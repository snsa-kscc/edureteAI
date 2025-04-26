import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Clock, MapPin, Facebook, Youtube } from "lucide-react";
import Link from "next/link";

export default function ContactUsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Kontaktiraj nas</h2>
        <p className="text-muted-foreground">Imaš pitanja ili povratne informacije? Tu smo da pomognemo.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stupi u kontakt</CardTitle>
          <CardDescription>Evo kako možeš doći do našeg tima za podršku.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 mt-0.5 text-pink-500" />
            <div>
              <h3 className="font-medium">E-mail</h3>
              <p className="text-muted-foreground">
                <a href="mailto:podrska@edurete.com">podrska@edurete.com</a>
              </p>
              <p className="text-sm text-muted-foreground mt-1">Obično odgovaramo unutar nekoliko sati tijekom radnog vremena.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 text-pink-500" />
            <div>
              <h3 className="font-medium">Radno vrijeme</h3>
              <p className="text-muted-foreground">Ponedjeljak - Petak, 9:00 - 17:00 CET</p>
              <p className="text-sm text-muted-foreground mt-1">Naš tim za podršku dostupan je tijekom ovog vremena.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 mt-0.5 text-pink-500" />
            <div>
              <h3 className="font-medium">Lokacija</h3>
              <p className="text-muted-foreground">Zagreb, Hrvatska</p>
              <p className="text-sm text-muted-foreground mt-1">Naše sjedište nalazi se u srcu Zagreba.</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">Pronašao/la si grešku?</h3>
            <p className="text-sm">
              Ako si našao/la grešku u aplikaciji ili imaš problem s porukama, molimo te da nam pošalješ detaljan opis problema na{" "}
              <span className="font-medium">
                <a href="mailto:podrska@edurete.com">podrska@edurete.com</a>
              </span>
              .
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Društvene mreže</CardTitle>
          <CardDescription>Prati nas i pridruži se našoj zajednici.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <SocialLink icon={<Facebook className="h-4 w-4 text-emerald-400" />} href="https://facebook.com/edurete" small />
            <SocialLink icon={<Youtube className="h-4 w-4 text-emerald-400" />} href="https://www.youtube.com/@eduretemrezaznanja8067" small />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SocialLink({
  icon,
  name,
  href,
  highlight = false,
  small = false,
}: {
  icon: React.ReactNode;
  name?: string;
  href: string;
  highlight?: boolean;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center ${small ? "p-2" : "gap-2 p-3"} rounded-md transition-colors ${
        highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"
      }`}
      title={name}
    >
      {icon}
      {!small && name && <span>{name}</span>}
    </Link>
  );
}
