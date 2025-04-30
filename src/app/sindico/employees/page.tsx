
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Briefcase, PlusCircle, Phone, Calendar } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation';

// Basic CPF format validation (XXX.XXX.XXX-XX)
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

interface Employee {
    id: number; // Or string UUID
    name: string;
    cpf: string; // Unique identifier
    role: string; // e.g., Porteiro, Zelador, Limpeza, Jardineiro
    phone?: string;
    hireDate?: string; // Format YYYY-MM-DD
    terminationDate?: string; // Format YYYY-MM-DD (optional)
    isActive: boolean; // Indicates current employment
}

// TODO: Fetch employees for the specific condominium from backend
const fetchEmployees = async (condoId: number): Promise<Employee[]> => {
    console.log(`Fetching employees for condo ID: ${condoId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    // Replace with actual API call filtered by condoId
    return [
        { id: 20, name: "José Zelador", cpf: "555.555.555-55", role: "Zelador", phone: "(98) 95555-5555", hireDate: "2023-05-01", isActive: true },
        { id: 21, name: "Maria Portaria", cpf: "666.666.666-66", role: "Porteiro(a)", hireDate: "2024-02-15", isActive: true },
        { id: 22, name: "Antônio Limpeza", cpf: "777.777.777-77", role: "Auxiliar de Limpeza", isActive: false, hireDate: "2023-08-10", terminationDate: "2024-06-30" },
    ];
};

export default function SindicoEmployeesPage() {
    const searchParams = useSearchParams();
    const condoId = searchParams.get('condoId'); // Get condoId from URL

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    // Form State
    const [employeeName, setEmployeeName] = useState('');
    const [employeeCpf, setEmployeeCpf] = useState('');
    const [employeeRole, setEmployeeRole] = useState('');
    const [employeePhone, setEmployeePhone] = useState('');
    const [employeeHireDate, setEmployeeHireDate] = useState('');
    const [employeeTerminationDate, setEmployeeTerminationDate] = useState('');
    const [employeeIsActive, setEmployeeIsActive] = useState<boolean>(true);

    const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null);

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
                const data = await fetchEmployees(Number(condoId));
                setEmployees(data);
            } catch (error) {
                console.error("Failed to load employee data:", error);
                toast({ title: "Erro", description: "Não foi possível carregar os dados dos funcionários.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [condoId, toast]);

     const resetForm = () => {
        setEditingEmployee(null);
        setEmployeeName('');
        setEmployeeCpf('');
        setEmployeeRole('');
        setEmployeePhone('');
        setEmployeeHireDate('');
        setEmployeeTerminationDate('');
        setEmployeeIsActive(true);
        setShowAddForm(false);
    };

     const handleEditClick = (employee: Employee) => {
        setEditingEmployee(employee);
        setEmployeeName(employee.name);
        setEmployeeCpf(employee.cpf);
        setEmployeeRole(employee.role);
        setEmployeePhone(employee.phone || '');
        setEmployeeHireDate(employee.hireDate || '');
        setEmployeeTerminationDate(employee.terminationDate || '');
        setEmployeeIsActive(employee.isActive);
        setShowAddForm(true);
    };

    const handleSaveEmployee = async () => {
        if (!employeeName.trim() || !employeeCpf.trim() || !employeeRole.trim()) {
            toast({ title: "Erro", description: "Nome, CPF e Cargo são obrigatórios.", variant: "destructive" });
            return;
        }
         if (!cpfRegex.test(employeeCpf)) {
             toast({ title: "Erro", description: "Formato de CPF inválido (use XXX.XXX.XXX-XX).", variant: "destructive" });
             return;
         }
          // Ensure hire date is not after termination date if termination date exists
         if (employeeTerminationDate && employeeHireDate && new Date(employeeHireDate) > new Date(employeeTerminationDate)) {
             toast({ title: "Erro", description: "A data de contratação não pode ser posterior à data de demissão.", variant: "destructive" });
             return;
         }

        const employeeData = {
            name: employeeName.trim(),
            cpf: employeeCpf.trim(),
            role: employeeRole.trim(),
            phone: employeePhone.trim() || undefined,
            hireDate: employeeHireDate || undefined,
            terminationDate: employeeTerminationDate || undefined,
            isActive: employeeIsActive,
        };

        // --- BACKEND NOTE ---
        // Implement creation/update logic.
        // - Validate data rigorously.
        // - Check for existing employee with the same CPF for the current condo.
        // - Ensure dates are valid.
        // - Link to the correct condominium ID.
        // - Use prepared statements.

        if (editingEmployee) {
            // TODO: Call backend API to update employee
            console.log("Updating employee:", editingEmployee.id, employeeData);
            setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...employeeData, id: editingEmployee.id } : e));
            toast({ title: "Sucesso", description: "Dados do funcionário atualizados." });
        } else {
            // TODO: Call backend API to add employee
             // Check if this CPF already exists (can be done on backend)
             if (employees.some(e => e.cpf === employeeCpf)) {
                 toast({ title: "Erro", description: "Já existe um funcionário cadastrado com este CPF.", variant: "destructive" });
                 return;
             }
            const newId = Math.max(0, ...employees.map(e => e.id)) + 20; // Simulate ID
            const newEmployee = { ...employeeData, id: newId };
            console.log("Adding employee:", newEmployee);
            setEmployees([...employees, newEmployee]);
            toast({ title: "Sucesso", description: "Funcionário adicionado com sucesso." });
        }
        resetForm();
    };

     const handleRemoveEmployee = async () => {
        if (!employeeToRemove) return;

        // --- BACKEND NOTE ---
        // Implement actual removal logic.
        // - Verify permissions.
        // - This might just deactivate (set isActive=false, set terminationDate) rather than delete.
        // - Use prepared statements.
        console.log("Removing employee:", employeeToRemove.id);
        setEmployees(employees.filter(e => e.id !== employeeToRemove.id));

        toast({ title: "Sucesso", description: `Funcionário ${employeeToRemove.name} removido.` });
        setEmployeeToRemove(null); // Close the dialog
    };

    const getStatusBadge = (isActive: boolean, terminationDate?: string) => {
        if (isActive) {
            return <Badge variant="default">Ativo</Badge>;
        } else {
            return <Badge variant="secondary">Inativo {terminationDate ? `(${new Date(terminationDate + 'T00:00:00').toLocaleDateString('pt-BR')})` : ''}</Badge>;
        }
    }

    if (!condoId) {
        return <p className="text-destructive">ID do Condomínio não encontrado na URL.</p>;
    }
    if (isLoading) {
        return <p>Carregando funcionários...</p>; // TODO: Add Skeleton Loader
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gerenciar Funcionários</h1>
                    {/* TODO: Display Condo Name */}
                    <p className="text-muted-foreground">Adicione, edite ou remova funcionários do condomínio.</p>
                </div>
                 <Button onClick={() => { setShowAddForm(!showAddForm); if(editingEmployee) resetForm(); }}>
                     {showAddForm ? 'Cancelar' : <><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Funcionário</>}
                 </Button>
            </div>

             {showAddForm && (
                 <Card>
                     <CardHeader>
                         <CardTitle>{editingEmployee ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                             <div className="space-y-1.5">
                                 <Label htmlFor="emp-name">Nome Completo*</Label>
                                 <Input id="emp-name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="emp-cpf">CPF*</Label>
                                 <Input
                                     id="emp-cpf"
                                     placeholder="000.000.000-00"
                                     value={employeeCpf}
                                     onChange={(e) => setEmployeeCpf(e.target.value)} // TODO: Add CPF Mask
                                     disabled={!!editingEmployee} // Disable CPF edit
                                 />
                                 {editingEmployee && <p className="text-xs text-muted-foreground">CPF não pode ser alterado.</p>}
                                  {employeeCpf && !editingEmployee && !cpfRegex.test(employeeCpf) && (
                                     <p className="text-xs text-destructive">Formato inválido.</p>
                                  )}
                             </div>
                             <div className="space-y-1.5">
                                 <Label htmlFor="emp-role">Cargo*</Label>
                                 <Input id="emp-role" placeholder="Porteiro, Zelador, etc." value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)} />
                             </div>
                             <div className="space-y-1.5">
                                  <Label htmlFor="emp-phone">Telefone (Opcional)</Label>
                                  <Input id="emp-phone" type="tel" placeholder="(XX) 9XXXX-XXXX" value={employeePhone} onChange={(e) => setEmployeePhone(e.target.value)} /> {/* TODO: Add Phone Mask */}
                              </div>
                               <div className="space-y-1.5">
                                  <Label htmlFor="emp-hire-date">Data de Contratação</Label>
                                  <Input id="emp-hire-date" type="date" value={employeeHireDate} onChange={(e) => setEmployeeHireDate(e.target.value)} />
                              </div>
                              <div className="space-y-1.5">
                                   <Label htmlFor="emp-status">Status*</Label>
                                    <Select value={employeeIsActive ? 'active' : 'inactive'} onValueChange={(val) => setEmployeeIsActive(val === 'active')}>
                                        <SelectTrigger id="emp-status">
                                           <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Ativo</SelectItem>
                                            <SelectItem value="inactive">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                               </div>
                               {/* Show Termination Date only if inactive */}
                               {!employeeIsActive && (
                                   <div className="space-y-1.5">
                                       <Label htmlFor="emp-termination-date">Data de Demissão</Label>
                                       <Input id="emp-termination-date" type="date" value={employeeTerminationDate} onChange={(e) => setEmployeeTerminationDate(e.target.value)} />
                                   </div>
                               )}
                         </div>
                     </CardContent>
                     <CardFooter className="gap-2">
                         <Button onClick={handleSaveEmployee}>{editingEmployee ? 'Salvar Alterações' : 'Adicionar Funcionário'}</Button>
                         <Button variant="outline" onClick={resetForm}>Cancelar</Button>
                     </CardFooter>
                 </Card>
             )}

            <Card>
                <CardHeader>
                    <CardTitle>Funcionários Cadastrados</CardTitle>
                     {/* TODO: Add filtering by status? */}
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        {employees.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Cargo</TableHead>
                                        <TableHead>CPF</TableHead>
                                        <TableHead>Telefone</TableHead>
                                        <TableHead>Contratação</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-medium">{employee.name}</TableCell>
                                            <TableCell>{employee.role}</TableCell>
                                            <TableCell>{employee.cpf}</TableCell>
                                            <TableCell>{employee.phone || 'N/A'}</TableCell>
                                            <TableCell>{employee.hireDate ? new Date(employee.hireDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                                            <TableCell>{getStatusBadge(employee.isActive, employee.terminationDate)}</TableCell>
                                            <TableCell className="text-right space-x-1">
                                                <Button variant="ghost" size="icon" title="Editar" onClick={() => handleEditClick(employee)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                 <AlertDialog>
                                                     <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" onClick={() => setEmployeeToRemove(employee)} title="Remover">
                                                          <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            Tem certeza que deseja remover o funcionário "{employeeToRemove?.name}" (CPF: {employeeToRemove?.cpf})? (A remoção pode ser lógica, mantendo o histórico).
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel onClick={() => setEmployeeToRemove(null)}>Cancelar</AlertDialogCancel>
                                                          <AlertDialogAction onClick={handleRemoveEmployee} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">Nenhum funcionário cadastrado para este condomínio.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
