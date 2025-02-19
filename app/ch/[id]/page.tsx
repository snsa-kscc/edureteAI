import { SimpleChat } from "@/components/simple-chat";

type Params = Promise<{ id: string }>;

export default async function Chat(props: { params: Promise<Params> }) {
  const params = await props.params;
  return <SimpleChat params={params} />;
}
