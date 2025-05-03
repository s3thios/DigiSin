
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Filter, Download, DollarSign, Edit, Check, X, FilePlus, Upload, Trash2 } from 'lucide-react'; // Added relevant icons
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";


// --- Data Structures ---
type PayrollStatus = 'pending' | 'processing' | 'paid' | 'error';

interface PayrollEntry {
    id: string; // Unique ID for this payroll run + employee
    employeeId: number;
    employeeName: string;
    employeeRole: string;
    monthYear: string; // YYYY-MM
    baseSalary: number;
    deductions: number; // Taxes, absences, etc.
    bonuses: number; // Overtime, performance, etc.
    netPayable: number;
    status: PayrollStatus;
    paymentDate?: string; // YYYY-MM-DD
    payslipUrl?: string; // Link to generated payslip PDF
    notes?: string;
}

interface EmployeeBasic {
    id: number;
    name: string;
    role: string;
    // Base salary might be fetched here or separately
    baseSalary?: number;
}

// --- Fetching Functions (Placeholders) ---
// TODO: Fetch basic employee list for the specific condoId (can reuse from time-tracking)
const fetchCondoEmployeesBasicPayroll = async (condoId: number): Promise<EmployeeBasic[]> => {
    console.log(`Fetching basic employee list for payroll, condo ID: ${condoId}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        { id: 20, name: "José Zelador", role: "Zelador", baseSalary: 2500.00 },
        { id: 21, name: "Maria Portaria", role: "Porteiro(a)", baseSalary: 2200.00 },
    ];
};

// TODO: Fetch payroll entries for the specific condoId and month/year
const fetchPayrollEntries = async (condoId: number, monthYear: string): Promise<PayrollEntry[]> => {
    console.log(`Fetching payroll entries for condo ${condoId}, month: ${monthYear}`);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay

    // Replace with actual API call filtered by condoId and monthYear
    // Calculate deductions/bonuses based on time entries, benefits, etc.
    const samplePayroll: PayrollEntry[] = [
        { id: `pay1-${monthYear}`, employeeId: 20, employeeName: "José Zelador", employeeRole: "Zelador", monthYear: monthYear, baseSalary: 2500.00, deductions: 350.50, bonuses: 50.00, netPayable: 2200.50, status: 'pending' },
        { id: `pay2-${monthYear}`, employeeId: 21, employeeName: "Maria Portaria", employeeRole: "Porteiro(a)", monthYear: monthYear, baseSalary: 2200.00, deductions: 280.00, bonuses: 0.00, netPayable: 1920.00, status: 'pending' },
    ];
    // Only return for the requested month/year (simulation)
    if (monthYear === format(new Date(), 'yyyy-MM')) {
        return samplePayroll.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
    }
    return []; // No data for other months in simulation
};

// TODO: Implement backend function to update payroll status (e.g., mark as paid)
const updatePayrollStatus = async (payrollEntryId: string, status: PayrollStatus, paymentDate?: string): Promise<boolean> => {
    console.log(`Updating payroll ${payrollEntryId} to ${status}, payment date: ${paymentDate || 'N/A'}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    // --- BACKEND NOTE ---
    // 1. Verify permissions.
    // 2. Update the status and paymentDate in the database.
    // 3. Use prepared statements.
    // 4. Return success/failure.
    return true;
}

// TODO: Implement backend function to generate/upload payslip
const uploadPayslip = async (payrollEntryId: string, file: File): Promise<{ payslipUrl: string }> => {
     console.log(`Uploading payslip for ${payrollEntryId}: ${file.name}`);
     await new Promise(resolve => setTimeout(resolve, 500));
     // --- BACKEND NOTE ---
     // 1. Validate file (PDF, size).
     // 2. Store securely.
     // 3. Update payroll record with the URL.
     // 4. Use prepared statements.
     return { payslipUrl: '#' }; // Return simulated URL
}

// TODO: Implement backend function to delete payslip
const deletePayslip = async (payrollEntryId: string): Promise<boolean> => {
    console.log(`Deleting payslip for ${payrollEntryId}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    // --- BACKEND NOTE ---
    // 1. Verify permissions.
    // 2. Delete file from storage.
    // 3. Remove URL from payroll record.
    // 4. Use prepared statements.
    return true;
}


// --- Component ---
export default function SindicoPayrollPage() {
    const searchParams = useSearchParams();
    const condoIdParam = searchParams.get('condoId');
    const { toast } = useToast();

    const [employees, setEmployees] = useState<EmployeeBasic[]>([]);
    const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date())); // Default to current month

    const [editingEntry, setEditingEntry] = useState<PayrollEntry | null>(null);
    const [editBonuses, setEditBonuses] = useState<number>(0);
    const [editDeductions, setEditDeductions] = useState<number>(0);
    const [editNotes, setEditNotes] = useState<string>('');

     const [payslipFile, setPayslipFile] = useState<File | null>(null);
     const [payslipUploadingFor, setPayslipUploadingFor] = useState<string | null>(null); // Payroll entry ID
     const [payslipDeletingFor, setPayslipDeletingFor] = useState<string | null>(null); // Payroll entry ID

    // Fetch employees on initial load or condo change
    useEffect(() => {
        if (!condoIdParam) {
            toast({ title: "Erro", description: "Condomínio não especificado.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        const condoId = Number(condoIdParam);
        const loadEmployees = async () => {
            try {
                const data = await fetchCondoEmployeesBasicPayroll(condoId);
                setEmployees(data);
            } catch (error) {
                console.error("Failed to load employee list:", error);
            }
        };
        loadEmployees();
         setSelectedMonth(startOfMonth(new Date())); // Reset month on condo change
    }, [condoIdParam, toast]);

    // Fetch payroll entries when month or condoId changes
    useEffect(() => {
        if (!condoIdParam) return;
        const condoId = Number(condoIdParam);
        const monthYearStr = format(selectedMonth, 'yyyy-MM');

        const loadPayroll = async () => {
            setIsLoading(true);
            try {
                const data = await fetchPayrollEntries(condoId, monthYearStr);
                setPayrollEntries(data);
            } catch (error) {
                console.error("Failed to load payroll entries:", error);
                toast({ title: "Erro", description: "Não foi possível carregar a folha de pagamento.", variant: "destructive" });
                setPayrollEntries([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadPayroll();
    }, [condoIdParam, selectedMonth, toast]);

    const handleEditClick = (entry: PayrollEntry) => {
        setEditingEntry(entry);
        setEditBonuses(entry.bonuses);
        setEditDeductions(entry.deductions);
        setEditNotes(entry.notes || '');
    };

    const handleCancelEdit = () => {
        setEditingEntry(null);
    };

     // TODO: Handle Payroll Save/Recalculate (needs backend logic)
    const handleSaveEdit = async () => {
        if (!editingEntry) return;
         // --- BACKEND NOTE ---
         // 1. Recalculate netPayable based on baseSalary, new deductions, new bonuses.
         // 2. Update the payroll entry in the database.
         // 3. Use prepared statements.
         console.log("Saving payroll edits for:", editingEntry.id, { deductions: editDeductions, bonuses: editBonuses, notes: editNotes });
          const newNetPayable = editingEntry.baseSalary + editBonuses - editDeductions; // Simplified calculation
         setPayrollEntries(payrollEntries.map(p =>
            p.id === editingEntry.id
             ? { ...p, deductions: editDeductions, bonuses: editBonuses, notes: editNotes, netPayable: newNetPayable }
             : p
         ));
         toast({ title: "Sucesso", description: "Ajustes salvos (simulado)." });
         setEditingEntry(null);
    }

    const handleMarkAsPaid = async (entryId: string) => {
         // --- BACKEND NOTE ---
         // Call the backend function to update status and payment date.
         const paymentDateStr = format(new Date(), 'yyyy-MM-dd');
         const success = await updatePayrollStatus(entryId, 'paid', paymentDateStr);
         if (success) {
             setPayrollEntries(payrollEntries.map(p =>
                p.id === entryId ? { ...p, status: 'paid', paymentDate: paymentDateStr } : p
             ));
             toast({ title: "Sucesso", description: "Pagamento marcado como realizado." });
         } else {
              toast({ title: "Erro", description: "Não foi possível marcar como pago.", variant: "destructive" });
         }
    }

    const handlePayslipFileChange = (event: React.ChangeEvent<HTMLInputElement>, entryId: string) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Basic PDF validation
            if (file.type !== 'application/pdf') {
                 toast({ title: "Erro", description: "Somente arquivos PDF são permitidos para holerites.", variant: "destructive" });
                 return;
            }
            setPayslipFile(file);
            setPayslipUploadingFor(entryId); // Track which entry we are uploading for
        } else {
            setPayslipFile(null);
            setPayslipUploadingFor(null);
        }
    };

     const handleUploadPayslip = async () => {
        if (!payslipFile || !payslipUploadingFor) return;
        try {
            const { payslipUrl } = await uploadPayslip(payslipUploadingFor, payslipFile);
            setPayrollEntries(payrollEntries.map(p =>
                p.id === payslipUploadingFor ? { ...p, payslipUrl: payslipUrl } : p
            ));
             toast({ title: "Sucesso", description: "Holerite enviado." });
        } catch (error) {
             toast({ title: "Erro", description: "Falha ao enviar holerite.", variant: "destructive" });
        } finally {
             setPayslipFile(null);
             setPayslipUploadingFor(null);
             // Clear file input visually
             const inputId = `payslip-upload-${payslipUploadingFor}`;
             const fileInput = document.getElementById(inputId) as HTMLInputElement;
             if (fileInput) fileInput.value = '';
        }
    }

     const handleDeletePayslip = async (entryId: string) => {
        setPayslipDeletingFor(entryId);
        try {
            const success = await deletePayslip(entryId);
            if (success) {
                setPayrollEntries(payrollEntries.map(p =>
                    p.id === entryId ? { ...p, payslipUrl: undefined } : p
                ));
                toast({ title: "Sucesso", description: "Holerite removido." });
            } else {
                 throw new Error("Backend deletion failed");
            }
        } catch (error) {
             toast({ title: "Erro", description: "Falha ao remover holerite.", variant: "destructive" });
        } finally {
             setPayslipDeletingFor(null);
        }
     }


    const getStatusBadge = (status: PayrollStatus) => {
        switch (status) {
            case 'pending': return <Badge variant="outline">Pendente</Badge>;
            case 'processing': return <Badge variant="secondary">Processando</Badge>;
            case 'paid': return <Badge variant="default"><Check className="mr-1 h-3 w-3"/> Pago</Badge>;
            case 'error': return <Badge variant="destructive">Erro</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

     const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const renderSkeletonRow = () => (
         <TableRow>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
         </TableRow>
    );

    if (!condoIdParam) {
        return <p className="text-destructive">ID do Condomínio não encontrado na URL.</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Folha de Pagamento</h1>
            {/* TODO: Display Condo Name */}
            <p className="text-muted-foreground">Gerencie os pagamentos dos funcionários do condomínio.</p>

            {/* Month Selector */}
            <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Selecionar Mês/Ano</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-end gap-4">
                     <div className="flex-1 min-w-[200px] space-y-1.5">
                        <Label htmlFor="month-select">Mês/Ano</Label>
                         {/* Simple month/year select for now. Could use Calendar Popover */}
                         <Input
                            id="month-select"
                            type="month"
                            value={format(selectedMonth, 'yyyy-MM')}
                            onChange={(e) => {
                                const date = parseISO(e.target.value + '-01T00:00:00'); // Set day to 01
                                if (isValid(date)) {
                                    setSelectedMonth(date);
                                }
                            }}
                         />
                    </div>
                     <Button variant="outline" onClick={handleExport} disabled={isLoading}>
                        <Download className="mr-2 h-4 w-4" /> Exportar Folha
                    </Button>
                </CardContent>
            </Card>

            {/* Payroll Table */}
            <Card>
                 <CardHeader>
                    <CardTitle>Folha - {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}</CardTitle>
                     <CardDescription>Visualize, ajuste e marque pagamentos como realizados.</CardDescription>
                </CardHeader>
                <CardContent>
                      <div className="overflow-x-auto">
                         <Table>
                             <TableHeader>
                                 <TableRow>
                                     <TableHead>Funcionário</TableHead>
                                     <TableHead>Cargo</TableHead>
                                     <TableHead>Sal. Base</TableHead>
                                     <TableHead>Bônus</TableHead>
                                     <TableHead>Deduções</TableHead>
                                     <TableHead>Líquido</TableHead>
                                     <TableHead>Status</TableHead>
                                     <TableHead>Holerite</TableHead>
                                     <TableHead className="text-right">Ações</TableHead>
                                 </TableRow>
                             </TableHeader>
                             <TableBody>
                                 {isLoading ? (
                                     <>
                                         {renderSkeletonRow()}
                                         {renderSkeletonRow()}
                                     </>
                                 ) : payrollEntries.length > 0 ? (
                                     payrollEntries.map((entry) => (
                                         editingEntry?.id === entry.id ? (
                                             // Editing Row
                                             <TableRow key={entry.id} className="bg-muted/50">
                                                 <TableCell className="font-medium">{entry.employeeName}</TableCell>
                                                 <TableCell>{entry.employeeRole}</TableCell>
                                                 <TableCell>{formatCurrency(entry.baseSalary)}</TableCell>
                                                 <TableCell>
                                                      <Input type="number" step="0.01" value={editBonuses} onChange={(e) => setEditBonuses(parseFloat(e.target.value) || 0)} className="h-8 w-24" />
                                                 </TableCell>
                                                  <TableCell>
                                                       <Input type="number" step="0.01" value={editDeductions} onChange={(e) => setEditDeductions(parseFloat(e.target.value) || 0)} className="h-8 w-24" />
                                                  </TableCell>
                                                 <TableCell>{formatCurrency(entry.baseSalary + editBonuses - editDeductions)}</TableCell>
                                                 <TableCell>{getStatusBadge(entry.status)}</TableCell>
                                                 <TableCell>
                                                     <Input type="text" placeholder="Notas..." value={editNotes} onChange={(e) => setEditNotes(e.target.value)} className="h-8 text-xs"/>
                                                 </TableCell>
                                                 <TableCell className="text-right space-x-1">
                                                     <Button size="sm" onClick={handleSaveEdit}><Check className="h-4 w-4"/></Button>
                                                     <Button size="sm" variant="ghost" onClick={handleCancelEdit}><X className="h-4 w-4"/></Button>
                                                 </TableCell>
                                             </TableRow>
                                         ) : (
                                             // Display Row
                                             <TableRow key={entry.id}>
                                                 <TableCell className="font-medium">{entry.employeeName}</TableCell>
                                                 <TableCell>{entry.employeeRole}</TableCell>
                                                 <TableCell>{formatCurrency(entry.baseSalary)}</TableCell>
                                                 <TableCell>{formatCurrency(entry.bonuses)}</TableCell>
                                                 <TableCell className="text-destructive">{formatCurrency(entry.deductions)}</TableCell>
                                                 <TableCell className="font-semibold">{formatCurrency(entry.netPayable)}</TableCell>
                                                 <TableCell>{getStatusBadge(entry.status)}</TableCell>
                                                 <TableCell className="space-y-1">
                                                      {entry.payslipUrl ? (
                                                          <div className="flex items-center gap-1">
                                                              <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                                                                  <a href={entry.payslipUrl} target="_blank" rel="noopener noreferrer">Ver Holerite</a>
                                                              </Button>
                                                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeletePayslip(entry.id)} disabled={payslipDeletingFor === entry.id} title="Remover Holerite">
                                                                   <Trash2 className="h-3 w-3 text-destructive"/>
                                                              </Button>
                                                          </div>
                                                      ) : (
                                                         <div className="flex items-center gap-1">
                                                            <Input
                                                                 id={`payslip-upload-${entry.id}`}
                                                                 type="file"
                                                                 accept=".pdf"
                                                                 onChange={(e) => handlePayslipFileChange(e, entry.id)}
                                                                 className="h-8 text-xs w-28"
                                                                 disabled={payslipUploadingFor === entry.id}
                                                            />
                                                             {payslipUploadingFor === entry.id && (
                                                                <Button size="sm" className="h-8" onClick={handleUploadPayslip} disabled={!payslipFile}>
                                                                    <Upload className="h-4 w-4"/>
                                                                </Button>
                                                             )}
                                                         </div>
                                                      )}
                                                 </TableCell>
                                                 <TableCell className="text-right space-x-1">
                                                      <Button variant="ghost" size="icon" title="Editar Bônus/Deduções" onClick={() => handleEditClick(entry)} disabled={entry.status === 'paid'}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                     <AlertDialog>
                                                         <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm" title="Marcar como Pago" disabled={entry.status !== 'pending'}>
                                                                 <DollarSign className="h-4 w-4" />
                                                            </Button>
                                                         </AlertDialogTrigger>
                                                         <AlertDialogContent>
                                                             <AlertDialogHeader>
                                                               <AlertDialogTitle>Confirmar Pagamento</AlertDialogTitle>
                                                               <AlertDialogDescription>
                                                                 Confirma que o pagamento de {formatCurrency(entry.netPayable)} para {entry.employeeName} foi realizado?
                                                               </AlertDialogDescription>
                                                             </AlertDialogHeader>
                                                             <AlertDialogFooter>
                                                               <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                               <AlertDialogAction onClick={() => handleMarkAsPaid(entry.id)}>Confirmar</AlertDialogAction>
                                                             </AlertDialogFooter>
                                                         </AlertDialogContent>
                                                     </AlertDialog>
                                                 </TableCell>
                                             </TableRow>
                                         )
                                     ))
                                 ) : (
                                     <TableRow>
                                         <TableCell colSpan={9} className="text-center text-muted-foreground py-4">Nenhum registro encontrado para este mês/ano.</TableCell>
                                     </TableRow>
                                 )}
                             </TableBody>
                         </Table>
                     </div>
                </CardContent>
            </Card>
        </div>
    );
}
