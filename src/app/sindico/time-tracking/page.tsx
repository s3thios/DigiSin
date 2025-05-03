
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, Filter, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { format, startOfMonth, endOfMonth, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// --- Data Structures ---
interface TimeEntry {
    id: string;
    employeeId: number;
    employeeName: string; // Denormalized for display
    date: string; // YYYY-MM-DD
    clockIn?: string; // HH:MM
    lunchOut?: string; // HH:MM
    lunchIn?: string; // HH:MM
    clockOut?: string; // HH:MM
    absenceReason?: string; // e.g., "Falta Justificada", "Atestado Médico"
    notes?: string;
}

interface EmployeeBasic {
    id: number;
    name: string;
    role: string;
}

// --- Fetching Functions (Placeholders) ---
// TODO: Fetch basic employee list for the specific condoId
const fetchCondoEmployeesBasic = async (condoId: number): Promise<EmployeeBasic[]> => {
    console.log(`Fetching basic employee list for condo ID: ${condoId}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    return [
        { id: 20, name: "José Zelador", role: "Zelador" },
        { id: 21, name: "Maria Portaria", role: "Porteiro(a)" },
        // Inactive employees might be excluded here depending on filter needs
    ];
};

// TODO: Fetch time entries for the specific condoId within a date range
const fetchTimeEntries = async (condoId: number, startDate: string, endDate: string, employeeId?: number): Promise<TimeEntry[]> => {
    console.log(`Fetching time entries for condo ${condoId} from ${startDate} to ${endDate}, employee: ${employeeId || 'all'}`);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay

    // Replace with actual API call filtered by condoId, dates, and optionally employeeId
    const sampleEntries: TimeEntry[] = [
        // José Zelador
        { id: 't1', employeeId: 20, employeeName: "José Zelador", date: '2024-07-29', clockIn: '08:01', lunchOut: '12:05', lunchIn: '13:03', clockOut: '17:05' },
        { id: 't2', employeeId: 20, employeeName: "José Zelador", date: '2024-07-30', clockIn: '07:58', lunchOut: '12:00', lunchIn: '13:00', clockOut: '17:01' },
        { id: 't3', employeeId: 20, employeeName: "José Zelador", date: '2024-07-31', absenceReason: 'Atestado Médico', notes: 'Entregue atestado para RH' },
        // Maria Portaria
        { id: 't4', employeeId: 21, employeeName: "Maria Portaria", date: '2024-07-29', clockIn: '13:55', clockOut: '22:05', notes: 'Turno da tarde' }, // No lunch break recorded
        { id: 't5', employeeId: 21, employeeName: "Maria Portaria", date: '2024-07-30', clockIn: '14:02', clockOut: '22:00', notes: 'Turno da tarde' },
    ];

    return sampleEntries.filter(entry =>
        (!employeeId || entry.employeeId === employeeId) &&
        entry.date >= startDate && entry.date <= endDate
    ).sort((a, b) => { // Sort by date, then name
       if (a.date !== b.date) return a.date.localeCompare(b.date);
       return a.employeeName.localeCompare(b.employeeName);
    });
};

// --- Utility Functions ---
const formatDateForAPI = (date: Date): string => format(date, 'yyyy-MM-dd');

// --- Component ---
export default function SindicoTimeTrackingPage() {
    const searchParams = useSearchParams();
    const condoIdParam = searchParams.get('condoId');
    const { toast } = useToast();

    const [employees, setEmployees] = useState<EmployeeBasic[]>([]);
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    // Fetch employees on initial load or condo change
    useEffect(() => {
        if (!condoIdParam) {
            toast({ title: "Erro", description: "Condomínio não especificado.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        const condoId = Number(condoIdParam);
        const loadEmployees = async () => {
             // Only set loading for employees if list is empty
             if (employees.length === 0) setIsLoading(true);
            try {
                const data = await fetchCondoEmployeesBasic(condoId);
                setEmployees(data);
            } catch (error) {
                console.error("Failed to load employee list:", error);
                toast({ title: "Erro", description: "Não foi possível carregar a lista de funcionários.", variant: "destructive" });
            } finally {
                 // Only stop loading if time entries are also loaded or failed
                 // setIsLoading(false); // Moved to the time entries useEffect
            }
        };
        loadEmployees();
         // Reset filters when condo changes
         setSelectedEmployeeId('all');
         setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
    }, [condoIdParam, toast]); // employees dependency removed to avoid loop

    // Fetch time entries when filters or condoId changes
    useEffect(() => {
        if (!condoIdParam || !dateRange.from || !dateRange.to) {
            // Don't fetch if condo or date range is missing
            return;
        }
        const condoId = Number(condoIdParam);
        const loadEntries = async () => {
            setIsLoading(true); // Set loading true when fetching entries
            try {
                const startDateStr = formatDateForAPI(dateRange.from!);
                const endDateStr = formatDateForAPI(dateRange.to!);
                const empId = selectedEmployeeId !== 'all' ? Number(selectedEmployeeId) : undefined;

                const data = await fetchTimeEntries(condoId, startDateStr, endDateStr, empId);
                setTimeEntries(data);
            } catch (error) {
                console.error("Failed to load time entries:", error);
                toast({ title: "Erro", description: "Não foi possível carregar os registros de ponto.", variant: "destructive" });
                setTimeEntries([]);
            } finally {
                setIsLoading(false); // Stop loading after fetching entries
            }
        };
        loadEntries();
    }, [condoIdParam, dateRange, selectedEmployeeId, toast]);


    // TODO: Handle Manual Entry/Correction (requires separate form/modal and backend endpoint)
    const handleManualEntry = () => {
        toast({ title: "Info", description: "Funcionalidade de entrada manual pendente." });
    }

    // TODO: Handle Export Data (requires backend endpoint to generate CSV/Excel)
     const handleExport = () => {
        toast({ title: "Info", description: "Funcionalidade de exportação pendente." });
    }

    const renderSkeletonRow = () => (
         <TableRow>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
         </TableRow>
    );

    if (!condoIdParam) {
        return <p className="text-destructive">ID do Condomínio não encontrado na URL.</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Ponto Eletrônico</h1>
            {/* TODO: Display Condo Name */}
            <p className="text-muted-foreground">Visualize e gerencie os registros de ponto dos funcionários.</p>

             {/* Filter Section */}
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filtros</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-end gap-4">
                    {/* Employee Filter */}
                     <div className="flex-1 min-w-[200px] space-y-1.5">
                        <Label htmlFor="filter-employee">Funcionário</Label>
                        <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                            <SelectTrigger id="filter-employee" className="w-full">
                                <SelectValue placeholder="Todos os Funcionários" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Funcionários</SelectItem>
                                {employees.map(emp => <SelectItem key={emp.id} value={emp.id.toString()}>{emp.name} ({emp.role})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Date Range Filter */}
                    <div className="flex-1 min-w-[280px] space-y-1.5">
                         <Label htmlFor="filter-date-range">Período</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="filter-date-range"
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal ${!dateRange.from && "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? (
                                  dateRange.to ? (
                                    <>
                                      {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{' '}
                                      {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                                    </>
                                  ) : (
                                    format(dateRange.from, "LLL dd, y", { locale: ptBR })
                                  )
                                ) : (
                                  <span>Selecione o período</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                     </div>
                      <div className="flex gap-2">
                          {/* Apply filters button is implicit via useEffect */}
                          {/* <Button onClick={loadEntries} disabled={isLoading}><Filter className="mr-2 h-4 w-4"/> Aplicar</Button> */}
                          <Button variant="outline" onClick={handleExport} disabled={isLoading}>
                              <Download className="mr-2 h-4 w-4" /> Exportar
                          </Button>
                           {/* <Button variant="outline" onClick={handleManualEntry} disabled={isLoading}>+ Entrada Manual</Button> */}
                      </div>
                </CardContent>
             </Card>

            {/* Time Entries Table */}
            <Card>
                 <CardHeader>
                    <CardTitle>Registros de Ponto</CardTitle>
                     <CardDescription>Exibindo registros para o período selecionado.</CardDescription>
                </CardHeader>
                <CardContent>
                      <div className="overflow-x-auto">
                         <Table>
                             <TableHeader>
                                 <TableRow>
                                     <TableHead>Data</TableHead>
                                     <TableHead>Funcionário</TableHead>
                                     <TableHead>Entrada</TableHead>
                                     <TableHead>Saída Almoço</TableHead>
                                     <TableHead>Volta Almoço</TableHead>
                                     <TableHead>Saída</TableHead>
                                     <TableHead>Ausência</TableHead>
                                     <TableHead>Observações</TableHead>
                                      {/* <TableHead className="text-right">Ações</TableHead> */}
                                 </TableRow>
                             </TableHeader>
                             <TableBody>
                                 {isLoading ? (
                                     <>
                                         {renderSkeletonRow()}
                                         {renderSkeletonRow()}
                                         {renderSkeletonRow()}
                                         {renderSkeletonRow()}
                                     </>
                                 ) : timeEntries.length > 0 ? (
                                     timeEntries.map((entry) => (
                                         <TableRow key={entry.id}>
                                             <TableCell>{format(parseISO(entry.date + 'T00:00:00'), 'dd/MM/yyyy')}</TableCell>
                                             <TableCell className="font-medium">{entry.employeeName}</TableCell>
                                             <TableCell>{entry.clockIn || '-'}</TableCell>
                                             <TableCell>{entry.lunchOut || '-'}</TableCell>
                                             <TableCell>{entry.lunchIn || '-'}</TableCell>
                                             <TableCell>{entry.clockOut || '-'}</TableCell>
                                             <TableCell>{entry.absenceReason || '-'}</TableCell>
                                             <TableCell>{entry.notes || '-'}</TableCell>
                                              {/* Add Edit/Delete actions if manual adjustments are allowed */}
                                              {/* <TableCell className="text-right"></TableCell> */}
                                         </TableRow>
                                     ))
                                 ) : (
                                     <TableRow>
                                         <TableCell colSpan={8} className="text-center text-muted-foreground py-4">Nenhum registro de ponto encontrado para os filtros aplicados.</TableCell>
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
