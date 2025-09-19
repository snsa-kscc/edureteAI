"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, PieChart, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">📊 Primjeri grafova</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 px-2 text-xs"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Sakrij
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Prikaži
            </>
          )}
        </Button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {examples.map((example, index) => {
                const Icon = example.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card
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
                  </motion.div>
                );
              })}
            </div>
            <motion.p
              className="text-xs text-slate-500 dark:text-slate-400 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              Kliknite na primjer da ga pošaljete ili napišite vlastiti zahtjev za graf.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
