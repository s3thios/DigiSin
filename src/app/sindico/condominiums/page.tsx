
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Building, PlusCircle, MapPin, Phone, FileSignature } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

// CNPJ format validation (XX.XXX.XXX/XXXX-XX)
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const MAX_CONDOS = 10; // Maximum number of condominiums allowed

interface Condominium {
    id: number; // Or string UUID from database
    name: string;
    cnpj: string;
    address: string;
    whatsapp?: string; // Contact for the specific condo (e.g., Zelador)
    // Add other relevant fields like number of units, syndic contact, etc.
}

// TODO: Fetch condominiums managed by this specific Sindico from the backend
const fetchSindicoCondominiums = async (): Promise<Condominium[]> => {
    // Simulate API call - replace with actual backend call
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
        { id: 1, name: "Plaza das Flores IV", cnpj: "11.222.333/0001-44", address: "Rua das Flores, 400, Bairro Jardim, São Luís - MA", whatsapp: "+5598987300672" },
        { id: 2, name: "Plaza das Flores III", cnpj: "44.555.666/0001-77", address: "Rua das Palmeiras, 300, Bairro Jardim, São Luís - MA" },
    ];
};


export default function SindicoCondominiumsPage() {
    const [condominiums, setCondominiums] = useState<Condominium[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCondo, setEditingCondo] = useState<Condominium | null>(null);

    // Form State
    const [condoName, setCondoName] = useState('');
    const [condoCnpj, setCondoCnpj] = useState('');
    const [condoAddress, setCondoAddress] = useState('');
    const [condoWhatsapp, setCondoWhatsapp] = useState('');

    const [condoToRemove, setCondoToRemove] = useState<Condominium | null>(null);

    const { toast } = useToast();

    useEffect(() => {
        const loadCondos = async () => {
            setIsLoading(true);
            try {
                const data = await fetchSindicoCondominiums();
                setCondominiums(data);
            } catch (error) {
                console.error("Failed to fetch condominiums:", error);
                toast({ title: "Erro", description: "Não foi possível carregar os condomínios.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        loadCondos();
    }, [toast]);


    const resetForm = () => {
        setEditingCondo(null);
        setCondoName('');
        setCondoCnpj('');
        setCondoAddress('');
        setCondoWhatsapp('');
        setShowAddForm(false);
    };

     const handleEditClick = (condo: Condominium) => {
        setEditingCondo(condo);
        setCondoName(condo.name);
        setCondoCnpj(condo.cnpj);
        setCondoAddress(condo.address);
        setCondoWhatsapp(condo.whatsapp || '');
        setShowAddForm(true);
    };

    const handleSaveCondominium = async () => {
        if (!condoName.trim() || !condoCnpj.trim() || !condoAddress.trim()) {
            toast({ title: "Erro", description: "Nome, CNPJ e Endereço são obrigatórios.", variant: "destructive" });
            return;
        }
        if (!cnpjRegex.test(condoCnpj)) {
            toast({ title: "Erro", description: "Formato de CNPJ inválido (XX.XXX.XXX/XXXX-XX).", variant: "destructive" });
            return;
        }

        if (!editingCondo && condominiums.length >= MAX_CONDOS) {
            toast({ title: "Limite Atingido", description: `Você só pode gerenciar até ${MAX_CONDOS} condomínios.`, variant: "destructive" });
            return;
        }

        const condoData: Omit<Condominium, 'id'> = {
            name: condoName.trim(),
            cnpj: condoCnpj.trim(),
            address: condoAddress.trim(),
            whatsapp: condoWhatsapp.trim() || undefined,
        };

        // --- BACKEND NOTE ---
        // Implement actual creation/update logic here.
        // - Validate data rigorously on the server.
        // - Ensure CNPJ uniqueness across condominiums.
        // - Associate the condominium with the logged-in Sindico.
        // - Use prepared statements to prevent SQL injection.

        if (editingCondo) {
            // TODO: Call backend API to update condominium
            console.log("Updating condominium:", editingCondo.id, condoData);
            setCondominiums(condominiums.map(c => c.id === editingCondo.id ? { ...condoData, id: editingCondo.id } : c));
            toast({ title: "Sucesso", description: "Condomínio atualizado com sucesso." });
        } else {
            // TODO: Call backend API to create condominium
            const newId = Math.max(0, ...condominiums.map(c => c.id)) + 1; // Simulate ID generation
            const newCondo = { ...condoData, id: newId };
            console.log("Adding condominium:", newCondo);
            setCondominiums([...condominiums, newCondo]);
            toast({ title: "Sucesso", description: "Condomínio adicionado com sucesso." });
        }
        resetForm();
    };

     const handleRemoveCondominium = async () => {
        if (!condoToRemove) return;

        // --- BACKEND NOTE ---
        // Implement actual removal logic.
        // - Verify the Sindico has permission to remove this condo.
        // - Consider cascading deletes or archiving related data (residents, employees, etc.). This is a critical step!
        // - Use prepared statements.
        console.log("Removing condominium:", condoToRemove.id);
        setCondominiums(condominiums.filter(c => c.id !== condoToRemove.id));

        toast({ title: "Sucesso", description: `Condomínio ${condoToRemove.name} removido.` });
        setCondoToRemove(null); // Close the dialog
    };


    if (isLoading) {
        return <p>Carregando condomínios...</p>; // TODO: Add Skeleton Loader
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Condomínios</h1>
                    <p className="text-muted-foreground">Adicione, edite ou remova os condomínios sob sua gestão.</p>
                     <p className="text-sm text-muted-foreground">Condomínios cadastrados: {condominiums.length}/{MAX_CONDOS}</p>
                </div>
                 <Button onClick={() => { setShowAddForm(!showAddForm); if(editingCondo) resetForm(); }} disabled={condominiums.length >= MAX_CONDOS && !showAddForm}>
                     {showAddForm ? 'Cancelar' : <><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Condomínio</>}
                 </Button>
            </div>

             {showAddForm && (
                 <Card>
                     <CardHeader>
                         <CardTitle>{editingCondo ? 'Editar Condomínio' : 'Adicionar Novo Condomínio'}</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                             <div className="space-y-1.5">
                                 <Label htmlFor="condo-name">Nome do Condomínio*</Label>
                                 <Input
                                     id="condo-name"
                                     placeholder="Ex: Plaza das Flores IV"
                                     value={condoName}
                                     onChange={(e) => setCondoName(e.target.value)}
                                 />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="condo-cnpj">CNPJ*</Label>
                                 <Input
                                     id="condo-cnpj"
                                     placeholder="XX.XXX.XXX/XXXX-XX"
                                     value={condoCnpj}
                                     onChange={(e) => setCondoCnpj(e.target.value)} // TODO: Add CNPJ Mask
                                 />
                                  {condoCnpj && !cnpjRegex.test(condoCnpj) && (
                                     <p className="text-xs text-destructive">Formato inválido.</p>
                                  )}
                             </div>
                              <div className="space-y-1.5">
                                 <Label htmlFor="condo-whatsapp">WhatsApp Contato (Opcional)</Label>
                                 <Input
                                     id="condo-whatsapp"
                                     placeholder="+55 98 9..."
                                     value={condoWhatsapp}
                                     onChange={(e) => setCondoWhatsapp(e.target.value)} // TODO: Add Phone Mask
                                 />
                             </div>
                         </div>
                         <div className="space-y-1.5">
                              <Label htmlFor="condo-address">Endereço Completo*</Label>
                                <Input
                                     id="condo-address"
                                     placeholder="Rua, Número, Bairro, Cidade - UF"
                                     value={condoAddress}
                                     onChange={(e) => setCondoAddress(e.target.value)}
                                 />
                         </div>
                         {/* Add more fields as needed */}
                     </CardContent>
                     <CardFooter className="gap-2">
                         <Button onClick={handleSaveCondominium}>{editingCondo ? 'Salvar Alterações' : 'Adicionar Condomínio'}</Button>
                         <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                     </CardFooter>
                 </Card>
             )}

            <Card>
                <CardHeader>
                    <CardTitle>Condomínios Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                    {condominiums.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>CNPJ</TableHead>
                                    <TableHead>Endereço</TableHead>
                                    <TableHead>WhatsApp</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {condominiums.map((condo) => (
                                    <TableRow key={condo.id}>
                                        <TableCell className="font-medium">{condo.name}</TableCell>
                                        <TableCell>{condo.cnpj}</TableCell>
                                        <TableCell>{condo.address}</TableCell>
                                        <TableCell>{condo.whatsapp || 'N/A'}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditClick(condo)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                             <AlertDialog>
                                                 <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setCondoToRemove(condo)} title="Remover">
                                                      <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                      <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                        Tem certeza que deseja remover o condomínio "{condoToRemove?.name}"? Esta ação é crítica e pode afetar todos os dados associados (moradores, funcionários, ocorrências, etc.).
                                                      </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                      <AlertDialogCancel onClick={() => setCondoToRemove(null)}>Cancelar</AlertDialogCancel>
                                                      <AlertDialogAction onClick={handleRemoveCondominium} className={buttonVariants({ variant: "destructive" })}>Remover Condomínio</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground">Nenhum condomínio cadastrado sob sua gestão.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
