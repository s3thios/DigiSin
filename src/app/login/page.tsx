'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // Use App Router's router

export default function LoginPage() {
    const [residentEmail, setResidentEmail] = useState('');
    const [residentPassword, setResidentPassword] = useState('');
    const [sindicoEmail, setSindicoEmail] = useState('');
    const [sindicoPassword, setSindicoPassword] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async (type: 'resident' | 'sindico' | 'admin') => {
        setIsLoading(true);
        let email = '';
        let password = '';

        if (type === 'resident') {
            email = residentEmail;
            password = residentPassword;
        } else if (type === 'sindico') {
            email = sindicoEmail;
            password = sindicoPassword;
        } else { // admin
            email = adminEmail;
            password = adminPassword;
        }

        console.log(`Attempting ${type} login with email: ${email}`);

        // TODO: Implement actual authentication logic here using Firebase Auth or similar
        // Replace this setTimeout with your actual API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // --- SIMULATED AUTH ---
        let loginSuccess = false;
        let redirectPath = '/';

        if (type === 'resident' && email === 'residente@email.com' && password === 'senha123') {
            loginSuccess = true;
            redirectPath = '/resident/dashboard';
            // TODO: Set user session/context for resident
        } else if (type === 'sindico' && email === 'sindico@email.com' && password === 'sindico123') {
            loginSuccess = true;
            redirectPath = '/sindico/dashboard'; // Redirect to sindico dashboard
            // TODO: Set user session/context for sindico (with their managed condos)
        } else if (type === 'admin' && email === 'admin@email.com' && password === 'admin123') {
            loginSuccess = true;
            redirectPath = '/admin/dashboard'; // Redirect to general admin dashboard
            // TODO: Set user session/context for admin
        }
        // --- END SIMULATED AUTH ---

        setIsLoading(false);

        if (loginSuccess) {
            toast({ title: "Login bem-sucedido!", description: "Redirecionando..." });
            router.push(redirectPath);
        } else {
            toast({
                title: "Falha no Login",
                description: "Email ou senha incorretos. Tente novamente.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Tabs defaultValue="resident" className="w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground">DigiCondo</h1>
                    <p className="text-muted-foreground">Acesse sua conta</p>
                </div>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="resident">Morador</TabsTrigger>
                    <TabsTrigger value="sindico">Síndico</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                {/* Resident Login Tab */}
                <TabsContent value="resident">
                    <Card>
                        <CardHeader>
                            <CardTitle>Acesso do Morador</CardTitle>
                            <CardDescription>Use seu email e senha cadastrados.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="resident-email">Email</Label>
                                <Input
                                    id="resident-email"
                                    type="email"
                                    placeholder="seu.email@exemplo.com"
                                    value={residentEmail}
                                    onChange={(e) => setResidentEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="resident-password">Senha</Label>
                                <Input
                                    id="resident-password"
                                    type="password"
                                    value={residentPassword}
                                    onChange={(e) => setResidentPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" onClick={() => handleLogin('resident')} disabled={isLoading}>
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                            <Button variant="link" className="text-sm p-0 h-auto" disabled={isLoading}>
                                Esqueceu sua senha?
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Síndico Login Tab */}
                <TabsContent value="sindico">
                     <Card>
                        <CardHeader>
                            <CardTitle>Acesso do Síndico</CardTitle>
                            <CardDescription>Login para síndicos de condomínios.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="sindico-email">Email</Label>
                                <Input
                                    id="sindico-email"
                                    type="email"
                                    placeholder="sindico@email.com"
                                    value={sindicoEmail}
                                    onChange={(e) => setSindicoEmail(e.target.value)}
                                    disabled={isLoading}
                                 />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="sindico-password">Senha</Label>
                                <Input
                                    id="sindico-password"
                                    type="password"
                                    value={sindicoPassword}
                                    onChange={(e) => setSindicoPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" onClick={() => handleLogin('sindico')} disabled={isLoading}>
                                 {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                             <Button variant="link" className="text-sm p-0 h-auto" disabled={isLoading}>
                                Esqueceu sua senha?
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Admin Login Tab */}
                 <TabsContent value="admin">
                     <Card>
                        <CardHeader>
                            <CardTitle>Acesso Admin</CardTitle>
                            <CardDescription>Login para administradores do sistema DigiCondo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="admin-email">Email</Label>
                                <Input
                                    id="admin-email"
                                    type="email"
                                    placeholder="admin@digicondo.com"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    disabled={isLoading}
                                 />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="admin-password">Senha</Label>
                                <Input
                                    id="admin-password"
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full" onClick={() => handleLogin('admin')} disabled={isLoading}>
                                 {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                             <Button variant="link" className="text-sm p-0 h-auto" disabled={isLoading}>
                                Esqueceu sua senha?
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
