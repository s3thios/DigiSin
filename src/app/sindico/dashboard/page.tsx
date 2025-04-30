'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Bell, MessageSquareQuote, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For Condo Switcher
import { Label } from '@/components/ui/label';

// TODO: Fetch the list of condos managed by this Sindico
const managedCondos = [
    { id: 1, name: "Plaza das Flores IV" },
    // { id: 2, name: "Plaza das Flores III" }, // Example if manages multiple
];

// TODO: Fetch dashboard data based on selectedCondoId
const getCondoSummary = (condoId: number) => {
    // Simulate fetching data for the selected condo
    console.log("Fetching summary for condo ID:", condoId);
    if (condoId === 1) {
        return {
            totalResidents: 250, // Example for PF IV
            pendingOccurrences: 2, // Example for PF IV
            pendingReservations: 1, // Example for PF IV
            unreadAnnouncements: 1, // Example for PF IV
        };
    }
    // Add data for other condos if needed
    return {
        totalResidents: 0,
        pendingOccurrences: 0,
        pendingReservations: 0,
        unreadAnnouncements: 0,
    };
};

export default function SindicoDashboardPage() {
  const [selectedCondoId, setSelectedCondoId] = useState<number | undefined>(managedCondos[0]?.id); // Default to first managed condo
  const [summary, setSummary] = useState(() => selectedCondoId ? getCondoSummary(selectedCondoId) : getCondoSummary(0));

  const handleCondoChange = (value: string) => {
      const condoId = parseInt(value, 10);
      setSelectedCondoId(condoId);
      setSummary(getCondoSummary(condoId));
  };

  const selectedCondoName = managedCondos.find(c => c.id === selectedCondoId)?.name || "N/A";

  if (!selectedCondoId) {
      // Handle case where Sindico might not manage any condos (shouldn't happen ideally)
      return (
          <div className="space-y-6">
              <h1 className="text-3xl font-bold text-foreground">Painel do Síndico</h1>
              <p className="text-muted-foreground">Nenhum condomínio associado.</p>
              {/* Or redirect, or show an error */}
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
                <Select value={selectedCondoId?.toString()} onValueChange={handleCondoChange}>
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
                {/* TODO: Link should probably include condo ID or context */}
                <Link href={`/sindico/residents?condo=${selectedCondoId}`}>Ver Moradores</Link>
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
                 {/* TODO: Link should probably include condo ID or context */}
                <Link href={`/sindico/complaints?condo=${selectedCondoId}`}>Ver Ocorrências</Link>
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
                 {/* TODO: Link should probably include condo ID or context */}
                <Link href={`/sindico/reservations?condo=${selectedCondoId}`}>Gerenciar Reservas</Link>
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
                 {/* TODO: Link should probably include condo ID or context */}
                <Link href={`/sindico/announcements?condo=${selectedCondoId}`}>Ver Avisos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas ({selectedCondoName})</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
             {/* TODO: Links should probably include condo ID or context */}
            <Button variant="outline" asChild>
                <Link href={`/sindico/announcements?condo=${selectedCondoId}&action=create`}>Criar Aviso</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/sindico/complaints?condo=${selectedCondoId}`}>Ver Ocorrências</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/sindico/tickets?condo=${selectedCondoId}`}>Ver Tickets</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/sindico/reservations?condo=${selectedCondoId}`}>Gerenciar Reservas</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href={`/sindico/residents?condo=${selectedCondoId}&action=add`}>Adicionar Morador</Link>
            </Button>
        </CardContent>
      </Card>

      {/* Add more sections relevant to the specific condo */}

    </div>
  );
}
