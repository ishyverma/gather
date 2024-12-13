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

export const AddSpaceElement = z.object({
    elementId: z.string(),
    spaceId: z.string(),
    x: z.number(),
    y: z.number()
})

export const AddElement = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    isStatic: z.boolean()
})

export const CreateAvatar = z.object({
    imageUrl: z.string(),
    name: z.string()
})

export const CreateMap = z.object({
    thumbnail: z.string(),
    dimensions: z.string(),
    name: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number()
    }))
}) 