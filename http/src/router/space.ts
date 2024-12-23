import { PrismaClient } from "@prisma/client"; 
import e, { Router, Request, Response, json } from "express";
import { AddSpaceElement, MakeSpace } from "../types/types";
import { userMiddleware } from "../middlewares/user";
import { findUser } from "../services/findUser";

export const spaceRouter = Router();
const client = new PrismaClient();

spaceRouter.post("/", userMiddleware, async (req: Request, res: Response) => {
    const parsedBody = MakeSpace.safeParse(req.body)

    if (!parsedBody.success) {
        console.log("first space")
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    const { name, dimensions, mapId, thumbnail } = parsedBody.data
    const user = await findUser(req.userId as string)

    if (!user) {
        res.status(400).json({
            message: "No user exists"
        })
        return 
    }
    
    if (!mapId && !dimensions) {
        console.log("second")
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    if (!mapId) {
        const space = await client.space.create({
            data: {
                name: name,
                width: parseInt(dimensions?.split("x")[0] as string),
                height: parseInt(dimensions?.split("x")[1] as string),
                thumbnail,
                // @ts-ignore
                creatorId: (user.id),
            }
        })

        res.json({
            spaceId: space.id
        })
        return
    } 

    try {

        const map = await client.map.findUnique({
            where: {
                id: mapId
            }
        })

        const mapSpace = await client.space.create({
            data: {
                name: map?.name as string,
                width: map?.width as number,
                height: map?.height as number,
                thumbnail: map?.thumbnail as string,
                creatorId: (user.id) as string
            }
        })
        res.json({
            spaceId: mapSpace.id
    })
    } catch(err) {
        res.status(400).json({
            message: "No map exists"
        })
    }
})  

spaceRouter.delete("/element", userMiddleware, async (req: Request, res: Response) => {
    const { elementId } = req.body

    const element = await client.spaceElements.findFirst({
        where: {
            id: elementId
        }
    })

    if (!element) {
        res.status(400).json({
            message: "No spaceElement found"
        })
        return
    }

    const deletedElement = await client.spaceElements.delete({
        where: {
            id: element.id
        }
    })

    res.json({
        message: "Element is deleted"
    })  
})

spaceRouter.delete("/:spaceId", userMiddleware, async (req: Request, res: Response) => {
    const spaceId = req.params.spaceId
    const space = await client.space.findUnique({
        where: {
            id: spaceId
        }
    })
    if (!space) {
        res.status(400).json({
            message: "Space not exists"
        })
        return
    }

    const deleteSpace = await client.space.delete({
        where: {
            id: spaceId
        }
    })

    res.json({
        message: "Space deleted"
    })
})

spaceRouter.get("/all", userMiddleware, async (req: Request, res: Response) => {
    const user = findUser(req.userId as string);
    if (!user) {
        res.status(400).json({
            message: "User not exists"
        })
        return
    }
    const spaces = await client.space.findMany({
        where: {
            // @ts-ignore
            creatorId: user.id
        },
        select: {
            id: true,
            name: true,
            height: true,
            width: true,
            thumbnail: true
        }
    })

    res.json({
        spaces: spaces.map(s => ({
            id: s.id,
            name: s.name,
            dimensions: `${s.width}x${s.height}`,
            thumbnail: s.thumbnail
        }))
    })
})

spaceRouter.get("/elements", userMiddleware, async (req: Request, res: Response) => {
    const element = await client.element.findMany({})
    res.json({
        elements: element.map(e => ({
            id: e.id,
            imageUrl: e.imageUrl,
            width: e.width,
            height: e.height,
            static: e.static
        }))
    })
})

spaceRouter.get("/:spaceId", userMiddleware, async (req: Request, res: Response) => {
    const spaceId = req.params.spaceId
    const space = await client.space.findUnique({
        where: {
            id: spaceId
        },
        select: {
            height: true,
            width: true,
            elements: {
                select: {
                    x: true,
                    y: true,
                    id: true,
                    element: true
                }
            }
        }
    })

    if (!space) {
        res.status(400).json({
            message: "Space not exists"
        })
        return
    }

    res.json({
        dimensions: `${space?.width}x${space?.height}`,
        elements: space?.elements.map(e => ({
            id: e.id,
            element: {
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                height: e.element.height,
                width: e.element.width,
                static: e.element.static
            },
            x: e.x,
            y: e.y
        }))
    })
})

spaceRouter.post("/element", userMiddleware, async (req: Request, res: Response) => {
    const parsedBody = AddSpaceElement.safeParse(req.body)
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    const { elementId, spaceId, x, y } = parsedBody.data
    const space = await client.space.findUnique({
        where: {
            id: spaceId
        }
    })

    if (!space) {
        res.status(400).json({
            message: "Space not exists"
        })
        return
    }

    const element = await client.element.findUnique({
        where: {
            id: elementId
        }
    })

    if (!element) {
        res.status(400).json({
            message: "Space not exists"
        })
        return
    }

    const spaceElement = await client.spaceElements.create({
        data: {
            elementId,
            spaceId,
            x,
            y
        }
    })

    res.json({
        message: "Element added"
    })

})

