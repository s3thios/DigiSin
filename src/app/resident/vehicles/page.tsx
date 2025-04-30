'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Car, Bike, PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type VehicleType = 'car' | 'motorcycle' | 'bicycle';

interface Vehicle {
  id: number;
  type: VehicleType;
  plate?: string; // Required for car/motorcycle
  brand?: string;
  model?: string;
  color?: string;
}

// Sample data - replace with actual data fetching/state management
const initialVehicles: Vehicle[] = [
    { id: 1, type: "car", plate: "BRA1B34", brand: "Fiat", model: "Mobi", color: "Branco" },
    { id: 2, type: "motorcycle", plate: "XYZ9W87", brand: "Honda", model: "CG 160", color: "Vermelha" },
    { id: 3, type: "bicycle", brand: "Caloi", model: "Andes", color: "Preta" },
];


export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [newVehicleType, setNewVehicleType] = useState<VehicleType | undefined>(undefined);
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleBrand, setNewVehicleBrand] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehicleColor, setNewVehicleColor] = useState('');
  const [vehicleToRemove, setVehicleToRemove] = useState<Vehicle | null>(null);

  const { toast } = useToast();

  const handleAddVehicle = async () => {
    if (!newVehicleType) {
         toast({ title: "Erro", description: "Selecione o tipo de veículo.", variant: "destructive" });
         return;
    }
    if ((newVehicleType === 'car' || newVehicleType === 'motorcycle') && !newVehiclePlate.trim()) {
        toast({ title: "Erro", description: "A placa é obrigatória para carros e motos.", variant: "destructive" });
        return;
    }
     if (!newVehicleBrand.trim() || !newVehicleModel.trim() || !newVehicleColor.trim()) {
        toast({ title: "Erro", description: "Preencha marca, modelo e cor.", variant: "destructive" });
        return;
    }

    // Basic Plate validation (Mercosul or Old) - Needs improvement
    if ((newVehicleType === 'car' || newVehicleType === 'motorcycle') && !/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}-?[0-9]{4}$/i.test(newVehiclePlate)) {
         toast({ title: "Erro", description: "Formato de placa inválido.", variant: "destructive" });
         return;
    }

    // TODO: Implement actual submission logic (send to backend)
    const newId = Math.max(0, ...vehicles.map(v => v.id)) + 1;
    const newVehicle: Vehicle = {
        id: newId,
        type: newVehicleType,
        plate: (newVehicleType === 'car' || newVehicleType === 'motorcycle') ? newVehiclePlate.trim().toUpperCase() : undefined,
        brand: newVehicleBrand.trim(),
        model: newVehicleModel.trim(),
        color: newVehicleColor.trim(),
    };
    console.log("Adding vehicle:", newVehicle);
    setVehicles([...vehicles, newVehicle]);

    toast({ title: "Sucesso", description: "Veículo adicionado com sucesso." });
    setNewVehicleType(undefined);
    setNewVehiclePlate('');
    setNewVehicleBrand('');
    setNewVehicleModel('');
    setNewVehicleColor('');
  };

  const handleRemoveVehicle = async () => {
    if (!vehicleToRemove) return;

    // TODO: Implement actual removal logic (send to backend)
    console.log("Removing vehicle:", vehicleToRemove.id);
    setVehicles(vehicles.filter(v => v.id !== vehicleToRemove.id));

    toast({ title: "Sucesso", description: `Veículo ${getVehicleDescription(vehicleToRemove)} removido.` });
    setVehicleToRemove(null); // Close the dialog
  };

   const getVehicleIcon = (type: VehicleType) => {
     switch (type) {
       case 'car': return <Car className="h-4 w-4 mr-2" />;
       case 'motorcycle': return <Bike className="h-4 w-4 mr-2" />; // Using Bike icon for motorcycle
       case 'bicycle': return <Bike className="h-4 w-4 mr-2" />;
       default: return null;
     }
   };

    const getVehicleTypeName = (type: VehicleType) => {
     switch (type) {
       case 'car': return 'Carro';
       case 'motorcycle': return 'Moto';
       case 'bicycle': return 'Bicicleta';
       default: return '';
     }
   };

    const getVehicleDescription = (vehicle: Vehicle) => {
        if (vehicle.type === 'bicycle') {
            return `${vehicle.brand} ${vehicle.model}`;
        }
        return `${vehicle.plate} (${vehicle.brand} ${vehicle.model})`;
    }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Cadastro de Veículos</h1>
      <p className="text-muted-foreground">Gerencie os veículos (carros, motos, bicicletas) associados à sua unidade.</p>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Veículo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                    <Label htmlFor="vehicle-type">Tipo</Label>
                    <Select value={newVehicleType} onValueChange={(value) => setNewVehicleType(value as VehicleType)}>
                        <SelectTrigger id="vehicle-type">
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="car">Carro</SelectItem>
                            <SelectItem value="motorcycle">Moto</SelectItem>
                            <SelectItem value="bicycle">Bicicleta</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

               {(newVehicleType === 'car' || newVehicleType === 'motorcycle') && (
                  <div className="space-y-1.5">
                     <Label htmlFor="vehicle-plate">Placa</Label>
                     <Input
                       id="vehicle-plate"
                       placeholder="AAA-1234 ou BRA1B34"
                       value={newVehiclePlate}
                       onChange={(e) => setNewVehiclePlate(e.target.value.toUpperCase())}
                     />
                  </div>
               )}
               <div className="space-y-1.5">
                  <Label htmlFor="vehicle-brand">Marca</Label>
                  <Input
                    id="vehicle-brand"
                    placeholder="Ex: Fiat, Honda, Caloi"
                    value={newVehicleBrand}
                    onChange={(e) => setNewVehicleBrand(e.target.value)}
                  />
               </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vehicle-model">Modelo</Label>
                  <Input
                    id="vehicle-model"
                    placeholder="Ex: Mobi, CG 160, Andes"
                    value={newVehicleModel}
                    onChange={(e) => setNewVehicleModel(e.target.value)}
                  />
               </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vehicle-color">Cor</Label>
                  <Input
                    id="vehicle-color"
                    placeholder="Ex: Branco, Vermelha, Preta"
                    value={newVehicleColor}
                    onChange={(e) => setNewVehicleColor(e.target.value)}
                  />
               </div>
           </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddVehicle}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Veículo
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veículos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium flex items-center">
                        {getVehicleIcon(vehicle.type)}
                        {getVehicleTypeName(vehicle.type)}
                    </TableCell>
                    <TableCell>{vehicle.plate || 'N/A'}</TableCell>
                    <TableCell>{vehicle.brand}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.color}</TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" onClick={() => setVehicleToRemove(vehicle)}>
                                 <Trash2 className="h-4 w-4 text-destructive" />
                               </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   Tem certeza que deseja remover o veículo "{getVehicleDescription(vehicleToRemove ?? vehicle)}"?
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel onClick={() => setVehicleToRemove(null)}>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={handleRemoveVehicle} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                               </AlertDialogFooter>
                           </AlertDialogContent>
                       </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground">Nenhum veículo cadastrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";
