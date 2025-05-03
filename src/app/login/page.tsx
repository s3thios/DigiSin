
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter, usePathname } from 'next/navigation'; // Use App Router's router
import { Loader2 } from 'lucide-react'; // Import loader icon
import { formatCpf, formatCnpj, isCpfValid, isCnpjValid } from '@/lib/formatters'; // Import formatters/validators

type LoginRole = 'resident' | 'sindico' | 'admin';

// TODO: Replace with actual function to fetch condo employees managed by Sindico
const fetchCondoEmployees = async (cpf: string): Promise<{ passwordHash: string } | null> => {
    // Simulate checking a list of employees added by the Sindico
    // This function should check if the CPF belongs to an active employee (e.g., supervisor)
    // associated with *any* condo managed by *any* sindico (or check based on a lookup).
    // For simulation, allow the test admin CPF
     if (cpf === '609.367.243-31') {
         // Simulate returning the hashed password for the test admin/supervisor
         // In a real scenario, fetch the hash from the database record created via sindico/employees
         // Hashing 'senha123' (replace with actual hash check)
         return { passwordHash: '$2b$...' }; // Placeholder for hashed password
     }
    return null;
};

export default function LoginPage({ defaultTab = 'resident' }: { defaultTab?: LoginRole }) {
    // Login States
    const [residentCpf, setResidentCpf] = useState('');
    const [residentPassword, setResidentPassword] = useState('');
    const [sindicoCnpj, setSindicoCnpj] = useState('');
    const [sindicoPassword, setSindicoPassword] = useState('');
    const [adminCpf, setAdminCpf] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    // Registration States
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerType, setRegisterType] = useState<LoginRole>(defaultTab);
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerCpf, setRegisterCpf] = useState('');
    const [registerCnpj, setRegisterCnpj] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState<LoginRole>(defaultTab);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname(); // Get current path

     // Determine default tab based on path if prop not provided or if path changes
     useEffect(() => {
         const pathSegments = pathname.split('/');
         const lastSegment = pathSegments[pathSegments.length - 1];
         const validTabs: LoginRole[] = ['resident', 'sindico', 'admin'];
         if (validTabs.includes(lastSegment as LoginRole)) {
             setCurrentTab(lastSegment as LoginRole);
             setRegisterType(lastSegment as LoginRole); // Sync register type on path change
         } else {
             setCurrentTab('resident'); // Default if path doesn't match
             setRegisterType('resident');
         }
     }, [pathname]);


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

    const handleLogin = async (type: LoginRole) => {
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
        // 1. Send the *raw* (unformatted) CPF/CNPJ to the backend.
        // 2. Backend determines user type (Resident, Sindico, Admin/Supervisor) based on identifier format and potentially a lookup.
        // 3. Fetch user data (including hashed password and role) based on raw CPF/CNPJ/Email.
        // 4. If Admin login: Check both DigiSin admins *and* condo employees (supervisors, etc.) added via Sindico panel.
        // 5. Verify password hash using Firebase Auth (signInWithEmailAndPassword using fetched email) or a secure hashing library (bcrypt).
        // 6. Verify role matches the login tab.
        // 7. Use prepared statements.
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
             // Redirect Sindico to dashboard, passing the condoId identified by CNPJ
             const condoId = 1; // TODO: Fetch actual condoId associated with the CNPJ from backend
            redirectPath = `/sindico/dashboard?condoId=${condoId}`;
        } else if (type === 'admin' && cleanIdentifier === '60936724331' && password === 'senha123') {
            // This could be a DigiSin admin OR a condo employee (Supervisor)
            // TODO: Backend should differentiate and set appropriate session/token
            // For now, assume it's a DigiSin admin with global access
             // const employee = await fetchCondoEmployees(formattedIdentifier);
             // if (employee) { /* login success as supervisor */ }
            loginSuccess = true;
            redirectPath = '/admin/dashboard'; // Redirect general admin
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
              } else if (registerType === 'admin' && !registerEmail.endsWith('@digisin.com.br')) { // Example corporate email check - ADJUST DOMAIN
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
        // 2. Backend validates uniqueness, domain rules, condo existence (for sindico).
        // 3. Backend uses Firebase Auth (createUserWithEmailAndPassword) or similar auth provider.
        // 4. Backend stores additional info (raw CPF/CNPJ, Name, Role, condo link for sindico) in Firestore/DB, linked by Auth UID.
        // 5. Sindico registration requires admin approval? Define workflow. Admin registration might need approval too.
        // 6. Use prepared statements for any direct DB interaction.
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

     const handleTabChange = (value: LoginRole) => {
         setIsRegistering(false);
         resetRegisterForm();
         setRegisterType(value);
         setCurrentTab(value);
         // Update URL without full page reload
         router.push(`/login/${value}`, { scroll: false });
     };


    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Tabs value={currentTab} className="w-full max-w-md" onValueChange={(value) => handleTabChange(value as LoginRole)}>
                <div className="text-center mb-6">
                    {/* TODO: Add actual logo */}
                     <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-md">
                       DS
                     </div>
                    <h1 className="text-3xl font-bold text-foreground">DigiSin</h1>
                    <p className="text-muted-foreground">Gestão inteligente e conectada, na palma da sua mão.</p>
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
                            <CardTitle>{isRegistering ? 'Registrar Acesso Admin' : 'Acesso Admin (DigiSin)'}</CardTitle>
                             <CardDescription>
                                {isRegistering ? 'Registre-se com seu CPF e email corporativo.' : 'Login para administradores e supervisores.'}
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
                                        <Label htmlFor="register-email-adm">Email Corporativo* (@digisin.com.br)</Label> {/* Adjusted Domain */}
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
