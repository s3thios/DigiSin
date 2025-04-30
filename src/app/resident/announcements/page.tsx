import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Sample data - replace with actual data fetching
const announcements = [
  { id: 1, title: "Manutenção da Piscina", date: "2024-07-25", content: "A piscina estará fechada para manutenção na próxima segunda-feira, dia 29/07.", type: "Manutenção", read: false },
  { id: 2, title: "Reunião de Condomínio", date: "2024-07-20", content: "Convocamos todos os moradores para a reunião de condomínio no dia 05/08 às 19h no salão de festas.", type: "Reunião", read: false },
  { id: 3, title: "Campanha de Coleta Seletiva", date: "2024-07-15", content: "Lembramos a todos sobre a importância da separação correta do lixo reciclável.", type: "Aviso", read: true },
  { id: 4, title: "Festa Junina Cancelada", date: "2024-06-10", content: "Devido ao mau tempo, a festa junina foi cancelada. Uma nova data será informada.", type: "Evento", read: true },
];

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Avisos e Comunicados</h1>
      <p className="text-muted-foreground">Mantenha-se informado sobre os últimos acontecimentos no condomínio.</p>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement.id} className={!announcement.read ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                   <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className={`h-5 w-5 ${!announcement.read ? 'text-primary' : 'text-muted-foreground'}`} />
                        {announcement.title}
                      </CardTitle>
                      <CardDescription>
                        Publicado em: {new Date(announcement.date).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </div>
                     <Badge variant={announcement.read ? "secondary" : "default"} className="ml-auto shrink-0">
                       {announcement.type}
                     </Badge>
                 </div>
              </CardHeader>
              <CardContent>
                <p>{announcement.content}</p>
              </CardContent>
              {!announcement.read && (
                <CardFooter>
                   {/* Add a button or mechanism to mark as read */}
                   {/* <Button size="sm" variant="outline">Marcar como lido</Button> */}
                </CardFooter>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Nenhum aviso no momento.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
