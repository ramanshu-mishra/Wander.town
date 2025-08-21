import {z} from "zod";

const loginSchema = z.object({
    username: z.string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).refine(val=>!val.includes(" ")),
    password: z.string().min(8).max(50)
});


const signupSchema = z.object({
    username: z.string().trim().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).refine(val=>!val.includes(" ")),
    password: z.string().min(8).max(50),
    name: z.string().min(1).max(40)
});


export {loginSchema,signupSchema}