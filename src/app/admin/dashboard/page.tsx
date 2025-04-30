import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Building, Bell, MessageSquareQuote, CalendarCheck, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  // Fetch summary data here (total residents, condos, pending items etc.)
  const summary = {
      totalCondos: 2,
      totalResidents: 500, // Example
      pendingComplaints: 5, // Example
      pendingReservations: 3, // Example (awaiting payment confirmation)
      unreadAnnouncements: 0, // Example
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
      <p className="text-muted-foreground">Visão geral da gestão dos condomínios.</p>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Condomínios</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCondos}</div>
            <p className="text-xs text-muted-foreground">
              Condomínios gerenciados
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/admin/condominiums">Gerenciar</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalResidents}</div>
            <p className="text-xs text-muted-foreground">
              Total de moradores cadastrados
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/admin/residents">Ver Moradores</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reclamações Pendentes</CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pendingComplaints}</div>
            <p className="text-xs text-muted-foreground">
             Aguardando resposta
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/admin/complaints">Ver Reclamações</Link>
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
                <Link href="/admin/reservations">Gerenciar Reservas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Button variant="outline" asChild>
                <Link href="/admin/announcements">Criar Aviso</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/admin/residents">Adicionar Morador</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/admin/condominiums">Adicionar Condomínio</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/admin/settings/fees">Ajustar Taxas</Link>
            </Button>
        </CardContent>
      </Card>

      {/* Add more sections as needed, e.g., recent activity feed, charts */}

    </div>
  );
}
