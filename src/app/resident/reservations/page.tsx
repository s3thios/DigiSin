
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { generatePixCode } from '@/services/pix';
import { generateBoleto } from '@/services/boleto';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Clock, Music } from 'lucide-react';
import { notifyReservationPendingPayment, notifyReservationConfirmed } from '@/services/notifications'; // Placeholder imports

type PaymentMethod = 'pix' | 'boleto';

interface PaymentResult {
  code: string;
  expiration: Date;
  url?: string; // For Boleto
}

export default function ReservationsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [proofPhoto, setProofPhoto] = useState<File | null>(null);
   const [damagePhoto, setDamagePhoto] = useState<File | null>(null);
   const [damageDescription, setDamageDescription] = useState('');


  const { toast } = useToast();

  // TODO: Fetch fee from admin settings
  const partyHallFee = 150;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setPaymentResult(null); // Reset payment result
  };

  const handleProofPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // --- SECURITY NOTE ---
      // Image Validation (Client-side basic check, Backend MUST perform thorough validation)
       const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
       const maxSize = 5 * 1024 * 1024; // 5MB limit

       if (!allowedTypes.includes(file.type)) {
           toast({
               title: "Erro",
               description: "Tipo de arquivo inválido. Apenas JPG, PNG ou GIF são permitidos.",
               variant: "destructive",
           });
           setProofPhoto(null);
           event.target.value = '';
           return;
       }
       if (file.size > maxSize) {
         toast({
           title: "Erro",
           description: "A foto de comprovante não pode exceder 5MB.",
           variant: "destructive",
         });
         setProofPhoto(null);
         event.target.value = '';
         return;
       }
       setProofPhoto(file);
    }
  };

  const handleDamagePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
       const file = event.target.files[0];
       // --- SECURITY NOTE --- (Same validation as proof photo)
       const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
       const maxSize = 5 * 1024 * 1024; // 5MB limit

       if (!allowedTypes.includes(file.type)) {
           toast({
               title: "Erro",
               description: "Tipo de arquivo inválido. Apenas JPG, PNG ou GIF são permitidos.",
               variant: "destructive",
           });
           setDamagePhoto(null);
           event.target.value = '';
           return;
       }
       if (file.size > maxSize) {
         toast({
           title: "Erro",
           description: "A foto de dano não pode exceder 5MB.",
           variant: "destructive",
         });
         setDamagePhoto(null);
         event.target.value = '';
         return;
       }
       setDamagePhoto(file);
    }
  };

   const handleUploadProof = async () => {
    if (!proofPhoto) {
      toast({ title: "Erro", description: "Selecione uma foto para enviar.", variant: "destructive" });
      return;
    }
    // --- BACKEND NOTE ---
    // Implement actual upload logic.
    // 1. Validate file on backend (MIME, size, content).
    // 2. Store securely.
    // 3. Link photo to the relevant reservation.
    // 4. Notify admin/sindico.
    // 5. Use prepared statements for database operations.
    console.log("Uploading proof photo:", proofPhoto.name);
     toast({ title: "Sucesso", description: "Foto de comprovante enviada." });
     setProofPhoto(null);
     // Clear the file input
     const fileInput = document.getElementById('proof-picture') as HTMLInputElement;
     if (fileInput) fileInput.value = '';
   };

   const handleReportDamage = async () => {
      if (!damagePhoto) {
        toast({ title: "Erro", description: "Selecione uma foto do dano.", variant: "destructive" });
        return;
      }
     if (!damageDescription.trim()) {
        toast({ title: "Erro", description: "Descreva o dano encontrado.", variant: "destructive" });
        return;
     }
    // --- BACKEND NOTE ---
    // Implement actual damage report logic.
    // 1. Validate description (length, sanitize).
    // 2. Validate photo on backend (MIME, size, content).
    // 3. Store securely (description + photo URL).
    // 4. Link report to the relevant reservation.
    // 5. Create a ticket for the damage report.
    // 6. Notify admin/sindico.
    // 7. Use prepared statements for database operations.
    console.log("Reporting damage:", damagePhoto.name, damageDescription);
    toast({ title: "Sucesso", description: "Relato de dano enviado para análise." });
    setDamagePhoto(null);
    setDamageDescription('');
    // Clear the file input
     const damageFileInput = document.getElementById('damage-picture') as HTMLInputElement;
     if (damageFileInput) damageFileInput.value = '';
   }


  const handleGeneratePayment = async () => {
    if (!selectedDate || !paymentMethod) return;

    setIsGeneratingPayment(true);
    setPaymentResult(null);

    // --- BACKEND NOTE ---
    // 1. Before generating payment, check if the date is still available (prevent race conditions).
    // 2. Create a 'pending' reservation record in the database.
    // 3. Call the PIX/Boleto generation service (ensure these services are secure).
    // 4. Store the payment code/details linked to the pending reservation.
    // 5. Set an expiration time for the pending reservation.
    // 6. Use prepared statements for all database interactions.

    try {
      const reservationDescription = `Reserva Salão ${format(selectedDate, 'dd/MM/yyyy')} (Dia Inteiro)`;
      // TODO: Get resident details from auth context
      const residentDetails = { email: 'residente@email.com', name: 'Nome Residente', cpf: '111.111.111-11' };

      if (paymentMethod === 'pix') {
        const result = await generatePixCode({
          value: partyHallFee,
          description: reservationDescription,
        });
        setPaymentResult({ code: result.pixCode, expiration: result.expiration });
        // Notify resident about pending payment
        if (residentDetails.email) {
            notifyReservationPendingPayment({ email: residentDetails.email }, selectedDate);
        }
        toast({
          title: "Código PIX Gerado",
          description: "Copie o código e realize o pagamento.",
        });
      } else if (paymentMethod === 'boleto') {
        const result = await generateBoleto({
          value: partyHallFee,
          description: reservationDescription,
          payerName: residentDetails.name,
          payerCPF: residentDetails.cpf,
        });
        setPaymentResult({ code: result.barcode, expiration: result.expiration, url: result.url });
         // Notify resident about pending payment
         if (residentDetails.email) {
             notifyReservationPendingPayment({ email: residentDetails.email }, selectedDate);
         }
        toast({
          title: "Boleto Gerado",
          description: "Realize o pagamento do boleto.",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar pagamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o método de pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPayment(false);
      setIsConfirming(false); // Close the confirmation dialog
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copiado!", description: "Código copiado para a área de transferência." });
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast({ title: "Erro", description: "Não foi possível copiar o código.", variant: "destructive" });
    });
  };

  // TODO: Implement rescheduling logic (check availability, apply fee, update backend)
  // TODO: Implement automatic confirmation after payment (requires webhook or polling) -> Notify Resident on confirm

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Reservas</h1>
      <p className="text-muted-foreground">Reserve o Salão de Festas para seu evento.</p>

      <Card>
        <CardHeader>
          <CardTitle>Salão de Festas</CardTitle>
          <CardDescription>
            Taxa de reserva: R$ {partyHallFee.toFixed(2)}. Horário: 08:00 às 22:00 (Dia inteiro). Som ambiente permitido.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center">
             <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                // TODO: Fetch and disable already booked dates from backend
                locale={ptBR}
                className="rounded-md border"
             />
             {selectedDate && (
               <p className="mt-2 text-sm text-muted-foreground">
                 Data selecionada: {format(selectedDate, 'PPP', { locale: ptBR })} (Dia inteiro)
               </p>
             )}
          </div>
          <div className="space-y-4">
             {selectedDate && (
                <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={isGeneratingPayment || !selectedDate}>
                       {selectedDate ? 'Confirmar Reserva e Gerar Pagamento' : 'Selecione uma Data'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
                      <AlertDialogDescription>
                        Você confirma a reserva do Salão de Festas para o dia{' '}
                        <span className="font-semibold">{selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}</span> (das 08:00 às 22:00)?
                        O valor da taxa é R$ {partyHallFee.toFixed(2)}. Selecione o método de pagamento.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                     <div className="flex flex-col space-y-2 my-4">
                       <Label>Método de Pagamento</Label>
                        <Select onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione Pix ou Boleto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="boleto">Boleto Bancário</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isGeneratingPayment}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleGeneratePayment} disabled={!paymentMethod || isGeneratingPayment}>
                        {isGeneratingPayment ? "Gerando..." : "Gerar Pagamento"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {paymentResult && (
                <Card className="mt-4 bg-secondary">
                   <CardHeader>
                     <CardTitle>Pagamento Pendente</CardTitle>
                     <CardDescription>
                       {paymentMethod === 'pix' ? 'Pague com o código PIX abaixo:' : 'Pague o boleto:'} Válido até {format(paymentResult.expiration, 'dd/MM/yyyy HH:mm')}
                     </CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="flex items-center space-x-2">
                       <Textarea readOnly value={paymentResult.code} className="flex-1 font-mono text-xs" rows={paymentMethod === 'pix' ? 3 : 1}/>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(paymentResult.code)}>
                          <Copy className="h-4 w-4"/>
                        </Button>
                      </div>
                     {paymentMethod === 'boleto' && paymentResult.url && (
                        <Button variant="link" asChild className="mt-2 p-0 h-auto">
                           {/* --- SECURITY NOTE: Ensure boleto URL is from trusted source --- */}
                           <a href={paymentResult.url} target="_blank" rel="noopener noreferrer">
                           Visualizar Boleto
                           </a>
                        </Button>
                     )}
                     <p className="mt-2 text-xs text-muted-foreground">
                        Sua reserva será confirmada automaticamente após a compensação do pagamento. Você será notificado.
                     </p>
                   </CardContent>
                </Card>
              )}

          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground flex flex-col items-start gap-1">
            <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> Horário: 08:00 às 22:00</div>
            <div className="flex items-center gap-1"><Music className="h-3 w-3" /> Som ambiente permitido.</div>
            <div>Nota: Taxas adicionais podem ser aplicadas em caso de reagendamento. Consulte o regulamento.</div>
        </CardFooter>
      </Card>

      {/* Section for uploading proof photo after event */}
      <Card>
         <CardHeader>
           <CardTitle>Comprovante Pós-Evento</CardTitle>
           <CardDescription>Após o uso, envie uma foto mostrando como o Salão de Festas foi deixado.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="proof-picture">Foto do Local (JPG, PNG, GIF - até 5MB)</Label>
              <Input id="proof-picture" type="file" accept="image/jpeg, image/png, image/gif" onChange={handleProofPhotoChange} />
              {proofPhoto && <p className="text-xs text-muted-foreground">Arquivo selecionado: {proofPhoto.name}</p>}
            </div>
            <Button onClick={handleUploadProof} disabled={!proofPhoto}>Enviar Comprovante</Button>
         </CardContent>
      </Card>

       {/* Section for reporting damage */}
      <Card>
         <CardHeader>
           <CardTitle>Relatar Dano</CardTitle>
           <CardDescription>Encontrou algum dano no Salão de Festas antes ou depois do seu evento? Informe aqui.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="damage-picture">Foto do Dano (JPG, PNG, GIF - até 5MB)</Label>
              <Input id="damage-picture" type="file" accept="image/jpeg, image/png, image/gif" onChange={handleDamagePhotoChange} />
               {damagePhoto && <p className="text-xs text-muted-foreground">Arquivo selecionado: {damagePhoto.name}</p>}
            </div>
             <div className="grid w-full gap-1.5">
               <Label htmlFor="damage-description">Descrição do Dano</Label>
               <Textarea
                 placeholder="Descreva o dano encontrado..."
                 id="damage-description"
                 value={damageDescription}
                 onChange={(e) => setDamageDescription(e.target.value)}
               />
             </div>
            <Button onClick={handleReportDamage} disabled={!damagePhoto || !damageDescription.trim()}>Relatar Dano</Button>
         </CardContent>
      </Card>

      {/* TODO: Add resident's reservation list (fetching confirmed/pending reservations) */}
      {/* <Card>
        <CardHeader><CardTitle>Minhas Reservas</CardTitle></CardHeader>
        <CardContent>...</CardContent>
      </Card> */}
    </div>
  );
}
