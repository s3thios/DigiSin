
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'; // Use App Router's router
import { Loader2 } from 'lucide-react'; // Import loader icon
import { formatCpf, formatCnpj, isCpfValid, isCnpjValid } from '@/lib/formatters'; // Import formatters/validators

export default function LoginPage() {
    // Login States
    const [residentCpf, setResidentCpf] = useState('');
    const [residentPassword, setResidentPassword] = useState('');
    const [sindicoCnpj, setSindicoCnpj] = useState('');
    const [sindicoPassword, setSindicoPassword] = useState('');
    const [adminCpf, setAdminCpf] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    // Registration States
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerType, setRegisterType] = useState<'resident' | 'sindico' | 'admin'>('resident');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerCpf, setRegisterCpf] = useState('');
    const [registerCnpj, setRegisterCnpj] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    // Input Masking Effect
    useEffect(() => {
        setResidentCpf(formatCpf(residentCpf));
    }, [residentCpf]);
    useEffect(() => {
        setSindicoCnpj(formatCnpj(sindicoCnpj));
    }, [sindicoCnpj]);
    useEffect(() => {
        setAdminCpf(formatCpf(adminCpf));
    }, [adminCpf]);
    useEffect(() => {
        setRegisterCpf(formatCpf(registerCpf));
    }, [registerCpf]);
     useEffect(() => {
        setRegisterCnpj(formatCnpj(registerCnpj));
    }, [registerCnpj]);

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
        const rawIdentifier = type === 'resident' ? residentCpf : type === 'sindico' ? sindicoCnpj : adminCpf;
        const formattedIdentifier = type === 'resident' || type === 'admin' ? formatCpf(rawIdentifier) : formatCnpj(rawIdentifier);

        if (type === 'resident') {
            identifier = formattedIdentifier;
            password = residentPassword;
             if (!isCpfValid(identifier)) {
                validationError = 'CPF inválido.';
            }
        } else if (type === 'sindico') {
            identifier = formattedIdentifier;
            password = sindicoPassword;
             if (!isCnpjValid(identifier)) {
                 validationError = 'CNPJ inválido.';
             }
        } else { // admin
            identifier = formattedIdentifier;
            password = adminPassword;
             if (!isCpfValid(identifier)) {
                 validationError = 'CPF inválido.';
             }
        }

        if (validationError) {
            toast({ title: "Erro de Validação", description: validationError, variant: "destructive" });
            setIsLoading(false);
            return;
        }

        console.log(`Attempting ${type} login with identifier: ${identifier}`);

        // --- BACKEND NOTE ---
        // 1. Send the *raw* (unformatted) CPF/CNPJ to the backend for lookup if necessary.
        // 2. Backend fetches user based on raw CPF/CNPJ.
        // 3. Backend verifies password hash using Firebase Auth (signInWithEmailAndPassword using fetched email).
        // 4. Backend verifies role.
        // 5. Use prepared statements.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

        // --- SIMULATED AUTH - USE PROVIDED TEST CREDENTIALS ---
        let loginSuccess = false;
        let redirectPath = '/';
        const cleanIdentifier = identifier.replace(/\D/g, ''); // Send clean ID for comparison

        if (type === 'resident' && cleanIdentifier === '63209914370' && password === 'senha098') {
            loginSuccess = true;
            redirectPath = '/resident/dashboard';
        } else if (type === 'sindico' && cleanIdentifier === '11222333000144' && password === 'senha890') {
            loginSuccess = true;
            redirectPath = '/sindico/dashboard'; // Redirect Sindico
        } else if (type === 'admin' && cleanIdentifier === '60936724331' && password === 'senha123') {
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
        const formattedCpf = formatCpf(registerCpf);
        const formattedCnpj = formatCnpj(registerCnpj);

        // Common Validations
        if (!registerName.trim() || !registerEmail.trim() || !formattedCpf || !registerPassword || !registerConfirmPassword) {
            validationError = "Preencha todos os campos obrigatórios (*).";
         } else if (!isCpfValid(formattedCpf)) {
            validationError = "CPF inválido.";
        } else if (!/\S+@\S+\.\S+/.test(registerEmail)) {
            validationError = "Formato de email inválido.";
        } else if (registerPassword !== registerConfirmPassword) {
             validationError = "As senhas não coincidem.";
        } else {
             const passwordStrengthRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
             if (!passwordStrengthRegex.test(registerPassword)) {
                 validationError = "Senha fraca: Mín. 8 caracteres, 1 maiúscula, 1 número.";
             }
        }

        // Type-Specific Validations
        if (!validationError) {
             if (registerType === 'sindico') {
                 if (!formattedCnpj) {
                     validationError = 'CNPJ do condomínio é obrigatório.';
                 } else if (!isCnpjValid(formattedCnpj)) {
                    validationError = 'CNPJ inválido.';
                 }
              } else if (registerType === 'admin' && !registerEmail.endsWith('@digicondo.com')) { // Example corporate email check
                 validationError = 'Email corporativo inválido para administrador.';
             }
        }


        if (validationError) {
             toast({ title: "Erro de Registro", description: validationError, variant: "destructive" });
             setIsLoading(false);
             return;
        }

         const cleanCpf = formattedCpf.replace(/\D/g, '');
         const cleanCnpj = formattedCnpj.replace(/\D/g, '');

        console.log(`Attempting ${registerType} registration for: ${registerName} (CPF: ${cleanCpf})`);

        // --- BACKEND NOTE ---
        // 1. Send *raw* identifiers (cleanCpf, cleanCnpj) to backend.
        // 2. Backend validates uniqueness, domain rules, etc.
        // 3. Backend uses Firebase Auth (createUserWithEmailAndPassword).
        // 4. Backend stores additional info (raw CPF/CNPJ, Name, Role) in Firestore, linked by Auth UID.
        // 5. Use prepared statements for any direct DB interaction.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

         const registrationSuccess = true; // Simulate success

        setIsLoading(false);

         if (registrationSuccess) {
            toast({ title: "Registro bem-sucedido!", description: "Sua conta foi criada. Faça o login." });
             resetRegisterForm();
             setIsRegistering(false);
             // Pre-fill login fields
             if (registerType === 'resident') setResidentCpf(formattedCpf);
             if (registerType === 'sindico') setSindicoCnpj(formattedCnpj);
             if (registerType === 'admin') setAdminCpf(formattedCpf);
         } else {
             toast({
                 title: "Falha no Registro",
                 description: "Não foi possível criar a conta. Verifique os dados ou contate o suporte.",
                 variant: "destructive",
             });
         }
    };

     const handleTabChange = (value: string) => {
         setIsRegistering(false);
         resetRegisterForm();
         setRegisterType(value as 'resident' | 'sindico' | 'admin');
     };


    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Tabs defaultValue="resident" className="w-full max-w-md" onValueChange={handleTabChange}>
                <div className="text-center mb-6">
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
                                        <Input
                                             id="register-cpf-res"
                                             placeholder="000.000.000-00"
                                             value={registerCpf} // Display formatted value
                                             onChange={(e) => setRegisterCpf(e.target.value)} // Update raw value, useEffect formats
                                             maxLength={14} // CPF length with formatting
                                             disabled={isLoading}
                                             required
                                          />
                                         {registerCpf && registerCpf.length === 14 && !isCpfValid(registerCpf) && <p className="text-xs text-destructive">CPF inválido.</p>}
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
                                         <Input
                                             id="resident-cpf"
                                             placeholder="000.000.000-00"
                                             value={residentCpf} // Display formatted value
                                             onChange={(e) => setResidentCpf(e.target.value)} // Update raw value, useEffect formats
                                             maxLength={14} // CPF length with formatting
                                             disabled={isLoading}
                                         />
                                          {residentCpf && residentCpf.length === 14 && !isCpfValid(residentCpf) && <p className="text-xs text-destructive">CPF inválido.</p>}
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
                                        <Input
                                             id="register-cpf-sin"
                                             placeholder="000.000.000-00"
                                             value={registerCpf}
                                             onChange={(e) => setRegisterCpf(e.target.value)}
                                             maxLength={14}
                                             disabled={isLoading}
                                             required
                                         />
                                         {registerCpf && registerCpf.length === 14 && !isCpfValid(registerCpf) && <p className="text-xs text-destructive">CPF inválido.</p>}
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="register-cnpj-sin">CNPJ do Condomínio*</Label>
                                         <Input
                                             id="register-cnpj-sin"
                                             placeholder="00.000.000/0000-00"
                                             value={registerCnpj}
                                             onChange={(e) => setRegisterCnpj(e.target.value)}
                                             maxLength={18} // CNPJ length with formatting
                                             disabled={isLoading}
                                             required
                                          />
                                         {registerCnpj && registerCnpj.length === 18 && !isCnpjValid(registerCnpj) && <p className="text-xs text-destructive">CNPJ inválido.</p>}
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
                                         <Input
                                             id="sindico-cnpj"
                                             placeholder="00.000.000/0000-00"
                                             value={sindicoCnpj}
                                             onChange={(e) => setSindicoCnpj(e.target.value)}
                                             maxLength={18}
                                             disabled={isLoading}
                                          />
                                         {sindicoCnpj && sindicoCnpj.length === 18 && !isCnpjValid(sindicoCnpj) && <p className="text-xs text-destructive">CNPJ inválido.</p>}
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
                                         <Input
                                             id="register-cpf-adm"
                                             placeholder="000.000.000-00"
                                             value={registerCpf}
                                             onChange={(e) => setRegisterCpf(e.target.value)}
                                             maxLength={14}
                                             disabled={isLoading}
                                             required
                                          />
                                        {registerCpf && registerCpf.length === 14 && !isCpfValid(registerCpf) && <p className="text-xs text-destructive">CPF inválido.</p>}
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
                                         <Input
                                             id="admin-cpf"
                                             placeholder="000.000.000-00"
                                             value={adminCpf}
                                             onChange={(e) => setAdminCpf(e.target.value)}
                                             maxLength={14}
                                             disabled={isLoading}
                                         />
                                         {adminCpf && adminCpf.length === 14 && !isCpfValid(adminCpf) && <p className="text-xs text-destructive">CPF inválido.</p>}
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
