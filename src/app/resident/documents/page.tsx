'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { FileUp, FileText, Trash2, Download } from 'lucide-react';

interface Document {
    id: number;
    type: 'proxy' | 'rental_contract';
    fileName: string;
    uploadDate: Date;
    url: string; // Simulated URL for download
}

// Sample data - replace with actual data fetching and user status check
const userStatus: 'owner' | 'tenant' = 'owner'; // Simulate user status
const initialDocuments: Document[] = [
    // { id: 1, type: 'proxy', fileName: 'procuracao_joao.pdf', uploadDate: new Date(2024, 6, 1), url: '#' },
    // { id: 2, type: 'rental_contract', fileName: 'contrato_aluguel_maria.pdf', uploadDate: new Date(2024, 5, 15), url: '#' },
];

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [proxyFile, setProxyFile] = useState<File | null>(null);
    const [contractFile, setContractFile] = useState<File | null>(null);
    const [documentToRemove, setDocumentToRemove] = useState<Document | null>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'proxy' | 'rental_contract') => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Optional: Add size/type validation if needed
            if (type === 'proxy') {
                setProxyFile(file);
            } else {
                setContractFile(file);
            }
        }
    };

    const handleUpload = async (type: 'proxy' | 'rental_contract') => {
        const file = type === 'proxy' ? proxyFile : contractFile;
        if (!file) {
            toast({ title: "Erro", description: "Selecione um arquivo para enviar.", variant: "destructive" });
            return;
        }

        // TODO: Implement actual upload logic
        console.log(`Uploading ${type} document:`, file.name);

        // Simulate adding to list after successful upload
        const newId = Math.max(0, ...documents.map(d => d.id)) + 1;
        const newDocument: Document = {
            id: newId,
            type: type,
            fileName: file.name,
            uploadDate: new Date(),
            url: '#', // Replace with actual URL after upload
        };
        setDocuments([...documents, newDocument]);


        toast({ title: "Sucesso", description: `Documento (${type === 'proxy' ? 'Procuração' : 'Contrato'}) enviado com sucesso.` });

        if (type === 'proxy') {
            setProxyFile(null);
            // Clear file input if possible
        } else {
            setContractFile(null);
            // Clear file input if possible
        }
    };

     const handleRemoveDocument = async () => {
        if (!documentToRemove) return;

        // TODO: Implement actual removal logic (send to backend)
        console.log("Removing document:", documentToRemove.id);
        setDocuments(documents.filter(d => d.id !== documentToRemove.id));

        toast({ title: "Sucesso", description: `Documento ${documentToRemove.fileName} removido.` });
        setDocumentToRemove(null); // Close the dialog
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Meus Documentos</h1>
            <p className="text-muted-foreground">Gerencie seus documentos importantes relacionados ao condomínio.</p>

            {userStatus === 'owner' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Enviar Procuração</CardTitle>
                        <CardDescription>Caso não possa comparecer a uma assembleia, envie uma procuração.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="proxy-file">Arquivo da Procuração (PDF)</Label>
                            <Input id="proxy-file" type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'proxy')} />
                            {proxyFile && <p className="text-xs text-muted-foreground">Arquivo selecionado: {proxyFile.name}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleUpload('proxy')} disabled={!proxyFile}>
                            <FileUp className="mr-2 h-4 w-4" /> Enviar Procuração
                        </Button>
                    </CardFooter>
                </Card>
            )}

             {/* Allow Owner to manage Tenant's Contract OR Tenant to upload their own */}
            {(userStatus === 'owner' || userStatus === 'tenant') && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Contrato de Locação</CardTitle>
                         <CardDescription>{userStatus === 'owner' ? 'Envie o contrato de locação do seu inquilino.' : 'Envie seu contrato de locação.'}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="contract-file">Arquivo do Contrato (PDF)</Label>
                            <Input id="contract-file" type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'rental_contract')} />
                            {contractFile && <p className="text-xs text-muted-foreground">Arquivo selecionado: {contractFile.name}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleUpload('rental_contract')} disabled={!contractFile}>
                            <FileUp className="mr-2 h-4 w-4" /> Enviar Contrato
                        </Button>
                    </CardFooter>
                </Card>
            )}


            <Card>
                 <CardHeader>
                     <CardTitle>Documentos Enviados</CardTitle>
                 </CardHeader>
                 <CardContent>
                    {documents.length > 0 ? (
                         <ul className="space-y-3">
                             {documents.map(doc => (
                                <li key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                         <FileText className="h-5 w-5 text-muted-foreground" />
                                         <div>
                                             <p className="font-medium">{doc.fileName}</p>
                                             <p className="text-xs text-muted-foreground">
                                                 {doc.type === 'proxy' ? 'Procuração' : 'Contrato'} - Enviado em: {doc.uploadDate.toLocaleDateString('pt-BR')}
                                             </p>
                                         </div>
                                    </div>
                                     <div className="flex gap-1">
                                        <Button variant="outline" size="icon" asChild>
                                            <a href={doc.url} download={doc.fileName} title="Baixar"> {/* TODO: Implement actual download */}
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                               <Button variant="ghost" size="icon" onClick={() => setDocumentToRemove(doc)} title="Remover">
                                                 <Trash2 className="h-4 w-4 text-destructive" />
                                               </Button>
                                           </AlertDialogTrigger>
                                           <AlertDialogContent>
                                               <AlertDialogHeader>
                                                 <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                 <AlertDialogDescription>
                                                   Tem certeza que deseja remover o documento "{documentToRemove?.fileName}"?
                                                 </AlertDialogDescription>
                                               </AlertDialogHeader>
                                               <AlertDialogFooter>
                                                 <AlertDialogCancel onClick={() => setDocumentToRemove(null)}>Cancelar</AlertDialogCancel>
                                                 <AlertDialogAction onClick={handleRemoveDocument} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                                               </AlertDialogFooter>
                                           </AlertDialogContent>
                                       </AlertDialog>
                                     </div>
                                </li>
                             ))}
                         </ul>
                    ) : (
                         <p className="text-center text-muted-foreground">Nenhum documento enviado.</p>
                    )}
                 </CardContent>
            </Card>

        </div>
    );
}


// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";

