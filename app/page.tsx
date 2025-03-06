import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export default function Home() {
  redirect(`/c/${uuidv4()}`);
}
