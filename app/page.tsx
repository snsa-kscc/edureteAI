import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  const timestamp = Math.round(new Date().getTime());

  redirect(`/chat/${userId}-${timestamp}`);
}
