import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function Title() {
  return (
    <h1 className={`${inter.className} text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-500 mr-auto`}>
      edureteAI
    </h1>
  );
}
