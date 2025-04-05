import { z } from "zod";

export const suscriptionSchema = z.object({
    email: z.string().email()
}).required()