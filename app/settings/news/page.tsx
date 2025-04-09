import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Novosti i ažuriranja</h2>
        <p className="text-muted-foreground">Budi informiran/a o najnovijim značajkama i ažuriranjima.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Poboljšanja upravljanja API kvotama</CardTitle>
            <CardDescription>8. travnja 2025.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Poboljšali smo naš sustav upravljanja API kvotama kako bismo bolje upravljali ograničenjima i pružili jasnije poruke o pogreškama kada se kvote
              premaše. Ovo ažuriranje pomaže spriječiti prekide u usluzi i pruža veću transparentnost o ograničenjima korištenja.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nove značajke za prikaz matematičkih formula</CardTitle>
            <CardDescription>30. ožujka 2025.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Unaprijedili smo naše mogućnosti prikaza matematičkih formula s poboljšanom LaTeX podrškom i boljim rukovanjem složenim jednadžbama. Ova
              poboljšanja olakšavaju rad s matematičkim sadržajem u vašim razgovorima.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimizacije performansi</CardTitle>
            <CardDescription>15. ožujka 2025.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Napravili smo značajna poboljšanja performansi kako bismo smanjili vrijeme učitavanja i poboljšali odzivnost aplikacije. Trebali biste primijetiti
              brže vrijeme odziva prilikom korištenja sučelja za razgovor.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
