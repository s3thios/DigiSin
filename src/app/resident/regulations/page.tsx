import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

// TODO: Replace with actual fetch logic or integrate with CMS/Storage
const regulations = [
    { id: 1, name: "Regimento Interno - Plaza das Flores IV", url: "#", description: "Normas de convivência, uso das áreas comuns e outras diretrizes." },
    { id: 2, name: "Convenção do Condomínio - Plaza das Flores IV", url: "#", description: "Documento legal que estabelece a estrutura e as regras gerais do condomínio." },
    // Add more documents as needed
];

export default function RegulationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Regulamento do Condomínio</h1>
      <p className="text-muted-foreground">Acesse os documentos importantes que regem a vida em condomínio.</p>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Oficiais</CardTitle>
          <CardDescription>Faça o download do Regimento Interno e da Convenção.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {regulations.length > 0 ? (
             regulations.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-start gap-3">
                         <FileText className="h-6 w-6 text-primary mt-1 shrink-0" />
                         <div>
                            <h3 className="font-semibold">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                         </div>
                    </div>
                     <Button variant="outline" size="icon" asChild>
                       {/* Placeholder URL, replace with actual download link */}
                       <a href={doc.url} download title={`Baixar ${doc.name}`}>
                         <Download className="h-4 w-4" />
                       </a>
                     </Button>
                </div>
             ))

          ) : (
             <p className="text-center text-muted-foreground">Nenhum documento de regulamento disponível no momento.</p>
          )}
           <p className="text-xs text-muted-foreground pt-4">
                Os documentos do regulamento serão disponibilizados pela administração em breve.
           </p>
        </CardContent>
      </Card>

       {/* Maybe add a section for FAQs based on regulations */}

    </div>
  );
}
