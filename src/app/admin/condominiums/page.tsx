'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Building, PlusCircle, MapPin, Phone } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Condominium {
    id: number;
    name: string;
    address: string;
    whatsapp?: string;
    // Add other relevant fields like CNPJ, number of units etc.
}

// Sample data - replace with actual data fetching
const initialCondominiums: Condominium[] = [
    { id: 1, name: "Plaza das Flores IV", address: "Rua das Flores, 400, Bairro Jardim, São Luís - MA", whatsapp: "+5598987300672" },
    { id: 2, name: "Plaza das Flores III", address: "Rua das Palmeiras, 300, Bairro Jardim, São Luís - MA", /* whatsapp: "+5598XXXXXXXXX" */ },
];


export default function CondominiumsPage() {
    const [condominiums, setCondominiums] = useState<Condominium[]>(initialCondominiums);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCondoName, setNewCondoName] = useState('');
    const [newCondoAddress, setNewCondoAddress] = useState('');
    const [newCondoWhatsapp, setNewCondoWhatsapp] = useState('');
    const [condoToRemove, setCondoToRemove] = useState<Condominium | null>(null);
    // TODO: State for editing existing condo

    const { toast } = useToast();

    const handleAddCondominium = async () => {
        if (!newCondoName.trim() || !newCondoAddress.trim()) {
            toast({ title: "Erro", description: "Preencha o nome e o endereço do condomínio.", variant: "destructive" });
            return;
        }

        // TODO: Implement actual submission logic (send to backend)
        const newId = Math.max(0, ...condominiums.map(c => c.id)) + 1;
        const newCondo: Condominium = {
            id: newId,
            name: newCondoName.trim(),
            address: newCondoAddress.trim(),
            whatsapp: newCondoWhatsapp.trim() || undefined,
        };
        console.log("Adding condominium:", newCondo);
        setCondominiums([...condominiums, newCondo]);

        toast({ title: "Sucesso", description: "Condomínio adicionado com sucesso." });
        setNewCondoName('');
        setNewCondoAddress('');
        setNewCondoWhatsapp('');
        setShowAddForm(false); // Hide form after adding
    };

     const handleRemoveCondominium = async () => {
        if (!condoToRemove) return;

        // TODO: Implement actual removal logic (send to backend)
        // Be careful! Removing a condo might require removing associated residents, etc.
        console.log("Removing condominium:", condoToRemove.id);
        setCondominiums(condominiums.filter(c => c.id !== condoToRemove.id));

        toast({ title: "Sucesso", description: `Condomínio ${condoToRemove.name} removido.` });
        setCondoToRemove(null); // Close the dialog
    };

     // TODO: Implement handleEditCondominium function

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Condomínios</h1>
                    <p className="text-muted-foreground">Adicione, edite ou remova os condomínios sob sua gestão.</p>
                </div>
                 <Button onClick={() => setShowAddForm(!showAddForm)}>
                     {showAddForm ? 'Cancelar' : <><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Condomínio</>}
                 </Button>
            </div>

             {showAddForm && (
                 <Card>
                     <CardHeader>
                         <CardTitle>Adicionar Novo Condomínio</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                         <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                 <Label htmlFor="condo-name">Nome do Condomínio</Label>
                                 <Input
                                     id="condo-name"
                                     placeholder="Ex: Plaza das Flores IV"
                                     value={newCondoName}
                                     onChange={(e) => setNewCondoName(e.target.value)}
                                 />
                             </div>
                              <div className="space-y-1.5">
                                 <Label htmlFor="condo-whatsapp">WhatsApp (Opcional)</Label>
                                 <Input
                                     id="condo-whatsapp"
                                     placeholder="+55 98 9..."
                                     value={newCondoWhatsapp}
                                     onChange={(e) => setNewCondoWhatsapp(e.target.value)}
                                 />
                             </div>
                         </div>
                         <div className="space-y-1.5">
                              <Label htmlFor="condo-address">Endereço Completo</Label>
                                <Input
                                     id="condo-address"
                                     placeholder="Rua, Número, Bairro, Cidade - UF"
                                     value={newCondoAddress}
                                     onChange={(e) => setNewCondoAddress(e.target.value)}
                                 />
                         </div>
                         {/* Add more fields as needed (CNPJ, etc.) */}
                     </CardContent>
                     <CardFooter>
                         <Button onClick={handleAddCondominium}>Salvar Condomínio</Button>
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
                                    <TableHead>Endereço</TableHead>
                                    <TableHead>WhatsApp</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {condominiums.map((condo) => (
                                    <TableRow key={condo.id}>
                                        <TableCell className="font-medium">{condo.name}</TableCell>
                                        <TableCell>{condo.address}</TableCell>
                                        <TableCell>{condo.whatsapp || 'N/A'}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon" title="Editar" /* onClick={() => handleEditClick(condo)} */ >
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
                                                        Tem certeza que deseja remover o condomínio "{condoToRemove?.name}"? Esta ação pode ser irreversível e afetar dados associados.
                                                      </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                      <AlertDialogCancel onClick={() => setCondoToRemove(null)}>Cancelar</AlertDialogCancel>
                                                      <AlertDialogAction onClick={handleRemoveCondominium} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground">Nenhum condomínio cadastrado.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";
