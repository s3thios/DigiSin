'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { MessageSquareQuote, CheckCircle, Clock, Filter, Download, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Use Dialog for details/response
import Image from 'next/image'; // For displaying attached photos


interface Complaint {
    id: number;
    date: Date;
    description: string;
    status: 'pending' | 'resolved' | 'archived';
    response?: string;
    residentName: string; // Name of the resident who complained
    condominium: string;
    unit: string; // Block + Apartment
    photoUrl?: string; // URL of attached photo
}

// Sample data - replace with actual data fetching
const initialComplaints: Complaint[] = [
    { id: 1, date: new Date(2024, 6, 24), description: "Barulho excessivo vindo do apartamento 301 após as 22h.", status: "pending", residentName: "Carlos Proprietário", condominium: "Plaza das Flores IV", unit: "A/101", photoUrl: "https://picsum.photos/300/200?random=10" },
    { id: 2, date: new Date(2024, 6, 20), description: "Vazamento na garagem próximo à vaga 12.", status: "resolved", response: "Equipe de manutenção verificou e reparou o vazamento.", residentName: "Fernanda Inquilina", condominium: "Plaza das Flores IV", unit: "A/102" },
    { id: 3, date: new Date(2024, 6, 18), description: "Luz do corredor do 5º andar queimada.", status: "pending", residentName: "Roberto Proprietário", condominium: "Plaza das Flores III", unit: "B/201" },
];

// Sample condo names (fetch dynamically)
const condoNames = ["Plaza das Flores IV", "Plaza das Flores III"];

export default function AdminComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [responseText, setResponseText] = useState('');
    const [filterCondo, setFilterCondo] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');


    const { toast } = useToast();

     const handleOpenDetails = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setResponseText(complaint.response || ''); // Pre-fill response if exists
    };

     const handleCloseDetails = () => {
        setSelectedComplaint(null);
        setResponseText('');
    };


     const handleSendResponse = async () => {
        if (!selectedComplaint || !responseText.trim()) {
            toast({ title: "Erro", description: "Digite uma resposta para a reclamação.", variant: "destructive" });
            return;
        }

        // TODO: Implement actual submission logic (send response to backend, update complaint status)
        console.log(`Responding to complaint ${selectedComplaint.id}:`, responseText);
         const updatedComplaint = { ...selectedComplaint, status: 'resolved' as const, response: responseText };

         setComplaints(complaints.map(c => c.id === selectedComplaint.id ? updatedComplaint : c));

        toast({ title: "Sucesso", description: "Resposta enviada e reclamação marcada como resolvida." });

         // Optionally send email notification to resident about the response
         // await sendEmail({ to: residentEmail, subject: `Resposta à sua reclamação #${selectedComplaint.id}`, body: responseText });

        handleCloseDetails(); // Close dialog after sending
    };

    // TODO: Implement handleArchiveComplaint function

     const getStatusBadge = (status: Complaint['status']) => {
        switch (status) {
        case 'pending':
            return <Badge variant="destructive"><Clock className="mr-1 h-3 w-3" />Pendente</Badge>;
        case 'resolved':
            return <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Resolvido</Badge>;
        case 'archived':
             return <Badge variant="secondary">Arquivado</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
        }
    };

     const filteredComplaints = useMemo(() => {
        return complaints.filter(complaint => {
            const matchesCondo = filterCondo === 'all' || complaint.condominium === filterCondo;
            const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
            return matchesCondo && matchesStatus;
        }).sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by newest first
    }, [complaints, filterCondo, filterStatus]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Reclamações</h1>
            <p className="text-muted-foreground">Visualize e responda às reclamações e sugestões dos moradores.</p>

             {/* Filter Section */}
             <Card>
                <CardContent className="p-4 flex flex-wrap items-end gap-4">
                     <div className="flex-1 min-w-[200px] space-y-1.5">
                       <Label htmlFor="filter-condo">Filtrar por Condomínio</Label>
                         <Select value={filterCondo} onValueChange={setFilterCondo}>
                             <SelectTrigger id="filter-condo" className="w-full">
                                 <SelectValue placeholder="Selecione o Condomínio" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 {condoNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                             </SelectContent>
                         </Select>
                     </div>
                     <div className="flex-1 min-w-[200px] space-y-1.5">
                        <Label htmlFor="filter-status">Filtrar por Status</Label>
                         <Select value={filterStatus} onValueChange={setFilterStatus}>
                             <SelectTrigger id="filter-status" className="w-full">
                                 <SelectValue placeholder="Selecione o Status" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 <SelectItem value="pending">Pendente</SelectItem>
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
                    <CardTitle>Lista de Reclamações</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredComplaints.length > 0 ? (
                         <div className="space-y-4">
                             {filteredComplaints.map((complaint) => (
                                <Card key={complaint.id} className="bg-muted/50">
                                     <CardHeader className="p-4 pb-2">
                                          <div className="flex justify-between items-start gap-2">
                                             <div>
                                                <p className="text-sm font-semibold">{complaint.residentName} ({complaint.unit})</p>
                                                <CardDescription>
                                                    {complaint.condominium} - Registrado em: {complaint.date.toLocaleDateString('pt-BR')}
                                                </CardDescription>
                                             </div>
                                             {getStatusBadge(complaint.status)}
                                         </div>
                                     </CardHeader>
                                     <CardContent className="p-4 pt-0">
                                         <p className="text-sm mb-2">{complaint.description}</p>
                                          {complaint.response && (
                                             <div className="mt-2 border-l-4 border-primary pl-3 py-1 bg-background">
                                              <p className="text-sm font-semibold text-primary">Resposta:</p>
                                              <p className="text-sm text-muted-foreground">{complaint.response}</p>
                                             </div>
                                          )}
                                     </CardContent>
                                      <CardFooter className="p-4 pt-0 justify-end">
                                        <Dialog onOpenChange={(open) => !open && handleCloseDetails()}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenDetails(complaint)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Ver Detalhes / Responder
                                                </Button>
                                            </DialogTrigger>
                                             {/* Keep content outside trigger if it depends on selectedComplaint */}
                                             {selectedComplaint && selectedComplaint.id === complaint.id && (
                                                <DialogContent className="sm:max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle>Detalhes da Reclamação #{selectedComplaint.id}</DialogTitle>
                                                        <DialogDescription>
                                                             De: {selectedComplaint.residentName} ({selectedComplaint.unit}, {selectedComplaint.condominium}) em {selectedComplaint.date.toLocaleDateString('pt-BR')}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                                                         <p><span className="font-semibold">Descrição:</span> {selectedComplaint.description}</p>
                                                          {selectedComplaint.photoUrl && (
                                                             <div>
                                                                 <p className="font-semibold mb-1">Foto Anexada:</p>
                                                                 {/* Using next/image - configure domains in next.config.ts if needed */}
                                                                  <Image
                                                                     src={selectedComplaint.photoUrl}
                                                                     alt="Foto da Reclamação"
                                                                     width={400}
                                                                     height={300}
                                                                     className="rounded-md object-cover border"
                                                                     data-ai-hint="complaint issue photo"
                                                                  />
                                                                  {/* Add download button for photo? */}
                                                                 {/* <Button variant="link" size="sm" asChild>
                                                                     <a href={selectedComplaint.photoUrl} target="_blank" rel="noreferrer"><Download className="mr-1 h-3 w-3"/> Baixar Foto</a>
                                                                 </Button> */}
                                                             </div>
                                                         )}

                                                         <div className="space-y-1.5">
                                                             <Label htmlFor="response-text">Resposta da Administração</Label>
                                                             <Textarea
                                                                 id="response-text"
                                                                 rows={4}
                                                                 value={responseText}
                                                                 onChange={(e) => setResponseText(e.target.value)}
                                                                 placeholder={selectedComplaint.status === 'pending' ? "Digite a resposta aqui..." : "Resposta já enviada."}
                                                                 readOnly={selectedComplaint.status !== 'pending'}
                                                             />
                                                         </div>
                                                    </div>
                                                    <DialogFooter className="gap-2">
                                                         <DialogClose asChild>
                                                             <Button type="button" variant="secondary">Fechar</Button>
                                                         </DialogClose>
                                                          {selectedComplaint.status === 'pending' && (
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
                        <p className="text-center text-muted-foreground py-4">Nenhuma reclamação encontrada com os filtros aplicados.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
