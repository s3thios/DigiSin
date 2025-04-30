'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Save } from 'lucide-react';

interface Fees {
    partyHall: number;
    rescheduleFee?: number; // Optional fee
    // Add other potential fees here
}

// Sample data - replace with actual data fetching
const initialFees: Fees = {
    partyHall: 150.00,
    // rescheduleFee: 50.00,
};

export default function AdminFeesPage() {
    const [fees, setFees] = useState<Fees>(initialFees);
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Ensure only numbers and one decimal point are entered
        const numericValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        setFees(prev => ({
            ...prev,
            [name]: numericValue === '' ? '' : parseFloat(numericValue) // Store as number or empty string
        }));
    };

     const handleSaveFees = async () => {
        // Validate if values are valid numbers
        if (isNaN(fees.partyHall) || fees.partyHall <= 0) {
             toast({ title: "Erro", description: "Valor inválido para a Taxa do Salão de Festas.", variant: "destructive" });
             return;
        }
         if (fees.rescheduleFee !== undefined && (isNaN(fees.rescheduleFee) || fees.rescheduleFee < 0)) {
            toast({ title: "Erro", description: "Valor inválido para a Taxa de Reagendamento.", variant: "destructive" });
            return;
        }


        // TODO: Implement actual save logic (send data to backend)
        console.log("Saving fees:", fees);
        // Simulate saving
        initialFees.partyHall = fees.partyHall; // Update the initial for next load (temporary)
        if (fees.rescheduleFee !== undefined) initialFees.rescheduleFee = fees.rescheduleFee;

        toast({ title: "Sucesso", description: "Taxas atualizadas com sucesso." });
        setIsEditing(false); // Exit editing mode
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Taxas</h1>
            <p className="text-muted-foreground">Ajuste os valores das taxas cobradas no condomínio.</p>

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                     <div>
                        <CardTitle>Taxas de Reserva e Serviços</CardTitle>
                        <CardDescription>Edite os valores das taxas aplicáveis.</CardDescription>
                     </div>
                     {!isEditing && (
                         <Button variant="outline" onClick={() => setIsEditing(true)}>Editar Taxas</Button>
                     )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                         <div className="space-y-1.5">
                            <Label htmlFor="partyHall">Taxa Salão de Festas (R$)*</Label>
                             <div className="relative">
                                 <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                 <Input
                                    id="partyHall"
                                    name="partyHall"
                                    type="number" // Use number for better mobile keyboard, but handle input carefully
                                    step="0.01"
                                    min="0"
                                    value={fees.partyHall === '' ? '' : fees.partyHall} // Handle empty string for input control
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className="pl-8"
                                />
                            </div>
                         </div>

                          {/* Optional Reschedule Fee */}
                         <div className="space-y-1.5">
                            <Label htmlFor="rescheduleFee">Taxa de Reagendamento (R$) (Opcional)</Label>
                             <div className="relative">
                                 <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                 <Input
                                    id="rescheduleFee"
                                    name="rescheduleFee"
                                     type="number"
                                     step="0.01"
                                     min="0"
                                    value={fees.rescheduleFee === undefined || fees.rescheduleFee === '' ? '' : fees.rescheduleFee}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    placeholder="Deixe em branco se não aplicável"
                                    className="pl-8"
                                />
                             </div>
                         </div>

                         {/* Add other fees here */}

                    </div>
                     {!isEditing && (
                         <p className="text-xs text-muted-foreground">Clique em "Editar Taxas" para modificar os valores.</p>
                     )}
                </CardContent>
                 {isEditing && (
                    <CardFooter className="gap-2">
                         <Button onClick={handleSaveFees}>
                             <Save className="mr-2 h-4 w-4"/> Salvar Alterações
                         </Button>
                         <Button variant="outline" onClick={() => { setFees(initialFees); setIsEditing(false); }}>Cancelar</Button>
                    </CardFooter>
                 )}
            </Card>
        </div>
    );
}
