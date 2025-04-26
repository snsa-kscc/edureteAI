"use client";

import { Chat, ServerActionResult } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { IconSpinner, IconTrash } from "./ui/icons";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";

export function SidebarActions({
  chat,
  userId,
  removeChat,
}: {
  chat: Chat;
  userId: string | null | undefined;
  removeChat: ({ id, path, userId }: { id: string; path: string; userId: string | null | undefined }) => ServerActionResult<void>;
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isRemovePending, startRemoveTransition] = useTransition();

  return (
    <>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="size-7 p-0 hover:bg-background" disabled={isRemovePending} onClick={() => setDeleteDialogOpen(true)}>
                <IconTrash className="text-emerald-500 mt-1" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Del</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
            <AlertDialogDescription>Obrisati ćete vašu poruku i podatke sa naših servera.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>Odustani</AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={(event) => {
                event.preventDefault();
                startRemoveTransition(async () => {
                  const result = await removeChat({
                    id: chat.id,
                    path: chat.path,
                    userId: userId!,
                  });

                  if (result && "error" in result) {
                    toast.error(result.error);
                    return;
                  }

                  setDeleteDialogOpen(false);
                  router.refresh();
                  router.push("/");
                  toast.success("Razgovor je obrisan");
                });
              }}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
