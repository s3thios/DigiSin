
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, Check, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

type DeliveryStatus = 'pending' | 'delivered' | 'archived'; // 'delivered' means picked up by resident

interface Delivery {
    id: number;
    trackingCode?: string;
    sender?: string; // e.g., Amazon, Correios
    notes?: string; // e.g., "Caixa grande", "Envelope"
    receivedAt: Date;
    deliveredAt?: Date; // When resident picked it up
    status: DeliveryStatus;
    photoUrl?: string; // Optional photo taken at reception
    recipientName: string; // Resident's name (fetched based on unit)
    unit: string; // Block/Apartment
}

// TODO: Fetch deliveries for the logged-in resident from the backend
const fetchResidentDeliveries = async (): Promise<Delivery[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Replace with actual API call filtered by resident ID/unit
    return [
        { id: 101, trackingCode: "AMZ123456BR", sender: "Amazon", notes: "Caixa média", receivedAt: new Date(2024, 6, 28, 10, 30), status: "pending", recipientName: "Maria Residente", unit: "B/101" },
        { id: 102, sender: "Correios", notes: "Envelope A4", receivedAt: new Date(2024, 6, 27, 15, 0), status: "pending", recipientName: "Maria Residente", unit: "B/101" },
        { id: 100, trackingCode: "ML987654BR", sender: "Mercado Livre", receivedAt: new Date(2024, 6, 25, 11, 0), deliveredAt: new Date(2024, 6, 25, 18, 0), status: "delivered", recipientName: "Maria Residente", unit: "B/101" },
    ].sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime()); // Sort by most recent received
};

export default function ResidentDeliveriesPage() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDeliveries = async () => {
            setIsLoading(true);
            try {
                const data = await fetchResidentDeliveries();
                setDeliveries(data);
            } catch (error) {
                console.error("Failed to load deliveries:", error);
                // Handle error display if needed
            } finally {
                setIsLoading(false);
            }
        };
        loadDeliveries();
    }, []);

    const getStatusBadge = (status: DeliveryStatus) => {
        switch (status) {
            case 'pending':
                return <Badge variant="destructive"><Clock className="mr-1 h-3 w-3" /> Aguardando Retirada</Badge>;
            case 'delivered':
                return <Badge variant="default"><Check className="mr-1 h-3 w-3" /> Retirado</Badge>;
            case 'archived':
                return <Badge variant="secondary"><Archive className="mr-1 h-3 w-3" /> Arquivado</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const renderSkeleton = () => (
        <Card className="opacity-50">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-28 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <Skeleton className="h-4 w-full" />
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Minhas Entregas</h1>
            <p className="text-muted-foreground">Acompanhe as correspondências e pacotes recebidos na portaria.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Entregas Recebidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <>
                            {renderSkeleton()}
                            {renderSkeleton()}
                        </>
                    ) : deliveries.length > 0 ? (
                        deliveries.map((delivery) => (
                            <Card key={delivery.id} className={`bg-muted/30 ${delivery.status === 'pending' ? 'border-primary' : ''} hover:shadow-md transition-shadow duration-200`}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Package className="h-5 w-5 text-primary" />
                                                {delivery.sender || "Entrega"} {delivery.trackingCode ? `(${delivery.trackingCode})` : ''}
                                            </CardTitle>
                                            <CardDescription>
                                                Recebido em: {format(delivery.receivedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                                {delivery.deliveredAt && ` | Retirado em: ${format(delivery.deliveredAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}`}
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(delivery.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    {delivery.notes && <p className="text-sm text-muted-foreground">Observações: {delivery.notes}</p>}
                                    {delivery.photoUrl && (
                                        <a href={delivery.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">Ver Foto (se disponível)</a>
                                    )}
                                     {delivery.status === 'pending' && (
                                         <p className="text-sm font-semibold text-destructive mt-2">Por favor, retire sua entrega na portaria.</p>
                                     )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">Nenhuma entrega registrada para sua unidade no momento.</p>
                    )}
                </CardContent>
                 <CardFooter>
                      <p className="text-xs text-muted-foreground">Você será notificado sobre novas entregas.</p>
                  </CardFooter>
            </Card>
        </div>
    );
}
