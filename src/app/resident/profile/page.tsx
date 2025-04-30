'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Edit } from 'lucide-react'; // Assuming Edit icon is needed for password change

// Sample data - replace with actual data fetching
const userProfile = {
  name: "Usuário Exemplo Silva",
  cpf: "123.456.789-00",
  birthdate: "1990-05-15",
  email: "usuario.exemplo@email.com",
  phone: "+55 (99) 91234-5678",
  condominium: "Plaza das Flores IV",
  block: "B",
  apartment: "101",
  status: "Proprietário", // or "Inquilino"
  profilePictureUrl: "https://picsum.photos/100/100",
};

export default function ProfilePage() {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
       const file = event.target.files[0];
       // Optional: Add size validation if needed
       setProfilePicture(file);
       // TODO: Add logic to immediately upload or show preview
        handleUploadPicture(file); // Auto-upload for simplicity
    }
  };

  const handleUploadPicture = async (file: File | null = profilePicture) => {
     if (!file) {
      toast({ title: "Erro", description: "Selecione uma foto para enviar.", variant: "destructive" });
      return;
    }
    // TODO: Implement actual upload logic
    console.log("Uploading profile picture:", file.name);
     toast({ title: "Sucesso", description: "Foto de perfil atualizada (simulado)." });
     // Update userProfile.profilePictureUrl with the new URL after successful upload
     // For now, just clear the state
     setProfilePicture(null);
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
       toast({ title: "Erro", description: "Preencha a nova senha e a confirmação.", variant: "destructive" });
       return;
    }
     if (newPassword !== confirmPassword) {
       toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
       return;
     }
      // TODO: Implement actual password change logic
      console.log("Changing password to:", newPassword);
      toast({ title: "Sucesso", description: "Senha alterada com sucesso." });
      setNewPassword('');
      setConfirmPassword('');
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
      <p className="text-muted-foreground">Visualize e gerencie suas informações.</p>

      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
           <Avatar className="h-24 w-24">
              <AvatarImage src={userProfile.profilePictureUrl} alt="Foto do Usuário" data-ai-hint="user avatar" />
              <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</AvatarFallback>
          </Avatar>
          <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="profile-picture">Alterar Foto</Label>
              <Input id="profile-picture" type="file" accept="image/*" onChange={handlePictureChange} />
              {profilePicture && <p className="text-xs text-muted-foreground">Arquivo selecionado: {profilePicture.name}</p>}
              {/* Removed the separate upload button as it auto-uploads on change now */}
              {/* <Button onClick={handleUploadPicture} disabled={!profilePicture} size="sm" className="mt-2">Enviar Nova Foto</Button> */}
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
           <CardDescription>Essas informações não podem ser alteradas por você. Contate a administração se precisar de correções.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
             <Label className="text-sm font-medium text-muted-foreground">Nome Completo</Label>
             <p className="text-foreground">{userProfile.name}</p>
          </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">CPF</Label>
             <p className="text-foreground">{userProfile.cpf}</p>
          </div>
          <div>
             <Label className="text-sm font-medium text-muted-foreground">Data de Nascimento</Label>
             <p className="text-foreground">{new Date(userProfile.birthdate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
          </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Email</Label>
             <p className="text-foreground">{userProfile.email}</p>
          </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
             <p className="text-foreground">{userProfile.phone}</p>
          </div>
           <Separator className="md:col-span-2 my-2"/>
             <div>
             <Label className="text-sm font-medium text-muted-foreground">Condomínio</Label>
             <p className="text-foreground">{userProfile.condominium}</p>
          </div>
            <div>
             <Label className="text-sm font-medium text-muted-foreground">Bloco</Label>
             <p className="text-foreground">{userProfile.block}</p>
          </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Apartamento</Label>
             <p className="text-foreground">{userProfile.apartment}</p>
          </div>
           <div>
             <Label className="text-sm font-medium text-muted-foreground">Status</Label>
             <p className="text-foreground">{userProfile.status}</p>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
        </CardHeader>
         <CardContent className="space-y-4">
             <div className="grid w-full max-w-sm items-center gap-1.5">
               <Label htmlFor="new-password">Nova Senha</Label>
               <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
               />
             </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
               <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
               <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
             </div>
          </CardContent>
          <CardFooter>
             <Button onClick={handleChangePassword}>
                <Edit className="mr-2 h-4 w-4" /> Alterar Senha
             </Button>
          </CardFooter>
      </Card>

    </div>
  );
}
