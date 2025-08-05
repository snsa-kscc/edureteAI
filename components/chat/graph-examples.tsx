"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";

interface GraphExamplesProps {
  onExampleClick: (prompt: string) => void;
}

const examples = [
  {
    icon: LineChart,
    title: "Funkcija sinus",
    description: "Nacrtaj graf funkcije sin(x)",
    prompt: "Nacrtaj graf funkcije sin(x) za x od 0 do 2π. Dodaj naslov i oznake osi.",
  },
  {
    icon: BarChart3,
    title: "Stupčasti graf",
    description: "Prikaži podatke u stupčastom grafu",
    prompt: "Napravi stupčasti graf koji prikazuje prodaju voća: jabuke 25, banane 30, naranče 20, grožđe 15.",
  },
  {
    icon: PieChart,
    title: "Kružni graf",
    description: "Prikaži postotke u kružnom grafu",
    prompt: "Napravi kružni graf koji prikazuje raspodjelu vremena tijekom dana: spavanje 8h, posao 8h, odmor 4h, ostalo 4h.",
  },
  {
    icon: TrendingUp,
    title: "Kvadratna funkcija",
    description: "Graf parabole",
    prompt: "Nacrtaj graf funkcije y = x² - 4x + 3 za x od -1 do 5. Označi nul-točke i vrh parabole.",
  },
];

export function GraphExamples({ onExampleClick }: GraphExamplesProps) {
  return (
    <div className="p-4 border-t">
      <h3 className="text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">📊 Primjeri grafova</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map((example, index) => {
          const Icon = example.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => onExampleClick(example.prompt)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-emerald-600" />
                  <CardTitle className="text-sm">{example.title}</CardTitle>
                </div>
                <CardDescription className="text-xs">{example.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">Kliknite na primjer da ga pošaljete ili napišite vlastiti zahtjev za graf.</p>
    </div>
  );
}
