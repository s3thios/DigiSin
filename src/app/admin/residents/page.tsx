'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, UserPlus, Filter, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

interface Resident {
    id: number;
    name: string;
    cpf: string;
    birthdate: string;
    email: string;
    phone: string;
    condominium: string;
    block: string;
    apartment: string;
    status: 'Proprietário' | 'Inquilino';
    // Add other fields like tenant info if status is Inquilino
}

// Sample data - replace with actual data fetching
const initialResidents: Resident[] = [
    { id: 1, name: "Carlos Proprietário", cpf: "111.111.111-11", birthdate: "1985-03-10", email: "carlos.prop@email.com", phone: "(98) 91111-1111", condominium: "Plaza das Flores IV", block: "A", apartment: "101", status: "Proprietário" },
    { id: 2, name: "Fernanda Inquilina", cpf: "222.222.222-22", birthdate: "1992-11-25", email: "fernanda.inq@email.com", phone: "(98) 92222-2222", condominium: "Plaza das Flores IV", block: "A", apartment: "102", status: "Inquilino" },
    { id: 3, name: "Roberto Proprietário", cpf: "333.333.333-33", birthdate: "1978-07-01", email: "roberto.prop@email.com", phone: "(98) 93333-3333", condominium: "Plaza das Flores III", block: "B", apartment: "201", status: "Proprietário" },
     { id: 4, name: "Juliana Proprietária", cpf: "444.444.444-44", birthdate: "1988-01-15", email: "juliana.prop@email.com", phone: "(98) 94444-4444", condominium: "Plaza das Flores III", block: "B", apartment: "202", status: "Proprietário" },
];

// Sample condo names (fetch dynamically)
const condoNames = ["Plaza das Flores IV", "Plaza das Flores III"];


export default function ResidentsPage() {
    const [residents, setResidents] = useState<Resident[]>(initialResidents);
    const [showAddForm, setShowAddForm] = useState(false);
    // State for adding/editing resident
    const [editingResident, setEditingResident] = useState<Resident | null>(null);
    const [residentName, setResidentName] = useState('');
    const [residentCpf, setResidentCpf] = useState('');
    const [residentBirthdate, setResidentBirthdate] = useState('');
    const [residentEmail, setResidentEmail] = useState('');
    const [residentPhone, setResidentPhone] = useState('');
    const [residentCondo, setResidentCondo] = useState<string | undefined>(undefined);
    const [residentBlock, setResidentBlock] = useState('');
    const [residentApartment, setResidentApartment] = useState('');
    const [residentStatus, setResidentStatus] = useState<'Proprietário' | 'Inquilino' | undefined>(undefined);

    const [residentToRemove, setResidentToRemove] = useState<Resident | null>(null);
    const [filterCondo, setFilterCondo] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');


    const { toast } = useToast();

     const resetForm = () => {
        setEditingResident(null);
        setResidentName('');
        setResidentCpf('');
        setResidentBirthdate('');
        setResidentEmail('');
        setResidentPhone('');
        setResidentCondo(undefined);
        setResidentBlock('');
        setResidentApartment('');
        setResidentStatus(undefined);
        setShowAddForm(false);
    };


    const handleSaveResident = async () => {
         if (!residentName.trim() || !residentCpf.trim() || !residentBirthdate || !residentEmail.trim() || !residentPhone.trim() || !residentCondo || !residentBlock.trim() || !residentApartment.trim() || !residentStatus) {
            toast({ title: "Erro", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
            return;
        }

         // TODO: Add better validation (CPF, email, phone format)

         const residentData: Omit<Resident, 'id'> = {
             name: residentName.trim(),
             cpf: residentCpf.trim(),
             birthdate: residentBirthdate,
             email: residentEmail.trim(),
             phone: residentPhone.trim(),
             condominium: residentCondo,
             block: residentBlock.trim().toUpperCase(),
             apartment: residentApartment.trim(),
             status: residentStatus,
         };

        if (editingResident) {
            // TODO: Implement actual update logic (send to backend)
            console.log("Updating resident:", editingResident.id, residentData);
            setResidents(residents.map(r => r.id === editingResident.id ? { ...residentData, id: editingResident.id } : r));
            toast({ title: "Sucesso", description: "Morador atualizado com sucesso." });
        } else {
            // TODO: Implement actual add logic (send to backend)
            const newId = Math.max(0, ...residents.map(r => r.id)) + 1;
            const newResident = { ...residentData, id: newId };
            console.log("Adding resident:", newResident);
            setResidents([...residents, newResident]);
            toast({ title: "Sucesso", description: "Morador adicionado com sucesso." });
        }
        resetForm();
    };

      const handleEditClick = (resident: Resident) => {
        setEditingResident(resident);
        setResidentName(resident.name);
        setResidentCpf(resident.cpf);
        setResidentBirthdate(resident.birthdate);
        setResidentEmail(resident.email);
        setResidentPhone(resident.phone);
        setResidentCondo(resident.condominium);
        setResidentBlock(resident.block);
        setResidentApartment(resident.apartment);
        setResidentStatus(resident.status);
        setShowAddForm(true);
    };


     const handleRemoveResident = async () => {
        if (!residentToRemove) return;

        // TODO: Implement actual removal logic (send to backend)
        console.log("Removing resident:", residentToRemove.id);
        setResidents(residents.filter(r => r.id !== residentToRemove.id));

        toast({ title: "Sucesso", description: `Morador ${residentToRemove.name} removido.` });
        setResidentToRemove(null); // Close the dialog
    };

      const filteredResidents = useMemo(() => {
        return residents.filter(resident => {
            const matchesCondo = filterCondo === 'all' || resident.condominium === filterCondo;
            const matchesSearch = !searchTerm ||
                resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resident.cpf.includes(searchTerm) ||
                resident.apartment.includes(searchTerm) ||
                resident.block.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCondo && matchesSearch;
        });
    }, [residents, filterCondo, searchTerm]);


    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Moradores</h1>
                    <p className="text-muted-foreground">Adicione, edite ou remova informações dos moradores.</p>
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
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-name">Nome Completo*</Label>
                                 <Input id="res-name" value={residentName} onChange={(e) => setResidentName(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-cpf">CPF*</Label>
                                 <Input id="res-cpf" value={residentCpf} onChange={(e) => setResidentCpf(e.target.value)} /> {/* TODO: CPF Mask */}
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-birthdate">Data de Nascimento*</Label>
                                 <Input id="res-birthdate" type="date" value={residentBirthdate} onChange={(e) => setResidentBirthdate(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-email">Email*</Label>
                                 <Input id="res-email" type="email" value={residentEmail} onChange={(e) => setResidentEmail(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-phone">Telefone*</Label>
                                 <Input id="res-phone" type="tel" value={residentPhone} onChange={(e) => setResidentPhone(e.target.value)} /> {/* TODO: Phone Mask */}
                             </div>
                             <div className="space-y-1.5">
                                  <Label htmlFor="res-condo">Condomínio*</Label>
                                  <Select value={residentCondo} onValueChange={setResidentCondo}>
                                       <SelectTrigger id="res-condo"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                       <SelectContent>
                                          {condoNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                                       </SelectContent>
                                  </Select>
                             </div>
                              <div className="space-y-1.5">
                                 <Label htmlFor="res-block">Bloco*</Label>
                                 <Input id="res-block" value={residentBlock} onChange={(e) => setResidentBlock(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="res-apartment">Apartamento*</Label>
                                 <Input id="res-apartment" value={residentApartment} onChange={(e) => setResidentApartment(e.target.value)} />
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
                    <div className="min-w-[200px] space-y-1.5">
                       <Label htmlFor="filter-condo">Filtrar por Condomínio</Label>
                         <Select value={filterCondo} onValueChange={setFilterCondo}>
                             <SelectTrigger id="filter-condo" className="w-full">
                                 <SelectValue placeholder="Selecione o Condomínio" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">Todos</SelectItem>
                                 {condoNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                             </SelectContent>
                         </Select>
                     </div>
                      {/* Add more filters if needed (e.g., by status) */}
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
                                        <TableHead>Condomínio</TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Telefone</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredResidents.map((resident) => (
                                        <TableRow key={resident.id}>
                                            <TableCell className="font-medium">{resident.name}</TableCell>
                                            <TableCell>{resident.condominium}</TableCell>
                                            <TableCell>Bl {resident.block} / Ap {resident.apartment}</TableCell>
                                             <TableCell>
                                                 <Badge variant={resident.status === 'Proprietário' ? 'secondary' : 'outline'}>
                                                     {resident.status}
                                                </Badge>
                                             </TableCell>
                                            <TableCell>{resident.email}</TableCell>
                                            <TableCell>{resident.phone}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditClick(resident)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                 <AlertDialog>
                                                     <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setResidentToRemove(resident)} title="Remover">
                                                          <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            Tem certeza que deseja remover o morador "{residentToRemove?.name}" (CPF: {residentToRemove?.cpf})?
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel onClick={() => setResidentToRemove(null)}>Cancelar</AlertDialogCancel>
                                                          <AlertDialogAction onClick={handleRemoveResident} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
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

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";
