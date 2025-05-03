
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Clock, Check, Filter, Search, User, Building, Camera, Send, PlusCircle, Archive, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSearchParams, useRouter } from 'next/navigation'; // To read query params
import { notifyDeliveryArrival, notifyDeliveryPickup } from '@/services/notifications'; // Placeholder notification functions
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import Image from 'next/image'; // For photo preview/display
import { buttonVariants } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type DeliveryStatus = 'pending' | 'delivered' | 'archived';

interface Delivery {
    id: number;
    trackingCode?: string;
    sender?: string;
    notes?: string;
    receivedAt: Date;
    deliveredAt?: Date;
    status: DeliveryStatus;
    photoUrl?: string;
    recipientName: string; // Resident's name
    recipientId: string; // Resident's unique ID (e.g., Firestore UID or internal ID)
    unit: string; // Block/Apartment
    condominiumId: number;
    condominiumName: string; // Denormalized for display
    registeredBy: string; // Name of admin/sindico who registered
}

// Placeholder for resident lookup result
interface ResidentLookup {
    id: string;
    name: string;
    unit: string; // combined block/apt
    email?: string;
    pushToken?: string;
}

// TODO: Fetch residents for the selected condo to populate dropdown/search
const fetchCondoResidents = async (condoId: number): Promise<ResidentLookup[]> => {
    console.log(`Fetching residents for condo ID: ${condoId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    // Replace with actual API call
    if (condoId === 1) {
        return [
            { id: "res1", name: "Carlos Proprietário", unit: "A/101", email: "carlos.prop@email.com" },
            { id: "res2", name: "Fernanda Inquilina", unit: "A/102", email: "fernanda.inq@email.com" },
        ];
    } else if (condoId === 2) {
         return [
             { id: "res3", name: "Roberto Proprietário", unit: "B/201", email: "roberto.prop@email.com" },
             { id: "res4", name: "Juliana Proprietária", unit: "B/202", email: "juliana.prop@email.com" },
         ];
    }
    return [];
};

// TODO: Fetch deliveries based on filters (condo, status, search)
const fetchDeliveries = async (filters: { condoId?: number; status?: string; search?: string }): Promise<Delivery[]> => {
    console.log("Fetching deliveries with filters:", filters);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Replace with actual API call using filters
    const allDeliveries: Delivery[] = [ // Sample data spanning multiple condos
        { id: 101, condominiumId: 1, condominiumName: "Plaza das Flores IV", trackingCode: "AMZ123456BR", sender: "Amazon", notes: "Caixa média", receivedAt: new Date(2024, 6, 28, 10, 30), status: "pending", recipientId: "res1", recipientName: "Carlos Proprietário", unit: "A/101", registeredBy: "Admin" },
        { id: 102, condominiumId: 1, condominiumName: "Plaza das Flores IV", sender: "Correios", notes: "Envelope A4", receivedAt: new Date(2024, 6, 27, 15, 0), status: "pending", recipientId: "res2", recipientName: "Fernanda Inquilina", unit: "A/102", registeredBy: "Admin" },
        { id: 100, condominiumId: 1, condominiumName: "Plaza das Flores IV", trackingCode: "ML987654BR", sender: "Mercado Livre", receivedAt: new Date(2024, 6, 25, 11, 0), deliveredAt: new Date(2024, 6, 25, 18, 0), status: "delivered", recipientId: "res1", recipientName: "Carlos Proprietário", unit: "A/101", registeredBy: "Admin" },
        { id: 103, condominiumId: 2, condominiumName: "Plaza das Flores III", sender: "Magazine Luiza", notes: "Pacote pequeno", receivedAt: new Date(2024, 6, 29, 9, 0), status: "pending", recipientId: "res3", recipientName: "Roberto Proprietário", unit: "B/201", registeredBy: "Síndico" },
    ];

    return allDeliveries.filter(d =>
        (!filters.condoId || d.condominiumId === filters.condoId) &&
        (!filters.status || filters.status === 'all' || d.status === filters.status) &&
        (!filters.search ||
         d.recipientName.toLowerCase().includes(filters.search.toLowerCase()) ||
         d.unit.toLowerCase().includes(filters.search.toLowerCase()) ||
         d.trackingCode?.toLowerCase().includes(filters.search.toLowerCase()) ||
         d.sender?.toLowerCase().includes(filters.search.toLowerCase())
        )
    ).sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
};

// TODO: Fetch list of condos managed by Admin/Sindico
const fetchManagedCondos = async (): Promise<{ id: number; name: string }[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        { id: 1, name: "Plaza das Flores IV" },
        { id: 2, name: "Plaza das Flores III" },
    ];
};

// TODO: Get current logged-in admin/sindico user details
const currentAdminUser = { name: "Admin Logado" };

export default function AdminDeliveriesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialAction = searchParams.get('action'); // Check if 'register' action is requested

    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [managedCondos, setManagedCondos] = useState<{ id: number; name: string }[]>([]);
    const [residentsList, setResidentsList] = useState<ResidentLookup[]>([]); // Residents of selected condo
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistering, setIsRegistering] = useState(initialAction === 'register');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [selectedCondoId, setSelectedCondoId] = useState<number | undefined>(undefined);
    const [selectedResidentId, setSelectedResidentId] = useState<string | undefined>(undefined);
    const [trackingCode, setTrackingCode] = useState('');
    const [sender, setSender] = useState('');
    const [notes, setNotes] = useState('');
    const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    // Filter State
    const [filterCondo, setFilterCondo] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('pending'); // Default to pending
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Action State
     const [deliveryToMark, setDeliveryToMark] = useState<Delivery | null>(null); // For marking delivered
     const [deliveryToRemove, setDeliveryToRemove] = useState<Delivery | null>(null); // For removing

    const { toast } = useToast();

    // Fetch managed condos on initial load
    useEffect(() => {
        const loadCondos = async () => {
            try {
                const condos = await fetchManagedCondos();
                setManagedCondos(condos);
                // Optionally pre-select the first condo if only one or based on query param
                if (condos.length === 1) {
                    setSelectedCondoId(condos[0].id);
                    setFilterCondo(condos[0].id.toString());
                } else {
                     const queryCondoId = searchParams.get('condoId');
                     if (queryCondoId && condos.some(c => c.id === Number(queryCondoId))) {
                         setSelectedCondoId(Number(queryCondoId));
                         setFilterCondo(queryCondoId);
                     }
                }
            } catch (error) {
                toast({ title: "Erro", description: "Falha ao carregar condomínios.", variant: "destructive" });
            }
        };
        loadCondos();
    }, [searchParams, toast]);


     // Fetch residents when selectedCondoId changes for the registration form
     useEffect(() => {
         if (selectedCondoId) {
             const loadResidents = async () => {
                 setIsLoading(true); // Consider a separate loading state for residents list
                 try {
                     const residents = await fetchCondoResidents(selectedCondoId);
                     setResidentsList(residents);
                 } catch (error) {
                     toast({ title: "Erro", description: `Falha ao carregar moradores do condomínio ${selectedCondoId}.`, variant: "destructive" });
                     setResidentsList([]);
                 } finally {
                     setIsLoading(false);
                 }
             };
             loadResidents();
         } else {
             setResidentsList([]); // Clear residents if no condo is selected
         }
     }, [selectedCondoId, toast]);

      // Fetch deliveries based on filters
     useEffect(() => {
         const loadDeliveries = async () => {
             setIsLoading(true);
             try {
                 const filters = {
                     condoId: filterCondo !== 'all' ? Number(filterCondo) : undefined,
                     status: filterStatus !== 'all' ? filterStatus : undefined,
                     search: searchTerm || undefined,
                 };
                 const data = await fetchDeliveries(filters);
                 setDeliveries(data);
             } catch (error) {
                 console.error("Failed to load deliveries:", error);
                 toast({ title: "Erro", description: "Falha ao carregar lista de entregas.", variant: "destructive" });
             } finally {
                 setIsLoading(false);
             }
         };
         loadDeliveries();
     }, [filterCondo, filterStatus, searchTerm, toast]);


    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                toast({ title: "Erro", description: "Tipo de arquivo inválido (JPG, PNG, GIF).", variant: "destructive" });
                return;
            }
            if (file.size > maxSize) {
                toast({ title: "Erro", description: "A foto não pode exceder 5MB.", variant: "destructive" });
                return;
            }
            setDeliveryPhoto(file);
             // Generate preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

        } else {
            setDeliveryPhoto(null);
            setPhotoPreview(null);
        }
    };

    const resetForm = () => {
        setSelectedResidentId(undefined);
        setTrackingCode('');
        setSender('');
        setNotes('');
        setDeliveryPhoto(null);
        setPhotoPreview(null);
        // Keep selectedCondoId if admin manages multiple and might register more for the same condo
        setIsRegistering(false);
    };


    const handleRegisterDelivery = async () => {
        if (!selectedCondoId || !selectedResidentId) {
            toast({ title: "Erro", description: "Selecione o condomínio e o destinatário.", variant: "destructive" });
            return;
        }
        if (!sender && !trackingCode) {
             toast({ title: "Erro", description: "Informe o remetente ou o código de rastreio.", variant: "destructive" });
             return;
        }

        setIsSubmitting(true);
        const resident = residentsList.find(r => r.id === selectedResidentId);
        if (!resident) {
             toast({ title: "Erro", description: "Destinatário inválido.", variant: "destructive" });
             setIsSubmitting(false);
             return;
        }
        const condo = managedCondos.find(c => c.id === selectedCondoId);

        let uploadedPhotoUrl: string | undefined = undefined;
        // --- BACKEND NOTE ---: Handle photo upload securely
        if (deliveryPhoto) {
             try {
                 console.log("Simulating photo upload:", deliveryPhoto.name);
                 // uploadedPhotoUrl = await uploadFileAndGetURL(deliveryPhoto, `deliveries/${selectedCondoId}/...`); // Replace with actual upload
                 uploadedPhotoUrl = photoPreview || undefined; // Use preview for simulation
             } catch (error) {
                  toast({ title: "Erro no Upload", description: "Falha ao enviar a foto.", variant: "destructive" });
                  setIsSubmitting(false);
                  return;
             }
        }

        // --- BACKEND NOTE ---
        // 1. Create delivery record in Firestore.
        // 2. Link to condoId and residentId.
        // 3. Store photoUrl if uploaded.
        // 4. Use prepared statements/transactions.

        const newDeliveryData = {
            condominiumId: selectedCondoId,
            condominiumName: condo?.name || 'Desconhecido',
            recipientId: resident.id,
            recipientName: resident.name,
            unit: resident.unit,
            trackingCode: trackingCode.trim() || undefined,
            sender: sender.trim() || undefined,
            notes: notes.trim() || undefined,
            receivedAt: new Date(),
            status: 'pending' as DeliveryStatus,
            photoUrl: uploadedPhotoUrl,
            registeredBy: currentAdminUser.name, // Get from auth context
        };

        console.log("Registering delivery:", newDeliveryData);

        // Simulate adding to list locally - replace with refetch or real-time update
        const newId = Math.max(0, ...deliveries.map(d => d.id)) + 1;
        const newDelivery = { ...newDeliveryData, id: newId };
        setDeliveries([newDelivery, ...deliveries]);

         // Notify Resident
         try {
             await notifyDeliveryArrival(
                 { email: resident.email, pushToken: resident.pushToken },
                 newDelivery.sender || `Entrega ${newDelivery.trackingCode || ''}`.trim()
             );
         } catch (e) { console.error("Failed to send notification", e); }


        toast({ title: "Sucesso", description: "Entrega registrada e morador notificado." });
        resetForm();
        setIsSubmitting(false);
    };

    const handleMarkDelivered = async () => {
        if (!deliveryToMark) return;

         // --- BACKEND NOTE ---
         // 1. Verify admin/sindico permissions.
         // 2. Update the delivery status to 'delivered' and set 'deliveredAt' timestamp in Firestore.
         // 3. Use prepared statements.

        console.log("Marking delivery as delivered:", deliveryToMark.id);
         // Simulate update
         setDeliveries(deliveries.map(d =>
             d.id === deliveryToMark.id
                 ? { ...d, status: 'delivered', deliveredAt: new Date() }
                 : d
         ));

         // Notify Resident (Optional, might be too noisy)
         // try {
         //    await notifyDeliveryPickup({ email: deliveryToMark.email, pushToken: deliveryToMark.pushToken }, deliveryToMark.id);
         // } catch(e) { console.error("Failed to send pickup notification", e); }


        toast({ title: "Sucesso", description: "Entrega marcada como retirada." });
        setDeliveryToMark(null); // Close dialog
    }

     const handleArchiveDelivery = async (deliveryId: number) => {
         // --- BACKEND NOTE ---
         // 1. Update the delivery status to 'archived'.
         // 2. Use prepared statements.
        console.log("Archiving delivery:", deliveryId);
         setDeliveries(deliveries.map(d =>
             d.id === deliveryId ? { ...d, status: 'archived' } : d
         ));
         toast({ title: "Sucesso", description: "Entrega arquivada." });
     }

     const handleRemoveDelivery = async () => {
        if (!deliveryToRemove) return;
         // --- BACKEND NOTE ---
         // Implement hard delete if necessary (use with caution).
         // Verify permissions.
         // Use prepared statements.
         console.log("Removing delivery:", deliveryToRemove.id);
         setDeliveries(deliveries.filter(d => d.id !== deliveryToRemove.id));
         toast({ title: "Sucesso", description: "Entrega removida permanentemente." });
         setDeliveryToRemove(null);
     }

    const getStatusBadge = (status: DeliveryStatus) => {
        switch (status) {
            case 'pending':
                return <Badge variant="destructive"><Clock className="mr-1 h-3 w-3" /> Pendente</Badge>;
            case 'delivered':
                return <Badge variant="default"><Check className="mr-1 h-3 w-3" /> Retirado</Badge>;
            case 'archived':
                 return <Badge variant="secondary"><Archive className="mr-1 h-3 w-3" /> Arquivado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

     const renderSkeleton = () => (
         <TableRow>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
         </TableRow>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Entregas</h1>
                    <p className="text-muted-foreground">Registre e acompanhe as entregas recebidas para os moradores.</p>
                </div>
                 <Button onClick={() => setIsRegistering(!isRegistering)}>
                     {isRegistering ? 'Cancelar Registro' : <><PlusCircle className="mr-2 h-4 w-4" /> Registrar Nova Entrega</>}
                 </Button>
            </div>

             {isRegistering && (
                 <Card>
                     <CardHeader>
                         <CardTitle>Registrar Nova Entrega</CardTitle>
                         <CardDescription>Selecione o condomínio, o destinatário e preencha os detalhes.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                             {/* Condo Selection (If managing multiple) */}
                              {managedCondos.length > 1 && (
                                 <div className="space-y-1.5">
                                     <Label htmlFor="condo-select">Condomínio*</Label>
                                     <Select value={selectedCondoId?.toString()} onValueChange={(val) => setSelectedCondoId(Number(val))}>
                                         <SelectTrigger id="condo-select">
                                             <SelectValue placeholder="Selecione o Condomínio" />
                                         </SelectTrigger>
                                         <SelectContent>
                                             {managedCondos.map(condo => <SelectItem key={condo.id} value={condo.id.toString()}>{condo.name}</SelectItem>)}
                                         </SelectContent>
                                     </Select>
                                 </div>
                              )}
                              {/* Resident Selection */}
                              <div className="space-y-1.5">
                                   <Label htmlFor="resident-select">Destinatário (Morador)*</Label>
                                   <Select value={selectedResidentId} onValueChange={setSelectedResidentId} disabled={!selectedCondoId}>
                                       <SelectTrigger id="resident-select">
                                           <SelectValue placeholder={selectedCondoId ? "Selecione o morador" : "Selecione o condomínio primeiro"} />
                                       </SelectTrigger>
                                       <SelectContent>
                                            {isLoading && residentsList.length === 0 && <SelectItem value="loading" disabled>Carregando...</SelectItem>}
                                            {!isLoading && residentsList.length === 0 && selectedCondoId && <SelectItem value="no-residents" disabled>Nenhum morador encontrado</SelectItem>}
                                           {residentsList.map(res => (
                                              <SelectItem key={res.id} value={res.id}>
                                                   {res.name} ({res.unit})
                                               </SelectItem>
                                           ))}
                                       </SelectContent>
                                   </Select>
                              </div>
                              {/* Tracking Code */}
                              <div className="space-y-1.5">
                                   <Label htmlFor="tracking-code">Código de Rastreio</Label>
                                   <Input id="tracking-code" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} placeholder="Opcional" />
                              </div>
                              {/* Sender */}
                               <div className="space-y-1.5">
                                   <Label htmlFor="sender">Remetente</Label>
                                   <Input id="sender" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Ex: Amazon, Correios" />
                               </div>
                               {/* Notes */}
                               <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                                   <Label htmlFor="notes">Observações</Label>
                                   <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: Caixa grande, frágil, envelope" rows={2} />
                               </div>
                                {/* Photo Upload */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="delivery-photo">Foto (Opcional)</Label>
                                    <Input id="delivery-photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                                </div>
                                 {/* Photo Preview */}
                                {photoPreview && (
                                    <div className="relative group">
                                        <Image src={photoPreview} alt="Preview Entrega" width={100} height={100} className="rounded-md border object-cover" />
                                         <Button variant="ghost" size="icon" className="absolute top-0 right-0 bg-black/50 text-white opacity-0 group-hover:opacity-100" onClick={() => { setDeliveryPhoto(null); setPhotoPreview(null); }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                         </div>
                     </CardContent>
                     <CardFooter>
                         <Button onClick={handleRegisterDelivery} disabled={isSubmitting || !selectedResidentId}>
                             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Registrar e Notificar
                         </Button>
                     </CardFooter>
                 </Card>
             )}

             {/* Filter and Search Section */}
             <Card>
                <CardContent className="p-4 flex flex-wrap items-end gap-4">
                     {/* Condo Filter (if multiple) */}
                     {managedCondos.length > 1 && (
                         <div className="flex-1 min-w-[180px] space-y-1.5">
                           <Label htmlFor="filter-condo">Condomínio</Label>
                             <Select value={filterCondo} onValueChange={setFilterCondo}>
                                 <SelectTrigger id="filter-condo" className="w-full">
                                     <SelectValue placeholder="Todos" />
                                 </SelectTrigger>
                                 <SelectContent>
                                     <SelectItem value="all">Todos</SelectItem>
                                     {managedCondos.map(condo => <SelectItem key={condo.id} value={condo.id.toString()}>{condo.name}</SelectItem>)}
                                 </SelectContent>
                             </Select>
                         </div>
                      )}
                      {/* Status Filter */}
                     <div className="flex-1 min-w-[150px] space-y-1.5">
                        <Label htmlFor="filter-status">Status</Label>
                         <Select value={filterStatus} onValueChange={setFilterStatus}>
                             <SelectTrigger id="filter-status" className="w-full">
                                 <SelectValue placeholder="Todos" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 <SelectItem value="pending">Pendente</SelectItem>
                                 <SelectItem value="delivered">Retirado</SelectItem>
                                  <SelectItem value="archived">Arquivado</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                      {/* Search Input */}
                    <div className="flex-1 min-w-[200px] space-y-1.5">
                         <Label htmlFor="search-term">Buscar</Label>
                         <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                 id="search-term"
                                 placeholder="Nome, Apto, Rastreio..."
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                                 className="pl-8"
                               />
                         </div>
                    </div>
                </CardContent>
             </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Entregas Registradas</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                         <Table>
                             <TableHeader>
                                 <TableRow>
                                     <TableHead>Recebido</TableHead>
                                     <TableHead>Condomínio</TableHead>
                                     <TableHead>Destinatário</TableHead>
                                     <TableHead>Unidade</TableHead>
                                     <TableHead>Remetente/Rastreio</TableHead>
                                     <TableHead>Status</TableHead>
                                     <TableHead className="text-right">Ações</TableHead>
                                 </TableRow>
                             </TableHeader>
                             <TableBody>
                                 {isLoading ? (
                                     <>
                                         {renderSkeleton()}
                                         {renderSkeleton()}
                                         {renderSkeleton()}
                                     </>
                                 ) : deliveries.length > 0 ? (
                                     deliveries.map((delivery) => (
                                         <TableRow key={delivery.id} className={delivery.status !== 'pending' ? 'opacity-70' : ''}>
                                             <TableCell>{format(delivery.receivedAt, 'dd/MM HH:mm', { locale: ptBR })}</TableCell>
                                              <TableCell>{delivery.condominiumName}</TableCell>
                                             <TableCell className="font-medium">{delivery.recipientName}</TableCell>
                                             <TableCell>{delivery.unit}</TableCell>
                                             <TableCell>
                                                  {delivery.sender}{delivery.sender && delivery.trackingCode && ' / '}{delivery.trackingCode}
                                                  {delivery.notes && <p className="text-xs text-muted-foreground truncate" title={delivery.notes}>{delivery.notes}</p>}
                                             </TableCell>
                                             <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                                             <TableCell className="text-right space-x-1">
                                                 {/* Mark Delivered Action */}
                                                 {delivery.status === 'pending' && (
                                                     <AlertDialog>
                                                         <AlertDialogTrigger asChild>
                                                             <Button variant="outline" size="icon" title="Marcar como Retirado" onClick={() => setDeliveryToMark(delivery)}>
                                                                 <Check className="h-4 w-4" />
                                                             </Button>
                                                         </AlertDialogTrigger>
                                                         <AlertDialogContent>
                                                             <AlertDialogHeader>
                                                               <AlertDialogTitle>Confirmar Retirada</AlertDialogTitle>
                                                               <AlertDialogDescription>
                                                                 Confirma que a entrega para {deliveryToMark?.recipientName} ({deliveryToMark?.unit}) foi retirada?
                                                               </AlertDialogDescription>
                                                             </AlertDialogHeader>
                                                             <AlertDialogFooter>
                                                               <AlertDialogCancel onClick={() => setDeliveryToMark(null)}>Cancelar</AlertDialogCancel>
                                                               <AlertDialogAction onClick={handleMarkDelivered}>Confirmar Retirada</AlertDialogAction>
                                                             </AlertDialogFooter>
                                                         </AlertDialogContent>
                                                     </AlertDialog>
                                                 )}
                                                  {/* Archive Action */}
                                                  {delivery.status === 'delivered' && (
                                                       <Button variant="ghost" size="icon" title="Arquivar" onClick={() => handleArchiveDelivery(delivery.id)}>
                                                            <Archive className="h-4 w-4" />
                                                        </Button>
                                                   )}
                                                   {/* Remove Action */}
                                                    <AlertDialog>
                                                         <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" title="Remover Registro" onClick={() => setDeliveryToRemove(delivery)}>
                                                              <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                              <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                              <AlertDialogDescription>
                                                                Tem certeza que deseja remover o registro desta entrega permanentemente? Esta ação não pode ser desfeita.
                                                              </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                              <AlertDialogCancel onClick={() => setDeliveryToRemove(null)}>Cancelar</AlertDialogCancel>
                                                              <AlertDialogAction onClick={handleRemoveDelivery} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                             </TableCell>
                                         </TableRow>
                                     ))
                                 ) : (
                                     <TableRow>
                                         <TableCell colSpan={7} className="text-center text-muted-foreground py-4">Nenhuma entrega encontrada com os filtros aplicados.</TableCell>
                                     </TableRow>
                                 )}
                             </TableBody>
                         </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
