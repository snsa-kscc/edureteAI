"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultCode = `import matplotlib.pyplot as plt
import numpy as np

# Generate sample data
x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x)

# Create the plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.title('Sine Wave Test', fontsize=16)
plt.xlabel('x (radians)', fontsize=12)
plt.ylabel('sin(x)', fontsize=12)
plt.grid(True, alpha=0.3)
plt.legend()

print("Graph generated successfully!")`;

export default function TestPythonPage() {
  const [code, setCode] = useState(defaultCode);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPythonFunction = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate-graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Python Function Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testPythonFunction} disabled={loading}>
              {loading ? "Testing..." : "Test Python Code"}
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Python Code:</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              className="font-mono text-sm"
              placeholder="Enter your matplotlib code here..."
            />
          </div>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className={result.success ? "text-green-600" : "text-red-600"}>{result.success ? "✅ Success" : "❌ Error"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.success ? (
                  <>
                    {result.image && (
                      <div>
                        <h3 className="font-medium mb-2">Generated Graph:</h3>
                        <img src={result.image} alt="Generated graph" className="max-w-full border rounded" />
                      </div>
                    )}
                    {result.stdout && (
                      <div>
                        <h3 className="font-medium mb-2">Output:</h3>
                        <pre className="bg-gray-100 p-2 rounded text-sm">{result.stdout}</pre>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium mb-2">Image Info:</h3>
                      <p className="text-sm text-gray-600">Base64 length: {result.imageLength || result.image?.length}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium mb-2 text-red-600">Error:</h3>
                      <pre className="bg-red-50 p-2 rounded text-sm text-red-800">{result.error}</pre>
                    </div>
                    {result.traceback && (
                      <div>
                        <h3 className="font-medium mb-2 text-red-600">Traceback:</h3>
                        <pre className="bg-red-50 p-2 rounded text-sm text-red-800 overflow-x-auto">{result.traceback}</pre>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
