
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Building, Bell, MessageSquareQuote, CalendarCheck, Package, DollarSign } from 'lucide-react'; // Added Package icon, DollarSign
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// TODO: Fetch summary data dynamically, considering all condos for the admin role
const globalSummary = {
    totalCondos: 2,
    totalResidents: 500, // Example
    pendingOccurrences: 5, // Example (across all condos)
    pendingReservations: 3, // Example (awaiting payment confirmation)
    pendingDeliveries: 12, // Example: Deliveries awaiting pickup
};


export default function AdminDashboardPage() {

  // In a real app, this page would likely show aggregated data
  // or allow selection to view a specific condo's details if needed
  // For now, showing global data.

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Visão Geral - Admin</h1>
      <p className="text-muted-foreground">Visão geral da gestão de todos os condomínios.</p>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Condomínios</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalSummary.totalCondos}</div>
            <p className="text-xs text-muted-foreground">
              Condomínios gerenciados
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/admin/condominiums">Gerenciar</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalSummary.totalResidents}</div>
            <p className="text-xs text-muted-foreground">
              Total de moradores cadastrados
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/admin/residents">Ver Moradores</Link>
            </Button>
          </CardContent>
        </Card>
         <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências Pendentes</CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalSummary.pendingOccurrences}</div>
            <p className="text-xs text-muted-foreground">
             Aguardando resposta/ação
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/admin/complaints">Ver Ocorrências</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendentes</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalSummary.pendingReservations}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação de pagamento
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/admin/reservations">Gerenciar Reservas</Link>
            </Button>
          </CardContent>
        </Card>
         <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas Pendentes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalSummary.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando retirada pelo morador
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/admin/deliveries">Gerenciar Entregas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas (Admin)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Button variant="outline" asChild>
                <Link href="/admin/announcements">Criar Aviso Global</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/admin/residents">Adicionar Morador</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/admin/condominiums">Adicionar Condomínio</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/admin/deliveries?action=register">Registrar Entrega</Link>
            </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/tickets">Ver Tickets</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/admin/settings/fees">Ajustar Taxas Globais</Link>
            </Button>
             {/* Removed Gerenciar Usuários Link */}
        </CardContent>
      </Card>

      {/* Add more sections as needed, e.g., recent activity feed, charts */}

    </div>
  );
}
