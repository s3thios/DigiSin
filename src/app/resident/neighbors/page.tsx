import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Car, PawPrint } from 'lucide-react'; // Icons for vehicle/pet indication

// Sample data - replace with actual data fetching for the specific condominium
// IMPORTANT: Filter data based on logged-in user's condominium
const neighbors = [
  { id: 1, firstName: "Carlos", block: "A", apartment: "101", status: "Proprietário", hasVehicle: true, hasPet: false, vehiclePlates: ["ABC1D23"] },
  { id: 2, firstName: "Fernanda", block: "A", apartment: "102", status: "Inquilino", hasVehicle: false, hasPet: true },
  { id: 3, firstName: "Roberto", block: "B", apartment: "201", status: "Proprietário", hasVehicle: true, hasPet: true, vehiclePlates: ["XYZ9W87", "DEF4E56"] },
  { id: 4, firstName: "Juliana", block: "B", apartment: "202", status: "Proprietário", hasVehicle: false, hasPet: false },
  { id: 5, firstName: "Marcos", block: "C", apartment: "301", status: "Inquilino", hasVehicle: true, hasPet: false, vehiclePlates: ["GHI7F89"] },
];

export default function NeighborsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Vizinhos</h1>
      <p className="text-muted-foreground">Veja quem são seus vizinhos no condomínio.</p>

      <Card>
        <CardHeader>
          <CardTitle>Moradores do Seu Condomínio</CardTitle>
           <CardDescription>Somente informações básicas são exibidas para preservar a privacidade.</CardDescription>
        </CardHeader>
        <CardContent>
          {neighbors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {neighbors.map((neighbor) => (
                <Card key={neighbor.id} className="overflow-hidden">
                   <CardContent className="p-4 flex flex-col items-center text-center">
                     <Avatar className="h-16 w-16 mb-3">
                        {/* Placeholder image - Ideally fetch user's actual picture */}
                        <AvatarImage src={`https://picsum.photos/100/100?random=${neighbor.id}`} alt={neighbor.firstName} data-ai-hint="person resident" />
                        <AvatarFallback>{neighbor.firstName.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <p className="font-semibold text-foreground">{neighbor.firstName}</p>
                      <p className="text-sm text-muted-foreground">
                         Bloco {neighbor.block} - Apto {neighbor.apartment}
                      </p>
                       <Badge variant="secondary" className="mt-1 mb-2">{neighbor.status}</Badge>
                       <div className="flex gap-2 items-center justify-center text-muted-foreground">
                            {neighbor.hasVehicle && (
                                <div title={`Veículo(s): ${neighbor.vehiclePlates?.join(', ') ?? ''}`}>
                                    <Car className="h-4 w-4" />
                                </div>
                             )}
                            {neighbor.hasPet && <PawPrint className="h-4 w-4" title="Possui Pet" />}
                       </div>
                        {neighbor.vehiclePlates && neighbor.vehiclePlates.length > 0 && (
                             <p className="text-xs text-muted-foreground mt-1 truncate w-full" title={neighbor.vehiclePlates.join(', ')}>
                                Placa(s): {neighbor.vehiclePlates.join(', ')}
                             </p>
                        )}
                   </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Não foi possível carregar a lista de vizinhos.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
