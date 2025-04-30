'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarCheck, Filter, Check, X, Eye, Clock, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"; // Use Dialog for details
import Image from 'next/image'; // For proof/damage photos


type ReservationStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'completed';

interface Reservation {
    id: number;
    date: Date;
    time: string;
    residentName: string;
    condominium: string;
    unit: string; // Block + Apartment
    status: ReservationStatus;
    paymentMethod?: 'pix' | 'boleto';
    // paymentCode?: string; // Pix code or Boleto barcode
    // paymentExpiration?: Date;
    proofPhotoUrl?: string; // URL for post-event proof photo
    damageReport?: { // Optional damage report linked to this reservation
        photoUrl: string;
        description: string;
        reportedBy: string; // Admin or resident name
        reportDate: Date;
    }
}

// Sample data - replace with actual data fetching
const initialReservations: Reservation[] = [
    { id: 1, date: new Date(2024, 7, 10), time: "19:00", residentName: "Carlos Proprietário", condominium: "Plaza das Flores IV", unit: "A/101", status: "confirmed", paymentMethod: 'pix' },
    { id: 2, date: new Date(2024, 7, 15), time: "14:00", residentName: "Fernanda Inquilina", condominium: "Plaza das Flores IV", unit: "A/102", status: "pending_payment", paymentMethod: 'boleto', /* paymentCode: '...', paymentExpiration: ... */ },
    { id: 3, date: new Date(2024, 7, 5), time: "10:00", residentName: "Roberto Proprietário", condominium: "Plaza das Flores III", unit: "B/201", status: "completed", proofPhotoUrl: "https://picsum.photos/300/200?random=20" },
    { id: 4, date: new Date(2024, 7, 20), time: "18:00", residentName: "Juliana Proprietária", condominium: "Plaza das Flores III", unit: "B/202", status: "confirmed", paymentMethod: 'pix' },
    { id: 5, date: new Date(2024, 6, 30), time: "12:00", residentName: "Carlos Proprietário", condominium: "Plaza das Flores IV", unit: "A/101", status: "completed", damageReport: { photoUrl: "https://picsum.photos/300/200?random=21", description: "Mesa de vidro trincada.", reportedBy: "Admin", reportDate: new Date(2024, 6, 31) } },

];

// Sample condo names (fetch dynamically)
const condoNames = ["Plaza das Flores IV", "Plaza das Flores III"];

export default function AdminReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [filterCondo, setFilterCondo] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);


    const { toast } = useToast();

    const handleOpenDetails = (reservation: Reservation) => {
        setSelectedReservation(reservation);
    };

     const handleCloseDetails = () => {
        setSelectedReservation(null);
    };

    // TODO: Implement functions to manually confirm payment or cancel reservations if needed
    const handleConfirmPayment = async (reservationId: number) => {
        // TODO: Call backend to confirm payment and update status
        console.log("Manually confirming payment for reservation:", reservationId);
         setReservations(reservations.map(r => r.id === reservationId ? { ...r, status: 'confirmed' } : r));
        toast({ title: "Sucesso", description: "Pagamento confirmado manualmente." });
    };

    const handleCancelReservation = async (reservationId: number) => {
         // TODO: Call backend to cancel reservation
         console.log("Cancelling reservation:", reservationId);
         setReservations(reservations.map(r => r.id === reservationId ? { ...r, status: 'cancelled' } : r));
         toast({ title: "Sucesso", description: "Reserva cancelada." });
         handleCloseDetails(); // Close details dialog if open
    };

     const getStatusBadge = (status: ReservationStatus) => {
        switch (status) {
        case 'pending_payment':
            return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" /> Pag. Pendente</Badge>;
        case 'confirmed':
            return <Badge variant="default"><Check className="mr-1 h-3 w-3" /> Confirmada</Badge>;
        case 'cancelled':
             return <Badge variant="destructive"><X className="mr-1 h-3 w-3" /> Cancelada</Badge>;
         case 'completed':
             return <Badge variant="secondary">Concluída</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
        }
    };

     const filteredReservations = useMemo(() => {
        return reservations.filter(res => {
            const matchesCondo = filterCondo === 'all' || res.condominium === filterCondo;
            const matchesStatus = filterStatus === 'all' || res.status === filterStatus;
             const matchesDate = !filterDate || format(res.date, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd');
            return matchesCondo && matchesStatus && matchesDate;
        }).sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date ascending
    }, [reservations, filterCondo, filterStatus, filterDate]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Reservas (Salão de Festas)</h1>
            <p className="text-muted-foreground">Visualize e gerencie as reservas do salão de festas.</p>

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
                        <Label htmlFor="filter-status">Status</Label>
                         <Select value={filterStatus} onValueChange={setFilterStatus}>
                             <SelectTrigger id="filter-status" className="w-full">
                                 <SelectValue placeholder="Todos" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 <SelectItem value="pending_payment">Pag. Pendente</SelectItem>
                                 <SelectItem value="confirmed">Confirmada</SelectItem>
                                 <SelectItem value="completed">Concluída</SelectItem>
                                 <SelectItem value="cancelled">Cancelada</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                     <div className="flex-1 min-w-[180px] space-y-1.5">
                        <Label htmlFor="filter-date">Data</Label>
                        <Popover>
                           <PopoverTrigger asChild>
                             <Button
                               id="filter-date"
                               variant={"outline"}
                               className={`w-full justify-start text-left font-normal ${!filterDate && "text-muted-foreground"}`}
                             >
                               <CalendarCheck className="mr-2 h-4 w-4" />
                               {filterDate ? format(filterDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                             </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0">
                             <Calendar
                               mode="single"
                               selected={filterDate}
                               onSelect={setFilterDate}
                               initialFocus
                               locale={ptBR}
                             />
                             <div className="p-2 border-t">
                                 <Button variant="ghost" size="sm" onClick={() => setFilterDate(undefined)}>Limpar Data</Button>
                             </div>
                           </PopoverContent>
                         </Popover>
                     </div>
                </CardContent>
             </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Reservas</CardTitle>
                    {/* Add Calendar View Toggle? */}
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        {filteredReservations.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Horário</TableHead>
                                        <TableHead>Morador</TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Condomínio</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReservations.map((res) => (
                                        <TableRow key={res.id}>
                                            <TableCell>{format(res.date, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                                            <TableCell>{res.time}</TableCell>
                                            <TableCell className="font-medium">{res.residentName}</TableCell>
                                            <TableCell>{res.unit}</TableCell>
                                            <TableCell>{res.condominium}</TableCell>
                                            <TableCell>{getStatusBadge(res.status)}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Dialog onOpenChange={(open) => !open && handleCloseDetails()}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Ver Detalhes" onClick={() => handleOpenDetails(res)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                     {/* Keep content outside trigger */}
                                                      {selectedReservation && selectedReservation.id === res.id && (
                                                         <DialogContent className="sm:max-w-lg">
                                                            <DialogHeader>
                                                                <DialogTitle>Detalhes da Reserva #{selectedReservation.id}</DialogTitle>
                                                                 <DialogDescription>
                                                                     Salão de Festas - {format(selectedReservation.date, "PPP", { locale: ptBR })} às {selectedReservation.time} <br/>
                                                                     Morador: {selectedReservation.residentName} ({selectedReservation.unit}, {selectedReservation.condominium})
                                                                 </DialogDescription>
                                                            </DialogHeader>
                                                             <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                                                                 <p><span className="font-semibold">Status:</span> {getStatusBadge(selectedReservation.status)}</p>
                                                                 {selectedReservation.status === 'pending_payment' && selectedReservation.paymentMethod && (
                                                                      <p><span className="font-semibold">Pagamento:</span> Pendente via {selectedReservation.paymentMethod.toUpperCase()}
                                                                         {/* Maybe show payment code/expiration here if needed */}
                                                                      </p>
                                                                 )}
                                                                 {selectedReservation.proofPhotoUrl && (
                                                                     <div>
                                                                         <p className="font-semibold mb-1">Foto Comprovante Pós-Evento:</p>
                                                                         <Image src={selectedReservation.proofPhotoUrl} alt="Foto Comprovante" width={400} height={300} className="rounded-md object-cover border" data-ai-hint="party hall after event"/>
                                                                         {/* Add download button? */}
                                                                     </div>
                                                                 )}
                                                                  {selectedReservation.damageReport && (
                                                                     <div className="border p-3 rounded-md bg-destructive/10">
                                                                         <p className="font-semibold mb-1 text-destructive">Relatório de Dano Vinculado:</p>
                                                                         <p className="text-sm"><span className="font-medium">Descrição:</span> {selectedReservation.damageReport.description}</p>
                                                                         <p className="text-sm"><span className="font-medium">Reportado por:</span> {selectedReservation.damageReport.reportedBy} em {selectedReservation.damageReport.reportDate.toLocaleDateString('pt-BR')}</p>
                                                                          <Image src={selectedReservation.damageReport.photoUrl} alt="Foto Dano" width={400} height={300} className="rounded-md object-cover border mt-2" data-ai-hint="damage broken item"/>
                                                                         {/* Add download button? */}
                                                                     </div>
                                                                 )}

                                                             </div>
                                                            <DialogFooter className="gap-2 flex-wrap justify-end">
                                                                <DialogClose asChild><Button type="button" variant="secondary">Fechar</Button></DialogClose>
                                                                 {selectedReservation.status === 'pending_payment' && (
                                                                     <Button type="button" size="sm" variant="outline" onClick={() => handleConfirmPayment(selectedReservation.id)}>
                                                                         <Check className="mr-1 h-4 w-4"/> Confirmar Pag. Manual
                                                                     </Button>
                                                                 )}
                                                                 {(selectedReservation.status === 'pending_payment' || selectedReservation.status === 'confirmed') && (
                                                                    <Button type="button" size="sm" variant="destructive" onClick={() => handleCancelReservation(selectedReservation.id)}>
                                                                         <X className="mr-1 h-4 w-4"/> Cancelar Reserva
                                                                    </Button>
                                                                 )}
                                                            </DialogFooter>
                                                         </DialogContent>
                                                      )}
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">Nenhuma reserva encontrada com os filtros aplicados.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
