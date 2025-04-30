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
import { Copy } from 'lucide-react';

type PaymentMethod = 'pix' | 'boleto';

interface PaymentResult {
  code: string;
  expiration: Date;
  url?: string; // For Boleto
}

export default function ReservationsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [proofPhoto, setProofPhoto] = useState<File | null>(null);
   const [damagePhoto, setDamagePhoto] = useState<File | null>(null);
   const [damageDescription, setDamageDescription] = useState('');


  const { toast } = useToast();

  const partyHallFee = 150;

  const availableTimes = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Reset time when date changes
    setPaymentResult(null); // Reset payment result
  };

  const handleProofPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
       if (file.size > 5 * 1024 * 1024) { // 5MB limit
         toast({
           title: "Erro",
           description: "A foto de comprovante não pode exceder 5MB.",
           variant: "destructive",
         });
         setProofPhoto(null);
         event.target.value = ''; // Clear the input
       } else {
         setProofPhoto(file);
       }
    }
  };

  const handleDamagePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
       const file = event.target.files[0];
       if (file.size > 5 * 1024 * 1024) { // 5MB limit
         toast({
           title: "Erro",
           description: "A foto de dano não pode exceder 5MB.",
           variant: "destructive",
         });
         setDamagePhoto(null);
         event.target.value = ''; // Clear the input
       } else {
        setDamagePhoto(file);
       }
    }
  };

   const handleUploadProof = async () => {
    if (!proofPhoto) {
      toast({ title: "Erro", description: "Selecione uma foto para enviar.", variant: "destructive" });
      return;
    }
    // TODO: Implement actual upload logic
    console.log("Uploading proof photo:", proofPhoto.name);
     toast({ title: "Sucesso", description: "Foto de comprovante enviada." });
     setProofPhoto(null);
     // Clear the file input if possible (depends on implementation)
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
    // TODO: Implement actual damage report logic (upload photo + description)
    console.log("Reporting damage:", damagePhoto.name, damageDescription);
    toast({ title: "Sucesso", description: "Relato de dano enviado para análise." });
    setDamagePhoto(null);
    setDamageDescription('');
    // Clear the file input if possible
   }


  const handleGeneratePayment = async () => {
    if (!selectedDate || !selectedTime || !paymentMethod) return;

    setIsGeneratingPayment(true);
    setPaymentResult(null);

    try {
      if (paymentMethod === 'pix') {
        const result = await generatePixCode({
          value: partyHallFee,
          description: `Reserva Salão ${format(selectedDate, 'dd/MM/yyyy')} ${selectedTime}`,
        });
        setPaymentResult({ code: result.pixCode, expiration: result.expiration });
        toast({
          title: "Código PIX Gerado",
          description: "Copie o código e realize o pagamento.",
        });
      } else if (paymentMethod === 'boleto') {
        // TODO: Get payer details (name, CPF) from logged-in user data
        const payerDetails = { name: "Nome do Residente", cpf: "123.456.789-00" };
        const result = await generateBoleto({
          value: partyHallFee,
          description: `Reserva Salão ${format(selectedDate, 'dd/MM/yyyy')} ${selectedTime}`,
          payerName: payerDetails.name,
          payerCPF: payerDetails.cpf,
        });
        setPaymentResult({ code: result.barcode, expiration: result.expiration, url: result.url });
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

  // TODO: Implement rescheduling logic and fee calculation
  // TODO: Implement automatic confirmation after payment (requires webhook or polling)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Reservas</h1>
      <p className="text-muted-foreground">Reserve o Salão de Festas para seu evento.</p>

      <Card>
        <CardHeader>
          <CardTitle>Salão de Festas</CardTitle>
          <CardDescription>Taxa de reserva: R$ {partyHallFee.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center">
             <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                locale={ptBR}
                className="rounded-md border"
             />
             {selectedDate && (
               <p className="mt-2 text-sm text-muted-foreground">
                 Data selecionada: {format(selectedDate, 'PPP', { locale: ptBR })}
               </p>
             )}
          </div>
          <div className="space-y-4">
            <Label htmlFor="time-select">Selecione o Horário</Label>
             <Select
                value={selectedTime}
                onValueChange={setSelectedTime}
                disabled={!selectedDate}
             >
                <SelectTrigger id="time-select" className="w-full">
                 <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                 {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                     {time}
                    </SelectItem>
                 ))}
                </SelectContent>
             </Select>

              {selectedDate && selectedTime && (
                <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={isGeneratingPayment}>
                      Confirmar Reserva e Gerar Pagamento
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
                      <AlertDialogDescription>
                        Você confirma a reserva do Salão de Festas para{' '}
                        {format(selectedDate, 'dd/MM/yyyy')} às {selectedTime}?
                        O valor da taxa é R$ {partyHallFee.toFixed(2)}.
                        Selecione o método de pagamento abaixo.
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
                           <a href={paymentResult.url} target="_blank" rel="noopener noreferrer">
                           Visualizar Boleto
                           </a>
                        </Button>
                     )}
                     <p className="mt-2 text-xs text-muted-foreground">
                        Sua reserva será confirmada automaticamente após a compensação do pagamento.
                     </p>
                   </CardContent>
                </Card>
              )}

          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
           Nota: Taxas adicionais podem ser aplicadas em caso de reagendamento.
           O horário de funcionamento do Salão de Festas é das 8:00 às 22:00.
        </CardFooter>
      </Card>

      {/* Section for uploading proof photo after event */}
      <Card>
         <CardHeader>
           <CardTitle>Comprovante Pós-Evento</CardTitle>
           <CardDescription>Envie uma foto de como você deixou o Salão de Festas após o uso.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="proof-picture">Foto do Local (até 5MB)</Label>
              <Input id="proof-picture" type="file" accept="image/*" onChange={handleProofPhotoChange} />
              {proofPhoto && <p className="text-xs text-muted-foreground">Arquivo selecionado: {proofPhoto.name}</p>}
            </div>
            <Button onClick={handleUploadProof} disabled={!proofPhoto}>Enviar Comprovante</Button>
         </CardContent>
      </Card>

       {/* Section for reporting damage */}
      <Card>
         <CardHeader>
           <CardTitle>Relatar Dano</CardTitle>
           <CardDescription>Encontrou algum dano no Salão de Festas? Informe aqui.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="damage-picture">Foto do Dano (até 5MB)</Label>
              <Input id="damage-picture" type="file" accept="image/*" onChange={handleDamagePhotoChange} />
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

      {/* Add calendar view for existing reservations later */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Calendário de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display Calendar with booked dates highlighted * /}
        </CardContent>
      </Card> */}
    </div>
  );
}
