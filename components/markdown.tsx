import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

interface MarkdownProps {
  children: string;
}

const NonMemoizedMarkdown = ({ children }: MarkdownProps) => {
  // Safety check for empty or null content
  if (!children || typeof children !== 'string') {
    return <div className="text-sm text-gray-500">No content to display</div>;
  }
  
  // const processedThinkTags = children.replace(
  //   /<think>(.*?)<\/think>/gs,
  //   (_, content) => `<pre className="whitespace-pre-wrap"><span className="text-xs text-gray-500">${content}</span></pre>`
  // );

  // Preprocess content to fix LaTeX environment syntax issues
  let processedContent = children;
  
  // Fix missing opening $$ for LaTeX environments
  // Match patterns like $\begin{array} that should be $$\begin{array}
  processedContent = processedContent.replace(/(?<!\$)\$\\begin{([^}]+)}/g, '$$\\begin{$1}');
  
  // Fix the issue with $$\begin{...} syntax for ALL environments (array, cases, aligned, etc.)
  // Ensure there's no line break immediately after $$
  processedContent = processedContent.replace(/\$\$\s*\n\s*\\begin{([^}]+)}/g, '$$\\begin{$1}');
  
  // Also handle cases where there might be spacing issues (without newline)
  processedContent = processedContent.replace(/\$\$\s*\\begin{([^}]+)}/g, '$$\\begin{$1}');
  
  // Fix missing closing $$ for LaTeX environments
  // Look for \end{...}$ that should be \end{...}$$
  processedContent = processedContent.replace(/\\end{([^}]+)}\$(?!\$)/g, '\\end{$1}$$');
  
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
    remarkPlugins={[
      // Staviti remarkMath PRIJE remarkGfm
      [remarkMath, { 
        singleDollarTextMath: true,
        inlineMathDouble: false // Prevents double processing
      }],
      remarkGfm
    ]}
    rehypePlugins={[
      rehypeRaw,
      [rehypeKatex, { 
        output: "htmlAndMathml",
        strict: false,    // Dopusti više LaTeX komandi
        trust: true,      // Vjeruj komandama poput \hline, \begin
        throwOnError: false, // Prikaži greške umjesto rušenja
        errorColor: '#cc0000',
        macros: {}, // Empty macros to prevent conflicts
        fleqn: false,
        leqno: false,
        minRuleThickness: 0.04
      }]
    ]}
    skipHtml={false}
  >
    {processedContent}
  </ReactMarkdown>
);
};

export const Markdown = memo(NonMemoizedMarkdown, (prevProps, nextProps) => prevProps.children === nextProps.children);
