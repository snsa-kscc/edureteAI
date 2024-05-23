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
import Link from "next/link";

export function Changelog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">What's new</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>What is new in the app</AlertDialogTitle>
          <AlertDialogDescription>
            23.05.2023 - Added another chat option -{" "}
            <Link className="underline hover:text-primary" href="/rsc-c">
              available here
            </Link>
          </AlertDialogDescription>
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
