'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Ticket, Clock, CheckCircle, Filter, Send, User, Shield, Eye, MessageSquare } from 'lucide-react'; // Added icons
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type MessageAuthor = 'resident' | 'admin' | 'sindico';

interface TicketMessage {
    id: number;
    author: MessageAuthor;
    authorName: string; // e.g., "Maria Residente", "Admin Auxiliar"
    timestamp: Date;
    content: string;
}

interface SupportTicket {
    id: number;
    subject: string; // e.g., "Ocorrência #4", "Dúvida sobre reserva"
    residentName: string;
    condominium: string;
    unit: string;
    status: TicketStatus;
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: string; // Admin/Sindico name
    messages: TicketMessage[];
    relatedOccurrenceId?: number; // Link back to the originating occurrence if applicable
}

// Sample data - replace with actual data fetching
const initialTickets: SupportTicket[] = [
    {
        id: 101,
        subject: "Sugestão #2",
        residentName: "Fernanda Inquilina",
        condominium: "Plaza das Flores IV",
        unit: "A/102",
        status: "resolved",
        createdAt: new Date(2024, 6, 20, 10, 0),
        updatedAt: new Date(2024, 6, 21, 11, 30),
        assignedTo: "Síndico Principal",
        relatedOccurrenceId: 2,
        messages: [
            { id: 1, author: "resident", authorName: "Fernanda Inquilina", timestamp: new Date(2024, 6, 20, 10, 0), content: "Gostaria de sugerir a instalação de um bicicletário na área comum." },
            { id: 2, author: "sindico", authorName: "Síndico Principal", timestamp: new Date(2024, 6, 21, 11, 30), content: "Obrigado pela sugestão, Fernanda! Anotamos para discutir na próxima assembleia." },
        ]
    },
    {
        id: 102,
        subject: "Ocorrência #4 - Lixo Acumulado",
        residentName: "Juliana Proprietária",
        condominium: "Plaza das Flores III",
        unit: "B/202",
        status: "in_progress",
        createdAt: new Date(2024, 6, 25, 9, 15),
        updatedAt: new Date(2024, 6, 25, 14, 0),
        assignedTo: "Supervisor Predial",
        relatedOccurrenceId: 4,
        messages: [
            { id: 3, author: "resident", authorName: "Juliana Proprietária", timestamp: new Date(2024, 6, 25, 9, 15), content: "O lixo está acumulando perto do Bloco C há dois dias." },
            { id: 4, author: "admin", authorName: "Admin Auxiliar", timestamp: new Date(2024, 6, 25, 9, 30), content: "Recebido. Encaminhando para o supervisor responsável." },
             { id: 5, author: "supervisor", authorName: "Supervisor Predial", timestamp: new Date(2024, 6, 25, 14, 0), content: "Juliana, já solicitei a coleta reforçada para hoje. Obrigado por avisar." },
        ]
    },
     {
        id: 103,
        subject: "Dúvida sobre taxa de reagendamento",
        residentName: "Carlos Proprietário",
        condominium: "Plaza das Flores IV",
        unit: "A/101",
        status: "open",
        createdAt: new Date(2024, 6, 26, 15, 0),
        updatedAt: new Date(2024, 6, 26, 15, 0),
        messages: [
            { id: 6, author: "resident", authorName: "Carlos Proprietário", timestamp: new Date(2024, 6, 26, 15, 0), content: "Qual o valor da taxa se eu precisar reagendar o salão de festas?" },
        ]
    },
];

// Sample condo names (fetch dynamically)
const condoNames = ["Plaza das Flores IV", "Plaza das Flores III"];
// Sample admin/sindico users (fetch dynamically)
const adminUsers = ["Síndico Principal", "Admin Auxiliar", "Supervisor Predial"];
// TODO: Get current logged-in admin/sindico user
const currentAdminUser = { name: "Admin Auxiliar", role: "admin" as MessageAuthor };

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [replyText, setReplyText] = useState('');
    const [filterCondo, setFilterCondo] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterAssigned, setFilterAssigned] = useState<string>('all');


    const { toast } = useToast();

     const handleOpenDetails = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
        setReplyText('');
    };

     const handleCloseDetails = () => {
        setSelectedTicket(null);
        setReplyText('');
    };


     const handleSendReply = async () => {
        if (!selectedTicket || !replyText.trim()) {
            toast({ title: "Erro", description: "Digite uma resposta para o ticket.", variant: "destructive" });
            return;
        }

        // TODO: Implement actual reply submission logic (send message to backend, update ticket status/updatedAt)
        const newMessage: TicketMessage = {
            id: Math.random(), // Generate temporary ID
            author: currentAdminUser.role,
            authorName: currentAdminUser.name,
            timestamp: new Date(),
            content: replyText.trim(),
        };

        console.log(`Replying to ticket ${selectedTicket.id}:`, newMessage);

        const updatedTicket = {
            ...selectedTicket,
            messages: [...selectedTicket.messages, newMessage],
            status: selectedTicket.status === 'open' ? 'in_progress' : selectedTicket.status, // Update status if it was just 'open'
            updatedAt: new Date(),
            assignedTo: selectedTicket.assignedTo ?? currentAdminUser.name, // Assign if not assigned
        };

         setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
         setSelectedTicket(updatedTicket); // Update the selected ticket state as well

        toast({ title: "Sucesso", description: "Resposta enviada." });

         // TODO: Notify resident (push/email) about the new reply
         // await sendEmail({ to: residentEmail, subject: `Nova resposta no Ticket #${selectedTicket.id}`, body: replyText });

        setReplyText(''); // Clear reply input
    };

     // TODO: Implement handleAssign function
     const handleAssign = async (ticketId: number, assignee: string) => {
         console.log(`Assigning ticket ${ticketId} to ${assignee}`);
          // TODO: Update backend
         setTickets(tickets.map(t => t.id === ticketId ? { ...t, assignedTo: assignee, status: t.status === 'open' ? 'in_progress' : t.status } : t));
         toast({ title: "Sucesso", description: `Ticket #${ticketId} atribuído a ${assignee}.` });
          // TODO: Notify assignee (push/email)?
     }

      // TODO: Implement handleStatusChange function
     const handleStatusChange = async (ticketId: number, status: TicketStatus) => {
         console.log(`Changing status of ticket ${ticketId} to ${status}`);
         // TODO: Update backend
         setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: status, updatedAt: new Date() } : t));
         toast({ title: "Sucesso", description: `Status do Ticket #${ticketId} atualizado para ${status}.` });
          // TODO: Notify resident if resolved/closed?
          if (status === 'resolved' || status === 'closed') {
              handleCloseDetails();
          }
     }


     const getStatusBadge = (status: TicketStatus) => {
        switch (status) {
        case 'open':
            return <Badge variant="destructive"><Clock className="mr-1 h-3 w-3" />Aberto</Badge>;
        case 'in_progress':
             return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />Em Andamento</Badge>;
        case 'resolved':
            return <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Resolvido</Badge>;
        case 'closed':
             return <Badge variant="secondary">Fechado</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
        }
    };

     const getAuthorIcon = (author: MessageAuthor) => {
        switch(author) {
            case 'resident': return <User className="h-4 w-4" />;
            case 'admin': return <Shield className="h-4 w-4 text-blue-600" />;
            case 'sindico': return <Shield className="h-4 w-4 text-green-600" />;
            default: return <User className="h-4 w-4" />;
        }
     }


     const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesCondo = filterCondo === 'all' || ticket.condominium === filterCondo;
            const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
            const matchesAssigned = filterAssigned === 'all' || ticket.assignedTo === filterAssigned || (filterAssigned === 'unassigned' && !ticket.assignedTo);
            return matchesCondo && matchesStatus && matchesAssigned;
        }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); // Sort by most recently updated
    }, [tickets, filterCondo, filterStatus, filterAssigned]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Tickets</h1>
            <p className="text-muted-foreground">Acompanhe e responda às solicitações e comunicações dos moradores.</p>

             {/* Filter Section */}
             <Card>
                <CardContent className="p-4 flex flex-wrap items-end gap-4">
                     <div className="flex-1 min-w-[180px] space-y-1.5">
                       <Label htmlFor="filter-condo">Condomínio</Label>
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
                       <Label htmlFor="filter-assigned">Atribuído a</Label>
                         <Select value={filterAssigned} onValueChange={setFilterAssigned}>
                             <SelectTrigger id="filter-assigned" className="w-full">
                                 <SelectValue placeholder="Todos" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 <SelectItem value="unassigned">Não Atribuído</SelectItem>
                                 {adminUsers.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                             </SelectContent>
                         </Select>
                     </div>
                     <div className="flex-1 min-w-[180px] space-y-1.5">
                        <Label htmlFor="filter-status">Status</Label>
                         <Select value={filterStatus} onValueChange={setFilterStatus}>
                             <SelectTrigger id="filter-status" className="w-full">
                                 <SelectValue placeholder="Todos" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 <SelectItem value="open">Aberto</SelectItem>
                                 <SelectItem value="in_progress">Em Andamento</SelectItem>
                                 <SelectItem value="resolved">Resolvido</SelectItem>
                                 <SelectItem value="closed">Fechado</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                     {/* Add date range filter if needed */}
                </CardContent>
             </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Lista de Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredTickets.length > 0 ? (
                         <div className="space-y-4">
                             {filteredTickets.map((ticket) => (
                                <Card key={ticket.id} className="bg-muted/50">
                                     <CardHeader className="p-4 pb-2">
                                          <div className="flex justify-between items-start gap-2">
                                             <div>
                                                <p className="text-base font-semibold">Ticket #{ticket.id}: {ticket.subject}</p>
                                                <CardDescription>
                                                     {ticket.residentName} ({ticket.unit}, {ticket.condominium})
                                                </CardDescription>
                                                <CardDescription>
                                                     Criado em: {format(ticket.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })} | Última att.: {format(ticket.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                                     {ticket.assignedTo && ` | Resp.: ${ticket.assignedTo}`}
                                                </CardDescription>
                                             </div>
                                             {getStatusBadge(ticket.status)}
                                         </div>
                                     </CardHeader>
                                     <CardContent className="p-4 pt-0">
                                          {ticket.messages.length > 0 && (
                                            <p className="text-sm text-muted-foreground italic truncate">
                                                Última msg: "{ticket.messages[ticket.messages.length - 1].content}" por {ticket.messages[ticket.messages.length - 1].authorName}
                                            </p>
                                          )}
                                     </CardContent>
                                      <CardFooter className="p-4 pt-0 justify-end">
                                        <Dialog onOpenChange={(open) => !open && handleCloseDetails()}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDetails(ticket)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Ver / Responder
                                                </Button>
                                            </DialogTrigger>
                                             {/* Keep content outside trigger */}
                                             {selectedTicket && selectedTicket.id === ticket.id && (
                                                <DialogContent className="sm:max-w-2xl"> {/* Wider dialog */}
                                                    <DialogHeader>
                                                        <DialogTitle>Detalhes do Ticket #{selectedTicket.id}</DialogTitle>
                                                        <DialogDescription>
                                                             Assunto: {selectedTicket.subject} <br/>
                                                             Morador: {selectedTicket.residentName} ({selectedTicket.unit}, {selectedTicket.condominium})
                                                        </DialogDescription>
                                                         {/* Link back to Occurrence */}
                                                        {selectedTicket.relatedOccurrenceId && (
                                                            <Button variant="link" size="sm" className="p-0 h-auto -mt-1" asChild>
                                                                <Link href={`/admin/complaints?occurrence=${selectedTicket.relatedOccurrenceId}`}>Ver Ocorrência Original</Link>
                                                            </Button>
                                                        )}
                                                    </DialogHeader>
                                                     <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto border-t border-b px-6 -mx-6">
                                                        <p className="text-sm"><span className="font-semibold">Status:</span> {getStatusBadge(selectedTicket.status)} {selectedTicket.assignedTo && `(Atribuído a: ${selectedTicket.assignedTo})`}</p>
                                                         <Separator />
                                                         <h4 className="font-semibold text-base">Histórico de Mensagens</h4>
                                                          <div className="space-y-4">
                                                              {selectedTicket.messages.map(msg => (
                                                                  <div key={msg.id} className={`flex gap-3 ${msg.author === 'resident' ? 'justify-start' : 'justify-end'}`}>
                                                                       {msg.author === 'resident' && (
                                                                          <Avatar className="h-8 w-8 border">
                                                                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                                                          </Avatar>
                                                                        )}
                                                                        <div className={`p-3 rounded-lg max-w-[75%] ${msg.author === 'resident' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                                                                            <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                                                                {getAuthorIcon(msg.author)}
                                                                                {msg.authorName}
                                                                                <span className="text-xs opacity-70 ml-2">{format(msg.timestamp, 'dd/MM HH:mm', { locale: ptBR })}</span>
                                                                            </p>
                                                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                                        </div>
                                                                         {msg.author !== 'resident' && (
                                                                             <Avatar className="h-8 w-8 border">
                                                                                {/* TODO: Get Admin/Sindico avatar */}
                                                                                <AvatarFallback>{msg.authorName.substring(0, 2)}</AvatarFallback>
                                                                            </Avatar>
                                                                         )}
                                                                  </div>
                                                              ))}
                                                          </div>
                                                     </div>
                                                     {/* Reply Section */}
                                                     {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
                                                         <div className="px-6 pb-4 -mx-6 space-y-2">
                                                              <Label htmlFor="reply-text">Responder como {currentAdminUser.name}</Label>
                                                              <Textarea
                                                                  id="reply-text"
                                                                  rows={3}
                                                                  value={replyText}
                                                                  onChange={(e) => setReplyText(e.target.value)}
                                                                  placeholder="Digite sua resposta aqui..."
                                                              />
                                                               <div className="flex justify-end">
                                                                 <Button type="button" onClick={handleSendReply} disabled={!replyText.trim()}>
                                                                      <Send className="mr-2 h-4 w-4"/> Enviar Resposta
                                                                  </Button>
                                                               </div>
                                                         </div>
                                                     )}

                                                    <DialogFooter className="gap-2 flex-wrap justify-between pt-4 border-t px-6 -mx-6 pb-6">
                                                          {/* Status Change & Assignment */}
                                                         <div className="flex gap-2 flex-wrap">
                                                             {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
                                                                  <Select
                                                                        value={selectedTicket.assignedTo}
                                                                        onValueChange={(value) => handleAssign(selectedTicket.id, value)}
                                                                    >
                                                                        <SelectTrigger className="w-auto text-xs h-8">
                                                                            <SelectValue placeholder="Atribuir..." />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                             <SelectItem value="unassigned">Não Atribuído</SelectItem>
                                                                            {adminUsers.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
                                                                        </SelectContent>
                                                                    </Select>
                                                             )}
                                                              <Select
                                                                    value={selectedTicket.status}
                                                                    onValueChange={(value) => handleStatusChange(selectedTicket.id, value as TicketStatus)}
                                                                >
                                                                    <SelectTrigger className="w-auto text-xs h-8">
                                                                        <SelectValue placeholder="Mudar Status..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="open">Aberto</SelectItem>
                                                                        <SelectItem value="in_progress">Em Andamento</SelectItem>
                                                                        <SelectItem value="resolved">Resolvido</SelectItem>
                                                                        <SelectItem value="closed">Fechado</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                         </div>
                                                         <DialogClose asChild>
                                                             <Button type="button" variant="secondary">Fechar Janela</Button>
                                                         </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                             )}
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-4">Nenhum ticket encontrado com os filtros aplicados.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
