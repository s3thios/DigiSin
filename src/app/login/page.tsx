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
    // Login States
    const [residentEmail, setResidentEmail] = useState('');
    const [residentPassword, setResidentPassword] = useState('');
    const [sindicoEmail, setSindicoEmail] = useState('');
    const [sindicoPassword, setSindicoPassword] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    // Registration States
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const resetRegisterForm = () => {
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
    }

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
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

        // --- SIMULATED AUTH ---
        let loginSuccess = false;
        let redirectPath = '/';

        if (type === 'resident' && email === 'residente@email.com' && password === 'senha123') {
            loginSuccess = true;
            redirectPath = '/resident/dashboard';
        } else if (type === 'sindico' && email === 'sindico@email.com' && password === 'sindico123') {
            loginSuccess = true;
            redirectPath = '/sindico/dashboard';
        } else if (type === 'admin' && email === 'admin@email.com' && password === 'admin123') {
            loginSuccess = true;
            redirectPath = '/admin/dashboard';
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

     const handleRegister = async () => {
        setIsLoading(true);

        // Validation
        if (!registerName.trim() || !registerEmail.trim() || !registerPassword || !registerConfirmPassword) {
            toast({ title: "Erro", description: "Preencha todos os campos de registro.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        if (!/\S+@\S+\.\S+/.test(registerEmail)) {
            toast({ title: "Erro", description: "Formato de email inválido.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        if (registerPassword.length < 8) {
            toast({ title: "Erro", description: "A senha deve ter pelo menos 8 caracteres.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        if (registerPassword !== registerConfirmPassword) {
            toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        console.log(`Attempting registration for: ${registerName} with email: ${registerEmail}`);

        // TODO: Implement actual registration logic here (e.g., Firebase createUserWithEmailAndPassword)
        // This might involve sending data to admin for approval before activating the account.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

         // --- SIMULATED REGISTRATION ---
         const registrationSuccess = true; // Simulate success
         // --- END SIMULATED REGISTRATION ---


        setIsLoading(false);

         if (registrationSuccess) {
            toast({ title: "Registro bem-sucedido!", description: "Sua conta foi criada. Faça o login." });
             resetRegisterForm();
             setIsRegistering(false); // Switch back to login view
             // Optionally prefill login email: setResidentEmail(registerEmail);
         } else {
             toast({
                 title: "Falha no Registro",
                 description: "Não foi possível criar a conta. Tente novamente.", // Add more specific errors from backend
                 variant: "destructive",
             });
         }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Tabs defaultValue="resident" className="w-full max-w-md">
                <div className="text-center mb-6">
                    {/* Logo or Title */}
                    <h1 className="text-3xl font-bold text-foreground">DigiCondo</h1>
                    <p className="text-muted-foreground">Acesse ou crie sua conta</p>
                </div>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="resident">Morador</TabsTrigger>
                    <TabsTrigger value="sindico">Síndico</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                {/* Resident Login/Register Tab */}
                <TabsContent value="resident">
                    <Card>
                        <CardHeader>
                            <CardTitle>{isRegistering ? 'Criar Conta de Morador' : 'Acesso do Morador'}</CardTitle>
                            <CardDescription>
                                {isRegistering ? 'Preencha seus dados para criar uma conta.' : 'Use seu email e senha cadastrados.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isRegistering ? (
                                <>
                                    <div className="space-y-1">
                                        <Label htmlFor="register-name">Nome Completo</Label>
                                        <Input
                                            id="register-name"
                                            placeholder="Seu nome completo"
                                            value={registerName}
                                            onChange={(e) => setRegisterName(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-email">Email</Label>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            placeholder="seu.email@exemplo.com"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-password">Senha</Label>
                                        <Input
                                            id="register-password"
                                            type="password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                                        <Input
                                            id="register-confirm-password"
                                            type="password"
                                            placeholder="Repita a senha"
                                            value={registerConfirmPassword}
                                            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                        />
                                         {registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword && (
                                             <p className="text-xs text-destructive">As senhas não coincidem.</p>
                                         )}
                                    </div>
                                    {/* TODO: Add fields for CPF, Block, Apartment if needed during initial registration, or handle later */}
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                             <Button
                                className="w-full"
                                onClick={() => isRegistering ? handleRegister() : handleLogin('resident')}
                                disabled={isLoading}
                            >
                                {isLoading ? (isRegistering ? 'Registrando...' : 'Entrando...') : (isRegistering ? 'Registrar' : 'Entrar')}
                            </Button>

                             {isRegistering ? (
                                 <Button variant="link" className="text-sm p-0 h-auto" onClick={() => { setIsRegistering(false); resetRegisterForm(); }} disabled={isLoading}>
                                     Já tem conta? Entrar
                                 </Button>
                             ) : (
                                 <>
                                     <Button variant="link" className="text-sm p-0 h-auto" disabled={isLoading}>
                                        Esqueceu sua senha?
                                     </Button>
                                     <Button variant="link" className="text-sm p-0 h-auto" onClick={() => { setIsRegistering(true); }} disabled={isLoading}>
                                         Não tem conta? Registre-se
                                     </Button>
                                 </>
                             )}
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
