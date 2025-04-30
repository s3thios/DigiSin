import { sendEmail, EmailDetails } from './email';
// TODO: Import push notification service library (e.g., Firebase Cloud Messaging)
// import { sendPushNotification, PushDetails } from './push'; // Placeholder

type NotificationChannel = 'email' | 'push' | 'all';

interface NotificationRecipient {
    email?: string;
    pushToken?: string; // Device token for push notifications
    // Add other identifiers as needed (e.g., userId)
}

interface NotificationPayload {
    subject: string; // For email
    title: string; // For push notification title
    body: string; // For email body and push notification body
    data?: Record<string, string>; // Optional data payload for push (e.g., navigation target)
}

/**
 * Sends a notification to a specific recipient via specified channels.
 *
 * @param recipient The recipient's details (email, push token).
 * @param payload The notification content (subject, title, body, data).
 * @param channels The channels to send through ('email', 'push', 'all'). Defaults to 'all'.
 * @returns A promise indicating success or failure for each channel.
 */
export async function sendNotification(
    recipient: NotificationRecipient,
    payload: NotificationPayload,
    channels: NotificationChannel = 'all'
): Promise<{ emailSent: boolean | null, pushSent: boolean | null }> {
    let emailSent: boolean | null = null;
    let pushSent: boolean | null = null;

    // Send Email
    if ((channels === 'email' || channels === 'all') && recipient.email) {
        try {
            emailSent = await sendEmail({
                to: recipient.email,
                subject: payload.subject,
                body: payload.body,
            });
        } catch (error) {
            console.error("Error sending email notification:", error);
            emailSent = false;
        }
    }

    // Send Push Notification
    if ((channels === 'push' || channels === 'all') && recipient.pushToken) {
        try {
            // TODO: Implement Push Notification Sending
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

    return { emailSent, pushSent };
}

// --- Specific Notification Helper Functions ---

/**
 * Notifies a resident about a new announcement.
 * @param resident Recipient details.
 * @param announcementTitle Title of the announcement.
 */
export async function notifyNewAnnouncement(resident: NotificationRecipient, announcementTitle: string) {
    // TODO: Fetch resident details if only userId is provided
    return sendNotification(resident, {
        subject: `Novo Aviso: ${announcementTitle}`,
        title: `Novo Aviso no Condomínio`,
        body: `Um novo aviso foi publicado: "${announcementTitle}". Confira no app!`,
        data: { screen: '/resident/announcements' } // Example deep link data
    });
}

/**
 * Notifies a resident about a reply to their occurrence/ticket.
 * @param resident Recipient details.
 * @param ticketId ID of the ticket.
 * @param replyExcerpt A short excerpt of the reply.
 */
export async function notifyTicketReply(resident: NotificationRecipient, ticketId: number, replyExcerpt: string) {
     return sendNotification(resident, {
        subject: `Nova Resposta no Ticket #${ticketId}`,
        title: `Resposta no Ticket #${ticketId}`,
        body: `Você recebeu uma nova resposta no seu ticket: "${replyExcerpt.substring(0, 50)}..."`,
        data: { screen: `/resident/tickets/${ticketId}` }
    });
}

/**
 * Notifies a resident about the status change of their occurrence/ticket.
 * @param resident Recipient details.
 * @param ticketId ID of the ticket.
 * @param newStatus The new status (e.g., "Resolvido", "Fechado").
 */
export async function notifyTicketStatusChange(resident: NotificationRecipient, ticketId: number, newStatus: string) {
     return sendNotification(resident, {
        subject: `Atualização no Ticket #${ticketId}`,
        title: `Ticket #${ticketId} Atualizado`,
        body: `O status do seu ticket foi atualizado para: ${newStatus}.`,
        data: { screen: `/resident/tickets/${ticketId}` }
    });
}


/**
 * Notifies a resident about a pending reservation payment.
 * @param resident Recipient details.
 * @param reservationDate Date of the reservation.
 */
export async function notifyReservationPendingPayment(resident: NotificationRecipient, reservationDate: Date) {
    const formattedDate = format(reservationDate, 'dd/MM/yyyy', { locale: ptBR });
    return sendNotification(resident, {
        subject: `Pagamento Pendente - Reserva ${formattedDate}`,
        title: `Pagamento Pendente`,
        body: `Sua reserva para ${formattedDate} está aguardando pagamento. Acesse o app para concluir.`,
        data: { screen: '/resident/reservations' }
    });
}

/**
 * Notifies a resident that their reservation is confirmed.
 * @param resident Recipient details.
 * @param reservationDate Date of the reservation.
 */
export async function notifyReservationConfirmed(resident: NotificationRecipient, reservationDate: Date) {
    const formattedDate = format(reservationDate, 'dd/MM/yyyy', { locale: ptBR });
    return sendNotification(resident, {
        subject: `Reserva Confirmada - ${formattedDate}`,
        title: `Reserva Confirmada!`,
        body: `Sua reserva do salão de festas para ${formattedDate} foi confirmada!`,
        data: { screen: '/resident/reservations' }
    });
}


/**
 * Notifies an admin/sindico about a new occurrence.
 * @param admin Recipient details.
 * @param occurrenceType Type of the occurrence.
 * @param residentName Name of the resident who reported.
 */
export async function notifyAdminNewOccurrence(admin: NotificationRecipient, occurrenceType: string, residentName: string) {
    return sendNotification(admin, {
        subject: `Nova Ocorrência Recebida (${occurrenceType})`,
        title: `Nova Ocorrência (${occurrenceType})`,
        body: `Uma nova ocorrência (${occurrenceType}) foi registrada por ${residentName}.`,
        data: { screen: '/admin/complaints' } // Or /sindico/complaints
    }, 'push'); // Example: Only send push notification to admin
}

/**
 * Notifies an admin/sindico when a ticket is assigned to them.
 * @param admin Recipient details.
 * @param ticketId ID of the ticket.
 * @param residentName Name of the resident who created the ticket.
 */
export async function notifyAdminTicketAssigned(admin: NotificationRecipient, ticketId: number, residentName: string) {
    return sendNotification(admin, {
        subject: `Novo Ticket Atribuído: #${ticketId}`,
        title: `Ticket #${ticketId} Atribuído`,
        body: `O ticket #${ticketId} de ${residentName} foi atribuído a você.`,
        data: { screen: `/admin/tickets/${ticketId}` } // Or /sindico/tickets/
    }, 'push');
}


// Add more specific notification functions as needed...
// e.g., notifyReservationCancelled, notifyMaintenanceScheduled, etc.
