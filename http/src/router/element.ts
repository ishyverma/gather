import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AddElement, CreateAvatar, CreateMap } from "../types/types";
import { adminMiddleware } from "../middlewares/admin";
const client = new PrismaClient();

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req: Request, res: Response) => {
    const parsedBody = AddElement.safeParse(req.body)
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    const { imageUrl, width, height, isStatic } = parsedBody.data
    const element = await client.element.create({
        data: {
            imageUrl,
            width,
            height,
            static: isStatic
        }
    })

    res.json({
        id: element.id
    })
})

adminRouter.put("/element/:elementId", adminMiddleware, async (req: Request, res: Response) => {
    const elementId = req.params.elementId
    const { imageUrl } = req.body
    const element = await client.element.update({
        where: {
            id: elementId
        },
        data: {
            imageUrl
        }
    })

    res.json({
        message: "Element updated"
    })
})

adminRouter.post("/avatar", adminMiddleware, async (req: Request, res: Response) => {
    const parsedBody = CreateAvatar.safeParse(req.body)
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    const { imageUrl, name } = parsedBody.data

    const avatar = await client.avatar.create({
        data: {
            imageUrl,
            name
        }
    })

    res.json({
        avatarId: avatar.id
    })
})

adminRouter.post("/map", async (req: Request, res: Response) => {
    const parsedBody = CreateMap.safeParse(req.body)
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    const { thumbnail, dimensions, name, defaultElements } = parsedBody.data

    const map = await client.map.create({
        data: {
            name,
            width: parseInt(dimensions.split("x")[0]),
            height: parseInt(dimensions.split("x")[1]),
            thumbnail,
            elements: {
                create: defaultElements.map(e => ({
                    elementId: e.elementId,
                    x: e.x,
                    y: e.y
                }))
            }
        }
    })
    res.json({
        id: map.id
    })
})