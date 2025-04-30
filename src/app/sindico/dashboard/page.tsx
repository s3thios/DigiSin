
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Bell, MessageSquareQuote, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For Condo Switcher
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation'; // To manage query params

// TODO: Fetch the list of condos managed by this specific Sindico from the backend
const fetchManagedCondos = async (): Promise<{ id: number; name: string }[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    // Replace with actual API call based on logged-in Sindico's credentials
    return [
        { id: 1, name: "Plaza das Flores IV" },
        { id: 2, name: "Plaza das Flores III" }, // Example if manages multiple
    ];
};

// TODO: Fetch dashboard data based on selectedCondoId from the backend
const fetchCondoSummary = async (condoId: number) => {
    // Simulate API call for the selected condo
    console.log("Fetching summary for condo ID:", condoId);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Replace with actual API call
    if (condoId === 1) { // PF IV
        return {
            totalResidents: 250,
            pendingOccurrences: 2,
            pendingReservations: 1,
            unreadAnnouncements: 1,
        };
    } else if (condoId === 2) { // PF III
         return {
            totalResidents: 180,
            pendingOccurrences: 1,
            pendingReservations: 0,
            unreadAnnouncements: 3,
        };
    }
    // Default empty summary
    return {
        totalResidents: 0,
        pendingOccurrences: 0,
        pendingReservations: 0,
        unreadAnnouncements: 0,
    };
};

interface CondoSummary {
    totalResidents: number;
    pendingOccurrences: number;
    pendingReservations: number;
    unreadAnnouncements: number;
}

export default function SindicoDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [managedCondos, setManagedCondos] = useState<{ id: number; name: string }[]>([]);
  const [selectedCondoId, setSelectedCondoId] = useState<number | undefined>(undefined);
  const [summary, setSummary] = useState<CondoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      const condos = await fetchManagedCondos();
      setManagedCondos(condos);

      const queryCondoId = searchParams.get('condoId');
      let currentCondoId = queryCondoId ? parseInt(queryCondoId, 10) : condos[0]?.id;

      if (currentCondoId && condos.some(c => c.id === currentCondoId)) {
        setSelectedCondoId(currentCondoId);
        const fetchedSummary = await fetchCondoSummary(currentCondoId);
        setSummary(fetchedSummary);
      } else if (condos.length > 0) {
          // If query param is invalid or missing, default to the first condo
          currentCondoId = condos[0].id;
          setSelectedCondoId(currentCondoId);
          router.replace(`/sindico/dashboard?condoId=${currentCondoId}`); // Update URL
          const fetchedSummary = await fetchCondoSummary(currentCondoId);
          setSummary(fetchedSummary);
      }
      setIsLoading(false);
    };
    initializeDashboard();
  }, [searchParams, router]); // Re-run if condoId in URL changes


  const handleCondoChange = async (value: string) => {
      const condoId = parseInt(value, 10);
      if (condoId !== selectedCondoId) {
          setIsLoading(true);
          setSelectedCondoId(condoId);
          router.push(`/sindico/dashboard?condoId=${condoId}`); // Update URL to persist selection
          const fetchedSummary = await fetchCondoSummary(condoId);
          setSummary(fetchedSummary);
          setIsLoading(false);
      }
  };

  const selectedCondoName = managedCondos.find(c => c.id === selectedCondoId)?.name || "Nenhum";

  if (isLoading && !summary) {
      return (
          <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Painel do Síndico</h1>
              <p className="text-muted-foreground">Carregando dados...</p>
              {/* Add skeleton loaders here */}
          </div>
      );
  }

  if (!selectedCondoId || !summary) {
      return (
          <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Painel do Síndico</h1>
              <p className="text-destructive">Você não gerencia nenhum condomínio ou ocorreu um erro.</p>
              {/* Optionally add a link to contact support or admin */}
          </div>
      );
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
              <h1 className="text-3xl font-bold text-foreground">Painel do Síndico</h1>
              <p className="text-muted-foreground">Visão geral do condomínio: {selectedCondoName}</p>
          </div>
           {/* Condo Switcher */}
          {managedCondos.length > 1 && (
             <div className="min-w-[200px] space-y-1.5">
                <Label htmlFor="condo-switcher">Selecionar Condomínio</Label>
                <Select value={selectedCondoId?.toString()} onValueChange={handleCondoChange} disabled={isLoading}>
                   <SelectTrigger id="condo-switcher" className="w-full">
                     <SelectValue placeholder="Selecionar Condomínio" />
                   </SelectTrigger>
                   <SelectContent>
                     {managedCondos.map(condo => <SelectItem key={condo.id} value={condo.id.toString()}>{condo.name}</SelectItem>)}
                   </SelectContent>
                </Select>
             </div>
           )}
      </div>


       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalResidents}</div>
            <p className="text-xs text-muted-foreground">
              Moradores neste condomínio
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                {/* Pass condo ID to linked page */}
                <Link href={`/sindico/residents?condoId=${selectedCondoId}`}>Ver Moradores</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências Pendentes</CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingOccurrences}</div>
            <p className="text-xs text-muted-foreground">
             Aguardando resposta/ação
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                 {/* Pass condo ID to linked page */}
                <Link href={`/sindico/complaints?condoId=${selectedCondoId}`}>Ver Ocorrências</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendentes</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingReservations}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação de pagamento
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                 {/* Pass condo ID to linked page */}
                <Link href={`/sindico/reservations?condoId=${selectedCondoId}`}>Gerenciar Reservas</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avisos Recentes</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.unreadAnnouncements}</div>
             <p className="text-xs text-muted-foreground">
              Avisos não lidos/recentes
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                 {/* Pass condo ID to linked page */}
                <Link href={`/sindico/announcements?condoId=${selectedCondoId}`}>Ver Avisos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas ({selectedCondoName})</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
             {/* Pass condo ID to linked pages */}
            <Button variant="outline" asChild>
                <Link href={`/sindico/announcements?condoId=${selectedCondoId}&action=create`}>Criar Aviso</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/sindico/complaints?condoId=${selectedCondoId}`}>Ver Ocorrências</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/sindico/tickets?condoId=${selectedCondoId}`}>Ver Tickets</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/sindico/reservations?condoId=${selectedCondoId}`}>Gerenciar Reservas</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/sindico/residents?condoId=${selectedCondoId}&action=add`}>Adicionar Morador</Link>
            </Button>
             <Button variant="outline" asChild>
                 <Link href={`/sindico/regulations?condoId=${selectedCondoId}`}>Gerenciar Regulamento</Link>
            </Button>
        </CardContent>
      </Card>

      {/* Add more sections relevant to the specific condo */}

    </div>
  );
}
