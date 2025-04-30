'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, UserPlus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


interface Visitor {
  id: number;
  name: string;
  cpf: string; // Or other document type
  vehiclePlate?: string; // Optional
}

// Sample data - replace with actual data fetching/state management
const initialVisitors: Visitor[] = [
    { id: 1, name: "João Visitante", cpf: "111.222.333-44", vehiclePlate: "BRA1B34" },
    { id: 2, name: "Maria Amiga", cpf: "555.666.777-88" },
];


export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [newVisitorName, setNewVisitorName] = useState('');
  const [newVisitorCpf, setNewVisitorCpf] = useState('');
  const [newVisitorPlate, setNewVisitorPlate] = useState('');
  const [visitorToRemove, setVisitorToRemove] = useState<Visitor | null>(null);

  const { toast } = useToast();

  const handleAddVisitor = async () => {
    if (!newVisitorName.trim() || !newVisitorCpf.trim()) {
      toast({ title: "Erro", description: "Preencha o nome e o CPF do visitante.", variant: "destructive" });
      return;
    }

    // Basic CPF format validation (XXX.XXX.XXX-XX) - Needs improvement for real validation
     if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(newVisitorCpf)) {
         toast({ title: "Erro", description: "Formato de CPF inválido. Use XXX.XXX.XXX-XX.", variant: "destructive" });
         return;
     }

    // Basic Plate validation (Mercosul or Old) - Needs improvement
    if (newVisitorPlate.trim() && !/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}-?[0-9]{4}$/i.test(newVisitorPlate)) {
         toast({ title: "Erro", description: "Formato de placa inválido.", variant: "destructive" });
         return;
    }


    // TODO: Implement actual submission logic (send to backend)
    const newId = Math.max(0, ...visitors.map(v => v.id)) + 1;
    const newVisitor: Visitor = {
        id: newId,
        name: newVisitorName,
        cpf: newVisitorCpf,
        vehiclePlate: newVisitorPlate.trim() || undefined,
    };
    console.log("Adding visitor:", newVisitor);
    setVisitors([...visitors, newVisitor]);


    toast({ title: "Sucesso", description: "Visitante adicionado com sucesso." });
    setNewVisitorName('');
    setNewVisitorCpf('');
    setNewVisitorPlate('');
  };

  const handleRemoveVisitor = async () => {
    if (!visitorToRemove) return;

    // TODO: Implement actual removal logic (send to backend)
    console.log("Removing visitor:", visitorToRemove.id);
    setVisitors(visitors.filter(v => v.id !== visitorToRemove.id));

    toast({ title: "Sucesso", description: `Visitante ${visitorToRemove.name} removido.` });
    setVisitorToRemove(null); // Close the dialog
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Cadastro de Visitantes</h1>
      <p className="text-muted-foreground">Gerencie a lista de visitantes autorizados a entrar na sua unidade.</p>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Visitante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className="space-y-1.5">
                  <Label htmlFor="visitor-name">Nome Completo</Label>
                  <Input
                    id="visitor-name"
                    placeholder="Nome do Visitante"
                    value={newVisitorName}
                    onChange={(e) => setNewVisitorName(e.target.value)}
                  />
               </div>
                <div className="space-y-1.5">
                  <Label htmlFor="visitor-cpf">CPF</Label>
                  <Input
                    id="visitor-cpf"
                    placeholder="000.000.000-00"
                    value={newVisitorCpf}
                    onChange={(e) => setNewVisitorCpf(e.target.value)} // TODO: Add CPF mask
                  />
               </div>
                <div className="space-y-1.5">
                  <Label htmlFor="visitor-plate">Placa do Veículo (Opcional)</Label>
                  <Input
                    id="visitor-plate"
                    placeholder="AAA-1234 ou BRA1B34"
                    value={newVisitorPlate}
                    onChange={(e) => setNewVisitorPlate(e.target.value.toUpperCase())} // TODO: Add plate mask
                  />
               </div>
           </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddVisitor}>
            <UserPlus className="mr-2 h-4 w-4" /> Adicionar Visitante
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visitantes Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {visitors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell className="font-medium">{visitor.name}</TableCell>
                    <TableCell>{visitor.cpf}</TableCell>
                    <TableCell>{visitor.vehiclePlate || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" onClick={() => setVisitorToRemove(visitor)}>
                                 <Trash2 className="h-4 w-4 text-destructive" />
                               </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Tem certeza que deseja remover o visitante "{visitorToRemove?.name}" da lista de autorizados?
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel onClick={() => setVisitorToRemove(null)}>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={handleRemoveVisitor} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                               </AlertDialogFooter>
                           </AlertDialogContent>
                       </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground">Nenhum visitante cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button"
