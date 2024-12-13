import { z } from "zod"

export const SignupParse = z.object({
    username: z.string(),
    password: z.string(),
    type: z.enum(['user', 'admin'])
})

export const SigninParse = z.object({
    username: z.string(),
    password: z.string()  
})

export const UpdateAvatar = z.object({
    avatarId: z.string()
})

export const MakeSpace = z.object({
    name: z.string(),
    thumbnail: z.string(),
    dimensions: z.string().optional(),
    mapId: z.string().optional()
})