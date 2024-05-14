"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function Changelog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">What's new</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>What is new in the app</AlertDialogTitle>
          <AlertDialogDescription>14.05.2023 - Added OpenAI's GPT-4o model</AlertDialogDescription>
          <AlertDialogDescription>02.05.2023 - Added chat history and system prompt. Everything still in beta. 2DO: bug fixes</AlertDialogDescription>
          <AlertDialogDescription>19.04.2023 - Added flagship OpenAI/GPT4 Turbo model in the dropdown menu</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
