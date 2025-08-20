"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

import { signUpSchema } from "@/schemas/signUpSchema";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

export default function SignUpForm() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
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

  if (!verifying) {
    return (
      <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
        <CardHeader className="flex flex-col gap-1 items-center pb-2">
          <h1 className="text-2xl font-bold text-default-900">
            Verify your Email
          </h1>
        </CardHeader>
      </Card>
    );
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
    } finally {
      // } catch (error: any) {
      //   console.log("Signup Error", error);
      //   setAuthError(
      //     error.errors?.[0]?.message ||
      //       "An error Occured during the SignUp.please try again"
      //   );
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      console.log(result);
      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });
        router.push("/dashboard");
      } else {
        console.error("Verification Incomplete", result);
        setVerificationError("Verification could not be complete!");
      }
    } catch (error: unknown) {
      console.log(error);
      if (error && typeof error === "object" && "errors" in error) {
        const clerkError = error as { errors: Array<{ message: string }> };
        setVerificationError(
          clerkError.errors?.[0]?.message ||
            "Verification could not be complete!"
        );
      } else {
        setVerificationError("Verification could not be complete!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return <h1>SignUp form with otp verificatio</h1>;
}
