"use client";
import { useAuth, useClerk, useSignIn } from "@clerk/clerk-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import LoadingSpinner from "./loading";
import { z } from "zod";
import {
  requestResetSchema,
  resetPasswordSchema,
} from "@/schemas/forgotPasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import { AlertCircle, Eye, EyeClosed, Lock } from "lucide-react";

type requestResetSchema = z.infer<typeof requestResetSchema>;
type resetPasswordSchema = z.infer<typeof resetPasswordSchema>;

interface ApiErrorResponse {
  errors?: Array<{
    longMessage?: string;
  }>;
}

function isApiErrorResponse(err: unknown): err is ApiErrorResponse {
  return err !== null && typeof err === "object" && "errors" in err;
}

export default function ForgotPassword() {
  const router = useRouter();
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestForm = useForm<requestResetSchema>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const resetPassword = useForm<resetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return <LoadingSpinner label="Loading..." color="#7AE2CF" />;
  }

  const onRequest = async (data: requestResetSchema) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: data.identifier,
      });
      setCodeSent(true);
    //   setIsSubmitting(false);
    } catch (err: unknown) {
      console.log("error", err);

      if (isApiErrorResponse(err)) {
        setError(err.errors?.[0]?.longMessage || "Failed to send reset code");
      } else {
        setError("Failed to send reset code");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onReset = async (data: resetPasswordSchema) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });

      if (result?.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Verification could not be completed. Please try again.");
      }
    
    } catch (err: unknown) {
      console.log("error", err);

      if (isApiErrorResponse(err)) {
        setError(err.errors?.[0]?.longMessage || "Failed to reset password");
      } else {
        setError("Failed to reset password");
      }
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner label="Loading..." color="#7AE2CF" />
      </div>
    );
  }

  const handleResendCode = async () => {
    setError(null);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: requestForm.getValues("identifier"),
      });
      addToast({
        title: "Success",
        description: "Verification code has been resent to your email",
        color: "success",
      });
    } catch (err: unknown) {
      console.log("error", err);

      if (isApiErrorResponse(err)) {
        setError(err.errors?.[0]?.longMessage || "Failed to send reset code");
      } else {
        setError("Failed to send reset code");
      }
    }
  };

  if (codeSent) {
    return (
      <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
        <CardHeader className="flex flex-col gap-1 items-center pb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-tl from-[#077a7d] to-[#06202B] bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-center text-[#06202b] opacity-50">
            We&apos;ve sent a verification code to your email
          </p>
        </CardHeader>

        <Divider className="bg-[#06202b]" />

        <CardBody className="py-6">
          {error && (
            <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form
            onSubmit={resetPassword.handleSubmit(onReset)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="verificationCode"
                className="text-sm font-medium text-[#06202b]"
              >
                Verification Code
              </label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter the 6-digit code"
                {...resetPassword.register("code")}
                className="w-full pt-2"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#06202b]"
              >
                New password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                startContent={<Lock className="h-4 w-4 text-[#06202b]" />}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeClosed className="h-4 w-4 text-[#06202b]" />
                    ) : (
                      <Eye className="h-4 w-4 text-default-500" />
                    )}
                  </Button>
                }
                isInvalid={!!resetPassword.formState.errors.password?.message}
                errorMessage={resetPassword.formState.errors.password?.message}
                {...resetPassword.register("password")}
                className="w-full pt-2"
              />
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full bg-[#06202b]"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#06202b] opacity-50">
              Didn&apos;t receive a code?{" "}
              <button
                onClick={handleResendCode}
                className="text-[#06202b] hover:underline font-medium"
              >
                Resend code
              </button>
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold bg-gradient-to-tl from-[#077a7d] to-[#06202B] bg-clip-text text-transparent">
          Reset Password
        </h1>
        <p className="text-center text-[#06202b] opacity-50">
          Enter the email address associated with your account
        </p>
      </CardHeader>

      <Divider className="bg-[#06202b]" />

      <CardBody className="py-6">
        {error && (
          <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form
          onSubmit={requestForm.handleSubmit(onRequest)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="identifier"
              className="text-sm font-medium  text-[#06202b]"
            >
              Email
            </label>
            <Input
              id="identifier"
              type="email"
              placeholder="Enter your email"
              {...requestForm.register("identifier")}
              isInvalid={!!requestForm.formState.errors.identifier?.message}
              errorMessage={requestForm.formState.errors.identifier?.message}
              className="w-full pt-2"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full bg-[#06202b]"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
