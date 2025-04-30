
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, UserCog, PlusCircle, UserCheck, UserX } from 'lucide-react'; // Added UserCheck, UserX for status
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';

// Typical council roles - could be customized
type CouncilRole = 'Subsíndico' | 'Secretário(a)' | 'Tesoureiro(a)' | 'Conselheiro Fiscal' | 'Conselheiro Consultivo';

interface CouncilMember {
    id: number; // Or string UUID
    name: string;
    cpf: string; // Unique identifier
    role: CouncilRole;
    email: string;
    phone?: string;
    blockApartment: string; // Resident's unit
    startDate?: string; // Format YYYY-MM-DD
    endDate?: string; // Format YYYY-MM-DD (optional for mandate)
    isActive: boolean; // To indicate current mandate
}

// TODO: Fetch council members for the specific condominium from backend
const fetchCouncilMembers = async (condoId: number): Promise<CouncilMember[]> => {
    console.log(`Fetching council members for condo ID: ${condoId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    // Replace with actual API call filtered by condoId
    return [
        { id: 10, name: "Carlos Proprietário", cpf: "111.111.111-11", role: "Subsíndico", email: "carlos.prop@email.com", blockApartment: "A/101", startDate: "2024-01-01", isActive: true },
        { id: 11, name: "Fernanda Inquilina", cpf: "222.222.222-22", role: "Secretário(a)", email: "fernanda.inq@email.com", blockApartment: "A/102", startDate: "2024-01-01", isActive: true },
        { id: 12, name: "Roberto Proprietário", cpf: "333.333.333-33", role: "Conselheiro Fiscal", email: "roberto.prop@email.com", blockApartment: "B/201", startDate: "2023-01-01", endDate: "2023-12-31", isActive: false },
    ];
};

// TODO: Fetch residents of the current condo to populate the selection dropdown
const fetchResidentsForSelection = async (condoId: number): Promise<{ cpf: string; name: string; blockApartment: string; email: string; phone?: string }[]> => {
     console.log(`Fetching residents for selection for condo ID: ${condoId}`);
     await new Promise(resolve => setTimeout(resolve, 200));
     // Replace with actual API call
     return [
         { cpf: "111.111.111-11", name: "Carlos Proprietário", blockApartment: "A/101", email: "carlos.prop@email.com", phone: "(98) 91111-1111" },
         { cpf: "222.222.222-22", name: "Fernanda Inquilina", blockApartment: "A/102", email: "fernanda.inq@email.com", phone: "(98) 92222-2222" },
         { cpf: "333.333.333-33", name: "Roberto Proprietário", blockApartment: "B/201", email: "roberto.prop@email.com", phone: "(98) 93333-3333" },
         { cpf: "444.444.444-44", name: "Juliana Proprietária", blockApartment: "B/202", email: "juliana.prop@email.com", phone: "(98) 94444-4444" },
     ];
}

export default function SindicoCouncilPage() {
    const searchParams = useSearchParams();
    const condoId = searchParams.get('condoId'); // Get condoId from URL

    const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
    const [residents, setResidents] = useState<{ cpf: string; name: string; blockApartment: string; email: string; phone?: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);

    // Form State
    const [selectedResidentCpf, setSelectedResidentCpf] = useState<string | undefined>(undefined);
    const [memberRole, setMemberRole] = useState<CouncilRole | undefined>(undefined);
    const [memberStartDate, setMemberStartDate] = useState<string>('');
    const [memberEndDate, setMemberEndDate] = useState<string>(''); // Optional end date
    const [memberIsActive, setMemberIsActive] = useState<boolean>(true); // Default to active

    const [memberToRemove, setMemberToRemove] = useState<CouncilMember | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        if (!condoId) {
            toast({ title: "Erro", description: "Condomínio não especificado.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [membersData, residentsData] = await Promise.all([
                    fetchCouncilMembers(Number(condoId)),
                    fetchResidentsForSelection(Number(condoId)),
                ]);
                setCouncilMembers(membersData);
                setResidents(residentsData);
            } catch (error) {
                console.error("Failed to load council data:", error);
                toast({ title: "Erro", description: "Não foi possível carregar os dados do conselho.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [condoId, toast]);

     const resetForm = () => {
        setEditingMember(null);
        setSelectedResidentCpf(undefined);
        setMemberRole(undefined);
        setMemberStartDate('');
        setMemberEndDate('');
        setMemberIsActive(true);
        setShowAddForm(false);
    };

     const handleEditClick = (member: CouncilMember) => {
        setEditingMember(member);
        setSelectedResidentCpf(member.cpf);
        setMemberRole(member.role);
        setMemberStartDate(member.startDate || '');
        setMemberEndDate(member.endDate || '');
        setMemberIsActive(member.isActive);
        setShowAddForm(true);
    };

    const handleSaveMember = async () => {
        if (!selectedResidentCpf || !memberRole || !memberStartDate) {
            toast({ title: "Erro", description: "Selecione o morador, a função e a data de início.", variant: "destructive" });
            return;
        }

         // Ensure start date is not after end date if end date exists
         if (memberEndDate && new Date(memberStartDate) > new Date(memberEndDate)) {
             toast({ title: "Erro", description: "A data de início não pode ser posterior à data de término.", variant: "destructive" });
             return;
         }

         // Find selected resident details
         const resident = residents.find(r => r.cpf === selectedResidentCpf);
         if (!resident) {
             toast({ title: "Erro", description: "Morador selecionado inválido.", variant: "destructive" });
             return;
         }

        const memberData = {
            name: resident.name,
            cpf: resident.cpf,
            role: memberRole,
            email: resident.email,
            phone: resident.phone,
            blockApartment: resident.blockApartment,
            startDate: memberStartDate,
            endDate: memberEndDate || undefined, // Set to undefined if empty
            isActive: memberIsActive,
        };

        // --- BACKEND NOTE ---
        // Implement creation/update logic.
        // - Validate data rigorously.
        // - Check for existing council member with the same CPF for the current condo/mandate.
        // - Ensure dates are valid.
        // - Link to the correct condominium ID.
        // - Use prepared statements.

        if (editingMember) {
            // TODO: Call backend API to update council member
            console.log("Updating council member:", editingMember.id, memberData);
            setCouncilMembers(councilMembers.map(m => m.id === editingMember.id ? { ...memberData, id: editingMember.id } : m));
            toast({ title: "Sucesso", description: "Membro do conselho atualizado." });
        } else {
            // TODO: Call backend API to add council member
             // Check if this resident is already a council member (can be done on backend too)
             if (councilMembers.some(m => m.cpf === selectedResidentCpf && m.isActive)) {
                 toast({ title: "Erro", description: "Este morador já é um membro ativo do conselho.", variant: "destructive" });
                 return;
             }
            const newId = Math.max(0, ...councilMembers.map(m => m.id)) + 10; // Simulate ID
            const newMember = { ...memberData, id: newId };
            console.log("Adding council member:", newMember);
            setCouncilMembers([...councilMembers, newMember]);
            toast({ title: "Sucesso", description: "Membro adicionado ao conselho." });
        }
        resetForm();
    };

     const handleRemoveMember = async () => {
        if (!memberToRemove) return;

        // --- BACKEND NOTE ---
        // Implement actual removal logic.
        // - Verify permissions.
        // - This might just deactivate the member record rather than delete.
        // - Use prepared statements.
        console.log("Removing council member:", memberToRemove.id);
        setCouncilMembers(councilMembers.filter(m => m.id !== memberToRemove.id));

        toast({ title: "Sucesso", description: `Membro ${memberToRemove.name} removido do conselho.` });
        setMemberToRemove(null); // Close the dialog
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive
            ? <Badge variant="default"><UserCheck className="mr-1 h-3 w-3" />Ativo</Badge>
            : <Badge variant="secondary"><UserX className="mr-1 h-3 w-3" />Inativo</Badge>;
    }

    if (!condoId) {
        return <p className="text-destructive">ID do Condomínio não encontrado na URL.</p>;
    }
    if (isLoading) {
        return <p>Carregando membros do conselho...</p>; // TODO: Add Skeleton Loader
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Conselho</h1>
                    {/* TODO: Display Condo Name */}
                    <p className="text-muted-foreground">Adicione ou edite os membros do conselho do condomínio.</p>
                </div>
                 <Button onClick={() => { setShowAddForm(!showAddForm); if(editingMember) resetForm(); }}>
                     {showAddForm ? 'Cancelar' : <><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Membro</>}
                 </Button>
            </div>

             {showAddForm && (
                 <Card>
                     <CardHeader>
                         <CardTitle>{editingMember ? 'Editar Membro do Conselho' : 'Adicionar Novo Membro'}</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                             <div className="space-y-1.5">
                                 <Label htmlFor="member-resident">Morador*</Label>
                                 <Select
                                      value={selectedResidentCpf}
                                      onValueChange={setSelectedResidentCpf}
                                      disabled={!!editingMember} // Disable selection when editing
                                  >
                                     <SelectTrigger id="member-resident">
                                        <SelectValue placeholder="Selecione um morador" />
                                     </SelectTrigger>
                                     <SelectContent>
                                         {residents.map(res => (
                                            <SelectItem key={res.cpf} value={res.cpf}>
                                                 {res.name} ({res.blockApartment})
                                             </SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                                  {editingMember && <p className="text-xs text-muted-foreground">Para alterar o morador, remova e adicione novamente.</p>}
                             </div>
                              <div className="space-y-1.5">
                                 <Label htmlFor="member-role">Função*</Label>
                                 <Select value={memberRole} onValueChange={(value) => setMemberRole(value as CouncilRole)}>
                                     <SelectTrigger id="member-role"><SelectValue placeholder="Selecione a função" /></SelectTrigger>
                                     <SelectContent>
                                         {/* Add typical council roles */}
                                         <SelectItem value="Subsíndico">Subsíndico</SelectItem>
                                         <SelectItem value="Secretário(a)">Secretário(a)</SelectItem>
                                         <SelectItem value="Tesoureiro(a)">Tesoureiro(a)</SelectItem>
                                         <SelectItem value="Conselheiro Fiscal">Conselheiro Fiscal</SelectItem>
                                         <SelectItem value="Conselheiro Consultivo">Conselheiro Consultivo</SelectItem>
                                     </SelectContent>
                                 </Select>
                             </div>
                             <div className="space-y-1.5">
                                  <Label htmlFor="member-status">Status*</Label>
                                   <Select value={memberIsActive ? 'active' : 'inactive'} onValueChange={(val) => setMemberIsActive(val === 'active')}>
                                       <SelectTrigger id="member-status">
                                          <SelectValue placeholder="Status" />
                                       </SelectTrigger>
                                       <SelectContent>
                                           <SelectItem value="active">Ativo</SelectItem>
                                           <SelectItem value="inactive">Inativo</SelectItem>
                                       </SelectContent>
                                   </Select>
                              </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="member-start-date">Data de Início*</Label>
                                 <Input id="member-start-date" type="date" value={memberStartDate} onChange={(e) => setMemberStartDate(e.target.value)} />
                             </div>
                              <div className="space-y-1.5">
                                 <Label htmlFor="member-end-date">Data de Término (Opcional)</Label>
                                 <Input id="member-end-date" type="date" value={memberEndDate} onChange={(e) => setMemberEndDate(e.target.value)} />
                             </div>
                         </div>
                     </CardContent>
                     <CardFooter className="gap-2">
                         <Button onClick={handleSaveMember}>{editingMember ? 'Salvar Alterações' : 'Adicionar Membro'}</Button>
                         <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                     </CardFooter>
                 </Card>
             )}

            <Card>
                <CardHeader>
                    <CardTitle>Membros do Conselho</CardTitle>
                    {/* TODO: Add filtering by status (Active/Inactive)? */}
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        {councilMembers.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Função</TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Início</TableHead>
                                        <TableHead>Término</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {councilMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell>{member.role}</TableCell>
                                            <TableCell>{member.blockApartment}</TableCell>
                                            <TableCell>{member.startDate ? new Date(member.startDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                                            <TableCell>{member.endDate ? new Date(member.endDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                                            <TableCell>{getStatusBadge(member.isActive)}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditClick(member)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                 <AlertDialog>
                                                     <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setMemberToRemove(member)} title="Remover">
                                                          <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            Tem certeza que deseja remover "{memberToRemove?.name}" ({memberToRemove?.role}) do conselho? (A remoção pode ser lógica, mantendo o histórico).
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel onClick={() => setMemberToRemove(null)}>Cancelar</AlertDialogCancel>
                                                          <AlertDialogAction onClick={handleRemoveMember} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">Nenhum membro do conselho cadastrado para este condomínio.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
