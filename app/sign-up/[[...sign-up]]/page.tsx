import { SignUp } from "@clerk/nextjs";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SignUpPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const referrerId = searchParams.ref;

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      {referrerId ? <SignUp forceRedirectUrl={`/api/process-referral?ref=${referrerId}`} /> : <SignUp />}
    </div>
  );
}
