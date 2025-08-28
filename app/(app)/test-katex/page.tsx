"use client";

import { Markdown } from "@/components/markdown";

export default function TestKaTeX() {
  // Simple KaTeX formula for basic testing
  const sampleText = `Odlično! Analizirajmo ovu funkciju korak po korak. 😊\n\n## Područje definicije\n\nFunkcija \n\n$$\n\\displaystyle\nf(x) = \\frac{1}{e^{2x} - 2e^x + 2}\n$$\n\nje definirana kada je nazivnik različit od nule. Provjerimo kada bi nazivnik bio jednak nuli:\n\n$$\n\\displaystyle\ne^{2x} - 2e^x + 2 = 0\n$$\n\nUvedimo supstituciju $t = e^x$ (gdje je $t > 0$):\n\n$$\n\\displaystyle\nt^2 - 2t + 2 = 0\n$$\n\nKoristeći kvadratnu formulu:\n$$\n\\displaystyle\nt = \\frac{2 \\pm \\sqrt{4-8}}{2} = \\frac{2 \\pm \\sqrt{-4}}{2} = \\frac{2 \\pm 2i}{2} = 1 \\pm i\n$$\n\nBudući da je $t = e^x$ realan broj (čak i pozitivan), a rješenja su kompleksna, nazivnik nikad nije jednak nuli!\n\n**Područje definicije:** $D_f = \\mathbb{R}$ ✨\n\n## Ponašanje na rubu područja definicije\n\nIspitajmo limese kada $x \\to \\pm\\infty$:\n\n**Za $x \\to +\\infty$:**\n$$\n\\displaystyle\n\\lim_{x \\to +\\infty} \\frac{1}{e^{2x} - 2e^x + 2} = \\frac{1}{+\\infty} = 0^+\n$$\n\n**Za $x \\to -\\infty$:**\nKada $x \\to -\\infty$, tada $e^x \\to 0$, pa:\n$$\n\\displaystyle\n\\lim_{x \\to -\\infty} \\frac{1}{e^{2x} - 2e^x + 2} = \\frac{1}{0 - 0 + 2} = \\frac{1}{2}\n$$\n\n## Derivacija i intervali monotonosti\n\nDerivirajmo funkciju pomoću pravila za derivaciju kvocijenta:\n\n$$\n\\displaystyle\nf'(x) = -\\frac{2e^{2x} - 2e^x}{(e^{2x} - 2e^x + 2)^2} = -\\frac{2e^x(e^x - 1)}{(e^{2x} - 2e^x + 2)^2}\n$$\n\nAnalizirajmo predznak derivacije:\n- Nazivnik $(e^{2x} - 2e^x + 2)^2$ je uvijek pozitivan\n- $2e^x$ je uvijek pozitivan\n- $e^x - 1 = 0$ kada je $x = 0$\n\nDakle:\n- Za $x < 0$: $e^x < 1$, pa je $e^x - 1 < 0$, što znači $f'(x) > 0$ → **funkcija raste**\n- Za $x > 0$: $e^x > 1$, pa je $e^x - 1 > 0$, što znači $f'(x) < 0$ → **funkcija pada**\n\n**Intervali monotonosti:**\n- Raste na $(-\\infty, 0)$\n- Pada na $(0, +\\infty)$\n\n## Lokalni ekstremi\n\nIz analize derivacije vidimo da u $x = 0$ funkcija ima **lokalni maksimum**.\n\nVrijednost maksimuma:\n$$\n\\displaystyle\nf(0) = \\frac{1}{e^0 - 2e^0 + 2} = \\frac{1}{1 - 2 + 2} = 1\n$$\n\n## Asimptote\n\n**Horizontalne asimptote:**\n- $y = 0$ (desna horizontalna asimptota, jer $\\lim_{x \\to +\\infty} f(x) = 0$)\n- $y = \\frac{1}{2}$ (lijeva horizontalna asimptota, jer $\\lim_{x \\to -\\infty} f(x) = \\frac{1}{2}$)\n\n**Vertikalne asimptote:** Nema (funkcija je definirana svugdje)\n\n## Kvalitativni graf`;

  const sampleText1 = `funkcija 
  $$
  \\displaystyle
  \\int_{0}^{\\pi} \\sin(x) \\, dx
  $$`;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">KaTeX Testing Page</h1>

      <div className="space-y-8">
        <div className="border p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <Markdown>{sampleText}</Markdown>
        </div>
      </div>

      <div className="space-y-8">
        <div className="border p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <Markdown>{sampleText1}</Markdown>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="font-bold mb-2">Debug Info:</h2>
        <p className="text-sm">If you see red error text, it means KaTeX couldn&apos;t parse the expression.</p>
      </div>
    </div>
  );
}
