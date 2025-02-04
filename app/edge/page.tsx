export const runtime = "edge";

export default function Page() {
  const now = new Date().toLocaleTimeString();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-secondary-500">edu</span>
          <span className="text-primary-500">rete</span>
          <span className="text-secondary-500">AI</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">The ultimate tool for educational content creation</p>
        <p className="mt-4 text-sm text-muted-foreground">Current time: {now}</p>
      </div>
    </div>
  );
}
