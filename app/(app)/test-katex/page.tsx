"use client";

import { Markdown } from "@/components/markdown";

export default function TestKaTeX() {
  // Simple KaTeX formula for basic testing
  const simpleFormula = `
Here's the quadratic formula: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

And some inline math: The area of a circle is $A = \\pi r^2$.
`;

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

  const mathContentAnthropic = `
$$\\begin{array}{|c|c|c|c|c|c|c|c|c|c|c|c|c|} \\hline \\text{Pozicija} & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 \\\\ \\hline \\text{Bit} & P_1 & P_2 & 1 & P_4 & 1 & 1 & 1 & P_8 & 0 & 1 & 0 & 0 \\\\ \\hline \\end{array}$$
`;

  const mathContentGemini = `
$$\n\\begin{array}{|c|c|c|c|c|c|c|c|c|c|c|c|}\n\\hline\n\\text{Pozicija} & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 \\\\\n\\hline\n\\text{Bit} & P_1 & P_2 & 1 & P_4 & 1 & 1 & 1 & P_8 & 0 & 1 & 0 & 0 \\\\\n\\hline\n\\end{array}\n$$
  `;

  const geminiTable = `
$$\n\\begin{array}{|c|c|}\n\\hline\n\\text{A} & \\text{B} \\\\\n\\hline  \n1 & 2 \\\\\n\\hline\n\\end{array}\n$$
`;

  const anthropicTable = `
$$\\begin{array}{|c|c|}\n\\hline\nA & B \\\\\n\\hline  \n1 & 2 \\\\\n\\hline\n\\end{array}$$
`;

  const geminiTable2 = `
  $$\n\\displaystyle\n
  \\begin{array}{|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|}\n
  \\hline\n
  \\text{Pozicija} & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 & 13 & 14 & 15 & 16 & 17 \\\\\n
  \\hline\n
  \\text{Tip bita} & P_1 & P_2 & D_1 & P_4 & D_2 & D_3 & D_4 & P_8 & D_5 & D_6 & D_7 & D_8 & D_9 & D_{10} & D_{11} & P_{16} & D_{12} \\\\\n
  \\hline\n
  \\text{Vrijednost} & ? & ? & \\mathbf{1} & ? & \\mathbf{1} & \\mathbf{1} & \\mathbf{1} & ? & \\mathbf{0} & \\mathbf{1} & \\mathbf{0} & \\mathbf{1} & \\mathbf{0} & \\mathbf{0} & \\mathbf{0} & ? & \\mathbf{1} \\\\\n
  \\hline\n
  \\end{array}\n$$
  `;

  const anthropicTable2 = `
$$\\displaystyle\n
\\begin{array}{|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|c|}\n
\\hline\n
\\text{Pozicija} & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 & 11 & 12 & 13 & 14 & 15 & 16 \\\\\n
\\hline\n
\\text{Tip} & P_1 & P_2 & D_1 & P_4 & D_2 & D_3 & D_4 & P_8 & D_5 & D_6 & D_7 & D_8 & D_9 & D_{10} & D_{11} & D_{12} \\\\\n
\\hline\n
\\text{Podaci} & ? & ? & 1 & ? & 1 & 1 & 1 & ? & 0 & 1 & 0 & 1 & 0 & 0 & 0 & 1 \\\\\n
\\hline\n
\\end{array}$$
`;

  const gg = `
$$\n\\displaystyle\nH(x) =\n
\\begin{cases}\n0 & \\text{za } x < 0 \\\\\n
\\frac{1}{2} & \\text{za } x = 0 \\\\\n1 & \\text{za } x > 0\n\\end{cases}\n$$
  `;

  const notGg = `
Heaviside funkcija (ili jedinična step funkcija) je jedna od najvažnijih funkcija u matematici i inženjerstvu! 📝 Naziva se po britanskom fizičaru Oliveru Heavisideu koji ju je koristio za analizu električnih krugova.\n\n## Definicija\n\nHeaviside funkcija $H(t)$ (ponekad označena kao $u(t)$ ili $\\theta(t)$) definira se ovako:\n\n

$$\n\\displaystyle\nH(t) = \\begin{cases}\n0 & \\text{za } t < 0 \\\\\n1 & \\text{za } t \\geq 0\n\\end{cases}\n$$

\n\nPostoji i varijanta gdje je $H(0) = \\frac{1}{2}$, ali najčešće koristimo definiciju gdje je $H(0) = 1$.\n\n## Grafički prikaz\n\nFunkcija izgleda kao \"skok\" - kreće se od nule za negativne vrijednosti i skače na 1 za pozitivne vrijednosti. Ima diskontinuitet (prekid) u točki $t = 0$.\n\n## Važna svojstva\n\n**Derivacija:** Derivacija Heaviside funkcije je Diracova delta funkcija:\n$$\\frac{dH(t)}{dt} = \\delta(t)$$\n\n**Integral:** \n$$\\int_{-\\infty}^{t} H(\\tau) d\\tau = tH(t)$$\n\n## Praktične primjene\n\n**U elektrotehnici:** Modelira uključivanje struje u trenutku $t = 0$ 🔌\n\n**U teoriji signala:** Predstavlja jedinični step signal\n\n**U diferencijalnim jednadžbama:** Pomaže pri rješavanju jednadžbi s diskontinuitetnim izvorima\n\n## Pomaknuta Heaviside funkcija\n\nČesto koristimo pomaknutu verziju:\n

$$\nH(t - a) = \\begin{cases}\n0 & \\text{za } t < a \\\\\n1 & \\text{za } t \\geq a\n\\end{cases}\n$$

\n\nOva funkcija \"uključuje se\" u trenutku $t = a$ umjesto u $t = 0$.\n\nJe li ti jasna osnovna ideja Heaviside funkcije? 🤔 Možda imaš neko specifično pitanje o njezinoj primjeni ili svojstvima?
`;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">KaTeX Testing Page</h1>

      <div className="space-y-8">
        <div className="border p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <Markdown>{simpleFormula}</Markdown>
        </div>

        <div className="border p-4 rounded-lg">
          <Markdown>{mathContent1}</Markdown>
        </div>

        <div className="border p-4 rounded-lg">
          <Markdown>{mathContent2}</Markdown>
        </div>

        <div className="border p-4 rounded-lg">
          <Markdown>{inlineMathContent}</Markdown>
        </div>

        <div className="border p-4 rounded-lg outline-1 outline-red-500">
          <Markdown>{mathContentAnthropic}</Markdown>
        </div>

        <div className="border p-4 rounded-lg outline-1 outline-red-500">
          <Markdown>{mathContentGemini}</Markdown>
        </div>

        <div className="border p-4 rounded-lg outline-1 outline-red-500">
          <Markdown>{anthropicTable}</Markdown>
        </div>

        <div className="border p-4 rounded-lg outline-1 outline-red-500">
          <Markdown>{geminiTable}</Markdown>
        </div>

        <div className="border p-4 rounded-lg outline-1 outline-red-500">
          <Markdown>{geminiTable2}</Markdown>
        </div>
      </div>

      <div className="border p-4 rounded-lg outline-1 outline-red-500">
        <Markdown>{anthropicTable2}</Markdown>
      </div>

      <div className="py-15"></div>

      <div className="border p-4 rounded-lg outline-1 outline-red-500">
        <Markdown>{gg}</Markdown>
      </div>

      <div className="border p-4 rounded-lg outline-1 outline-red-500">
        <Markdown>{notGg}</Markdown>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <p className="text-sm">If you see red error text, it means KaTeX couldn&apos;t parse the expression.</p>
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
