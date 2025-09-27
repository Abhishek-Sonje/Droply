import * as z from "zod";

export const requestResetSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "Email is required !" })
    .email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z.object({
  code: z.string().min(1, { message: "Code is required !" }),
  password: z.string().min(1, { message: "New Password is required " } ),
});
