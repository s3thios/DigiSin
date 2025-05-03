
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // Use App Router's router
import { Loader2 } from 'lucide-react'; // Import loader icon

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
    const [adminEmail, setAdminEmail] = useState(''); // Added for Admin registration

    // Registration States
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerType, setRegisterType] = useState<'resident' | 'sindico' | 'admin'>('resident'); // Track registration type
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerCpf, setRegisterCpf] = useState('');
    const [registerCnpj, setRegisterCnpj] = useState(''); // For Sindico registration
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const resetRegisterForm = () => {
        setRegisterName('');
        setRegisterEmail('');
        setRegisterCpf('');
        setRegisterCnpj('');
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
        // Fetch user details from Firestore based on CPF/CNPJ to get the associated email for signInWithEmailAndPassword.
        // Verify roles from Firestore/Custom Claims.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

        // --- SIMULATED AUTH - UPDATED WITH TEST CREDENTIALS ---
        let loginSuccess = false;
        let redirectPath = '/';

        if (type === 'resident' && identifier === '632.099.143-70' && password === 'senha098') {
            loginSuccess = true;
            redirectPath = '/resident/dashboard';
        } else if (type === 'sindico' && identifier === '11.222.333/0001-44' && password === 'senha890') {
            loginSuccess = true;
            redirectPath = '/sindico/dashboard'; // Redirect Sindico
        } else if (type === 'admin' && identifier === '609.367.243-31' && password === 'senha123') {
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

     // Handles Registration for all types
     const handleRegister = async () => {
        setIsLoading(true);
        let validationError = '';

        // Common Validations
        if (!registerName.trim() || !registerEmail.trim() || !registerCpf.trim() || !registerPassword || !registerConfirmPassword) {
            validationError = "Preencha todos os campos obrigatórios (*).";
        } else if (!cpfRegex.test(registerCpf)) {
            validationError = "Formato de CPF inválido (use XXX.XXX.XXX-XX).";
        } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
            validationError = "Formato de email inválido.";
        } else if (registerPassword !== registerConfirmPassword) {
             validationError = "As senhas não coincidem.";
        } else {
             // Password Strength Check (Example: Minimum 8 chars, 1 number, 1 uppercase)
             const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
             if (!passwordStrengthRegex.test(registerPassword)) {
                 validationError = "A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula e um número.";
             }
        }

        // Type-Specific Validations
        if (!validationError) {
             if (registerType === 'sindico' && !cnpjRegex.test(registerCnpj)) {
                 validationError = 'Formato de CNPJ inválido (use XX.XXX.XXX/XXXX-XX).';
             } else if (registerType === 'admin' && !registerEmail.endsWith('@digicondo.com')) { // Example corporate email check
                 validationError = 'Email corporativo inválido para administrador.';
             }
        }


        if (validationError) {
             toast({ title: "Erro de Registro", description: validationError, variant: "destructive" });
             setIsLoading(false);
             return;
        }

        console.log(`Attempting ${registerType} registration for: ${registerName} (CPF: ${registerCpf})`);

        // --- BACKEND NOTE ---
        // Implement actual registration logic using Firebase Auth (createUserWithEmailAndPassword)
        // and Firestore (to store additional details like CPF, CNPJ, Name, Role, Condo link).
        // - Ensure CPF uniqueness within the system or condo.
        // - Ensure CNPJ exists and is managed if registering a Sindico.
        // - Verify corporate email domain for Admin.
        // - Securely hash passwords.
        // - Send verification email if needed.
        // - Use prepared statements/secure practices for database interactions.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

         // --- SIMULATED REGISTRATION ---
         const registrationSuccess = true; // Simulate success
         // --- END SIMULATED REGISTRATION ---


        setIsLoading(false);

         if (registrationSuccess) {
            toast({ title: "Registro bem-sucedido!", description: "Sua conta foi criada. Faça o login." });
             resetRegisterForm();
             setIsRegistering(false); // Switch back to login view
             // Pre-fill login fields based on registration type
             if (registerType === 'resident') setResidentCpf(registerCpf);
             if (registerType === 'sindico') setSindicoCnpj(registerCnpj);
             if (registerType === 'admin') setAdminCpf(registerCpf);
         } else {
             toast({
                 title: "Falha no Registro",
                 description: "Não foi possível criar a conta. Verifique os dados ou contate o suporte.", // Add more specific errors from backend
                 variant: "destructive",
             });
         }
    };

     const handleTabChange = (value: string) => {
         setIsRegistering(false); // Always switch back to login view when changing tabs
         resetRegisterForm();
         setRegisterType(value as 'resident' | 'sindico' | 'admin'); // Update registration type contextually
     };


    return (
         // Center content vertically and horizontally
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Tabs defaultValue="resident" className="w-full max-w-md" onValueChange={handleTabChange}>
                <div className="text-center mb-6">
                     {/* Placeholder for Logo */}
                    <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl">
                        DC
                    </div>
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
                                        <Label htmlFor="register-name-res">Nome Completo*</Label>
                                        <Input id="register-name-res" value={registerName} onChange={(e) => setRegisterName(e.target.value)} disabled={isLoading} required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="register-cpf-res">CPF*</Label>
                                        <Input id="register-cpf-res" placeholder="000.000.000-00" value={registerCpf} onChange={(e) => setRegisterCpf(e.target.value)} disabled={isLoading} required />
                                        {registerCpf && !cpfRegex.test(registerCpf) && <p className="text-xs text-destructive">Formato inválido.</p>}
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-email-res">Email Pessoal*</Label>
                                        <Input id="register-email-res" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} disabled={isLoading} required />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-password-res">Senha*</Label>
                                        <Input id="register-password-res" type="password" placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} disabled={isLoading} required />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-confirm-password-res">Confirmar Senha*</Label>
                                        <Input id="register-confirm-password-res" type="password" placeholder="Repita a senha" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} disabled={isLoading} required />
                                        {registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword && <p className="text-xs text-destructive">As senhas não coincidem.</p>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Login Form (Resident) */}
                                    <div className="space-y-1">
                                        <Label htmlFor="resident-cpf">CPF</Label>
                                        <Input id="resident-cpf" placeholder="000.000.000-00" value={residentCpf} onChange={(e) => setResidentCpf(e.target.value)} disabled={isLoading} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="resident-password">Senha</Label>
                                        <Input id="resident-password" type="password" value={residentPassword} onChange={(e) => setResidentPassword(e.target.value)} disabled={isLoading} />
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                             <Button className="w-full" onClick={() => isRegistering ? handleRegister() : handleLogin('resident')} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? (isRegistering ? 'Registrando...' : 'Entrando...') : (isRegistering ? 'Criar Conta' : 'Entrar')}
                            </Button>
                             {isRegistering ? (
                                 <Button variant="link" className="text-sm p-0 h-auto" onClick={() => { setIsRegistering(false); resetRegisterForm(); }} disabled={isLoading}>
                                     Já tem conta? Entrar
                                 </Button>
                             ) : (
                                 <>
                                     <Button variant="link" className="text-sm p-0 h-auto" disabled={isLoading}>Esqueceu sua senha?</Button>
                                     <Button variant="link" className="text-sm p-0 h-auto" onClick={() => { setIsRegistering(true); }} disabled={isLoading}>Não tem conta? Registre-se</Button>
                                 </>
                             )}
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Síndico Login/Register Tab */}
                <TabsContent value="sindico">
                     <Card>
                        <CardHeader>
                            <CardTitle>{isRegistering ? 'Registrar Acesso Síndico' : 'Acesso do Síndico'}</CardTitle>
                            <CardDescription>
                               {isRegistering ? 'Registre-se usando seu CPF e o CNPJ do condomínio.' : 'Login com CNPJ do condomínio e senha pessoal.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {isRegistering ? (
                                <>
                                    {/* Registration Form (Sindico) */}
                                    <div className="space-y-1">
                                        <Label htmlFor="register-name-sin">Nome Completo (Síndico)*</Label>
                                        <Input id="register-name-sin" value={registerName} onChange={(e) => setRegisterName(e.target.value)} disabled={isLoading} required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="register-cpf-sin">CPF (Síndico)*</Label>
                                        <Input id="register-cpf-sin" placeholder="000.000.000-00" value={registerCpf} onChange={(e) => setRegisterCpf(e.target.value)} disabled={isLoading} required />
                                        {registerCpf && !cpfRegex.test(registerCpf) && <p className="text-xs text-destructive">Formato inválido.</p>}
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-cnpj-sin">CNPJ do Condomínio*</Label>
                                        <Input id="register-cnpj-sin" placeholder="00.000.000/0000-00" value={registerCnpj} onChange={(e) => setRegisterCnpj(e.target.value)} disabled={isLoading} required />
                                         {registerCnpj && !cnpjRegex.test(registerCnpj) && <p className="text-xs text-destructive">Formato inválido.</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="register-email-sin">Email de Contato*</Label>
                                        <Input id="register-email-sin" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} disabled={isLoading} required />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-password-sin">Senha Pessoal*</Label>
                                        <Input id="register-password-sin" type="password" placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} disabled={isLoading} required />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-confirm-password-sin">Confirmar Senha*</Label>
                                        <Input id="register-confirm-password-sin" type="password" placeholder="Repita a senha" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} disabled={isLoading} required />
                                         {registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword && <p className="text-xs text-destructive">As senhas não coincidem.</p>}
                                    </div>
                                </>
                             ) : (
                                <>
                                     {/* Login Form (Sindico) */}
                                    <div className="space-y-1">
                                        <Label htmlFor="sindico-cnpj">CNPJ do Condomínio</Label>
                                        <Input id="sindico-cnpj" placeholder="00.000.000/0000-00" value={sindicoCnpj} onChange={(e) => setSindicoCnpj(e.target.value)} disabled={isLoading} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="sindico-password">Senha Pessoal</Label>
                                        <Input id="sindico-password" type="password" value={sindicoPassword} onChange={(e) => setSindicoPassword(e.target.value)} disabled={isLoading} />
                                    </div>
                                </>
                             )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                             <Button className="w-full" onClick={() => isRegistering ? handleRegister() : handleLogin('sindico')} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? (isRegistering ? 'Registrando...' : 'Entrando...') : (isRegistering ? 'Registrar Síndico' : 'Entrar')}
                            </Button>
                             {isRegistering ? (
                                 <Button variant="link" className="text-sm p-0 h-auto" onClick={() => { setIsRegistering(false); resetRegisterForm(); }} disabled={isLoading}>
                                     Já é registrado? Entrar
                                 </Button>
                             ) : (
                                <>
                                     <Button variant="link" className="text-sm p-0 h-auto" disabled={isLoading}>Esqueceu sua senha?</Button>
                                     {/* Sindico registration might be restricted */}
                                     <Button variant="link" className="text-sm p-0 h-auto" onClick={() => { setIsRegistering(true); }} disabled={isLoading}>
                                         Registrar novo Síndico/Condomínio
                                     </Button>
                                </>
                             )}
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Admin Login/Register Tab */}
                 <TabsContent value="admin">
                     <Card>
                        <CardHeader>
                            <CardTitle>{isRegistering ? 'Registrar Acesso Admin' : 'Acesso Admin (DigiCondo)'}</CardTitle>
                             <CardDescription>
                                {isRegistering ? 'Registre-se com seu CPF e email corporativo.' : 'Login para administradores da plataforma.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                              {isRegistering ? (
                                <>
                                    {/* Registration Form (Admin) */}
                                    <div className="space-y-1">
                                        <Label htmlFor="register-name-adm">Nome Completo (Admin)*</Label>
                                        <Input id="register-name-adm" value={registerName} onChange={(e) => setRegisterName(e.target.value)} disabled={isLoading} required />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="register-cpf-adm">CPF (Admin)*</Label>
                                        <Input id="register-cpf-adm" placeholder="000.000.000-00" value={registerCpf} onChange={(e) => setRegisterCpf(e.target.value)} disabled={isLoading} required />
                                        {registerCpf && !cpfRegex.test(registerCpf) && <p className="text-xs text-destructive">Formato inválido.</p>}
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-email-adm">Email Corporativo* (@digicondo.com)</Label>
                                        <Input id="register-email-adm" type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} disabled={isLoading} required />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-password-adm">Senha*</Label>
                                        <Input id="register-password-adm" type="password" placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} disabled={isLoading} required />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-confirm-password-adm">Confirmar Senha*</Label>
                                        <Input id="register-confirm-password-adm" type="password" placeholder="Repita a senha" value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} disabled={isLoading} required />
                                         {registerPassword && registerConfirmPassword && registerPassword !== registerConfirmPassword && <p className="text-xs text-destructive">As senhas não coincidem.</p>}
                                    </div>
                                </>
                              ) : (
                                <>
                                    {/* Login Form (Admin) */}
                                    <div className="space-y-1">
                                        <Label htmlFor="admin-cpf">CPF</Label>
                                        <Input id="admin-cpf" placeholder="000.000.000-00" value={adminCpf} onChange={(e) => setAdminCpf(e.target.value)} disabled={isLoading} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="admin-password">Senha</Label>
                                        <Input id="admin-password" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} disabled={isLoading} />
                                    </div>
                                </>
                              )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                             <Button className="w-full" onClick={() => isRegistering ? handleRegister() : handleLogin('admin')} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? (isRegistering ? 'Registrando...' : 'Entrando...') : (isRegistering ? 'Registrar Admin' : 'Entrar')}
                            </Button>
                             {isRegistering ? (
                                 <Button variant="link" className="text-sm p-0 h-auto" onClick={() => { setIsRegistering(false); resetRegisterForm(); }} disabled={isLoading}>
                                     Já é registrado? Entrar
                                 </Button>
                             ) : (
                                <>
                                     <Button variant="link" className="text-sm p-0 h-auto" disabled={isLoading}>Esqueceu sua senha?</Button>
                                      {/* Admin registration might be restricted */}
                                     <Button variant="link" className="text-sm p-0 h-auto" onClick={() => { setIsRegistering(true); }} disabled={isLoading}>
                                         Registrar novo Admin
                                     </Button>
                                </>
                             )}
                        </CardFooter>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
