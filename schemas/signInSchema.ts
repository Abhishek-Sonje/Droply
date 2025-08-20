import * as z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required !" })
    .email({ message: "Please enter valid Email" }),

  password: z
    .string()
    .min(1, { message: "Password is Required !" })
    .min(8, { message: "Password must be atleast 8 characters" }),
});
