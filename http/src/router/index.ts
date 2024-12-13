import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { SigninParse, SignupParse } from "../types/types";
import bcrpyt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";
import { userRouter } from "./user";
import { spaceRouter } from "./space";


const client = new PrismaClient();
export const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    const parsedBody = SignupParse.safeParse(req.body)
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    const { username, password, type } = parsedBody.data
    const hasedPassword = await bcrpyt.hash(password, 5)

    const user = await client.user.create({
        data: {
            username, 
            password: hasedPassword, 
            type
        }
    })

    res.json({
        userId: user.id
    })
})

router.post("/signin", async (req: Request, res: Response) => {
    const parsedBody = SigninParse.safeParse(req.body)
    if (!parsedBody.success) {
        res.status(400).json({
            message: "Validation failed"
        })
        return
    }

    const { username, password } = parsedBody.data
    const isUser = await client.user.findUnique({
        where: {
            username
        }
    })

    if (!isUser) {
        res.status(400).json({
            message: "No user exists"
        })
        return
    }

    const hashedPassword = await bcrpyt.compare(password, isUser.password)
    if (!hashedPassword) {
        res.status(400).json({
            message: "Password incorrect"
        })
        return
    }

    const token = jwt.sign({
        username: isUser.username,
        type: isUser.type
    }, JWT_SECRET)

    res.json({
        token
    })
})

router.use("/user", userRouter);
router.use("/space", spaceRouter);