'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Ticket, Clock, CheckCircle, Filter, Eye, MessageSquare, User, Shield } from 'lucide-react'; // Added icons
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types (should match admin side)
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type MessageAuthor = 'resident' | 'admin' | 'sindico';

interface TicketMessage {
    id: number;
    author: MessageAuthor;
    authorName: string;
    timestamp: Date;
    content: string;
}

interface SupportTicket {
    id: number;
    subject: string;
    status: TicketStatus;
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: string; // Admin/Sindico name
    messages: TicketMessage[];
    relatedOccurrenceId?: number;
}

// Sample data - fetch ONLY the tickets for the logged-in resident
// TODO: Fetch resident's tickets dynamically
const initialResidentTickets: SupportTicket[] = [
     {
        id: 101,
        subject: "Sugestão #2",
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
        id: 103,
        subject: "Dúvida sobre taxa de reagendamento",
        status: "open",
        createdAt: new Date(2024, 6, 26, 15, 0),
        updatedAt: new Date(2024, 6, 26, 15, 0),
        messages: [
            { id: 6, author: "resident", authorName: "Carlos Proprietário", timestamp: new Date(2024, 6, 26, 15, 0), content: "Qual o valor da taxa se eu precisar reagendar o salão de festas?" },
        ]
    },
];

export default function ResidentTicketsPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>(initialResidentTickets);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const { toast } = useToast();

     const handleOpenDetails = (ticket: SupportTicket) => {
        setSelectedTicket(ticket);
    };

     const handleCloseDetails = () => {
        setSelectedTicket(null);
    };

     // Resident typically cannot change status/assign, only view/reply (if allowed)

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
            case 'admin':
            case 'sindico': return <Shield className="h-4 w-4 text-blue-600" />; // Generic admin icon for resident view
            default: return <User className="h-4 w-4" />;
        }
     }

     const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
            return matchesStatus;
        }).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()); // Sort by most recently updated
    }, [tickets, filterStatus]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Meus Tickets de Suporte</h1>
            <p className="text-muted-foreground">Acompanhe suas solicitações e comunicações com a administração.</p>

             {/* Filter Section */}
             <Card>
                <CardContent className="p-4 flex flex-wrap items-end gap-4">
                     <div className="flex-1 min-w-[200px] space-y-1.5">
                        <Label htmlFor="filter-status">Filtrar por Status</Label>
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
                </CardContent>
             </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Seus Tickets</CardTitle>
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
                                                     Criado em: {format(ticket.createdAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })} | Última att.: {format(ticket.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                                </CardDescription>
                                                 {ticket.assignedTo && (
                                                     <CardDescription>
                                                         Responsável: {ticket.assignedTo}
                                                     </CardDescription>
                                                 )}
                                             </div>
                                             {getStatusBadge(ticket.status)}
                                         </div>
                                     </CardHeader>
                                      <CardFooter className="p-4 pt-2 justify-end">
                                        <Dialog onOpenChange={(open) => !open && handleCloseDetails()}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDetails(ticket)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                                                </Button>
                                            </DialogTrigger>
                                             {/* Keep content outside trigger */}
                                             {selectedTicket && selectedTicket.id === ticket.id && (
                                                <DialogContent className="sm:max-w-xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Detalhes do Ticket #{selectedTicket.id}</DialogTitle>
                                                        <DialogDescription>
                                                             Assunto: {selectedTicket.subject}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                     <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto border-t border-b px-6 -mx-6">
                                                        <p className="text-sm"><span className="font-semibold">Status:</span> {getStatusBadge(selectedTicket.status)}</p>
                                                         <Separator />
                                                         <h4 className="font-semibold text-base">Histórico de Mensagens</h4>
                                                          <div className="space-y-4">
                                                              {selectedTicket.messages.map(msg => (
                                                                  <div key={msg.id} className={`flex gap-3 ${msg.author === 'resident' ? 'justify-start' : 'justify-end'}`}>
                                                                       {msg.author === 'resident' && (
                                                                          <Avatar className="h-8 w-8 border">
                                                                              {/* TODO: Get resident's avatar */}
                                                                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                                                          </Avatar>
                                                                        )}
                                                                        <div className={`p-3 rounded-lg max-w-[75%] ${msg.author === 'resident' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                                                                            <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                                                                {getAuthorIcon(msg.author)}
                                                                                {msg.author === 'resident' ? 'Você' : msg.authorName} {/* Show 'Você' for resident */}
                                                                                <span className="text-xs opacity-70 ml-2">{format(msg.timestamp, 'dd/MM HH:mm', { locale: ptBR })}</span>
                                                                            </p>
                                                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                                        </div>
                                                                         {(msg.author === 'admin' || msg.author === 'sindico') && (
                                                                             <Avatar className="h-8 w-8 border">
                                                                                {/* TODO: Get Admin/Sindico avatar */}
                                                                                <AvatarFallback><Shield className="h-4 w-4"/></AvatarFallback>
                                                                            </Avatar>
                                                                         )}
                                                                  </div>
                                                              ))}
                                                          </div>
                                                     </div>
                                                      {/* NOTE: Resident reply functionality might be added here if needed */}
                                                     {/* {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
                                                         <div className="px-6 pb-4 -mx-6 space-y-2 border-t pt-4"> ... Reply Input ... </div>
                                                     )} */}
                                                    <DialogFooter className="pt-4 px-6 -mx-6 pb-6">
                                                         <DialogClose asChild>
                                                             <Button type="button" variant="secondary">Fechar</Button>
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
