'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, PawPrint, PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


type PetSpecies = 'dog' | 'cat' | 'bird' | 'other';

interface Pet {
  id: number;
  name: string;
  species: PetSpecies;
  breed?: string;
  color?: string;
  photoUrl?: string; // URL for the pet's photo
}

// Sample data - replace with actual data fetching/state management
const initialPets: Pet[] = [
    { id: 1, name: "Rex", species: "dog", breed: "Vira-lata", color: "Caramelo", photoUrl: "https://picsum.photos/50/50?random=1" },
    { id: 2, name: "Mia", species: "cat", breed: "Siamês", color: "Branco e Cinza", photoUrl: "https://picsum.photos/50/50?random=2" },
    { id: 3, name: "Loro", species: "bird", breed: "Papagaio", color: "Verde" },
];


export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [newPetName, setNewPetName] = useState('');
  const [newPetSpecies, setNewPetSpecies] = useState<PetSpecies | undefined>(undefined);
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetColor, setNewPetColor] = useState('');
  const [newPetPhoto, setNewPetPhoto] = useState<File | null>(null);
  const [petToRemove, setPetToRemove] = useState<Pet | null>(null);

  const { toast } = useToast();

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Optional: Add size validation if needed
      setNewPetPhoto(file);
    }
  };


  const handleAddPet = async () => {
    if (!newPetName.trim() || !newPetSpecies) {
      toast({ title: "Erro", description: "Preencha o nome e a espécie do pet.", variant: "destructive" });
      return;
    }

    // TODO: Implement actual submission logic (send to backend, upload photo if present)
    const newId = Math.max(0, ...pets.map(p => p.id)) + 1;

    let photoUrl = undefined;
    if (newPetPhoto) {
        console.log("Uploading pet photo:", newPetPhoto.name);
        // Simulate upload and get URL
        photoUrl = `https://picsum.photos/50/50?random=${newId}`; // Replace with actual URL after upload
    }


    const newPet: Pet = {
        id: newId,
        name: newPetName,
        species: newPetSpecies,
        breed: newPetBreed.trim() || undefined,
        color: newPetColor.trim() || undefined,
        photoUrl: photoUrl,
    };
    console.log("Adding pet:", newPet);
    setPets([...pets, newPet]);


    toast({ title: "Sucesso", description: "Pet adicionado com sucesso." });
    setNewPetName('');
    setNewPetSpecies(undefined);
    setNewPetBreed('');
    setNewPetColor('');
    setNewPetPhoto(null);
    // Clear file input if possible
  };

  const handleRemovePet = async () => {
    if (!petToRemove) return;

    // TODO: Implement actual removal logic (send to backend)
    console.log("Removing pet:", petToRemove.id);
    setPets(pets.filter(p => p.id !== petToRemove.id));

    toast({ title: "Sucesso", description: `Pet ${petToRemove.name} removido.` });
    setPetToRemove(null); // Close the dialog
  };


   const getSpeciesName = (species: PetSpecies) => {
     switch (species) {
       case 'dog': return 'Cachorro';
       case 'cat': return 'Gato';
       case 'bird': return 'Pássaro';
       case 'other': return 'Outro';
       default: return '';
     }
   };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Cadastro de Pets</h1>
      <p className="text-muted-foreground">Gerencie os animais de estimação da sua unidade.</p>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Pet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
               <div className="space-y-1.5">
                  <Label htmlFor="pet-name">Nome</Label>
                  <Input
                    id="pet-name"
                    placeholder="Nome do Pet"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                  />
               </div>
               <div className="space-y-1.5">
                    <Label htmlFor="pet-species">Espécie</Label>
                    <Select value={newPetSpecies} onValueChange={(value) => setNewPetSpecies(value as PetSpecies)}>
                        <SelectTrigger id="pet-species">
                            <SelectValue placeholder="Selecione a espécie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dog">Cachorro</SelectItem>
                            <SelectItem value="cat">Gato</SelectItem>
                            <SelectItem value="bird">Pássaro</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pet-breed">Raça (Opcional)</Label>
                  <Input
                    id="pet-breed"
                    placeholder="Ex: Vira-lata, Siamês"
                    value={newPetBreed}
                    onChange={(e) => setNewPetBreed(e.target.value)}
                  />
               </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pet-color">Cor (Opcional)</Label>
                  <Input
                    id="pet-color"
                    placeholder="Ex: Caramelo, Branco"
                    value={newPetColor}
                    onChange={(e) => setNewPetColor(e.target.value)}
                  />
               </div>
                <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="pet-photo">Foto (Opcional)</Label>
                  <Input id="pet-photo" type="file" accept="image/*" onChange={handlePhotoChange} />
                   {newPetPhoto && <p className="text-xs text-muted-foreground">Arquivo: {newPetPhoto.name}</p>}
               </div>
           </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddPet}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Pet
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pets Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {pets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Espécie</TableHead>
                  <TableHead>Raça</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>
                        <Avatar className="h-9 w-9">
                           <AvatarImage src={pet.photoUrl} alt={pet.name} data-ai-hint="pet animal" />
                           <AvatarFallback><PawPrint className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{pet.name}</TableCell>
                    <TableCell>{getSpeciesName(pet.species)}</TableCell>
                    <TableCell>{pet.breed || 'N/A'}</TableCell>
                    <TableCell>{pet.color || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" onClick={() => setPetToRemove(pet)}>
                                 <Trash2 className="h-4 w-4 text-destructive" />
                               </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Tem certeza que deseja remover o pet "{petToRemove?.name}"?
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel onClick={() => setPetToRemove(null)}>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={handleRemovePet} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                               </AlertDialogFooter>
                           </AlertDialogContent>
                       </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground">Nenhum pet cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";
