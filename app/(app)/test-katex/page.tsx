'use client';

import { Markdown } from '@/components/markdown';

export default function TestKaTeX() {
  // Test with properly escaped LaTeX
  const mathContent1 = `
## Table with Proper Escaping
$$\\displaystyle
\\begin{array}{|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|}
\\hline
\\text{Pozicija} & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 & 13 & 14 & 15 & 16 \\\\
\\hline
\\text{Tip} & P_1 & P_2 & D_1 & P_4 & D_2 & D_3 & D_4 & P_8 & D_5 & D_6 & D_7 & D_8 & D_9 & D_{10} & D_{11} & D_{12} \\\\
\\hline
\\text{Podaci} & ? & ? & 1 & ? & 1 & 1 & 1 & ? & 0 & 1 & 0 & 1 & 0 & 0 & 0 & 1 \\\\
\\hline
\\end{array}$$
`;

  // Alternative: Using template literals with raw strings
  const mathContent2 = String.raw`
## Alternative Table Format
$$\begin{array}{|c|c|c|c|}
\hline
\text{Col 1} & \text{Col 2} & \text{Col 3} & \text{Col 4} \\
\hline
A & B & C & D \\
\hline
1 & 2 & 3 & 4 \\
\hline
\end{array}$$
`;

  // Test inline math
  const inlineMathContent = `
## Inline Math Tests
This is inline math: $x = \\frac{a}{b}$ and this is another: $\\sqrt{x^2 + y^2}$.

## Display Math
$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

## Matrix Example
$$\\begin{pmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{pmatrix}$$
`;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">KaTeX Testing Page</h1>
      
      <div className="space-y-8">
        <div className="border p-4 rounded-lg">
          <Markdown>{mathContent1}</Markdown>
        </div>
        
        <div className="border p-4 rounded-lg">
          <Markdown>{mathContent2}</Markdown>
        </div>
        
        <div className="border p-4 rounded-lg">
          <Markdown>{inlineMathContent}</Markdown>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <p className="text-sm">If you see red error text, it means KaTeX couldn't parse the expression.</p>
        <p className="text-sm">Common issues:</p>
        <ul className="list-disc ml-6 text-sm">
          <li>Missing double backslashes (\\\\) for line breaks in arrays</li>
          <li>Unsupported LaTeX commands</li>
          <li>Incorrect escaping in JavaScript strings</li>
        </ul>
      </div>
    </div>
  );
}
