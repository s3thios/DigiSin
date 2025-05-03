

import { sendEmail, EmailDetails } from './email';
import { format } from 'date-fns'; // Added for formatting dates
import { ptBR } from 'date-fns/locale'; // Added for locale
// TODO: Import push notification service library (e.g., Firebase Cloud Messaging)
// import { sendPushNotification, PushDetails } from './push'; // Placeholder

type NotificationChannel = 'email' | 'push' | 'sms' | 'all'; // Added SMS

interface NotificationRecipient {
    email?: string;
    pushToken?: string; // Device token for push notifications
    phone?: string; // Phone number for SMS
    // Add other identifiers as needed (e.g., userId)
}

interface NotificationPayload {
    subject: string; // For email
    title: string; // For push notification title
    body: string; // For email body and push notification body
    smsBody?: string; // Optional separate body for SMS (usually shorter)
    data?: Record<string, string>; // Optional data payload for push (e.g., navigation target)
}

/**
 * Sends a notification to a specific recipient via specified channels.
 *
 * @param recipient The recipient's details (email, push token, phone).
 * @param payload The notification content (subject, title, body, data).
 * @param channels The channels to send through ('email', 'push', 'sms', 'all'). Defaults to 'all'.
 * @returns A promise indicating success or failure for each channel.
 */
export async function sendNotification(
    recipient: NotificationRecipient,
    payload: NotificationPayload,
    channels: NotificationChannel = 'all'
): Promise<{ emailSent: boolean | null, pushSent: boolean | null, smsSent: boolean | null }> {
    let emailSent: boolean | null = null;
    let pushSent: boolean | null = null;
    let smsSent: boolean | null = null;

    // --- BACKEND NOTE ---
    // Ensure recipient details (email, pushToken, phone) are fetched securely based on user ID.
    // Sanitize payload content before sending.
    // Implement robust error handling and logging for each channel.
    // Use actual service integrations for email, push, and SMS.

    // Send Email
    if ((channels === 'email' || channels === 'all') && recipient.email) {
        try {
            // --- BACKEND NOTE ---: Call the actual email sending service API here.
            console.log(`Simulating email to ${recipient.email}: ${payload.subject}`);
            emailSent = await sendEmail({
                to: recipient.email,
                subject: payload.subject,
                body: payload.body, // Ensure body is properly formatted (HTML or plain text)
            });
        } catch (error) {
            console.error("Error sending email notification:", error);
            emailSent = false;
        }
    }

    // Send Push Notification
    if ((channels === 'push' || channels === 'all') && recipient.pushToken) {
        try {
            // --- BACKEND NOTE ---: Call the actual push notification service API here.
            console.log(`Simulating push notification to token ${recipient.pushToken}: ${payload.title} - ${payload.body}`);
            // pushSent = await sendPushNotification({
            //     token: recipient.pushToken,
            //     title: payload.title,
            //     body: payload.body,
            //     data: payload.data,
            // });
            pushSent = true; // Simulate success
        } catch (error) {
            console.error("Error sending push notification:", error);
            pushSent = false;
        }
    }

     // Send SMS
    if ((channels === 'sms' || channels === 'all') && recipient.phone) {
        try {
            // --- BACKEND NOTE ---: Call the actual SMS gateway API here.
            const smsText = payload.smsBody || payload.body; // Use specific SMS body or fallback
             console.log(`Simulating SMS to ${recipient.phone}: ${smsText.substring(0, 160)}`); // Truncate for simulation
            // smsSent = await sendSms({ to: recipient.phone, message: smsText });
            smsSent = true; // Simulate success
        } catch (error) {
            console.error("Error sending SMS notification:", error);
            smsSent = false;
        }
    }


    return { emailSent, pushSent, smsSent };
}

// --- Specific Notification Helper Functions ---

/**
 * Notifies a resident about a new announcement.
 * @param resident Recipient details.
 * @param announcementTitle Title of the announcement.
 */
export async function notifyNewAnnouncement(resident: NotificationRecipient, announcementTitle: string) {
    // --- BACKEND NOTE ---: Fetch resident details if only userId is provided.
    const message = `Um novo aviso foi publicado: "${announcementTitle}". Confira no app!`;
    return sendNotification(resident, {
        subject: `Novo Aviso: ${announcementTitle}`,
        title: `Novo Aviso no Condomínio`,
        body: message,
        smsBody: `DigiCondo Aviso: ${announcementTitle}. Detalhes no app.`, // Shorter SMS
        data: { screen: '/resident/announcements' } // Example deep link data
    }, 'all'); // Send via all channels
}

/**
 * Notifies a resident about a reply to their ticket.
 * @param resident Recipient details.
 * @param ticketId ID of the ticket.
 * @param replyExcerpt A short excerpt of the reply.
 */
export async function notifyTicketReply(resident: NotificationRecipient, ticketId: number, replyExcerpt: string) {
     // --- BACKEND NOTE ---: Fetch resident details. Ensure replyExcerpt is sanitized.
     const message = `Você recebeu uma nova resposta no seu ticket: "${replyExcerpt.substring(0, 50)}..."`;
     return sendNotification(resident, {
        subject: `Nova Resposta no Ticket #${ticketId}`,
        title: `Resposta no Ticket #${ticketId}`,
        body: message,
        smsBody: `DigiCondo Ticket #${ticketId}: Nova resposta. Veja no app.`,
        data: { screen: `/resident/tickets/${ticketId}` }
    }, 'all');
}

/**
 * Notifies a resident about the status change of their ticket.
 * @param resident Recipient details.
 * @param ticketId ID of the ticket.
 * @param newStatus The new status (e.g., "Resolvido", "Fechado").
 */
export async function notifyTicketStatusChange(resident: NotificationRecipient, ticketId: number, newStatus: string) {
     // --- BACKEND NOTE ---: Fetch resident details.
     const message = `O status do seu ticket foi atualizado para: ${newStatus}.`;
     return sendNotification(resident, {
        subject: `Atualização no Ticket #${ticketId}`,
        title: `Ticket #${ticketId} Atualizado`,
        body: message,
        smsBody: `DigiCondo Ticket #${ticketId}: Status atualizado para ${newStatus}.`,
        data: { screen: `/resident/tickets/${ticketId}` }
    }, 'all');
}


/**
 * Notifies a resident about a pending reservation payment.
 * @param resident Recipient details.
 * @param reservationDate Date of the reservation.
 */
export async function notifyReservationPendingPayment(resident: NotificationRecipient, reservationDate: Date) {
    // --- BACKEND NOTE ---: Fetch resident details.
    const formattedDate = format(reservationDate, 'dd/MM/yyyy', { locale: ptBR });
    const message = `Sua reserva para ${formattedDate} está aguardando pagamento. Acesse o app para concluir.`;
    return sendNotification(resident, {
        subject: `Pagamento Pendente - Reserva ${formattedDate}`,
        title: `Pagamento Pendente`,
        body: message,
        smsBody: `DigiCondo Reserva ${formattedDate}: Pagamento pendente. Acesse o app.`,
        data: { screen: '/resident/reservations' }
    }, 'all');
}

/**
 * Notifies a resident that their reservation is confirmed.
 * @param resident Recipient details.
 * @param reservationDate Date of the reservation.
 */
export async function notifyReservationConfirmed(resident: NotificationRecipient, reservationDate: Date) {
    // --- BACKEND NOTE ---: Fetch resident details. Triggered by payment confirmation.
    const formattedDate = format(reservationDate, 'dd/MM/yyyy', { locale: ptBR });
     const message = `Sua reserva do salão de festas para ${formattedDate} foi confirmada!`;
    return sendNotification(resident, {
        subject: `Reserva Confirmada - ${formattedDate}`,
        title: `Reserva Confirmada!`,
        body: message,
        smsBody: `DigiCondo Reserva ${formattedDate}: Confirmada!`,
        data: { screen: '/resident/reservations' }
    }, 'all');
}

/**
 * Notifies a resident about a new delivery arrival.
 * @param resident Recipient details.
 * @param senderOrTracking Info about the delivery (e.g., sender name or tracking code).
 */
export async function notifyDeliveryArrival(resident: NotificationRecipient, senderOrTracking: string) {
    // --- BACKEND NOTE ---: Fetch resident details.
    const message = `Uma nova entrega (${senderOrTracking}) chegou para você na portaria.`;
    return sendNotification(resident, {
        subject: `Nova Entrega Recebida - ${senderOrTracking}`,
        title: `Nova Entrega na Portaria!`,
        body: message,
        smsBody: `DigiCondo Entrega: ${senderOrTracking} chegou na portaria. Retire em breve.`,
        data: { screen: '/resident/deliveries' }
    }, 'all'); // Send via Email, Push, SMS
}

/**
 * Notifies a resident after their delivery has been marked as picked up (optional).
 * @param resident Recipient details.
 * @param deliveryId ID of the delivery.
 */
export async function notifyDeliveryPickup(resident: NotificationRecipient, deliveryId: number) {
    // --- BACKEND NOTE ---: Fetch resident details. This might be optional.
     const message = `Sua entrega (ID: ${deliveryId}) foi registrada como retirada.`;
    return sendNotification(resident, {
        subject: `Entrega Retirada (ID: ${deliveryId})`,
        title: `Entrega Retirada`,
        body: message,
        // No SMS for this usually.
        data: { screen: '/resident/deliveries' }
    }, 'email'); // Send only via email maybe
}


/**
 * Notifies an admin/sindico about a new occurrence (and associated ticket).
 * @param admin Recipient details.
 * @param occurrenceType Type of the occurrence.
 * @param residentName Name of the resident who reported.
 * @param ticketId The ID of the newly created ticket.
 */
export async function notifyAdminNewOccurrence(admin: NotificationRecipient, occurrenceType: string, residentName: string, ticketId: number) {
    // --- BACKEND NOTE ---: Fetch admin details. Determine who to notify.
    const message = `Uma nova ocorrência (${occurrenceType}) foi registrada por ${residentName}. Ticket #${ticketId} criado.`;
    return sendNotification(admin, {
        subject: `Nova Ocorrência/Ticket Recebido (${occurrenceType})`,
        title: `Nova Ocorrência (${occurrenceType}) - Ticket #${ticketId}`,
        body: message,
        smsBody: `DigiCondo Alerta: Nova ocorrência (${occurrenceType}) de ${residentName}. Ticket #${ticketId}.`,
        data: { screen: `/admin/tickets/${ticketId}` } // Link directly to the ticket
    }, 'all'); // Send to admin via all channels
}

/**
 * Notifies an admin/sindico when a ticket is assigned to them.
 * @param admin Recipient details.
 * @param ticketId ID of the ticket.
 * @param residentName Name of the resident who created the ticket.
 */
export async function notifyAdminTicketAssigned(admin: NotificationRecipient, ticketId: number, residentName: string) {
    // --- BACKEND NOTE ---: Fetch admin details.
    const message = `O ticket #${ticketId} de ${residentName} foi atribuído a você.`;
    return sendNotification(admin, {
        subject: `Novo Ticket Atribuído: #${ticketId}`,
        title: `Ticket #${ticketId} Atribuído`,
        body: message,
        smsBody: `DigiCondo Ticket #${ticketId} atribuído a você.`,
        data: { screen: `/admin/tickets/${ticketId}` }
    }, 'all');
}


// Add more specific notification functions as needed...
// e.g., notifyReservationCancelled, notifyMaintenanceScheduled, etc.
