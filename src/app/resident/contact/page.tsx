'use client'; // Required for Map component and potentially WhatsApp links

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { MapPin, Building, Phone, Globe } from 'lucide-react'; // Globe for Website/HQ
import { Button } from '@/components/ui/button';
// Assuming a simple Map component exists or will be created
// import MapComponent from '@/components/map-component'; // Placeholder

interface ContactInfo {
    name: string;
    address: string;
    // coordinates: { lat: number; lng: number }; // For map integration
    phone?: string;
    whatsapp?: string;
    isCondo: boolean;
}

const digisinHQ: ContactInfo = {
    name: "DigiCondo Sede",
    address: "Av. Exemplo, 123, Sala 45, Centro, São Luís - MA, 65000-000",
    // coordinates: { lat: -2.5307, lng: -44.3068 }, // Example coordinates for São Luís
    phone: "+55 (98) 3000-1000",
    isCondo: false,
};

// TODO: Fetch condominium data dynamically based on user's condo
const condominiums: ContactInfo[] = [
    {
        name: "Plaza das Flores IV",
        address: "Rua das Flores, 400, Bairro Jardim, São Luís - MA, 65000-001",
        // coordinates: { lat: -2.5350, lng: -44.3000 }, // Example coordinates
        whatsapp: "+5598987300672", // Raw number for WhatsApp link
        isCondo: true,
    },
    {
        name: "Plaza das Flores III",
        address: "Rua das Palmeiras, 300, Bairro Jardim, São Luís - MA, 65000-002",
        // coordinates: { lat: -2.5360, lng: -44.3010 }, // Example coordinates
        // whatsapp: "+5598XXXXXXXXX", // Add when provided
        isCondo: true,
    },
];

// Assume the user belongs to Plaza das Flores IV for filtering
const currentUserCondoName = "Plaza das Flores IV";
const userCondominium = condominiums.find(c => c.name === currentUserCondoName);

export default function ContactPage() {

    const openWhatsApp = (number?: string) => {
        if (!number) return;
        // Basic cleaning - remove non-digits
        const cleanedNumber = number.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanedNumber}`, '_blank');
    };

     // Placeholder Map Component - Replace with actual implementation if available
     const MapComponent = ({ address }: { address: string }) => (
        <div className="h-48 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-sm">
            Mapa de "{address.split(',')[0]}" (Integração Pendente)
            {/* TODO: Integrate @vis.gl/react-google-maps here */}
        </div>
     );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Contatos Úteis</h1>
            <p className="text-muted-foreground">Encontre informações de contato da administração e do seu condomínio.</p>

            {/* Digisin HQ Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        {digisinHQ.name}
                    </CardTitle>
                    <CardDescription>Administração Geral DigiCondo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                         <MapPin className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
                         <p className="text-sm">{digisinHQ.address}</p>
                    </div>
                     {digisinHQ.phone && (
                        <div className="flex items-center gap-2">
                             <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                             <p className="text-sm">{digisinHQ.phone}</p>
                        </div>
                     )}
                     {/* <MapComponent address={digisinHQ.address} /> */}
                </CardContent>
            </Card>

            {/* User's Condominium Card */}
            {userCondominium && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary" />
                            {userCondominium.name}
                        </CardTitle>
                        <CardDescription>Informações do seu condomínio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
                            <p className="text-sm">{userCondominium.address}</p>
                        </div>
                         {userCondominium.whatsapp && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" /> {/* Using Phone icon for WhatsApp */}
                                <Button variant="link" className="p-0 h-auto text-sm" onClick={() => openWhatsApp(userCondominium.whatsapp)}>
                                    Contatar via WhatsApp ({userCondominium.whatsapp})
                                </Button>
                            </div>
                         )}
                        {/* <MapComponent address={userCondominium.address} /> */}
                    </CardContent>
                </Card>
            )}

            {/* Optionally list other managed condos for admins/sindico */}

        </div>
    );
}
