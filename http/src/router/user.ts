import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { userMiddleware } from "../middlewares/user";
import { UpdateAvatar } from "../types/types";

const client = new PrismaClient();
export const userRouter = Router();

userRouter.get("/metadata", userMiddleware, async (req: Request, res: Response) => {
    const username = req.userId
    const avatar = await client.avatar.findMany({})
    res.json({
        avatars: avatar.map(a => ({
            id: a.id,
            imageUrl: a.imageUrl,
            name: a.name 
        }))
    })
})

userRouter.post("/metadata", userMiddleware, async (req: Request, res: Response) => {
    const parsedBody = UpdateAvatar.safeParse(req.body)
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }
    const { avatarId } = parsedBody.data
    const avatar = await client.avatar.findUnique({
        where: {
            id: avatarId
        }
    })
    if (!avatar) {
        res.status(400).json({
            message: "No avatar exists"
        })
        return
    }
    res.json({
        message: "Avatar updated"
    })
})

userRouter.get("/metadata/bulk", async (req: Request, res: Response) => {
    const ids = req.query.ids as string
    const users = ids?.substring(1, ids.length - 1).split(", ")
    const avatars = await client.avatar.findMany({
        where: {
            id: {
                in: users
            }
        },
        select: {
            id: true,
            imageUrl: true
        }
    })

    res.json({
        avatars
    }) 
}) 