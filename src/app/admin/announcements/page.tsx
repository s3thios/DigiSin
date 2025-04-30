'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Bell, PlusCircle, Send } from 'lucide-react'; // Send icon for publish
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added SelectGroup, SelectLabel
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox

interface Announcement {
    id: number;
    title: string;
    content: string;
    type: 'Aviso' | 'Manutenção' | 'Reunião' | 'Evento'; // Example types
    targetCondo: string; // 'all' or specific condo name
    publishDate: Date;
    // sentEmail: boolean; // Track if email was sent
}

// Sample data - replace with actual data fetching
const initialAnnouncements: Announcement[] = [
    { id: 1, title: "Manutenção da Piscina", content: "A piscina estará fechada para manutenção na próxima segunda-feira, dia 29/07.", type: "Manutenção", targetCondo: "Plaza das Flores IV", publishDate: new Date(2024, 6, 25) },
    { id: 2, title: "Reunião Geral", content: "Convocamos todos os moradores para a reunião geral de condomínio no dia 10/08 às 19h no salão de festas.", type: "Reunião", targetCondo: "all", publishDate: new Date(2024, 6, 20) },
];

// Sample condo names (fetch dynamically)
const condoNames = ["Plaza das Flores IV", "Plaza das Flores III"];


export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [showAddForm, setShowAddForm] = useState(false);
    // State for adding/editing announcement
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');
    const [announcementType, setAnnouncementType] = useState<'Aviso' | 'Manutenção' | 'Reunião' | 'Evento' | undefined>(undefined);
    const [announcementTarget, setAnnouncementTarget] = useState<string | undefined>(undefined);
    const [sendEmailNotification, setSendEmailNotification] = useState(true); // Default to send email

    const [announcementToRemove, setAnnouncementToRemove] = useState<Announcement | null>(null);

    const { toast } = useToast();

    const resetForm = () => {
        setEditingAnnouncement(null);
        setAnnouncementTitle('');
        setAnnouncementContent('');
        setAnnouncementType(undefined);
        setAnnouncementTarget(undefined);
        setSendEmailNotification(true);
        setShowAddForm(false);
    };


    const handleSaveAnnouncement = async () => {
         if (!announcementTitle.trim() || !announcementContent.trim() || !announcementType || !announcementTarget) {
            toast({ title: "Erro", description: "Preencha todos os campos do aviso.", variant: "destructive" });
            return;
        }

         const announcementData: Omit<Announcement, 'id' | 'publishDate'> = {
             title: announcementTitle.trim(),
             content: announcementContent.trim(),
             type: announcementType,
             targetCondo: announcementTarget,
         };

        if (editingAnnouncement) {
            // TODO: Implement actual update logic (send to backend)
             // Note: Re-sending email might need careful consideration on update
            console.log("Updating announcement:", editingAnnouncement.id, announcementData);
            setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...a, ...announcementData } : a)); // Keep original publishDate
            toast({ title: "Sucesso", description: "Aviso atualizado com sucesso." });
             if (sendEmailNotification) {
                // TODO: Trigger email sending logic again for the update
                console.log("Sending update email notification...");
            }
        } else {
            // TODO: Implement actual add logic (send to backend)
            const newId = Math.max(0, ...announcements.map(a => a.id)) + 1;
            const newAnnouncement = { ...announcementData, id: newId, publishDate: new Date() };
            console.log("Adding announcement:", newAnnouncement);
            setAnnouncements([newAnnouncement, ...announcements]); // Add to top
            toast({ title: "Sucesso", description: "Aviso publicado com sucesso." });

            if (sendEmailNotification) {
                // TODO: Trigger email sending logic for the new announcement
                console.log("Sending email notification...");
                // Example: await sendEmail({ to: 'all_residents@domain.com', subject: newAnnouncement.title, body: newAnnouncement.content });
            }
        }
        resetForm();
    };

      const handleEditClick = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setAnnouncementTitle(announcement.title);
        setAnnouncementContent(announcement.content);
        setAnnouncementType(announcement.type);
        setAnnouncementTarget(announcement.targetCondo);
        setSendEmailNotification(true); // Default to true when editing, maybe check if already sent?
        setShowAddForm(true);
    };


     const handleRemoveAnnouncement = async () => {
        if (!announcementToRemove) return;

        // TODO: Implement actual removal logic (send to backend)
        console.log("Removing announcement:", announcementToRemove.id);
        setAnnouncements(announcements.filter(a => a.id !== announcementToRemove.id));

        toast({ title: "Sucesso", description: `Aviso "${announcementToRemove.title}" removido.` });
        setAnnouncementToRemove(null); // Close the dialog
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Avisos</h1>
                    <p className="text-muted-foreground">Crie, edite ou remova avisos e comunicados.</p>
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
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                         </div>
                         <div className="space-y-1.5">
                              <Label htmlFor="ann-content">Conteúdo*</Label>
                              <Textarea id="ann-content" rows={5} value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} />
                         </div>
                         <div className="grid sm:grid-cols-2 gap-4 items-end">
                             <div className="space-y-1.5">
                                  <Label htmlFor="ann-target">Enviar Para*</Label>
                                  <Select value={announcementTarget} onValueChange={setAnnouncementTarget}>
                                       <SelectTrigger id="ann-target"><SelectValue placeholder="Selecione o(s) condomínio(s)" /></SelectTrigger>
                                       <SelectContent>
                                           <SelectGroup>
                                              <SelectLabel>Condomínios</SelectLabel>
                                              <SelectItem value="all">Todos os Condomínios</SelectItem>
                                              {condoNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                                           </SelectGroup>
                                       </SelectContent>
                                  </Select>
                             </div>
                              <div className="flex items-center space-x-2 pb-1">
                                 <Checkbox
                                    id="send-email"
                                    checked={sendEmailNotification}
                                    onCheckedChange={(checked) => setSendEmailNotification(Boolean(checked))}
                                 />
                                <label
                                    htmlFor="send-email"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Notificar moradores por email
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
                    {/* Add filtering/sorting options here */}
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        {announcements.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Destino</TableHead>
                                        <TableHead>Data Publicação</TableHead>
                                        {/* <TableHead>Email Enviado?</TableHead> */}
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {announcements.map((ann) => (
                                        <TableRow key={ann.id}>
                                            <TableCell className="font-medium">{ann.title}</TableCell>
                                            <TableCell>{ann.type}</TableCell>
                                            <TableCell>{ann.targetCondo === 'all' ? 'Todos' : ann.targetCondo}</TableCell>
                                            <TableCell>{ann.publishDate.toLocaleDateString('pt-BR')}</TableCell>
                                            {/* <TableCell>{ann.sentEmail ? 'Sim' : 'Não'}</TableCell> */}
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
                            <p className="text-center text-muted-foreground py-4">Nenhum aviso publicado.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";
