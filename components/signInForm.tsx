"use client";

import React, { useState } from "react";
import { z } from "zod";
 
import { signInSchema } from "@/schemas/signInSchema";
 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
 
import { useRouter } from "next/router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button, Divider, Input } from "@heroui/react";
import { AlertCircle, Eye, EyeClosed, Lock, Mail } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, isLoaded, setActive } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const signInAttempt = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        session: await setActive({ session: signInAttempt.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (e) {
      if (e instanceof Error) {
        setAuthError(e.message);
      } else {
        setAuthError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold text-default-900">
          Sign In to Your Account
        </h1>
        <p className="text-default-500 text-center">
          {" "}
          Welcome back! Please enter your details.{" "}
        </p>
      </CardHeader>

      <Divider />
      <CardBody className="py-6">
        {authError && (
          <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="identifier"
              className="text-default-900 text-sm font-medium"
            >
              Email
            </label>

            <Input
              id="identifier"
              type="email"
              placeholder="your.email@example.com"
              autoComplete="email"
              {...register("identifier")}
              startContent={<Mail className="h-4 w-4 text-default-500" />}
              isInvalid={!!errors.identifier}
              errorMessage={errors.identifier?.message}
              className="w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-default-900 text-sm font-medium"
            >
              Password
            </label>

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              startContent={<Lock className="h-4 w-4 text-default-500" />}
              autoComplete="current-password"
              {...register("password")}
              className="w-full"
              isInvalid={!!errors.identifier}
              errorMessage={errors.identifier?.message}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeClosed className="h-4 w-4 text-default-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-default-500" />
                  )}
                </Button>
              }
            />
          </div>

          <div>
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default SignInForm;
