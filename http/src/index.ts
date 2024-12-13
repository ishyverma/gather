import express from "express"
import { router } from "./router"
import dotenv from "dotenv"
const app = express()

app.use(express.json())

app.use("/api/v1", router)

app.listen(3000)

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
        }
    }
}