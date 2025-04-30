'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { MessageSquareQuote, CheckCircle, Clock, ThumbsUp, Lightbulb, Ticket } from 'lucide-react'; // Added icons
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select

type OccurrenceStatus = 'pending' | 'in_progress' | 'resolved' | 'archived';
type OccurrenceType = 'reclamação' | 'elogio' | 'sugestão';

// Sample data for resident's occurrences - replace with actual data fetching
interface Occurrence {
  id: number;
  date: string;
  type: OccurrenceType;
  description: string;
  status: OccurrenceStatus;
  response: string | null;
  ticketId?: number; // Link to tracking ticket
}

const initialOccurrences: Occurrence[] = [
  { id: 1, date: "2024-07-24", type: "reclamação", description: "Barulho excessivo vindo do apartamento 301 após as 22h.", status: "pending", response: null },
  { id: 2, date: "2024-07-20", type: "sugestão", description: "Instalar bicicletário na área comum.", status: "resolved", response: "Sugestão anotada para próxima assembleia.", ticketId: 101 },
  { id: 3, date: "2024-06-15", type: "elogio", description: "Portaria sempre muito atenciosa.", status: "archived", response: "Agradecemos o reconhecimento!", },
];


export default function OccurrencesPage() {
  const [newOccurrenceType, setNewOccurrenceType] = useState<OccurrenceType | undefined>(undefined);
  const [newOccurrenceDesc, setNewOccurrenceDesc] = useState('');
  const [occurrencePhoto, setOccurrencePhoto] = useState<File | null>(null);
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
         setOccurrencePhoto(null);
         event.target.value = ''; // Clear the input
       } else {
        setOccurrencePhoto(file);
       }
    }
  };


  const handleSubmitOccurrence = async () => {
    if (!newOccurrenceType) {
       toast({ title: "Erro", description: "Por favor, selecione o tipo de ocorrência.", variant: "destructive" });
       return;
    }
    if (!newOccurrenceDesc.trim()) {
      toast({ title: "Erro", description: "Por favor, descreva sua ocorrência.", variant: "destructive" });
      return;
    }

    // TODO: Implement actual submission logic (send to backend, upload photo if present)
    console.log(`Submitting ${newOccurrenceType}:`, newOccurrenceDesc, occurrencePhoto?.name);

     // Simulate adding to list
     const newId = Math.max(0, ...initialOccurrences.map(o => o.id)) + 1;
     const newOccurrenceEntry: Occurrence = {
         id: newId,
         date: new Date().toISOString().split('T')[0], // Today's date
         type: newOccurrenceType,
         description: newOccurrenceDesc,
         status: 'pending',
         response: null,
     };
     // Note: In a real app, you'd fetch the updated list or add optimistically
     initialOccurrences.unshift(newOccurrenceEntry); // Add to front (temporary simulation)


     // TODO: Notify Admin/Sindico (push/email) about the new occurrence
    toast({ title: "Sucesso", description: `Ocorrência (${newOccurrenceType}) registrada com sucesso.` });
    setNewOccurrenceType(undefined);
    setNewOccurrenceDesc('');
    setOccurrencePhoto(null);
     // Optionally clear the file input
     const fileInput = document.getElementById('occurrence-photo') as HTMLInputElement;
     if (fileInput) fileInput.value = '';
  };

  const getStatusBadge = (status: OccurrenceStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive"><Clock className="mr-1 h-3 w-3" />Pendente</Badge>;
      case 'in_progress':
         return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />Em Andamento</Badge>;
      case 'resolved':
        return <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Resolvido</Badge>;
      case 'archived':
        return <Badge variant="secondary">Arquivado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: OccurrenceType) => {
      switch (type) {
          case 'reclamação': return <MessageSquareQuote className="h-4 w-4 mr-1 text-destructive" />;
          case 'elogio': return <ThumbsUp className="h-4 w-4 mr-1 text-green-600" />;
          case 'sugestão': return <Lightbulb className="h-4 w-4 mr-1 text-blue-600" />;
          default: return null;
      }
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Minhas Ocorrências</h1>
      <p className="text-muted-foreground">Registre reclamações, elogios ou sugestões para a administração.</p>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Nova Ocorrência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
             <div className="space-y-1.5">
               <Label htmlFor="occurrence-type">Tipo de Ocorrência</Label>
               <Select value={newOccurrenceType} onValueChange={(value) => setNewOccurrenceType(value as OccurrenceType)}>
                 <SelectTrigger id="occurrence-type">
                   <SelectValue placeholder="Selecione Reclamação, Elogio ou Sugestão" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="reclamação">Reclamação</SelectItem>
                   <SelectItem value="elogio">Elogio</SelectItem>
                   <SelectItem value="sugestão">Sugestão</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div className="space-y-1.5">
                <Label htmlFor="occurrence-photo">Anexar Foto (Opcional - até 5MB)</Label>
                <Input id="occurrence-photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                 {occurrencePhoto && <p className="text-xs text-muted-foreground">Arquivo selecionado: {occurrencePhoto.name}</p>}
             </div>
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="occurrence-description">Descrição</Label>
            <Textarea
              placeholder="Descreva a ocorrência..."
              id="occurrence-description"
              value={newOccurrenceDesc}
              onChange={(e) => setNewOccurrenceDesc(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmitOccurrence} disabled={!newOccurrenceType || !newOccurrenceDesc.trim()}>Enviar Ocorrência</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ocorrências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {initialOccurrences.length > 0 ? ( // Use initialOccurrences for simulation
            initialOccurrences.map((occurrence) => (
              <Card key={occurrence.id} className="bg-muted/50">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-1">
                        {getTypeIcon(occurrence.type)}
                        <span className="text-sm font-medium capitalize">{occurrence.type}</span>
                     </div>
                    {getStatusBadge(occurrence.status)}
                  </div>
                   <CardDescription>
                      Registrado em: {new Date(occurrence.date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm mb-2">{occurrence.description}</p>
                  {occurrence.response && (
                     <div className="mt-2 border-l-4 border-primary pl-3 py-1 bg-background">
                      <p className="text-sm font-semibold text-primary">Resposta da Administração:</p>
                      <p className="text-sm text-muted-foreground">{occurrence.response}</p>
                     </div>
                  )}
                  {occurrence.ticketId && (
                     <div className="mt-2">
                        <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                             {/* TODO: Link to actual resident ticket view page */}
                             <a href={`/resident/tickets/${occurrence.ticketId}`}><Ticket className="mr-1 h-3 w-3"/> Ver Ticket #{occurrence.ticketId}</a>
                        </Button>
                     </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">Nenhuma ocorrência registrada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
