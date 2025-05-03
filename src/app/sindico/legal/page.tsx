
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Scale, FileText, Gavel, Newspaper, Upload, Download, Trash2 } from 'lucide-react'; // Icons for legal matters
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

// --- Data Structures ---
interface LegalDocument {
    id: string; // Unique ID
    condoId: number;
    type: 'report' | 'process' | 'law' | 'news' | 'regulation';
    title: string;
    description?: string;
    fileName: string;
    fileUrl: string; // Secure URL to download/view
    uploadDate: Date;
    uploadedBy: string; // User who uploaded (Sindico name/ID)
}

// --- Fetching Functions (Placeholders) ---
// TODO: Implement backend fetching for documents related to the condoId
const fetchLegalDocuments = async (condoId: number, type?: LegalDocument['type']): Promise<LegalDocument[]> => {
    console.log(`Fetching legal documents for condo ${condoId}, type: ${type || 'all'}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    // Replace with actual API call, filtering by condoId and optionally by type
    const allDocs: LegalDocument[] = [
        { id: 'doc1', condoId: 1, type: 'regulation', title: 'Regimento Interno V2', fileName: 'regimento_interno_v2.pdf', fileUrl: '#', uploadDate: new Date(2024, 6, 1), uploadedBy: 'Sindico Exemplo' },
        { id: 'doc2', condoId: 1, type: 'report', title: 'Relatório Auditoria 2023', fileName: 'auditoria_2023.pdf', fileUrl: '#', uploadDate: new Date(2024, 3, 15), uploadedBy: 'Sindico Exemplo' },
        { id: 'doc3', condoId: 1, type: 'law', title: 'Lei do Condomínio Atualizada', fileName: 'lei_condominio_atual.pdf', fileUrl: '#', uploadDate: new Date(2024, 1, 10), uploadedBy: 'Sindico Exemplo', description: 'Referente às alterações na lei X.' },
        { id: 'doc4', condoId: 1, type: 'process', title: 'Processo Vizinhança 101', fileName: 'proc_101.pdf', fileUrl: '#', uploadDate: new Date(2024, 5, 5), uploadedBy: 'Sindico Exemplo' },
        { id: 'doc5', condoId: 1, type: 'news', title: 'Notícia Relevante - Jornal Local', fileName: 'noticia_seguranca.pdf', fileUrl: '#', uploadDate: new Date(2024, 7, 1), uploadedBy: 'Sindico Exemplo' },
    ];
    return allDocs.filter(doc => doc.condoId === condoId && (!type || doc.type === type))
                  .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());
};

// TODO: Implement backend logic for uploading and storing document + metadata
const uploadLegalDocument = async (condoId: number, file: File, type: LegalDocument['type'], title: string, description?: string, uploaderName: string): Promise<LegalDocument> => {
     console.log(`Uploading document: ${file.name} for condo ${condoId}`);
     await new Promise(resolve => setTimeout(resolve, 700)); // Simulate upload

     // --- BACKEND NOTE ---
     // 1. Validate file (type, size, malware scan).
     // 2. Store securely (e.g., Firebase Storage, S3) with unique name.
     // 3. Create database record linking file URL, metadata (condoId, type, title, desc), uploader, date.
     // 4. Use prepared statements.
     // 5. Return the created document object.

     const newId = `doc${Math.random().toString(36).substring(7)}`;
     return {
         id: newId,
         condoId: condoId,
         type: type,
         title: title,
         description: description,
         fileName: file.name,
         fileUrl: '#', // Replace with actual URL
         uploadDate: new Date(),
         uploadedBy: uploaderName, // Get from session/auth
     };
};

// TODO: Implement backend logic for deleting document + metadata
const deleteLegalDocument = async (documentId: string, condoId: number): Promise<boolean> => {
    console.log(`Deleting document: ${documentId} from condo ${condoId}`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate deletion

    // --- BACKEND NOTE ---
    // 1. Verify user permissions (is this Sindico allowed to delete for this condo?).
    // 2. Delete file from storage.
    // 3. Delete metadata record from database.
    // 4. Use prepared statements.
    // 5. Return true on success, false on failure.
    return true;
}

// --- Component ---
export default function SindicoLegalPage() {
    const searchParams = useSearchParams();
    const condoIdParam = searchParams.get('condoId');
    const { toast } = useToast();

    const [documents, setDocuments] = useState<LegalDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<LegalDocument['type']>('regulation');

    // Upload Form State
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadTitle, setUploadTitle] = useState('');
    const [uploadDescription, setUploadDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const [docToRemove, setDocToRemove] = useState<LegalDocument | null>(null);

    // Fetch documents when condoId or tab changes
    useEffect(() => {
        if (!condoIdParam) {
            toast({ title: "Erro", description: "Condomínio não especificado.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
        const condoId = Number(condoIdParam);
        const loadDocuments = async () => {
            setIsLoading(true);
            try {
                const data = await fetchLegalDocuments(condoId, currentTab);
                setDocuments(data);
            } catch (error) {
                console.error("Failed to load legal documents:", error);
                toast({ title: "Erro", description: "Não foi possível carregar os documentos.", variant: "destructive" });
                setDocuments([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadDocuments();
    }, [condoIdParam, currentTab, toast]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Basic validation (allow common doc types)
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            const maxSize = 10 * 1024 * 1024; // 10MB limit

            if (!allowedTypes.includes(file.type)) {
                toast({ title: "Erro", description: "Tipo de arquivo inválido (PDF, DOCX, JPG, PNG).", variant: "destructive" });
                setUploadFile(null);
                event.target.value = '';
                return;
            }
             if (file.size > maxSize) {
                toast({ title: "Erro", description: "O arquivo não pode exceder 10MB.", variant: "destructive" });
                setUploadFile(null);
                event.target.value = '';
                return;
             }
            setUploadFile(file);
        } else {
             setUploadFile(null);
        }
    };

    const handleUpload = async () => {
         if (!condoIdParam || !uploadFile || !uploadTitle.trim()) {
             toast({ title: "Erro", description: "Selecione o arquivo e preencha o título.", variant: "destructive" });
             return;
         }
         setIsUploading(true);
         try {
             // TODO: Get uploader name from session/auth context
             const uploaderName = "Sindico Exemplo";
             const newDocument = await uploadLegalDocument(Number(condoIdParam), uploadFile, currentTab, uploadTitle.trim(), uploadDescription.trim() || undefined, uploaderName);
             setDocuments([newDocument, ...documents]); // Add to the top
             toast({ title: "Sucesso", description: "Documento enviado com sucesso." });
             // Reset form
             setUploadFile(null);
             setUploadTitle('');
             setUploadDescription('');
             const fileInput = document.getElementById('legal-doc-file') as HTMLInputElement;
             if (fileInput) fileInput.value = '';
         } catch (error) {
             console.error("Upload failed:", error);
             toast({ title: "Erro no Upload", description: "Não foi possível enviar o documento.", variant: "destructive" });
         } finally {
             setIsUploading(false);
         }
    }

     const handleRemove = async () => {
        if (!docToRemove || !condoIdParam) return;
        try {
            const success = await deleteLegalDocument(docToRemove.id, Number(condoIdParam));
            if (success) {
                setDocuments(documents.filter(doc => doc.id !== docToRemove.id));
                toast({ title: "Sucesso", description: "Documento removido." });
            } else {
                throw new Error("Deletion failed on backend");
            }
        } catch (error) {
            console.error("Deletion failed:", error);
            toast({ title: "Erro", description: "Não foi possível remover o documento.", variant: "destructive" });
        } finally {
            setDocToRemove(null);
        }
     }

     const getIconForType = (type: LegalDocument['type']) => {
        switch (type) {
            case 'report': return <AreaChart className="h-5 w-5 text-muted-foreground" />;
            case 'process': return <Gavel className="h-5 w-5 text-muted-foreground" />;
            case 'law': return <Scale className="h-5 w-5 text-muted-foreground" />;
            case 'news': return <Newspaper className="h-5 w-5 text-muted-foreground" />;
            case 'regulation': return <FileText className="h-5 w-5 text-muted-foreground" />;
            default: return <FileText className="h-5 w-5 text-muted-foreground" />;
        }
    }

    if (!condoIdParam) {
        return <p className="text-destructive">ID do Condomínio não encontrado na URL.</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Assuntos Legais e Documentos</h1>
             {/* TODO: Display Condo Name */}
            <p className="text-muted-foreground">Gerencie relatórios, processos, leis, notícias e regulamentos do condomínio.</p>

             <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as LegalDocument['type'])} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-4">
                     <TabsTrigger value="regulation">Regulamentos</TabsTrigger>
                    <TabsTrigger value="report">Relatórios</TabsTrigger>
                    <TabsTrigger value="process">Processos</TabsTrigger>
                    <TabsTrigger value="law">Leis</TabsTrigger>
                    <TabsTrigger value="news">Notícias</TabsTrigger>
                </TabsList>

                 {/* Content for each tab */}
                 {['regulation', 'report', 'process', 'law', 'news'].map(tabType => (
                    <TabsContent key={tabType} value={tabType} className="space-y-6">
                         {/* Upload Section */}
                         <Card>
                             <CardHeader>
                                <CardTitle>Enviar Novo Documento - {
                                     tabType === 'regulation' ? 'Regulamento' :
                                     tabType === 'report' ? 'Relatório' :
                                     tabType === 'process' ? 'Processo' :
                                     tabType === 'law' ? 'Lei' : 'Notícia'
                                 }</CardTitle>
                             </CardHeader>
                             <CardContent className="space-y-4">
                                 <div className="grid sm:grid-cols-2 gap-4 items-end">
                                     <div className="space-y-1.5">
                                         <Label htmlFor="legal-doc-title">Título*</Label>
                                         <Input id="legal-doc-title" placeholder="Título descritivo do documento" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
                                     </div>
                                     <div className="space-y-1.5">
                                         <Label htmlFor="legal-doc-file">Arquivo* (PDF, DOCX, JPG, PNG - Max 10MB)</Label>
                                         <Input id="legal-doc-file" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png" onChange={handleFileChange} />
                                          {uploadFile && <p className="text-xs text-muted-foreground">Selecionado: {uploadFile.name}</p>}
                                     </div>
                                 </div>
                                  <div className="space-y-1.5">
                                     <Label htmlFor="legal-doc-description">Descrição (Opcional)</Label>
                                     <Textarea id="legal-doc-description" placeholder="Breve descrição ou contexto do documento..." value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} rows={2} />
                                 </div>
                             </CardContent>
                             <CardFooter>
                                 <Button onClick={handleUpload} disabled={isUploading || !uploadFile || !uploadTitle.trim()}>
                                     {isUploading ? 'Enviando...' : <><Upload className="mr-2 h-4 w-4" /> Enviar</>}
                                 </Button>
                             </CardFooter>
                         </Card>

                         {/* Document List Section */}
                         <Card>
                             <CardHeader>
                                 <CardTitle>Documentos Enviados - {
                                     tabType === 'regulation' ? 'Regulamentos' :
                                     tabType === 'report' ? 'Relatórios' :
                                     tabType === 'process' ? 'Processos' :
                                     tabType === 'law' ? 'Leis' : 'Notícias'
                                 }</CardTitle>
                             </CardHeader>
                             <CardContent>
                                {isLoading ? (
                                    <div className="space-y-3">
                                        <Skeleton className="h-16 w-full" />
                                        <Skeleton className="h-16 w-full" />
                                    </div>
                                ) : documents.length > 0 ? (
                                     <ul className="space-y-3">
                                         {documents.map(doc => (
                                            <li key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                                <div className="flex items-start gap-3">
                                                    {getIconForType(doc.type)}
                                                    <div>
                                                        <p className="font-medium">{doc.title} <span className="text-xs text-muted-foreground">({doc.fileName})</span></p>
                                                         {doc.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
                                                        <p className="text-xs text-muted-foreground">
                                                            Enviado por: {doc.uploadedBy} em: {doc.uploadDate.toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                 <div className="flex gap-1">
                                                    <Button variant="outline" size="icon" asChild>
                                                        <a href={doc.fileUrl} download={doc.fileName} title="Baixar">
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                     <AlertDialog>
                                                         <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => setDocToRemove(doc)} title="Remover">
                                                              <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                         </AlertDialogTrigger>
                                                         <AlertDialogContent>
                                                             <AlertDialogHeader>
                                                               <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                                                               <AlertDialogDescription>
                                                                 Tem certeza que deseja remover o documento "{docToRemove?.title}"? Esta ação não pode ser desfeita.
                                                               </AlertDialogDescription>
                                                             </AlertDialogHeader>
                                                             <AlertDialogFooter>
                                                               <AlertDialogCancel onClick={() => setDocToRemove(null)}>Cancelar</AlertDialogCancel>
                                                               <AlertDialogAction onClick={handleRemove} className={buttonVariants({ variant: "destructive" })}>Remover</AlertDialogAction>
                                                             </AlertDialogFooter>
                                                         </AlertDialogContent>
                                                     </AlertDialog>
                                                 </div>
                                            </li>
                                         ))}
                                     </ul>
                                ) : (
                                     <p className="text-center text-muted-foreground">Nenhum documento encontrado para esta categoria.</p>
                                )}
                             </CardContent>
                         </Card>
                     </TabsContent>
                 ))}

             </Tabs>
        </div>
    );
}
