import { PrismaClient } from "@prisma/client"
const client = new PrismaClient();

export const findUser = async (username: string) => {
    const user = client.user.findUnique({
        where: {
            username: username
        }
    })
    return user
}