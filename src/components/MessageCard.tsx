"use client";

import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { Loader2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
// import { Message } from "@/schemas/messageSchema";
import { Message } from "@/models/UserModel";
import { useState } from "react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });

      onMessageDelete(`${message._id}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Card className="card-bordered bg-[#0A0A0A]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#f8f8f8ff] text-[17px] sm:text-3xl">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {isDeleting ? (
                <Button variant="outline">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </Button>
              ) : (
                <Button variant="outline">
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-sm:px-4 rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-black">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm textGradient pt-2">
          <Badge variant="secondary">
            {dayjs(message.timestamp).format("MMM D, YYYY h:mm A")}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}
