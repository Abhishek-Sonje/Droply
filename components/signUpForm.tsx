"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpForm() {
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { isLoaded, signUp, setActive } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  if (verifying) {
    return <h1>Verification Page</h1>;
  }

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error: unknown) {
      console.log("Signup Error", error);

      // Type guard to safely access error properties
      if (error && typeof error === "object" && "errors" in error) {
        const clerkError = error as { errors: Array<{ message: string }> };
        setAuthError(
          clerkError.errors?.[0]?.message ||
            "An error occurred during the SignUp. Please try again"
        );
      } else {
        setAuthError("An error occurred during the SignUp. Please try again");
      }
    }
    // } catch (error: any) {
    //   console.log("Signup Error", error);
    //   setAuthError(
    //     error.errors?.[0]?.message ||
    //       "An error Occured during the SignUp.please try again"
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const handleVerificationSubmit = async () => {};

  return <h1>SignUp from with otp verificatio</h1>;
}
