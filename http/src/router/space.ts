import { PrismaClient } from "@prisma/client"; 
import { Router, Request, Response, json } from "express";
import { MakeSpace } from "../types/types";
import { userMiddleware } from "../middlewares/user";
import { findUser } from "../services/findUser";

export const spaceRouter = Router();
const client = new PrismaClient();

spaceRouter.post("/", userMiddleware, async (req: Request, res: Response) => {
    const parsedBody = MakeSpace.safeParse(req.body)
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    const { name, dimensions, mapId, thumbnail } = parsedBody.data
    const user = findUser(req.userId as string)
    if (!mapId && dimensions) {
        const space = await client.space.create({
            data: {
                name: name,
                width: parseInt(dimensions.split("x")[0]),
                height: parseInt(dimensions.split("x")[1]),
                thumbnail,
                creatorId: (req.userId as string)
            }
        })

        res.json({
            spaceId: space.id
        })
        return
    } 

    const map = await client.map.findUnique({
        where: {
            id: mapId
        }
    })

    if (!map) {
        res.status(400).json({
            message: "No map exists"
        })
        return
    }

    const mapSpace = await client.space.create({
        data: {
            name: map.name,
            width: map.width,
            height: map.height,
            thumbnail: map.thumbnail,
            creatorId: (req.userId as string)
        }
    })
    res.json({
        spaceId: mapSpace.id
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
            message: "No space exists"
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

spaceRouter.get("/all", async (req: Request, res: Response) => {
    const spaces = await client.space.findMany({
        where: {
            creatorId: req.userId
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