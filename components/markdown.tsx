import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MarkdownProps {
  children: string;
}

const NonMemoizedMarkdown = ({ children }: MarkdownProps) => {
  const processedThinkTags = children.replace(
    /<think>(.*?)<\/think>/gs,
    (_, content) => `<pre className="whitespace-pre-wrap"><span className="text-xs text-gray-500">${content}</span></pre>`
  );
  const processedContent = processedThinkTags.replace(/\\\[/g, "$$$").replace(/\\\]/g, "$$$").replace(/\\\(/g, "$$$").replace(/\\\)/g, "$$$");

  const remarkMathOptions = {
    singleDollarTextMath: true,
  };

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre {...props} className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}>
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`} {...props}>
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => (
      <ol className="ml-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ node, children, ...props }: any) => (
      <li className="p-0" {...props}>
        {children}
      </li>
    ),
    ul: ({ node, children, ...props }: any) => (
      <ul className="ml-4" {...props}>
        {children}
      </ul>
    ),
    strong: ({ node, children, ...props }: any) => (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    ),
    a: ({ node, children, ...props }: any) => (
      <Link className="text-blue-500 hover:underline" target="_blank" rel="noreferrer" {...props}>
        {children}
      </Link>
    ),
  };

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeKatex, { output: "htmlAndMathml" }]]}
    >
      {processedContent}
    </ReactMarkdown>
  );
};

export const Markdown = memo(NonMemoizedMarkdown, (prevProps, nextProps) => prevProps.children === nextProps.children);
