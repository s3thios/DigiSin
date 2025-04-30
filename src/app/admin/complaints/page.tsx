'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { MessageSquareQuote, CheckCircle, Clock, Filter, Download, Eye, ThumbsUp, Lightbulb, Ticket } from 'lucide-react'; // Added ThumbsUp, Lightbulb, Ticket
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"; // Use Dialog for details/response
import Image from 'next/image'; // For displaying attached photos


type OccurrenceStatus = 'pending' | 'in_progress' | 'resolved' | 'archived';
type OccurrenceType = 'reclamação' | 'elogio' | 'sugestão';

interface Occurrence {
    id: number;
    date: Date;
    type: OccurrenceType;
    description: string;
    status: OccurrenceStatus;
    response?: string; // Direct response (legacy?) or link to ticket
    residentName: string; // Name of the resident who submitted
    condominium: string;
    unit: string; // Block + Apartment
    photoUrl?: string; // URL of attached photo
    assignedTo?: string; // Name of Admin/Sindico handling it
    ticketId?: number; // Link to the tracking ticket
}

// Sample data - replace with actual data fetching
const initialOccurrences: Occurrence[] = [
    { id: 1, date: new Date(2024, 6, 24), type: "reclamação", description: "Barulho excessivo vindo do apartamento 301 após as 22h.", status: "pending", residentName: "Carlos Proprietário", condominium: "Plaza das Flores IV", unit: "A/101", photoUrl: "https://picsum.photos/300/200?random=10" },
    { id: 2, date: new Date(2024, 6, 20), type: "sugestão", description: "Instalar bicicletário na área comum.", status: "resolved", response: "Sugestão anotada para próxima assembleia.", residentName: "Fernanda Inquilina", condominium: "Plaza das Flores IV", unit: "A/102", assignedTo: "Síndico Principal", ticketId: 101 },
    { id: 3, date: new Date(2024, 6, 18), type: "elogio", description: "Parabéns pela organização da festa junina!", status: "archived", residentName: "Roberto Proprietário", condominium: "Plaza das Flores III", unit: "B/201", assignedTo: "Admin Auxiliar"},
    { id: 4, date: new Date(2024, 6, 25), type: "reclamação", description: "Lixo acumulado próximo ao bloco C.", status: "in_progress", residentName: "Juliana Proprietária", condominium: "Plaza das Flores III", unit: "B/202", assignedTo: "Supervisor Predial", ticketId: 102 },
];

// Sample condo names (fetch dynamically)
const condoNames = ["Plaza das Flores IV", "Plaza das Flores III"];
// Sample admin/sindico users (fetch dynamically)
const adminUsers = ["Síndico Principal", "Admin Auxiliar", "Supervisor Predial"];

export default function AdminOccurrencesPage() {
    const [occurrences, setOccurrences] = useState<Occurrence[]>(initialOccurrences);
    const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
    const [responseText, setResponseText] = useState(''); // Maybe remove if using tickets only
    const [filterCondo, setFilterCondo] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');


    const { toast } = useToast();

     const handleOpenDetails = (occurrence: Occurrence) => {
        setSelectedOccurrence(occurrence);
        setResponseText(occurrence.response || ''); // Pre-fill response if exists
    };

     const handleCloseDetails = () => {
        setSelectedOccurrence(null);
        setResponseText('');
    };


     const handleSendResponse = async () => {
        // This might be replaced by ticket reply functionality
        if (!selectedOccurrence || !responseText.trim()) {
            toast({ title: "Erro", description: "Digite uma resposta para a ocorrência.", variant: "destructive" });
            return;
        }

        // TODO: Implement actual submission logic (update occurrence status, potentially create/link ticket)
        console.log(`Responding to occurrence ${selectedOccurrence.id}:`, responseText);
         const updatedOccurrence = { ...selectedOccurrence, status: 'resolved' as const, response: responseText, assignedTo: selectedOccurrence.assignedTo ?? "Admin" }; // Assign if not already

         setOccurrences(occurrences.map(o => o.id === selectedOccurrence.id ? updatedOccurrence : o));

        toast({ title: "Sucesso", description: "Resposta enviada e ocorrência marcada como resolvida." });

         // TODO: Notify resident (push/email) about the response/status change
         // await sendEmail({ to: residentEmail, subject: `Resposta à sua ocorrência #${selectedOccurrence.id}`, body: responseText });

        handleCloseDetails(); // Close dialog after sending
    };

     // TODO: Implement handleAssign function
     const handleAssign = async (occurrenceId: number, assignee: string) => {
         console.log(`Assigning occurrence ${occurrenceId} to ${assignee}`);
          // TODO: Update backend
         setOccurrences(occurrences.map(o => o.id === occurrenceId ? { ...o, assignedTo: assignee, status: o.status === 'pending' ? 'in_progress' : o.status } : o));
         toast({ title: "Sucesso", description: `Ocorrência #${occurrenceId} atribuída a ${assignee}.` });
          // TODO: Notify assignee (push/email)?
     }

     // TODO: Implement function to create/link ticket
      const handleCreateTicket = async (occurrenceId: number) => {
         console.log(`Creating ticket for occurrence ${occurrenceId}`);
          // TODO: Call backend to create ticket and link it
         const newTicketId = Math.floor(Math.random() * 1000) + 100; // Simulate ticket ID
         setOccurrences(occurrences.map(o => o.id === occurrenceId ? { ...o, ticketId: newTicketId, status: 'in_progress' } : o));
         toast({ title: "Sucesso", description: `Ticket #${newTicketId} criado para a ocorrência #${occurrenceId}.` });
          // Redirect to ticket page? router.push(`/admin/tickets/${newTicketId}`);
          handleCloseDetails();
      }


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

     const filteredOccurrences = useMemo(() => {
        return occurrences.filter(occurrence => {
            const matchesCondo = filterCondo === 'all' || occurrence.condominium === filterCondo;
            const matchesStatus = filterStatus === 'all' || occurrence.status === filterStatus;
            const matchesType = filterType === 'all' || occurrence.type === filterType;
            return matchesCondo && matchesStatus && matchesType;
        }).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by newest first
    }, [occurrences, filterCondo, filterStatus, filterType]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Ocorrências</h1>
            <p className="text-muted-foreground">Visualize, atribua e responda às ocorrências (reclamações, elogios, sugestões) dos moradores.</p>

             {/* Filter Section */}
             <Card>
                <CardContent className="p-4 flex flex-wrap items-end gap-4">
                     <div className="flex-1 min-w-[180px] space-y-1.5">
                       <Label htmlFor="filter-condo">Filtrar por Condomínio</Label>
                         <Select value={filterCondo} onValueChange={setFilterCondo}>
                             <SelectTrigger id="filter-condo" className="w-full">
                                 <SelectValue placeholder="Todos" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 {condoNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                             </SelectContent>
                         </Select>
                     </div>
                      <div className="flex-1 min-w-[180px] space-y-1.5">
                       <Label htmlFor="filter-type">Filtrar por Tipo</Label>
                         <Select value={filterType} onValueChange={setFilterType}>
                             <SelectTrigger id="filter-type" className="w-full">
                                 <SelectValue placeholder="Todos" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 <SelectItem value="reclamação">Reclamação</SelectItem>
                                 <SelectItem value="elogio">Elogio</SelectItem>
                                 <SelectItem value="sugestão">Sugestão</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                     <div className="flex-1 min-w-[180px] space-y-1.5">
                        <Label htmlFor="filter-status">Filtrar por Status</Label>
                         <Select value={filterStatus} onValueChange={setFilterStatus}>
                             <SelectTrigger id="filter-status" className="w-full">
                                 <SelectValue placeholder="Todos" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 <SelectItem value="pending">Pendente</SelectItem>
                                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                                 <SelectItem value="resolved">Resolvido</SelectItem>
                                 <SelectItem value="archived">Arquivado</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                     {/* Add date range filter if needed */}
                </CardContent>
             </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Lista de Ocorrências</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredOccurrences.length > 0 ? (
                         <div className="space-y-4">
                             {filteredOccurrences.map((occurrence) => (
                                <Card key={occurrence.id} className="bg-muted/50">
                                     <CardHeader className="p-4 pb-2">
                                          <div className="flex justify-between items-start gap-2">
                                             <div className="flex items-center gap-2">
                                                 {getTypeIcon(occurrence.type)}
                                                 <div>
                                                    <p className="text-sm font-semibold capitalize">{occurrence.type}</p>
                                                    <CardDescription>
                                                         {occurrence.residentName} ({occurrence.unit}) - {occurrence.condominium}
                                                    </CardDescription>
                                                    <CardDescription>
                                                        Registrado em: {occurrence.date.toLocaleDateString('pt-BR')}
                                                        {occurrence.assignedTo && ` | Atribuído a: ${occurrence.assignedTo}`}
                                                    </CardDescription>
                                                 </div>
                                             </div>
                                             {getStatusBadge(occurrence.status)}
                                         </div>
                                     </CardHeader>
                                     <CardContent className="p-4 pt-0">
                                         <p className="text-sm mb-2">{occurrence.description}</p>
                                          {occurrence.response && (
                                             <div className="mt-2 border-l-4 border-primary pl-3 py-1 bg-background">
                                              <p className="text-sm font-semibold text-primary">Resposta:</p>
                                              <p className="text-sm text-muted-foreground">{occurrence.response}</p>
                                             </div>
                                          )}
                                          {occurrence.ticketId && (
                                             <div className="mt-2">
                                                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                                     {/* TODO: Link to actual ticket page */}
                                                     <a href={`/admin/tickets/${occurrence.ticketId}`}><Ticket className="mr-1 h-3 w-3"/> Ver Ticket #{occurrence.ticketId}</a>
                                                </Button>
                                             </div>
                                          )}
                                     </CardContent>
                                      <CardFooter className="p-4 pt-0 justify-end">
                                        <Dialog onOpenChange={(open) => !open && handleCloseDetails()}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDetails(occurrence)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Detalhes
                                                </Button>
                                            </DialogTrigger>
                                             {/* Keep content outside trigger if it depends on selectedOccurrence */}
                                             {selectedOccurrence && selectedOccurrence.id === occurrence.id && (
                                                <DialogContent className="sm:max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle>Detalhes da Ocorrência #{selectedOccurrence.id} ({selectedOccurrence.type})</DialogTitle>
                                                        <DialogDescription>
                                                             De: {selectedOccurrence.residentName} ({selectedOccurrence.unit}, {selectedOccurrence.condominium}) em {selectedOccurrence.date.toLocaleDateString('pt-BR')}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                                                         <p><span className="font-semibold">Descrição:</span> {selectedOccurrence.description}</p>
                                                          {selectedOccurrence.photoUrl && (
                                                             <div>
                                                                 <p className="font-semibold mb-1">Foto Anexada:</p>
                                                                  <Image
                                                                     src={selectedOccurrence.photoUrl}
                                                                     alt="Foto da Ocorrência"
                                                                     width={400}
                                                                     height={300}
                                                                     className="rounded-md object-cover border"
                                                                     data-ai-hint="complaint issue photo"
                                                                  />
                                                                 {/* Add download button for photo? */}
                                                                 {/* <Button variant="link" size="sm" asChild>
                                                                     <a href={selectedOccurrence.photoUrl} target="_blank" rel="noreferrer"><Download className="mr-1 h-3 w-3"/> Baixar Foto</a>
                                                                 </Button> */}
                                                             </div>
                                                         )}

                                                         {/* Assignment Dropdown */}
                                                         {(selectedOccurrence.status === 'pending' || selectedOccurrence.status === 'in_progress') && (
                                                             <div className="space-y-1.5">
                                                                 <Label htmlFor="assign-user">Atribuir a:</Label>
                                                                 <Select
                                                                      value={selectedOccurrence.assignedTo}
                                                                      onValueChange={(value) => handleAssign(selectedOccurrence.id, value)}
                                                                 >
                                                                     <SelectTrigger id="assign-user">
                                                                         <SelectValue placeholder="Atribuir a um responsável..." />
                                                                     </SelectTrigger>
                                                                     <SelectContent>
                                                                         {adminUsers.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
                                                                     </SelectContent>
                                                                 </Select>
                                                             </div>
                                                         )}

                                                         {/* Response Area (Might be replaced by Tickets) */}
                                                          {!selectedOccurrence.ticketId && (
                                                            <div className="space-y-1.5">
                                                                <Label htmlFor="response-text">Resposta Rápida (Opcional)</Label>
                                                                <Textarea
                                                                    id="response-text"
                                                                    rows={3}
                                                                    value={responseText}
                                                                    onChange={(e) => setResponseText(e.target.value)}
                                                                    placeholder={selectedOccurrence.status === 'resolved' ? "Resposta já enviada." : "Digite uma resposta rápida aqui..."}
                                                                    readOnly={selectedOccurrence.status === 'resolved' || selectedOccurrence.status === 'archived'}
                                                                />
                                                            </div>
                                                          )}
                                                    </div>
                                                    <DialogFooter className="gap-2 flex-wrap justify-end">
                                                         <DialogClose asChild>
                                                             <Button type="button" variant="secondary">Fechar</Button>
                                                         </DialogClose>
                                                          {/* Button to create/link ticket */}
                                                         {!selectedOccurrence.ticketId && (selectedOccurrence.status === 'pending' || selectedOccurrence.status === 'in_progress') && (
                                                            <Button type="button" variant="outline" onClick={() => handleCreateTicket(selectedOccurrence.id)}>
                                                               <Ticket className="mr-2 h-4 w-4" /> Criar/Vincular Ticket
                                                            </Button>
                                                         )}
                                                          {/* Send quick response button (if not using tickets exclusively) */}
                                                          {!selectedOccurrence.ticketId && responseText.trim() && (selectedOccurrence.status === 'pending' || selectedOccurrence.status === 'in_progress') && (
                                                            <Button type="button" onClick={handleSendResponse} disabled={!responseText.trim()}>
                                                                Enviar Resposta e Resolver
                                                            </Button>
                                                         )}
                                                          {/* Add Archive button? */}
                                                         {/* <Button type="button" variant="outline" onClick={handleArchiveComplaint}>Arquivar</Button> */}
                                                    </DialogFooter>
                                                </DialogContent>
                                             )}
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-4">Nenhuma ocorrência encontrada com os filtros aplicados.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
