'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Trash2, Download } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RegulationDocument {
    id: number;
    name: string; // e.g., "Regimento Interno", "Convenção"
    fileName: string;
    uploadDate: Date;
    condominium: string; // Which condo this applies to
    url: string; // Simulated URL
}

// Sample data - replace with actual data fetching
const initialRegulations: RegulationDocument[] = [
    { id: 1, name: "Regimento Interno", fileName: "regimento_pf4.pdf", uploadDate: new Date(2024, 5, 1), condominium: "Plaza das Flores IV", url: "#" },
    { id: 2, name: "Convenção", fileName: "convencao_pf4.pdf", uploadDate: new Date(2024, 5, 1), condominium: "Plaza das Flores IV", url: "#" },
    { id: 3, name: "Regimento Interno", fileName: "regimento_pf3.pdf", uploadDate: new Date(2024, 5, 1), condominium: "Plaza das Flores III", url: "#" },
];

// Sample condo names (fetch dynamically)
const condoNames = ["Plaza das Flores IV", "Plaza das Flores III"];

export default function AdminRegulationsPage() {
    const [regulations, setRegulations] = useState<RegulationDocument[]>(initialRegulations);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [documentName, setDocumentName] = useState(''); // "Regimento Interno" or "Convenção" or other
    const [targetCondo, setTargetCondo] = useState<string | undefined>(undefined);
    const [documentToRemove, setDocumentToRemove] = useState<RegulationDocument | null>(null);

    const { toast } = useToast();

     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
             // Validate type (e.g., PDF) and size if necessary
             if (file.type !== 'application/pdf') {
                 toast({ title: "Erro", description: "Somente arquivos PDF são permitidos.", variant: "destructive" });
                 setDocumentFile(null);
                 event.target.value = ''; // Clear input
                 return;
             }
            setDocumentFile(file);
        }
    };


    const handleUploadDocument = async () => {
        if (!documentFile || !documentName.trim() || !targetCondo) {
            toast({ title: "Erro", description: "Selecione o arquivo, o nome e o condomínio.", variant: "destructive" });
            return;
        }

        // TODO: Implement actual upload logic (send file and metadata to backend/storage)
        console.log(`Uploading ${documentName} (${documentFile.name}) for ${targetCondo}`);

         // Simulate adding to list after successful upload
        const newId = Math.max(0, ...regulations.map(d => d.id)) + 1;
        const newDocument: RegulationDocument = {
            id: newId,
            name: documentName.trim(),
            fileName: documentFile.name,
            uploadDate: new Date(),
            condominium: targetCondo,
            url: '#', // Replace with actual URL after upload
        };
        setRegulations([...regulations, newDocument]);

        toast({ title: "Sucesso", description: `Documento "${documentName}" enviado com sucesso.` });
        setDocumentFile(null);
        setDocumentName('');
        setTargetCondo(undefined);
        // Clear file input
    };

    const handleRemoveDocument = async () => {
        if (!documentToRemove) return;

        // TODO: Implement actual removal logic (delete from backend/storage)
        console.log("Removing document:", documentToRemove.id, documentToRemove.fileName);
        setRegulations(regulations.filter(d => d.id !== documentToRemove.id));

        toast({ title: "Sucesso", description: `Documento ${documentToRemove.fileName} removido.` });
        setDocumentToRemove(null); // Close the dialog
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Gerenciar Regulamentos</h1>
            <p className="text-muted-foreground">Faça upload ou remova os documentos de regulamento dos condomínios.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Upload de Novo Documento</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                         <div className="space-y-1.5">
                              <Label htmlFor="doc-file">Arquivo (PDF)*</Label>
                              <Input id="doc-file" type="file" accept=".pdf" onChange={handleFileChange} />
                              {documentFile && <p className="text-xs text-muted-foreground">Selecionado: {documentFile.name}</p>}
                         </div>
                          <div className="space-y-1.5">
                             <Label htmlFor="doc-name">Nome do Documento*</Label>
                             <Input id="doc-name" placeholder="Ex: Regimento Interno, Convenção" value={documentName} onChange={(e) => setDocumentName(e.target.value)} />
                         </div>
                         <div className="space-y-1.5">
                             <Label htmlFor="doc-condo">Condomínio*</Label>
                             <Select value={targetCondo} onValueChange={setTargetCondo}>
                                 <SelectTrigger id="doc-condo"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                 <SelectContent>
                                     {condoNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                                 </SelectContent>
                             </Select>
                         </div>
                     </div>
                 </CardContent>
                 <CardFooter>
                     <Button onClick={handleUploadDocument} disabled={!documentFile || !documentName || !targetCondo}>
                        <Upload className="mr-2 h-4 w-4" /> Enviar Documento
                     </Button>
                 </CardFooter>
            </Card>


             <Card>
                 <CardHeader>
                     <CardTitle>Documentos Enviados</CardTitle>
                      {/* Add filtering by condo here if needed */}
                 </CardHeader>
                 <CardContent>
                    {regulations.length > 0 ? (
                         <ul className="space-y-3">
                             {regulations.map(doc => (
                                <li key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                         <FileText className="h-5 w-5 text-muted-foreground" />
                                         <div>
                                             <p className="font-medium">{doc.name} <span className="text-xs text-muted-foreground">({doc.fileName})</span></p>
                                             <p className="text-xs text-muted-foreground">
                                                 Condomínio: {doc.condominium} - Enviado em: {doc.uploadDate.toLocaleDateString('pt-BR')}
                                             </p>
                                         </div>
                                    </div>
                                     <div className="flex gap-1">
                                        <Button variant="outline" size="icon" asChild>
                                            <a href={doc.url} download={doc.fileName} title="Baixar">
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
                                                   Tem certeza que deseja remover o documento "{documentToRemove?.name}" para o condomínio "{documentToRemove?.condominium}"?
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
                         <p className="text-center text-muted-foreground">Nenhum documento de regulamento enviado.</p>
                    )}
                 </CardContent>
            </Card>

        </div>
    );
}

// Helper for destructive variant in AlertDialogAction if not directly supported
import { buttonVariants } from "@/components/ui/button";
