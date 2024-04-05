"use client";
export default function Title() {
  return (
    <h1
      onClick={() => location.reload()}
      className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 mr-auto cursor-pointer"
    >
      edureteAI
    </h1>
  );
}
