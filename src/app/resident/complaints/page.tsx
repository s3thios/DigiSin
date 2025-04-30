'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { MessageSquareQuote, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


// Sample data - replace with actual data fetching
const complaints = [
  { id: 1, date: "2024-07-24", description: "Barulho excessivo vindo do apartamento 301 após as 22h.", status: "pending", response: null },
  { id: 2, date: "2024-07-20", description: "Vazamento na garagem próximo à vaga 12.", status: "resolved", response: "Equipe de manutenção verificou e reparou o vazamento." },
  { id: 3, date: "2024-07-18", description: "Luz do corredor do 5º andar queimada.", status: "pending", response: null },
];


export default function ComplaintsPage() {
  const [newComplaint, setNewComplaint] = useState('');
  const [complaintPhoto, setComplaintPhoto] = useState<File | null>(null);
  const { toast } = useToast();

   const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
       const file = event.target.files[0];
       if (file.size > 5 * 1024 * 1024) { // 5MB limit
         toast({
           title: "Erro",
           description: "A foto não pode exceder 5MB.",
           variant: "destructive",
         });
         setComplaintPhoto(null);
         event.target.value = ''; // Clear the input
       } else {
        setComplaintPhoto(file);
       }
    }
  };


  const handleSubmitComplaint = async () => {
    if (!newComplaint.trim()) {
      toast({ title: "Erro", description: "Por favor, descreva sua reclamação.", variant: "destructive" });
      return;
    }

    // TODO: Implement actual submission logic (send to backend, upload photo if present)
    console.log("Submitting complaint:", newComplaint, complaintPhoto?.name);

    toast({ title: "Sucesso", description: "Reclamação registrada com sucesso." });
    setNewComplaint('');
    setComplaintPhoto(null);
     // Optionally clear the file input
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />Pendente</Badge>;
      case 'resolved':
        return <Badge variant="secondary"><CheckCircle className="mr-1 h-3 w-3" />Resolvido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Reclamações e Sugestões</h1>
      <p className="text-muted-foreground">Registre ocorrências ou envie sugestões para a administração.</p>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Nova Reclamação/Sugestão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="complaint-description">Descrição</Label>
            <Textarea
              placeholder="Descreva a ocorrência ou sugestão..."
              id="complaint-description"
              value={newComplaint}
              onChange={(e) => setNewComplaint(e.target.value)}
              rows={4}
            />
          </div>
           <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="complaint-photo">Anexar Foto (Opcional - até 5MB)</Label>
              <Input id="complaint-photo" type="file" accept="image/*" onChange={handlePhotoChange} />
               {complaintPhoto && <p className="text-xs text-muted-foreground">Arquivo selecionado: {complaintPhoto.name}</p>}
            </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitComplaint}>Enviar Reclamação</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Reclamações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <Card key={complaint.id} className="bg-muted/50">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardDescription>
                      Registrado em: {new Date(complaint.date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                    {getStatusBadge(complaint.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">{complaint.description}</p>
                  {complaint.response && (
                     <div className="mt-2 border-l-4 border-primary pl-3 py-1 bg-background">
                      <p className="text-sm font-semibold text-primary">Resposta da Administração:</p>
                      <p className="text-sm text-muted-foreground">{complaint.response}</p>
                     </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">Nenhuma reclamação registrada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
