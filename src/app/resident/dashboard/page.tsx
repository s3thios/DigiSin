import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bell, Calendar, MessageSquareQuote, FileText } from 'lucide-react';

// TODO: Fetch resident-specific dashboard data dynamically
const residentSummary = {
    unreadAnnouncements: 3, // Example
    activeReservations: 1, // Example
    pendingOccurrences: 0, // Example
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* TODO: Fetch resident's name */}
      <h1 className="text-3xl font-bold text-foreground">Bem-vindo(a), Maria!</h1>
      <p className="text-muted-foreground">Seu painel de controle do condomínio.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos Avisos</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residentSummary.unreadAnnouncements}</div>
            <p className="text-xs text-muted-foreground">
              Avisos não lidos
            </p>
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/resident/announcements">Ver avisos</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suas Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residentSummary.activeReservations}</div>
            <p className="text-xs text-muted-foreground">
              Reserva ativa
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/resident/reservations">Ver reservas</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocorrências Abertas</CardTitle>
            <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{residentSummary.pendingOccurrences}</div>
            <p className="text-xs text-muted-foreground">
              Ocorrências pendentes
            </p>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/resident/complaints">Registrar Ocorrência</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regulamento</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs text-muted-foreground">
                Acesse as regras e diretrizes do condomínio.
            </CardDescription>
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/resident/regulations">Ver regulamento</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Future sections can be added here, e.g., quick links, recent activity */}
       <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Button variant="outline" asChild>
                <Link href="/resident/reservations">Reservar Salão</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/resident/visitors">Cadastrar Visitante</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/resident/vehicles">Cadastrar Veículo</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/resident/complaints">Abrir Ocorrência</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/resident/marketplace">Ver Classificados</Link>
            </Button>
             <Button variant="outline" asChild>
                <Link href="/resident/profile">Meu Perfil</Link>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
