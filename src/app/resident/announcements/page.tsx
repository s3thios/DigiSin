'use client'; // Required for state and potential interactions

import React, { useState } from 'react'; // Import useState
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Import Button
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Sample data - replace with actual data fetching
const initialAnnouncements = [
  { id: 1, title: "Manutenção da Piscina", date: "2024-07-25", content: "A piscina estará fechada para manutenção na próxima segunda-feira, dia 29/07.", type: "Manutenção", read: false },
  { id: 2, title: "Reunião de Condomínio", date: "2024-07-20", content: "Convocamos todos os moradores para a reunião de condomínio no dia 05/08 às 19h no salão de festas.", type: "Reunião", read: false },
  { id: 3, title: "Campanha de Coleta Seletiva", date: "2024-07-15", content: "Lembramos a todos sobre a importância da separação correta do lixo reciclável.", type: "Aviso", read: true },
  { id: 4, title: "Festa Junina Cancelada", date: "2024-06-10", content: "Devido ao mau tempo, a festa junina foi cancelada. Uma nova data será informada.", type: "Evento", read: true },
];

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);

    // TODO: Implement marking as read (update backend and local state)
    const handleMarkAsRead = (id: number) => {
        console.log("Marking announcement as read:", id);
        setAnnouncements(prev => prev.map(ann =>
            ann.id === id ? { ...ann, read: true } : ann
        ));
        // TODO: Call backend API to update read status for the user
    };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Avisos e Comunicados</h1>
      <p className="text-muted-foreground">Mantenha-se informado sobre os últimos acontecimentos no condomínio.</p>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement.id} className={!announcement.read ? 'border-primary bg-primary/5' : ''}> {/* Highlight unread */}
              <CardHeader>
                <div className="flex justify-between items-start">
                   <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className={`h-5 w-5 ${!announcement.read ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} /> {/* Pulse unread */}
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
                   <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(announcement.id)}>Marcar como lido</Button>
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
