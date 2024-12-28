"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema, VerifySchema } from "@/schemas/verifiySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function page() {
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
  });

  const onVerify = async (data: VerifySchema) => {
    setIsVerifying(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.token,
      });

      toast({
        title: "User verified",
        description: response.data.message,
        variant: "default",
      });

      router.replace("/signin");
    } catch (error) {
      console.error("Error in verifying user: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred while verifying user",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center gap-4 items-center min-h-screen">
      <div className="w-full max-w-md text-yellow-50 p-8 shadow-md">
        <div className="mb-3 text-center">
          <h1 className="font-bold text-2xl">Verify your account</h1>
          <p className="text-sm text-slate-500">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onVerify)}>
            <FormField
              name="token"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isVerifying}
              className="mt-4 bg-yellow-50 text-black w-full text-[16px] hover:bg-slate-200"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
