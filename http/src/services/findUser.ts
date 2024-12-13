import { PrismaClient } from "@prisma/client"
const client = new PrismaClient();

export const findUser = async (username: string): Promise<{ id: string, username: string, password: string, type: "user"| "admin" } | null> => {
    const user = client.user.findUnique({
        where: {
            username: username
        },
        select: {
            id: true,
            username: true,
            password: true,
            type: true
        }
    })
    if (!user) {
        return null
    } 
    return user
}