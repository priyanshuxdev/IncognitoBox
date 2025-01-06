//Public Profile
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema, MessageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ShimmerButton from "@/components/ui/shimmer-button";
import LetterPullup from "@/components/ui/letter-pullup";
import ShinyButton from "@/components/ui/shiny-button";

export default function SendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  //taking username from parameter
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
  });

  //watching every words of content
  const messageContent = form.watch("content");
  const onSendingMessage = async (data: MessageSchema) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });
      toast({
        title: "Thank you for your feedback!",
        description: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Ohh!",
        description:
          axiosError.response?.data.message ??
          `${username} is not accepting messages.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[93vh] flex flex-col justify-center items-center">
      <div className="w-full sm:w-3/4  text-yellow-50 p-8 shadow-md">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />

        <div className="sm:hidden flex flex-col items-center justify-center mb-5">
          <LetterPullup
            className="publicPageTextGradient text-[40px]"
            words={"IncognitoBox"}
            delay={0.05}
          />
          <p className="textGradient">Anonymous Messaging</p>
        </div>

        <LetterPullup
          className="publicPageTextGradient max-sm:text-[1.2rem] mb-4 max-sm:hidden"
          words={"IncognitoBox - Anonymous Messaging"}
          delay={0.05}
        />

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSendingMessage)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="max-sm:text-[12px]">
                    Your message will be sent anonymously to @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your anonymous message here..."
                      className="resize-y bg-transparent text-white placeholder:textGradient"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6 sm:mt-4">
              {isLoading ? (
                <ShimmerButton disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </ShimmerButton>
              ) : (
                <ShimmerButton
                  type="submit"
                  disabled={isLoading || !messageContent}
                >
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </ShimmerButton>
              )}
            </div>
          </form>
        </FormProvider>
        {/* <Separator className="my-6" /> */}
        <div className="text-center mt-12 sm:mt-8">
          <div className="mb-3 text-[#f8f8ff]">Get Your Message Board:</div>
          <Link href={"/signup"}>
            <ShinyButton className="bg-[#f8f8ff] text-[#454545]">
              Create Your Account
            </ShinyButton>
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-0">
        <span className="text-[10px]">Created with ❤ by priyanshuxdev</span>
      </footer>
    </div>
  );
}
