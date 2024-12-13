import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";

const client = new PrismaClient();

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    if (!header) {
        res.status(403).json({
            message: "Auth failed"
        })
        return
    }
    const token = header.split(" ")[1]
    const data = jwt.verify(token, (JWT_SECRET)) as { type: "admin" | "user", username: string }
    req.userId = data.username
    next();
}