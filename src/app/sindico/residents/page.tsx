
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, UserPlus, Filter, Search, KeyRound, UserX } from 'lucide-react'; // Added KeyRound, UserX
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation'; // Hook to get condoId
import { buttonVariants } from "@/components/ui/button";

// Basic CPF format validation (XXX.XXX.XXX-XX)
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

interface Resident {
    id: number; // Or string UUID
    name: string;
    cpf: string;
    birthdate?: string; // Make optional if not always available/required
    email: string;
    phone?: string; // Make optional
    condominiumId: number; // ID of the condo they belong to
    block: string;
    apartment: string;
    status: 'Proprietário' | 'Inquilino';
    isActive: boolean; // Added to manage resident status
    // Add other fields like tenant info if status is Inquilino
}

// TODO: Fetch residents for the specific condominium from backend
const fetchResidents = async (condoId: number): Promise<Resident[]> => {
    console.log(`Fetching residents for condo ID: ${condoId}`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    // Replace with actual API call filtered by condoId
    return [
        { id: 1, name: "Carlos Proprietário", cpf: "111.111.111-11", birthdate: "1985-03-10", email: "carlos.prop@email.com", phone: "(98) 91111-1111", condominiumId: condoId, block: "A", apartment: "101", status: "Proprietário", isActive: true },
        { id: 2, name: "Fernanda Inquilina", cpf: "222.222.222-22", birthdate: "1992-11-25", email: "fernanda.inq@email.com", phone: "(98) 92222-2222", condominiumId: condoId, block: "A", apartment: "102", status: "Inquilino", isActive: true },
        { id: 3, name: "Roberto Inativo", cpf: "333.333.333-33", birthdate: "1978-07-01", email: "roberto.prop@email.com", phone: "(98) 93333-3333", condominiumId: condoId, block: "B", apartment: "201", status: "Proprietário", isActive: false }, // Example inactive
        // Add more residents specific to the condoId
    ];
};

const DEFAULT_RESET_PASSWORD = "mudar123"; // Define the default password for reset

export default function SindicoResidentsPage() {
    const searchParams = useSearchParams();
    const condoIdParam = searchParams.get('condoId'); // Get condoId from URL
    const actionParam = searchParams.get('action'); // Check if 'add' action is requested

    const [residents, setResidents] = useState<Resident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(actionParam === 'add'); // Open form if action=add
    // State for adding/editing resident
    const [editingResident, setEditingResident] = useState<Resident | null>(null);
    const [residentName, setResidentName] = useState('');
    const [residentCpf, setResidentCpf] = useState('');
    const [residentBirthdate, setResidentBirthdate] = useState('');
    const [residentEmail, setResidentEmail] = useState('');
    const [residentPhone, setResidentPhone] = useState('');
    const [residentBlock, setResidentBlock] = useState('');
    const [residentApartment, setResidentApartment] = useState('');
    const [residentStatus, setResidentStatus] = useState<'Proprietário' | 'Inquilino' | undefined>(undefined);
    const [residentIsActive, setResidentIsActive] = useState<boolean>(true); // Default to active

    const [residentToRemove, setResidentToRemove] = useState<Resident | null>(null);
    const [residentToResetPass, setResidentToResetPass] = useState<Resident | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all'); // Added status filter

    const { toast } = useToast();

     useEffect(() => {
        if (!condoIdParam) {
            toast({ title: "Erro", description: "Condomínio não especificado.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        const condoId = Number(condoIdParam);
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchResidents(condoId);
                setResidents(data);
            } catch (error) {
                console.error("Failed to load resident data:", error);
                toast({ title: "Erro", description: "Não foi possível carregar os dados dos moradores.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [condoIdParam, toast]);


     const resetForm = () => {
        setEditingResident(null);
        setResidentName('');
        setResidentCpf('');
        setResidentBirthdate('');
        setResidentEmail('');
        setResidentPhone('');
        setResidentBlock('');
        setResidentApartment('');
        setResidentStatus(undefined);
        setResidentIsActive(true);
        setShowAddForm(false);
    };


    const handleSaveResident = async () => {
         if (!condoIdParam || !residentName.trim() || !residentCpf.trim() || !residentEmail.trim() || !residentBlock.trim() || !residentApartment.trim() || !residentStatus) {
            toast({ title: "Erro", description: "Nome, CPF, Email, Bloco, Apto e Status são obrigatórios.", variant: "destructive" });
            return;
        }
         if (!cpfRegex.test(residentCpf)) {
             toast({ title: "Erro", description: "Formato de CPF inválido (use XXX.XXX.XXX-XX).", variant: "destructive" });
             return;
         }
         if (!/\S+@\S+\.\S+/.test(residentEmail)) {
             toast({ title: "Erro", description: "Formato de email inválido.", variant: "destructive" });
             return;
         }

         const residentData: Omit<Resident, 'id' | 'condominiumId'> = {
             name: residentName.trim(),
             cpf: residentCpf.trim(),
             birthdate: residentBirthdate || undefined,
             email: residentEmail.trim(),
             phone: residentPhone.trim() || undefined,
             block: residentBlock.trim().toUpperCase(),
             apartment: residentApartment.trim(),
             status: residentStatus,
             isActive: residentIsActive,
         };

         // --- BACKEND NOTE ---
         // Implement creation/update logic.
         // - Validate data rigorously.
         // - Check for existing resident with the same CPF in this condo.
         // - Handle association with the correct condominiumId.
         // - Use prepared statements.

        if (editingResident) {
            // TODO: Call backend API to update resident
            console.log("Updating resident:", editingResident.id, { ...residentData, condominiumId: Number(condoIdParam) });
            setResidents(residents.map(r => r.id === editingResident.id ? { ...residentData, id: editingResident.id, condominiumId: Number(condoIdParam) } : r));
            toast({ title: "Sucesso", description: "Morador atualizado com sucesso." });
        } else {
            // TODO: Call backend API to add resident
             // Check if CPF already exists in this condo
             if (residents.some(r => r.cpf === residentCpf)) {
                 toast({ title: "Erro", description: "Já existe um morador cadastrado com este CPF neste condomínio.", variant: "destructive" });
                 return;
             }
            const newId = Math.max(0, ...residents.map(r => r.id)) + 1; // Simulate ID
            const newResident = { ...residentData, id: newId, condominiumId: Number(condoIdParam) };
            console.log("Adding resident:", newResident);
            setResidents([...residents, newResident]);
            toast({ title: "Sucesso", description: "Morador adicionado com sucesso." });
             // TODO: Trigger initial password setup/email notification for the new resident
        }
        resetForm();
    };

      const handleEditClick = (resident: Resident) => {
        setEditingResident(resident);
        setResidentName(resident.name);
        setResidentCpf(resident.cpf);
        setResidentBirthdate(resident.birthdate || '');
        setResidentEmail(resident.email);
        setResidentPhone(resident.phone || '');
        setResidentBlock(resident.block);
        setResidentApartment(resident.apartment);
        setResidentStatus(resident.status);
        setResidentIsActive(resident.isActive);
        setShowAddForm(true);
    };


     const handleRemoveResident = async () => {
        if (!residentToRemove) return;

        // --- BACKEND NOTE ---
        // Implement actual removal or deactivation logic.
        // - Option 1: Mark as inactive (set isActive=false). Safer, preserves history.
        // - Option 2: Hard delete (use with caution, might orphan data).
        // - Use prepared statements.
        console.log("Deactivating/Removing resident:", residentToRemove.id);
         // Simulate marking as inactive
         setResidents(residents.map(r => r.id === residentToRemove.id ? { ...r, isActive: false } : r));
         // OR simulate hard delete: setResidents(residents.filter(r => r.id !== residentToRemove.id));

        toast({ title: "Sucesso", description: `Morador ${residentToRemove.name} ${residentToRemove.isActive ? 'desativado' : 'removido'}.` });
        setResidentToRemove(null); // Close the dialog
    };

     const handleResetPassword = async () => {
         if (!residentToResetPass) return;

        // --- BACKEND NOTE ---
        // Implement secure password reset logic.
        // 1. Verify Sindico's permission.
        // 2. Generate a secure hash of DEFAULT_RESET_PASSWORD.
        // 3. Update the resident's password hash in the database.
        // 4. **IMPORTANT**: Notify the resident (email/push) that their password was reset and provide the temporary password, urging them to change it immediately upon next login.
        // 5. Optionally, force password change on the resident's next login.
        // 6. Use prepared statements.

        console.log(`Resetting password for resident: ${residentToResetPass.id} (${residentToResetPass.email}) to default: ${DEFAULT_RESET_PASSWORD}`);
         // TODO: Call backend API to reset password

         toast({ title: "Sucesso", description: `Senha de ${residentToResetPass.name} redefinida para o padrão. Notifique o morador.` });
         setResidentToResetPass(null); // Close the dialog
     }


      const filteredResidents = useMemo(() => {
        return residents.filter(resident => {
            const matchesSearch = !searchTerm ||
                resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resident.cpf.includes(searchTerm) ||
                resident.apartment.includes(searchTerm) ||
                resident.block.toLowerCase().includes(searchTerm.toLowerCase());
             const matchesStatusFilter = filterStatus === 'all' || (filterStatus === 'active' && resident.isActive) || (filterStatus === 'inactive' && !resident.isActive);
            return matchesSearch && matchesStatusFilter;
        });
    }, [residents, searchTerm, filterStatus]);

     const getStatusBadge = (isActive: boolean) => {
        return isActive
            ? <Badge variant="default">Ativo</Badge>
            : <Badge variant="secondary">Inativo</Badge>;
     }


     if (!condoIdParam) {
        return <p className="text-destructive">ID do Condomínio não encontrado na URL.</p>;
     }
     if (isLoading) {
        return <p>Carregando moradores...</p>; // TODO: Add Skeleton Loader
     }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Moradores</h1>
                    {/* TODO: Display Condo Name */}
                    <p className="text-muted-foreground">Adicione, edite ou desative moradores do condomínio.</p>
                </div>
                 <Button onClick={() => { setShowAddForm(!showAddForm); if(editingResident) resetForm(); }}>
                     {showAddForm ? 'Cancelar' : <><UserPlus className="mr-2 h-4 w-4" /> Adicionar Morador</>}
                 </Button>
            </div>

             {showAddForm && (
                 <Card>
                     <CardHeader>
                         <CardTitle>{editingResident ? 'Editar Morador' : 'Adicionar Novo Morador'}</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-name">Nome Completo*</Label>
                                 <Input id="res-name" value={residentName} onChange={(e) => setResidentName(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-cpf">CPF*</Label>
                                 <Input
                                     id="res-cpf"
                                     placeholder="000.000.000-00"
                                     value={residentCpf}
                                     onChange={(e) => setResidentCpf(e.target.value)} // TODO: CPF Mask
                                     disabled={!!editingResident} // Disable CPF edit
                                 />
                                 {editingResident && <p className="text-xs text-muted-foreground">CPF não pode ser alterado.</p>}
                                 {residentCpf && !editingResident && !cpfRegex.test(residentCpf) && (
                                     <p className="text-xs text-destructive">Formato inválido.</p>
                                  )}
                             </div>
                              <div className="space-y-1.5">
                                 <Label htmlFor="res-email">Email*</Label>
                                 <Input id="res-email" type="email" value={residentEmail} onChange={(e) => setResidentEmail(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-phone">Telefone</Label>
                                 <Input id="res-phone" type="tel" placeholder="(XX) 9XXXX-XXXX" value={residentPhone} onChange={(e) => setResidentPhone(e.target.value)} /> {/* TODO: Phone Mask */}
                             </div>
                              <div className="space-y-1.5">
                                 <Label htmlFor="res-birthdate">Data de Nascimento</Label>
                                 <Input id="res-birthdate" type="date" value={residentBirthdate} onChange={(e) => setResidentBirthdate(e.target.value)} />
                             </div>
                              <div className="space-y-1.5">
                                 <Label htmlFor="res-block">Bloco*</Label>
                                 <Input id="res-block" placeholder="Ex: A, B" value={residentBlock} onChange={(e) => setResidentBlock(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-apartment">Apartamento*</Label>
                                 <Input id="res-apartment" placeholder="Ex: 101, 202" value={residentApartment} onChange={(e) => setResidentApartment(e.target.value)} />
                             </div>
                              <div className="space-y-1.5">
                                  <Label htmlFor="res-status">Status*</Label>
                                  <Select value={residentStatus} onValueChange={(value) => setResidentStatus(value as 'Proprietário' | 'Inquilino')}>
                                       <SelectTrigger id="res-status"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="Proprietário">Proprietário</SelectItem>
                                          <SelectItem value="Inquilino">Inquilino</SelectItem>
                                       </SelectContent>
                                  </Select>
                             </div>
                             <div className="space-y-1.5">
                                  <Label htmlFor="res-is-active">Situação*</Label>
                                   <Select value={residentIsActive ? 'active' : 'inactive'} onValueChange={(val) => setResidentIsActive(val === 'active')}>
                                       <SelectTrigger id="res-is-active">
                                          <SelectValue placeholder="Ativo/Inativo" />
                                       </SelectTrigger>
                                       <SelectContent>
                                           <SelectItem value="active">Ativo</SelectItem>
                                           <SelectItem value="inactive">Inativo</SelectItem>
                                       </SelectContent>
                                   </Select>
                              </div>
                         </div>
                         {/* TODO: Add fields for tenant info if status is Inquilino */}
                     </CardContent>
                     <CardFooter className="gap-2">
                         <Button onClick={handleSaveResident}>{editingResident ? 'Salvar Alterações' : 'Adicionar Morador'}</Button>
                         <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                     </CardFooter>
                 </Card>
             )}

             {/* Filter and Search Section */}
             <Card>
                <CardContent className="p-4 flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px] space-y-1.5">
                         <Label htmlFor="search-term">Buscar</Label>
                         <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                 id="search-term"
                                 placeholder="Nome, CPF, Apto..."
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                                 className="pl-8"
                               />
                         </div>
                    </div>
                    <div className="min-w-[180px] space-y-1.5">
                       <Label htmlFor="filter-status">Filtrar por Situação</Label>
                         <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'active' | 'inactive')}>
                             <SelectTrigger id="filter-status" className="w-full">
                                 <SelectValue placeholder="Todos" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 <SelectItem value="active">Ativos</SelectItem>
                                 <SelectItem value="inactive">Inativos</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                      {/* Add more filters if needed */}
                </CardContent>
             </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Moradores Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        {filteredResidents.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Situação</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredResidents.map((resident) => (
                                        <TableRow key={resident.id} className={!resident.isActive ? 'opacity-60' : ''}>
                                            <TableCell className="font-medium">{resident.name}</TableCell>
                                            <TableCell>Bl {resident.block} / Ap {resident.apartment}</TableCell>
                                             <TableCell>
                                                 <Badge variant={resident.status === 'Proprietário' ? 'secondary' : 'outline'}>
                                                     {resident.status}
                                                </Badge>
                                             </TableCell>
                                            <TableCell>{resident.email}</TableCell>
                                            <TableCell>{getStatusBadge(resident.isActive)}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                {/* Password Reset */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Redefinir Senha" onClick={() => setResidentToResetPass(resident)} disabled={!resident.isActive}>
                                                            <KeyRound className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Confirmar Redefinição de Senha</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            Tem certeza que deseja redefinir a senha de "{residentToResetPass?.name}" para a senha padrão "{DEFAULT_RESET_PASSWORD}"? O morador precisará alterá-la no próximo login.
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel onClick={() => setResidentToResetPass(null)}>Cancelar</AlertDialogCancel>
                                                          <AlertDialogAction onClick={handleResetPassword}>Redefinir Senha</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                {/* Edit */}
                                                <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditClick(resident)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                {/* Remove/Deactivate */}
                                                 <AlertDialog>
                                                     <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setResidentToRemove(resident)} title={resident.isActive ? 'Desativar' : 'Remover Definitivamente'}>
                                                          <UserX className={`h-4 w-4 ${resident.isActive ? 'text-orange-600' : 'text-destructive'}`} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Confirmar {residentToRemove?.isActive ? 'Desativação' : 'Remoção'}</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            {residentToRemove?.isActive
                                                              ? `Tem certeza que deseja DESATIVAR o morador "${residentToRemove?.name}"? Ele perderá o acesso ao sistema.`
                                                              : `Tem certeza que deseja REMOVER PERMANENTEMENTE o morador "${residentToRemove?.name}" (CPF: ${residentToRemove?.cpf})? Esta ação não pode ser desfeita.`}
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel onClick={() => setResidentToRemove(null)}>Cancelar</AlertDialogCancel>
                                                          <AlertDialogAction onClick={handleRemoveResident} className={buttonVariants({ variant: residentToRemove?.isActive ? "default" : "destructive" })}>
                                                             {residentToRemove?.isActive ? 'Desativar' : 'Remover'}
                                                          </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">Nenhum morador encontrado com os filtros aplicados.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
