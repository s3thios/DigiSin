'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Package, Trash2, PlusCircle, Phone, MessageCircle } from 'lucide-react'; // Added Phone and MessageCircle for contact
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';


type AdType = 'product' | 'service' | 'job';

interface Ad {
  id: number;
  title: string;
  description: string;
  type: AdType;
  contactInfo: string; // Phone or other contact method
  postedBy: string; // Resident's first name (or full name if privacy allows)
  blockApartment: string; // e.g., "Bloco A / Apto 101"
  postDate: Date;
}

// Sample data - replace with actual data fetching (filtered by condominium)
const initialAds: Ad[] = [
    { id: 1, title: "Aulas de Violão", description: "Ofereço aulas particulares de violão para iniciantes. Horários flexíveis.", type: "service", contactInfo: "(99) 98877-6655", postedBy: "Carlos", blockApartment: "Bloco A / Apto 101", postDate: new Date(2024, 6, 20) },
    { id: 2, title: "Vendo Bicicleta Usada", description: "Bicicleta Caloi Andes em bom estado. Pouco uso. R$ 300,00.", type: "product", contactInfo: "Falar com Fernanda", blockApartment: "Bloco A / Apto 102", postDate: new Date(2024, 6, 22) },
    { id: 3, title: "Babysitter Disponível", description: "Cuido de crianças nos fins de semana. Tenho experiência e referências.", type: "job", contactInfo: "(99) 91122-3344", postedBy: "Juliana", blockApartment: "Bloco B / Apto 202", postDate: new Date(2024, 6, 24) },
];

// Assume this is the current user's identifier - TODO: Fetch dynamically
const currentUserIdentifier = { name: "Maria Residente", blockApartment: "Bloco B / Apto 101" };

export default function MarketplacePage() {
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdDescription, setNewAdDescription] = useState('');
  const [newAdType, setNewAdType] = useState<AdType | undefined>(undefined);
  const [newAdContact, setNewAdContact] = useState('');
  const [adToRemove, setAdToRemove] = useState<Ad | null>(null);


  const { toast } = useToast();

  const handleAddAd = async () => {
    if (!newAdTitle.trim() || !newAdDescription.trim() || !newAdType || !newAdContact.trim()) {
      toast({ title: "Erro", description: "Preencha todos os campos do anúncio.", variant: "destructive" });
      return;
    }

    // TODO: Implement actual submission logic (send to backend)
    const newId = Math.max(0, ...ads.map(a => a.id)) + 1;
    const newAd: Ad = {
        id: newId,
        title: newAdTitle,
        description: newAdDescription,
        type: newAdType,
        contactInfo: newAdContact,
        postedBy: currentUserIdentifier.name, // Use logged-in user's name
        blockApartment: currentUserIdentifier.blockApartment, // Use logged-in user's unit info
        postDate: new Date(),
    };
    console.log("Adding ad:", newAd);
     // Simulate adding to list and notify
     setAds([newAd, ...ads]); // Add to the beginning of the list
     // TODO: Potentially notify other residents (optional, consider frequency)


    toast({ title: "Sucesso", description: "Anúncio publicado com sucesso." });
    setNewAdTitle('');
    setNewAdDescription('');
    setNewAdType(undefined);
    setNewAdContact('');
  };

   const handleRemoveAd = async () => {
    if (!adToRemove) return;

     // Basic check: Only allow removing own ads (compare postedBy or add userId)
     if (adToRemove.postedBy !== currentUserIdentifier.name || adToRemove.blockApartment !== currentUserIdentifier.blockApartment) {
         toast({ title: "Erro", description: "Você só pode remover seus próprios anúncios.", variant: "destructive" });
         setAdToRemove(null);
         return;
     }

    // TODO: Implement actual removal logic (send to backend)
    console.log("Removing ad:", adToRemove.id);
    setAds(ads.filter(a => a.id !== adToRemove.id));

    toast({ title: "Sucesso", description: `Anúncio "${adToRemove.title}" removido.` });
    setAdToRemove(null); // Close the dialog
  };


   const getAdTypeIcon = (type: AdType) => {
     switch (type) {
       case 'product': return <Package className="h-4 w-4 mr-1" />;
       case 'service': return <Briefcase className="h-4 w-4 mr-1" />;
       case 'job': return <Briefcase className="h-4 w-4 mr-1" />; // Same icon for job/service?
       default: return null;
     }
   };

   const getAdTypeName = (type: AdType) => {
        switch (type) {
       case 'product': return 'Produto';
       case 'service': return 'Serviço';
       case 'job': return 'Oportunidade';
       default: return '';
     }
   }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Classificados da Comunidade</h1>
      <p className="text-muted-foreground">Anuncie ou encontre produtos, serviços e oportunidades oferecidos por seus vizinhos.</p>

      <Card>
        <CardHeader>
          <CardTitle>Publicar Novo Anúncio</CardTitle>
           <CardDescription>Seu anúncio será visível apenas para os moradores do seu condomínio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <Label htmlFor="ad-title">Título</Label>
                   <Input
                     id="ad-title"
                     placeholder="Ex: Aulas de Violão, Vendo Bicicleta"
                     value={newAdTitle}
                     onChange={(e) => setNewAdTitle(e.target.value)}
                   />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ad-type">Tipo</Label>
                    <Select value={newAdType} onValueChange={(value) => setNewAdType(value as AdType)}>
                        <SelectTrigger id="ad-type">
                            <SelectValue placeholder="Selecione Produto, Serviço ou Oportunidade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="product">Produto</SelectItem>
                            <SelectItem value="service">Serviço</SelectItem>
                            <SelectItem value="job">Oportunidade</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
           </div>
           <div className="space-y-1.5">
                <Label htmlFor="ad-description">Descrição</Label>
                <Textarea
                 id="ad-description"
                 placeholder="Detalhe o produto, serviço ou oportunidade..."
                 value={newAdDescription}
                 onChange={(e) => setNewAdDescription(e.target.value)}
                 rows={3}
                />
            </div>
            <div className="space-y-1.5">
                  <Label htmlFor="ad-contact">Informação de Contato</Label>
                  <Input
                    id="ad-contact"
                    placeholder="Telefone, email ou como ser contatado"
                    value={newAdContact}
                    onChange={(e) => setNewAdContact(e.target.value)}
                  />
               </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddAd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Publicar Anúncio
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classificados Ativos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ads.length > 0 ? (
            ads.map((ad) => (
              <Card key={ad.id} className="relative group">
                <CardHeader className="pb-2">
                   <div className="flex justify-between items-start gap-2">
                     <CardTitle className="text-lg">{ad.title}</CardTitle>
                      <Badge variant="outline" className="flex items-center shrink-0">
                         {getAdTypeIcon(ad.type)}
                         {getAdTypeName(ad.type)}
                      </Badge>
                   </div>
                    <CardDescription>
                       Postado por: {ad.postedBy} ({ad.blockApartment}) em {ad.postDate.toLocaleDateString('pt-BR')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{ad.description}</p>
                   <div className="flex items-center gap-2 text-sm text-primary font-medium">
                     <MessageCircle className="h-4 w-4"/> {/* Or Phone icon based on content? */}
                     <span>Contato: {ad.contactInfo}</span>
                   </div>
                </CardContent>
                 {/* Show remove button only for user's own ads */}
                  {(ad.postedBy === currentUserIdentifier.name && ad.blockApartment === currentUserIdentifier.blockApartment) && (
                    <AlertDialog>
                         <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => setAdToRemove(ad)} title="Remover Anúncio">
                                <Trash2 className="h-4 w-4 text-destructive" />
                             </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o anúncio "{adToRemove?.title}"?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setAdToRemove(null)}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleRemoveAd} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 )}
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">Nenhum classificado publicado no momento.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";
