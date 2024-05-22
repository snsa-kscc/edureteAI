import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export default function RscHome() {
  redirect(`/rsc-c/${randomUUID()}`);
}
