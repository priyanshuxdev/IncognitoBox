"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/UserModel";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  CheckCircle2,
  Copy,
  Loader2,
  LoaderCircle,
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import { CiUser } from "react-icons/ci";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import ShineBorder from "@/components/ui/shine-border";

export default function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);

  //optimistic ui deletion
  const onDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { register, watch, setValue } = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const acceptMessages = watch("acceptMessages");

  const getAcceptMessageStatus = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "failed to fetch message status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const getMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Messages refreshed",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message ?? "No messages found",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  //fetch initail state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    getAcceptMessageStatus();
    getMessages();
  }, [session, setValue, toast, getMessages, getAcceptMessageStatus]);

  //handle switch changes
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user)
    return (
      <div className="flex justify-center items-center">
        <LoaderCircle className="h-16 w-16 mt-40 animate-spin" />
      </div>
    );

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied to clipboard",
      description: "Profile Url has been copied to clipboard",
      variant: "default",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        <ShineBorder
          className="relative flex h-[70px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-transparent md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-tr from-neutral-50 to-neutral-500 bg-clip-text text-center text-2xl sm:text-4xl font-semibold leading-none text-transparent">
            Welcome, {username}
          </span>
        </ShineBorder>

        <Card className="bg-black">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="text-black">
                  {username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-white">{username}</CardTitle>
                <CardDescription className="text-[#BFBFBF]">{`@${username}`}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CiUser className="h-4 w-4 text-white" />
                <span className="text-sm text-muted-foreground text-[#BFBFBF]">
                  Your public link
                </span>
              </div>
              <div className="flex space-x-2">
                <Input value={profileUrl} readOnly className="text-white" />
                <Button onClick={copyToClipboard} variant="outline">
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center space-x-2 pt-3">
                <MessageSquare className="h-4 w-4 text-white" />
                <span className="text-sm text-muted-foreground text-[#BFBFBF]">
                  Accept messages: {acceptMessages ? "ON" : "OFF"}
                </span>
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle>Anonymous Messages</CardTitle>
            <Button
              className="mt-4 text-black"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                getMessages(true);
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map((message, i) => (
                  <MessageCard
                    key={i}
                    message={message}
                    onMessageDelete={onDeleteMessage}
                  />
                ))
              ) : (
                <p className="text-sm">
                  Nothing to show. Refresh to fetch the messages
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <Link href={profileUrl}>Go to public profile page...</Link> */}
    </>
  );
}
