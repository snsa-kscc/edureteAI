"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ToolResultProps {
  toolName: string;
  result: any;
  args: any;
}

export function ToolResult({ toolName, result, args }: ToolResultProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (toolName === "generateGraph") {
    return (
      <div className="my-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">📊 Generiran graf</h4>
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="h-6 px-2">
            {showDetails ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            <span className="ml-1 text-xs">{showDetails ? "Sakrij" : "Detalji"}</span>
          </Button>
        </div>

        {result.success ? (
          <div className="space-y-3">
            {result.description && <p className="text-sm text-slate-600 dark:text-slate-400">{result.description}</p>}

            <div className="relative">
              <Image
                src={result.imageUrl || result.image}
                alt={result.description || "Generated graph"}
                width={800}
                height={480}
                className="rounded-lg border max-w-full h-auto"
                unoptimized
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = result.imageUrl || result.image;
                  link.download = `graph-${Date.now()}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success("Graf je preuzet!");
                }}
                className="h-8"
              >
                <Download className="h-3 w-3 mr-1" />
                Preuzmi
              </Button>
              {(result.imageUrl || result.r2Url) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.open(result.imageUrl || result.r2Url, "_blank");
                  }}
                  className="h-8"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Trajni link
                </Button>
              )}
            </div>

            {(result.imageUrl || result.r2Url) && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">✅ Graf je automatski spremljen u oblak</p>}

            {showDetails && (
              <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                <div className="mb-2">
                  <strong>Python kod:</strong>
                  <pre className="mt-1 p-2 bg-slate-200 dark:bg-slate-700 rounded overflow-x-auto">
                    <code>{args.code}</code>
                  </pre>
                </div>
                {result.stdout && (
                  <div className="mb-2">
                    <strong>Izlaz:</strong>
                    <pre className="mt-1 p-2 bg-green-100 dark:bg-green-900/20 rounded text-green-800 dark:text-green-200">{result.stdout}</pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <strong>Upozorenja:</strong>
                    <pre className="mt-1 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-yellow-800 dark:text-yellow-200">{result.stderr}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium text-sm">Greška pri generiranju grafa</span>
            </div>

            {result.description && <p className="text-sm text-slate-600 dark:text-slate-400">Pokušano: {result.description}</p>}

            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-700 dark:text-red-300">{result.error}</div>

            {showDetails && (
              <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                <div className="mb-2">
                  <strong>Python kod:</strong>
                  <pre className="mt-1 p-2 bg-slate-200 dark:bg-slate-700 rounded overflow-x-auto">
                    <code>{args.code}</code>
                  </pre>
                </div>
                {result.stdout && (
                  <div className="mb-2">
                    <strong>Izlaz:</strong>
                    <pre className="mt-1 p-2 bg-green-100 dark:bg-green-900/20 rounded text-green-800 dark:text-green-200">{result.stdout}</pre>
                  </div>
                )}
                {result.stderr && (
                  <div>
                    <strong>Greške:</strong>
                    <pre className="mt-1 p-2 bg-red-100 dark:bg-red-900/20 rounded text-red-800 dark:text-red-200">{result.stderr}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default tool result display for other tools
  return (
    <div className="my-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">🔧 Alat: {toolName}</h4>
      </div>
      <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
