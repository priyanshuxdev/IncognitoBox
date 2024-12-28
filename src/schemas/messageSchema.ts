import z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be atleast 10 characters")
    .max(500, "Message must be no more than 500 characters"),
});

export type MessageSchema = z.infer<typeof messageSchema>;
