
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Bell, PlusCircle, Send } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { notifyNewAnnouncement } from '@/services/notifications'; // Placeholder import
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface Announcement {
    id: number;
    title: string;
    content: string;
    type: 'Aviso' | 'Manutenção' | 'Reunião' | 'Evento';
    condoId: number;
    publishDate: Date;
}

// TODO: Fetch announcements for the specific condominium from backend
const fetchAnnouncements = async (condoId: number): Promise<Announcement[]> => {
    console.log(`Fetching announcements for condo ID: ${condoId}`);
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate API delay
    // Replace with actual API call filtered by condoId
    if (condoId === 1) { // Example for Plaza IV
        return [
            { id: 1, title: "Manutenção da Piscina", content: "A piscina estará fechada para manutenção na próxima segunda-feira, dia 29/07.", type: "Manutenção", condoId: 1, publishDate: new Date(2024, 6, 25) },
            { id: 2, title: "Reunião Geral (Plaza IV)", content: "Convocamos todos os moradores para a reunião geral de condomínio no dia 10/08 às 19h no salão de festas.", type: "Reunião", condoId: 1, publishDate: new Date(2024, 6, 20) },
        ];
    } else if (condoId === 2) { // Example for Plaza III
        return [
             { id: 3, title: "Limpeza Caixa D'água", content: "A limpeza da caixa d'água será realizada no dia 01/08. Poderá haver interrupção no fornecimento.", type: "Manutenção", condoId: 2, publishDate: new Date(2024, 6, 26) },
        ];
    }
    return [];
};

// TODO: Implement backend logic for creating/updating/deleting announcements
const saveAnnouncementToBackend = async (announcement: Omit<Announcement, 'id' | 'publishDate'>, condoId: number, editingId?: number): Promise<Announcement> => {
     console.log(`${editingId ? 'Updating' : 'Adding'} announcement for condo ${condoId}:`, announcement);
     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API save
     // --- BACKEND NOTE ---
     // Validate data, use prepared statements, check permissions.
     // If editingId, update existing record. Otherwise, create new one.
     // Return the saved/updated announcement with its ID and publishDate.
     const newId = editingId ?? Math.floor(Math.random() * 1000) + 10;
     return { ...announcement, id: newId, publishDate: new Date(), condoId: condoId };
};

const deleteAnnouncementFromBackend = async (id: number, condoId: number): Promise<boolean> => {
     console.log(`Deleting announcement ${id} from condo ${condoId}`);
     await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delete
     // --- BACKEND NOTE ---
     // Verify permissions, use prepared statements.
     return true; // Simulate success
};


export default function SindicoAnnouncementsPage() {
    const searchParams = useSearchParams();
    const condoIdParam = searchParams.get('condoId');
    const actionParam = searchParams.get('action'); // Check if 'create' action is requested

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(actionParam === 'create');
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');
    const [announcementType, setAnnouncementType] = useState<Announcement['type'] | undefined>(undefined);
    const [sendNotificationChecked, setSendNotificationChecked] = useState(true);
    const [announcementToRemove, setAnnouncementToRemove] = useState<Announcement | null>(null);

    const { toast } = useToast();

     useEffect(() => {
        if (!condoIdParam) {
            toast({ title: "Erro", description: "Condomínio não especificado.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        const condoId = Number(condoIdParam);
        const loadAnnouncements = async () => {
            setIsLoading(true);
            try {
                const data = await fetchAnnouncements(condoId);
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to load announcements:", error);
                toast({ title: "Erro", description: "Não foi possível carregar os avisos.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        loadAnnouncements();
         // Reset form if condo changes
         resetForm();
         setShowAddForm(actionParam === 'create'); // Re-evaluate based on param
    }, [condoIdParam, actionParam, toast]);

    const resetForm = () => {
        setEditingAnnouncement(null);
        setAnnouncementTitle('');
        setAnnouncementContent('');
        setAnnouncementType(undefined);
        setSendNotificationChecked(true);
        setShowAddForm(false);
    };


    const handleSaveAnnouncement = async () => {
         if (!condoIdParam || !announcementTitle.trim() || !announcementContent.trim() || !announcementType) {
            toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
            return;
        }
        const condoId = Number(condoIdParam);

        const announcementData: Omit<Announcement, 'id' | 'publishDate'> = {
             title: announcementTitle.trim(),
             content: announcementContent.trim(),
             type: announcementType,
             condoId: condoId,
         };

        let successMessage = '';
        let savedAnnouncement: Announcement | null = null;

        try {
             savedAnnouncement = await saveAnnouncementToBackend(announcementData, condoId, editingAnnouncement?.id);
            if (editingAnnouncement) {
                 setAnnouncements(announcements.map(a => a.id === savedAnnouncement!.id ? savedAnnouncement! : a));
                 successMessage = "Aviso atualizado com sucesso.";
            } else {
                 setAnnouncements([savedAnnouncement!, ...announcements]); // Add to top
                 successMessage = "Aviso publicado com sucesso.";
            }
             // --- NOTIFICATION ---
             if (sendNotificationChecked && savedAnnouncement) {
                 console.log(`Sending notifications for ${editingAnnouncement ? 'updated' : 'new'} announcement...`);
                  try {
                      // --- BACKEND NOTE ---: Fetch target residents for the specific condoId.
                      const targetResidents = [ // Simulation
                          { email: `residente1_condo${condoId}@email.com`, pushToken: `token123_${condoId}` },
                          { email: `residente2_condo${condoId}@email.com`, pushToken: `token456_${condoId}` },
                      ];

                      for (const resident of targetResidents) {
                          await notifyNewAnnouncement(resident, savedAnnouncement.title);
                      }
                      toast({ title: "Sucesso", description: `${successMessage} Notificações enviadas.` });

                  } catch (error) {
                     console.error("Failed to send notifications:", error);
                     toast({ title: "Sucesso Parcial", description: `${successMessage} Falha ao enviar notificações.`, variant: "destructive" });
                  }
             } else {
                 toast({ title: "Sucesso", description: successMessage });
             }

             resetForm();

        } catch (error) {
            console.error("Failed to save announcement:", error);
            toast({ title: "Erro", description: `Falha ao ${editingAnnouncement ? 'atualizar' : 'publicar'} o aviso.`, variant: "destructive" });
        }
    };

      const handleEditClick = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setAnnouncementTitle(announcement.title);
        setAnnouncementContent(announcement.content);
        setAnnouncementType(announcement.type);
        setSendNotificationChecked(true); // Default to true when editing
        setShowAddForm(true);
    };


     const handleRemoveAnnouncement = async () => {
        if (!announcementToRemove || !condoIdParam) return;
        const condoId = Number(condoIdParam);

        try {
            const success = await deleteAnnouncementFromBackend(announcementToRemove.id, condoId);
            if (success) {
                setAnnouncements(announcements.filter(a => a.id !== announcementToRemove.id));
                toast({ title: "Sucesso", description: `Aviso "${announcementToRemove.title}" removido.` });
            } else {
                 throw new Error("Backend deletion failed");
            }
        } catch(error) {
             console.error("Failed to delete announcement:", error);
             toast({ title: "Erro", description: "Falha ao remover o aviso.", variant: "destructive" });
        } finally {
            setAnnouncementToRemove(null); // Close the dialog
        }
    };


     if (!condoIdParam) {
        return <p className="text-destructive">ID do Condomínio não encontrado na URL.</p>;
     }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Avisos</h1>
                    {/* TODO: Display Condo Name */}
                    <p className="text-muted-foreground">Crie, edite ou remova avisos e comunicados para este condomínio.</p>
                </div>
                 <Button onClick={() => { setShowAddForm(!showAddForm); if(editingAnnouncement) resetForm(); }}>
                      {showAddForm ? 'Cancelar' : <><PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Aviso</>}
                 </Button>
            </div>

             {showAddForm && (
                 <Card>
                     <CardHeader>
                         <CardTitle>{editingAnnouncement ? 'Editar Aviso' : 'Criar Novo Aviso'}</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                             <div className="space-y-1.5 lg:col-span-2">
                                 <Label htmlFor="ann-title">Título*</Label>
                                 <Input id="ann-title" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                  <Label htmlFor="ann-type">Tipo*</Label>
                                  <Select value={announcementType} onValueChange={(value) => setAnnouncementType(value as any)}>
                                       <SelectTrigger id="ann-type"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="Aviso">Aviso</SelectItem>
                                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                                          <SelectItem value="Reunião">Reunião</SelectItem>
                                          <SelectItem value="Evento">Evento</SelectItem>
                                       </SelectContent>
                                  </Select>
                             </div>
                              <div className="space-y-1.5 lg:col-span-3">
                                  <Label htmlFor="ann-content">Conteúdo*</Label>
                                  <Textarea id="ann-content" rows={5} value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} />
                              </div>
                              <div className="flex items-center space-x-2 lg:col-span-3">
                                 <Checkbox
                                    id="send-notification"
                                    checked={sendNotificationChecked}
                                    onCheckedChange={(checked) => setSendNotificationChecked(Boolean(checked))}
                                 />
                                <label
                                    htmlFor="send-notification"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Notificar moradores (Email/Push) ao publicar/salvar
                                </label>
                            </div>
                         </div>
                     </CardContent>
                     <CardFooter className="gap-2">
                         <Button onClick={handleSaveAnnouncement}>
                           <Send className="mr-2 h-4 w-4" /> {editingAnnouncement ? 'Salvar Alterações' : 'Publicar Aviso'}
                         </Button>
                         <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                     </CardFooter>
                 </Card>
             )}

            <Card>
                <CardHeader>
                    <CardTitle>Avisos Publicados</CardTitle>
                    {/* TODO: Add filtering/sorting options here */}
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        {isLoading ? (
                             <div className="space-y-2">
                                 <Skeleton className="h-10 w-full" />
                                 <Skeleton className="h-10 w-full" />
                                 <Skeleton className="h-10 w-full" />
                             </div>
                        ) : announcements.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Data Publicação</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {announcements.map((ann) => (
                                        <TableRow key={ann.id}>
                                            <TableCell className="font-medium">{ann.title}</TableCell>
                                            <TableCell>{ann.type}</TableCell>
                                            <TableCell>{ann.publishDate.toLocaleDateString('pt-BR')}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditClick(ann)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                 <AlertDialog>
                                                     <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setAnnouncementToRemove(ann)} title="Remover">
                                                          <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            Tem certeza que deseja remover o aviso "{announcementToRemove?.title}"?
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel onClick={() => setAnnouncementToRemove(null)}>Cancelar</AlertDialogCancel>
                                                          <AlertDialogAction onClick={handleRemoveAnnouncement} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">Nenhum aviso publicado para este condomínio.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
