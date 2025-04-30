'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, UserPlus, ShieldCheck, UserCog } from 'lucide-react'; // ShieldCheck for role
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

type AdminRole = 'síndico' | 'admin' | 'supervisor'; // Define admin roles

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: AdminRole;
    // Add last login, active status etc. if needed
}

// Sample data - replace with actual data fetching
// IMPORTANT: The current user should likely not be able to remove/demote themselves.
const initialAdminUsers: AdminUser[] = [
    { id: 1, name: "Síndico Principal", email: "sindico@digicondo.com", role: "síndico" },
    { id: 2, name: "Admin Auxiliar", email: "admin@digicondo.com", role: "admin" },
    { id: 3, name: "Supervisor Predial", email: "supervisor@digicondo.com", role: "supervisor" },
];


export default function AdminUsersPage() {
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
    const [showAddForm, setShowAddForm] = useState(false);
    // State for adding/editing user
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState<AdminRole | undefined>(undefined);
    const [userPassword, setUserPassword] = useState(''); // For adding new user or resetting password

    const [userToRemove, setUserToRemove] = useState<AdminUser | null>(null);

    const { toast } = useToast();

     const resetForm = () => {
        setEditingUser(null);
        setUserName('');
        setUserEmail('');
        setUserRole(undefined);
        setUserPassword('');
        setShowAddForm(false);
    };


    const handleSaveUser = async () => {
         if (!userName.trim() || !userEmail.trim() || !userRole) {
            toast({ title: "Erro", description: "Preencha nome, email e função.", variant: "destructive" });
            return;
        }
         // Add basic email validation
         if (!/\S+@\S+\.\S+/.test(userEmail)) {
             toast({ title: "Erro", description: "Formato de email inválido.", variant: "destructive" });
             return;
         }

         // Require password only when adding a new user
          if (!editingUser && !userPassword.trim()) {
              toast({ title: "Erro", description: "A senha é obrigatória ao adicionar um novo usuário.", variant: "destructive" });
              return;
          }
          // Optional: Add password complexity validation

         const userData = {
             name: userName.trim(),
             email: userEmail.trim(),
             role: userRole,
             // Include password only if adding or resetting
             ...(userPassword.trim() ? { password: userPassword.trim() } : {})
         };

        if (editingUser) {
            // TODO: Implement actual update logic (send to backend)
            // Be careful about password reset flow if password field is filled during edit
            console.log("Updating admin user:", editingUser.id, userData);
            setAdminUsers(adminUsers.map(u => u.id === editingUser.id ? { ...editingUser, ...userData } : u));
            toast({ title: "Sucesso", description: "Usuário administrador atualizado." });
        } else {
            // TODO: Implement actual add logic (send to backend)
            const newId = Math.max(0, ...adminUsers.map(u => u.id)) + 1;
            const newUser: AdminUser = { ...userData, id: newId, role: userRole }; // Ensure role is set
            console.log("Adding admin user:", newUser);
            setAdminUsers([...adminUsers, newUser]);
            toast({ title: "Sucesso", description: "Usuário administrador adicionado." });
        }
        resetForm();
    };

      const handleEditClick = (user: AdminUser) => {
        setEditingUser(user);
        setUserName(user.name);
        setUserEmail(user.email);
        setUserRole(user.role);
        setUserPassword(''); // Clear password field when editing
        setShowAddForm(true);
    };


     const handleRemoveUser = async () => {
        if (!userToRemove) return;
        // TODO: Add check to prevent self-removal? Requires knowing current user ID.
        // if (userToRemove.id === currentUserId) { toast(...); return; }

        // TODO: Implement actual removal logic (send to backend)
        console.log("Removing admin user:", userToRemove.id);
        setAdminUsers(adminUsers.filter(u => u.id !== userToRemove.id));

        toast({ title: "Sucesso", description: `Usuário ${userToRemove.name} removido.` });
        setUserToRemove(null); // Close the dialog
    };

    const getRoleBadge = (role: AdminRole) => {
        let variant: "default" | "secondary" | "outline" = "secondary";
        if (role === 'síndico') variant = 'default';
        if (role === 'admin') variant = 'outline';
        return <Badge variant={variant}>{role.charAt(0).toUpperCase() + role.slice(1)}</Badge>;
    }


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Usuários Admin</h1>
                    <p className="text-muted-foreground">Adicione ou edite usuários com acesso administrativo.</p>
                </div>
                 <Button onClick={() => { setShowAddForm(!showAddForm); if(editingUser) resetForm(); }}>
                     {showAddForm ? 'Cancelar' : <><UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário</>}
                 </Button>
            </div>

             {showAddForm && (
                 <Card>
                     <CardHeader>
                         <CardTitle>{editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                             <div className="space-y-1.5">
                                 <Label htmlFor="user-name">Nome Completo*</Label>
                                 <Input id="user-name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="user-email">Email*</Label>
                                 <Input id="user-email" type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                             </div>
                              <div className="space-y-1.5">
                                  <Label htmlFor="user-role">Função*</Label>
                                  <Select value={userRole} onValueChange={(value) => setUserRole(value as AdminRole)}>
                                       <SelectTrigger id="user-role"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="síndico">Síndico</SelectItem>
                                          <SelectItem value="admin">Admin</SelectItem>
                                          <SelectItem value="supervisor">Supervisor</SelectItem>
                                       </SelectContent>
                                  </Select>
                             </div>
                             <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                                  <Label htmlFor="user-password">Senha {editingUser ? '(Deixe em branco para não alterar)' : '*'}</Label>
                                  <Input id="user-password" type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                             </div>
                         </div>
                     </CardContent>
                     <CardFooter className="gap-2">
                         <Button onClick={handleSaveUser}>{editingUser ? 'Salvar Alterações' : 'Adicionar Usuário'}</Button>
                         <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                     </CardFooter>
                 </Card>
             )}

            <Card>
                <CardHeader>
                    <CardTitle>Usuários Administradores</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        {adminUsers.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Função</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditClick(user)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                 <AlertDialog>
                                                     <AlertDialogTrigger asChild>
                                                         {/* Disable remove button for self? Needs currentUserId */}
                                                         {/* <Button variant="ghost" size="icon" disabled={user.id === currentUserId} onClick={() => setUserToRemove(user)} title="Remover"> */}
                                                         <Button variant="ghost" size="icon" onClick={() => setUserToRemove(user)} title="Remover">
                                                          <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            Tem certeza que deseja remover o usuário "{userToRemove?.name}" ({userToRemove?.email})? Esta ação removerá o acesso administrativo.
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel onClick={() => setUserToRemove(null)}>Cancelar</AlertDialogCancel>
                                                          <AlertDialogAction onClick={handleRemoveUser} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">Nenhum usuário administrador cadastrado.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";
