import z from "zod";

export const verifySchema = z.object({
  token: z
    .string()
    .length(6, "Verification token must be at least 6 character"),
});

export type VerifySchema = z.infer<typeof verifySchema>;
