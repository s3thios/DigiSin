'use client'; // Required for Map component and potentially WhatsApp links

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { MapPin, Building, Phone, Globe, MessageSquare } from 'lucide-react'; // Globe for Website/HQ, MessageSquare for in-app
import { Button } from '@/components/ui/button';
// Assuming a simple Map component exists or will be created
// import MapComponent from '@/components/map-component'; // Placeholder

// Define a simple WhatsApp icon component (replace with lucide if available later)
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 448 512"
    {...props}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);


interface ContactInfo {
    name: string;
    address: string;
    // coordinates: { lat: number; lng: number }; // For map integration
    phone?: string; // General phone
    whatsapp?: string; // Specific WhatsApp number
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
// This should include the specific syndic's WhatsApp number for that condo
const condominiums: ContactInfo[] = [
    {
        name: "Plaza das Flores IV",
        address: "Rua das Flores, 400, Bairro Jardim, São Luís - MA, 65000-001",
        // coordinates: { lat: -2.5350, lng: -44.3000 }, // Example coordinates
        whatsapp: "+5598987300672", // Syndic's WhatsApp for Plaza IV
        phone: "+5598987300672", // General phone might be the same
        isCondo: true,
    },
    {
        name: "Plaza das Flores III",
        address: "Rua das Palmeiras, 300, Bairro Jardim, São Luís - MA, 65000-002",
        // coordinates: { lat: -2.5360, lng: -44.3010 }, // Example coordinates
        whatsapp: "+5598999999999", // Syndic's WhatsApp for Plaza III (EXAMPLE)
        isCondo: true,
    },
];

// Assume the user belongs to Plaza das Flores IV for filtering
const currentUserCondoName = "Plaza das Flores IV";
const userCondominium = condominiums.find(c => c.name === currentUserCondoName);

export default function ContactPage() {

    const openWhatsApp = (number?: string) => {
        if (!number) return;
        // Basic cleaning - remove non-digits, keep leading + if present
        const cleanedNumber = number.startsWith('+') ? '+' + number.replace(/\D/g, '') : number.replace(/\D/g, '');
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
            <p className="text-muted-foreground">Encontre informações de contato da administração e do seu condomínio. <br />
            <span className="font-semibold">Lembrete:</span> Para registros e acompanhamento, utilize preferencialmente o sistema de <a href="/resident/complaints" className="text-primary underline">Ocorrências/Tickets</a>. O contato direto é recomendado para urgências.
            </p>


            {/* User's Condominium Card */}
            {userCondominium && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary" />
                            {userCondominium.name} (Seu Condomínio)
                        </CardTitle>
                        <CardDescription>Contato direto com a administração local (Síndico/Zeladoria).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
                            <p className="text-sm">{userCondominium.address}</p>
                        </div>
                         {userCondominium.phone && (
                            <div className="flex items-center gap-2">
                                 <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                                 <p className="text-sm">Telefone Geral: {userCondominium.phone}</p>
                            </div>
                         )}
                         {userCondominium.whatsapp && (
                            <div className="flex items-center gap-2">
                                <WhatsAppIcon className="h-4 w-4 shrink-0 text-green-600" />
                                <Button variant="link" className="p-0 h-auto text-sm" onClick={() => openWhatsApp(userCondominium.whatsapp)}>
                                    Contatar Síndico via WhatsApp
                                </Button>
                            </div>
                         )}
                        {/* Option to open internal communication */}
                        <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 shrink-0 text-blue-600" />
                                <Button variant="link" className="p-0 h-auto text-sm" asChild>
                                    <a href="/resident/complaints">Abrir Ocorrência/Ticket (Recomendado)</a>
                                </Button>
                         </div>
                        {/* <MapComponent address={userCondominium.address} /> */}
                    </CardContent>
                     <CardFooter className="text-xs text-muted-foreground">
                        Priorize o sistema de ocorrências/tickets para comunicação formal e registrada.
                     </CardFooter>
                </Card>
            )}

             {/* Digisin HQ Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        {digisinHQ.name}
                    </CardTitle>
                    <CardDescription>Administração Geral DigiCondo (Desenvolvedor/Suporte Plataforma)</CardDescription>
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
                 <CardFooter className="text-xs text-muted-foreground">
                        Contato para suporte técnico da plataforma DigiCondo.
                 </CardFooter>
            </Card>

            {/* Optionally list other managed condos for admins/sindico */}

        </div>
    );
}
