import z from "zod";

export const acceptMessageSchema = z.object({
  isAcceptingMessage: z.boolean(),
});

export type AcceptMessageSchema = z.infer<typeof acceptMessageSchema>;
