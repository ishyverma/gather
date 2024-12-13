import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    if (!header) {
        res.status(403).json({
            message: "Auth failed"
        })
        return
    }
    const token = header.split(" ")[1]
    const data = jwt.verify(token, (JWT_SECRET)) as { type: "admin" | "user", username: string }

    if (data.type !== "admin") {
        res.status(400).json({
            message: "User is not admin"
        })
        return;
    }
    
    req.userId = data.username
    next();
}