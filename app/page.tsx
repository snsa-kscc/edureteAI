import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  const timestamp = Math.round(new Date().getTime());

  redirect(`/chat/${userId}-${timestamp}`);
}
