import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import katex from "katex";

interface MarkdownProps {
  children: string;
}

const NonMemoizedMarkdown = ({ children }: MarkdownProps) => {
  // Safety check for empty or null content
  if (!children || typeof children !== "string") {
    return <div className="text-sm text-gray-500">No content to display</div>;
  }

  // Pre-process to isolate math blocks
  const preprocessMath = (content: string) => {
    let processed = content;

    // Replace display math blocks with placeholders that have error boundaries
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      try {
        const html = katex.renderToString(math, {
          displayMode: true,
          throwOnError: false,
          strict: false,
          trust: true,
          errorColor: "#cc0000",
          output: "html",
        });
        return `<div class="katex-display-block">${html}</div>`;
      } catch (e) {
        return `<div class="katex-error" style="color: #cc0000;">Math Error: ${match}</div>`;
      }
    });

    // Replace inline math with error boundaries
    processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
      try {
        const html = katex.renderToString(math, {
          displayMode: false,
          throwOnError: false,
          strict: false,
          trust: true,
          errorColor: "#cc0000",
          output: "html",
        });
        return `<span class="katex-inline-block">${html}</span>`;
      } catch (e) {
        return `<span class="katex-error" style="color: #cc0000;">${match}</span>`;
      }
    });

    return processed;
  };

  const processedContent = preprocessMath(children);

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
          {...props}
        >
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
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    ),
  };

  return (
    <ReactMarkdown
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      skipHtml={false}
    >
      {processedContent}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
