'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DollarSign, Users, Bell, Mail } from 'lucide-react'; // Example icons

export default function AdminSettingsPage() {

    // Add state and handlers for general settings if needed

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Configurações Gerais</h1>
            <p className="text-muted-foreground">Acesse as diferentes áreas de configuração do sistema.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <DollarSign className="h-5 w-5 text-primary"/> Taxas
                        </CardTitle>
                        <CardDescription>Gerencie as taxas de reserva e outros custos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild>
                           <Link href="/admin/settings/fees">Acessar Taxas</Link>
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Users className="h-5 w-5 text-primary"/> Usuários Admin
                        </CardTitle>
                        <CardDescription>Gerencie os usuários com acesso administrativo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild>
                           <Link href="/admin/settings/users">Gerenciar Usuários</Link>
                        </Button>
                    </CardContent>
                </Card>

                 {/* Placeholder for Notification Settings */}
                 <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Bell className="h-5 w-5 text-primary"/> Notificações
                        </CardTitle>
                        <CardDescription>Configure os modelos e gatilhos de notificação (Email, WhatsApp).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" disabled>Configurar Notificações (Em breve)</Button>
                    </CardContent>
                </Card>

                 {/* Placeholder for Email Integration Settings */}
                 {/* <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Mail className="h-5 w-5 text-primary"/> Integração de Email
                        </CardTitle>
                        <CardDescription>Configure o serviço de envio de emails.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" disabled>Configurar Email (Em breve)</Button>
                    </CardContent>
                </Card> */}

                 {/* Add more settings cards as needed */}

            </div>
        </div>
    );
}
