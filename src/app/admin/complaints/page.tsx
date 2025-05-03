
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { MessageSquareQuote, CheckCircle, Clock, Filter, Download, Eye, ThumbsUp, Lightbulb, Ticket } from 'lucide-react'; // Icons for types and status
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import Image from 'next/image';
import { notifyTicketReply, notifyTicketStatusChange } from '@/services/notifications'; // Placeholder imports


type OccurrenceStatus = 'pending' | 'in_progress' | 'resolved' | 'archived';
// Updated OccurrenceType as requested
type OccurrenceType = 'reclamação' | 'elogio' | 'sugestão';

interface Occurrence {
    id: number;
    date: Date;
    type: OccurrenceType;
    description: string;
    status: OccurrenceStatus;
    response?: string; // Last response excerpt or link to ticket
    residentName: string;
    residentEmail?: string; // Added for notifications
    condominium: string;
    unit: string;
    photoUrl?: string;
    assignedTo?: string;
    ticketId?: number;
}

// Sample data - replace with actual data fetching
// TODO: Fetch occurrences, likely filtered or globally depending on Admin vs. Sindico role
const initialOccurrences: Occurrence[] = [
    { id: 1, date: new Date(2024, 6, 24), type: "reclamação", description: "Barulho excessivo vindo do apartamento 301 após as 22h.", status: "pending", residentName: "Carlos Proprietário", residentEmail: "carlos.prop@email.com", condominium: "Plaza das Flores IV", unit: "A/101", photoUrl: "https://picsum.photos/300/200?random=10" },
    { id: 2, date: new Date(2024, 6, 20), type: "sugestão", description: "Instalar bicicletário na área comum.", status: "resolved", response: "Sugestão anotada para próxima assembleia.", residentName: "Fernanda Inquilina", residentEmail: "fernanda.inq@email.com", condominium: "Plaza das Flores IV", unit: "A/102", assignedTo: "Síndico Principal", ticketId: 101 },
    { id: 3, date: new Date(2024, 6, 18), type: "elogio", description: "Parabéns pela organização da festa junina!", status: "archived", residentName: "Roberto Proprietário", residentEmail: "roberto.prop@email.com", condominium: "Plaza das Flores III", unit: "B/201", assignedTo: "Admin Auxiliar"},
    { id: 4, date: new Date(2024, 6, 25), type: "reclamação", description: "Lixo acumulado próximo ao bloco C.", status: "in_progress", residentName: "Juliana Proprietária", residentEmail: "juliana.prop@email.com", condominium: "Plaza das Flores III", unit: "B/202", assignedTo: "Supervisor Predial", ticketId: 102 },
];

// Sample condo names (fetch dynamically)
const condoNames = ["Plaza das Flores IV", "Plaza das Flores III"];
// Sample admin/sindico users (fetch dynamically)
const adminUsers = ["Síndico Principal", "Admin Auxiliar", "Supervisor Predial"];

export default function AdminOccurrencesPage() {
    const [occurrences, setOccurrences] = useState<Occurrence[]>(initialOccurrences);
    const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
    const [filterCondo, setFilterCondo] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');


    const { toast } = useToast();

     const handleOpenDetails = (occurrence: Occurrence) => {
        setSelectedOccurrence(occurrence);
    };

     const handleCloseDetails = () => {
        setSelectedOccurrence(null);
    };


     const handleAssign = async (occurrenceId: number, assignee: string) => {
         // --- BACKEND NOTE ---
         // Update the 'assignedTo' field and potentially the 'status' to 'in_progress' in the database.
         // Link the assignment to the corresponding ticket if it exists.
         // Use prepared statements.
         // Ensure only authorized users (Admin/Sindico) can perform this.
         console.log(`Assigning occurrence ${occurrenceId} to ${assignee}`);
         setOccurrences(occurrences.map(o => o.id === occurrenceId ? { ...o, assignedTo: assignee, status: o.status === 'pending' ? 'in_progress' : o.status } : o));
         toast({ title: "Sucesso", description: `Ocorrência #${occurrenceId} atribuída a ${assignee}.` });
         // TODO: Notify assignee (push/email) via `notifyAdminTicketAssigned` if ticket exists, or general notification.
     }


      const handleCreateTicket = async (occurrenceId: number) => {
          // --- BACKEND NOTE ---
          // Check if a ticket already exists for this occurrence.
          // If not, create a new ticket record linked to this occurrence.
          // Set the ticket subject/initial message based on occurrence details.
          // Update the occurrence record with the new ticketId and potentially set status to 'in_progress'.
          // Use prepared statements.
          // Ensure only authorized users (Admin/Sindico) can perform this.
         console.log(`Creating ticket for occurrence ${occurrenceId}`);
         const newTicketId = Math.floor(Math.random() * 1000) + 100; // Simulate ticket ID
         setOccurrences(occurrences.map(o => o.id === occurrenceId ? { ...o, ticketId: newTicketId, status: 'in_progress' } : o));
         toast({ title: "Sucesso", description: `Ticket #${newTicketId} criado para a ocorrência #${occurrenceId}.` });
          // TODO: Notify relevant admin/sindico about the new ticket via `notifyAdminNewOccurrence`.
          handleCloseDetails();
          // Optionally redirect to the ticket page:
          // router.push(`/admin/tickets/${newTicketId}`);
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
            <p className="text-muted-foreground">Visualize, atribua e acompanhe as ocorrências (reclamações, elogios, sugestões) dos moradores via tickets. Respostas são gerenciadas na tela de Tickets.</p>

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
                                <Card key={occurrence.id} className="bg-muted/50 hover:shadow-md transition-shadow duration-200">
                                     <CardHeader className="p-4 pb-2">
                                          <div className="flex justify-between items-start gap-2">
                                             <div className="flex items-center gap-2">
                                                 {getTypeIcon(occurrence.type)}
                                                 <div>
                                                    <p className="text-sm font-semibold capitalize">{occurrence.type} #{occurrence.id}</p>
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
                                          {occurrence.ticketId && (
                                             <div className="mt-2">
                                                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                                                     <a href={`/admin/tickets/${occurrence.ticketId}`}><Ticket className="mr-1 h-3 w-3"/> Ver Ticket #{occurrence.ticketId}</a>
                                                </Button>
                                             </div>
                                          )}
                                     </CardContent>
                                      <CardFooter className="p-4 pt-0 justify-end">
                                        <Dialog onOpenChange={(open) => !open && handleCloseDetails()}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDetails(occurrence)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Detalhes / Atribuir
                                                </Button>
                                            </DialogTrigger>
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
                                                                  {/* --- SECURITY NOTE: Ensure photoUrl is from a trusted source and properly validated --- */}
                                                                  <Image
                                                                     src={selectedOccurrence.photoUrl}
                                                                     alt="Foto da Ocorrência"
                                                                     width={400}
                                                                     height={300}
                                                                     className="rounded-md object-cover border transition-transform duration-300 hover:scale-105 cursor-pointer"
                                                                     data-ai-hint="complaint issue photo"
                                                                     onClick={() => window.open(selectedOccurrence.photoUrl, '_blank')} // Open image in new tab
                                                                  />
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

                                                    </div>
                                                    <DialogFooter className="gap-2 flex-wrap justify-end">
                                                         <DialogClose asChild>
                                                             <Button type="button" variant="secondary">Fechar</Button>
                                                         </DialogClose>
                                                          {/* Button to create/link ticket */}
                                                         {!selectedOccurrence.ticketId && (selectedOccurrence.status === 'pending' || selectedOccurrence.status === 'in_progress') && (
                                                            <Button type="button" variant="outline" onClick={() => handleCreateTicket(selectedOccurrence.id)}>
                                                               <Ticket className="mr-2 h-4 w-4" /> Criar Ticket
                                                            </Button>
                                                         )}
                                                          {/* Go to Ticket button if already exists */}
                                                         {selectedOccurrence.ticketId && (
                                                            <Button type="button" asChild>
                                                                <a href={`/admin/tickets/${selectedOccurrence.ticketId}`}>
                                                                    <Ticket className="mr-2 h-4 w-4"/> Abrir Ticket #{selectedOccurrence.ticketId}
                                                                </a>
                                                            </Button>
                                                         )}
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
