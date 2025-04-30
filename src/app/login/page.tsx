
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // Use App Router's router

// Basic CPF format validation (XXX.XXX.XXX-XX)
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
// Basic CNPJ format validation (XX.XXX.XXX/XXXX-XX)
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export default function LoginPage() {
    // Login States
    const [residentCpf, setResidentCpf] = useState('');
    const [residentPassword, setResidentPassword] = useState('');
    const [sindicoCnpj, setSindicoCnpj] = useState('');
    const [sindicoPassword, setSindicoPassword] = useState('');
    const [adminCpf, setAdminCpf] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    // Registration States (Only for Resident)
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerCpf, setRegisterCpf] = useState(''); // Added CPF for registration
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const resetRegisterForm = () => {
        setRegisterName('');
        setRegisterEmail('');
        setRegisterCpf('');
        setRegisterPassword('');
        setRegisterConfirmPassword('');
    }

    const handleLogin = async (type: 'resident' | 'sindico' | 'admin') => {
        setIsLoading(true);
        let identifier = ''; // CPF or CNPJ
        let password = '';
        let validationError = '';

        if (type === 'resident') {
            identifier = residentCpf;
            password = residentPassword;
            if (!cpfRegex.test(identifier)) {
                validationError = 'Formato de CPF inválido (use XXX.XXX.XXX-XX).';
            }
        } else if (type === 'sindico') {
            identifier = sindicoCnpj;
            password = sindicoPassword;
             if (!cnpjRegex.test(identifier)) {
                 validationError = 'Formato de CNPJ inválido (use XX.XXX.XXX/XXXX-XX).';
             }
        } else { // admin
            identifier = adminCpf;
            password = adminPassword;
             if (!cpfRegex.test(identifier)) {
                 validationError = 'Formato de CPF inválido (use XXX.XXX.XXX-XX).';
             }
        }

        if (validationError) {
            toast({ title: "Erro de Validação", description: validationError, variant: "destructive" });
            setIsLoading(false);
            return;
        }

        console.log(`Attempting ${type} login with identifier: ${identifier}`);

        // --- BACKEND NOTE ---
        // Implement actual authentication logic here using Firebase Auth or similar.
        // Ensure the backend verifies credentials securely against the database.
        // Apply SQL injection protection (e.g., prepared statements) on the backend.
        // Implement rate limiting to prevent brute-force attacks.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

        // --- SIMULATED AUTH ---
        let loginSuccess = false;
        let redirectPath = '/';

        if (type === 'resident' && identifier === '111.111.111-11' && password === 'senha123') {
            loginSuccess = true;
            redirectPath = '/resident/dashboard';
        } else if (type === 'sindico' && identifier === '11.222.333/0001-44' && password === 'sindico123') {
            loginSuccess = true;
            redirectPath = '/sindico/dashboard';
        } else if (type === 'admin' && identifier === '999.999.999-99' && password === 'admin123') {
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
                description: "Identificador ou senha incorretos. Tente novamente.",
                variant: "destructive",
            });
        }
    };

     // Handles Resident Registration only
     const handleRegister = async () => {
        setIsLoading(true);

        // Validation
        if (!registerName.trim() || !registerEmail.trim() || !registerCpf.trim() || !registerPassword || !registerConfirmPassword) {
            toast({ title: "Erro", description: "Preencha todos os campos de registro.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
         if (!cpfRegex.test(registerCpf)) {
            toast({ title: "Erro", description: "Formato de CPF inválido (use XXX.XXX.XXX-XX).", variant: "destructive" });
            setIsLoading(false);
            return;
         }
        if (!/\S+@\S+\.\S+/.test(registerEmail)) {
            toast({ title: "Erro", description: "Formato de email inválido.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
         // Password Strength Check (Example: Minimum 8 chars, 1 number, 1 uppercase)
         const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
         if (!passwordStrengthRegex.test(registerPassword)) {
             toast({ title: "Erro", description: "A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula e um número.", variant: "destructive" });
             setIsLoading(false);
             return;
         }
        if (registerPassword !== registerConfirmPassword) {
            toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        console.log(`Attempting resident registration for: ${registerName} (CPF: ${registerCpf}) with email: ${registerEmail}`);

        // --- BACKEND NOTE ---
        // Implement actual registration logic here.
        // - Securely hash the password before storing.
        // - Verify CPF uniqueness and potentially link to condo unit based on admin pre-registration.
        // - Send verification email if needed.
        // - Ensure backend applies SQL injection protection.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

         // --- SIMULATED REGISTRATION ---
         const registrationSuccess = true; // Simulate success
         // --- END SIMULATED REGISTRATION ---


        setIsLoading(false);

         if (registrationSuccess) {
            toast({ title: "Registro bem-sucedido!", description: "Sua conta foi criada. Faça o login." });
             resetRegisterForm();
             setIsRegistering(false); // Switch back to login view
             setResidentCpf(registerCpf); // Pre-fill login CPF
         } else {
             toast({
                 title: "Falha no Registro",
                 description: "Não foi possível criar a conta. Verifique os dados ou contate o suporte.", // Add more specific errors from backend
                 variant: "destructive",
             });
         }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Tabs defaultValue="resident" className="w-full max-w-md">
                <div className="text-center mb-6">
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
                                {isRegistering ? 'Preencha seus dados para criar uma conta.' : 'Use seu CPF e senha cadastrados.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isRegistering ? (
                                <>
                                    {/* Registration Form (Resident) */}
                                    <div className="space-y-1">
                                        <Label htmlFor="register-name">Nome Completo*</Label>
                                        <Input
                                            id="register-name"
                                            placeholder="Seu nome completo"
                                            value={registerName}
                                            onChange={(e) => setRegisterName(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="register-cpf">CPF*</Label>
                                        <Input
                                            id="register-cpf"
                                            placeholder="000.000.000-00"
                                            value={registerCpf}
                                            onChange={(e) => setRegisterCpf(e.target.value)} // TODO: Add CPF mask
                                            disabled={isLoading}
                                            required
                                        />
                                         {registerCpf && !cpfRegex.test(registerCpf) && (
                                             <p className="text-xs text-destructive">Formato inválido.</p>
                                         )}
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-email">Email*</Label>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            placeholder="seu.email@exemplo.com"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-password">Senha*</Label>
                                        <Input
                                            id="register-password"
                                            type="password"
                                            placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número"
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-confirm-password">Confirmar Senha*</Label>
                                        <Input
                                            id="register-confirm-password"
                                            type="password"
                                            placeholder="Repita a senha"
                                            value={registerConfirmPassword}
                                            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                         {registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword && (
                                             <p className="text-xs text-destructive">As senhas não coincidem.</p>
                                         )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Login Form (Resident) */}
                                    <div className="space-y-1">
                                        <Label htmlFor="resident-cpf">CPF</Label>
                                        <Input
                                            id="resident-cpf"
                                            placeholder="000.000.000-00"
                                            value={residentCpf}
                                            onChange={(e) => setResidentCpf(e.target.value)} // TODO: Add CPF mask
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
                                {isLoading ? (isRegistering ? 'Registrando...' : 'Entrando...') : (isRegistering ? 'Criar Conta' : 'Entrar')}
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
                            <CardDescription>Login com CNPJ do condomínio e senha pessoal.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="sindico-cnpj">CNPJ do Condomínio</Label>
                                <Input
                                    id="sindico-cnpj"
                                    placeholder="00.000.000/0000-00"
                                    value={sindicoCnpj}
                                    onChange={(e) => setSindicoCnpj(e.target.value)} // TODO: Add CNPJ mask
                                    disabled={isLoading}
                                 />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="sindico-password">Senha Pessoal</Label>
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
                            <CardTitle>Acesso Admin (DigiCondo)</CardTitle>
                            <CardDescription>Login para administradores da plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="admin-cpf">CPF</Label>
                                <Input
                                    id="admin-cpf"
                                    placeholder="000.000.000-00"
                                    value={adminCpf}
                                    onChange={(e) => setAdminCpf(e.target.value)} // TODO: Add CPF mask
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
