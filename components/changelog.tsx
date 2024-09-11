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
          <AlertDialogDescription>21.06.2023 - Claude 3.5 Sonnet model added</AlertDialogDescription>
          <AlertDialogDescription>03.06.2023 - Chat interface v1 end of life</AlertDialogDescription>
          <AlertDialogDescription>23.05.2023 - Added chat interface v2</AlertDialogDescription>
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
