import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
    throw new Error('La clé API Resend n&apos;est pas configurée. Veuillez ajouter RESEND_API_KEY dans votre fichier .env.local');
}

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Prise-Medoc <onboarding@resend.dev>',
            to: [to],
            subject,
            text,
            html: html || text,
        });

        if (error) {
            console.error('Erreur lors de l&apos;envoi de l&apos;email:', error);
            return false;
        }

        console.log('Email envoyé avec succès:', data);
        return true;
    } catch (error) {
        console.error('Erreur lors de l&apos;envoi de l&apos;email:', error);
        return false;
    }
};

// Template pour les notifications de rappel de médicaments
export const sendMedicationReminder = async (userEmail: string, medicationName: string, time: string) => {
    const subject = `Rappel de prise de médicament : ${medicationName}`;
    const text = `Bonjour,\n\nC&apos;est l&apos;heure de prendre votre médicament : ${medicationName}.\nHeure prévue : ${time}\n\nCordialement,\nL&apos;équipe Prise-Medoc`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://prise-medoc.com/logo.png" alt="Prise-Medoc Logo" style="max-width: 150px;">
            </div>
            <h2 style="color: #2563eb; margin-bottom: 20px; text-align: center;">Rappel de prise de médicament</h2>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0 0 15px 0;">Bonjour,</p>
                <p style="margin: 0 0 15px 0;">C&apos;est l&apos;heure de prendre votre médicament :</p>
                <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; border: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 18px; color: #1e40af;"><strong>${medicationName}</strong></p>
                    <p style="margin: 10px 0 0 0; color: #64748b;">Heure prévue : <strong>${time}</strong></p>
                </div>
            </div>
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0; color: #0369a1;">
                    <strong>N&apos;oubliez pas de confirmer la prise de votre médicament dans l&apos;application.</strong>
                </p>
            </div>
            <div style="text-align: center; color: #64748b; font-size: 14px;">
                <p style="margin: 0;">Cordialement,<br>L&apos;équipe Prise-Medoc</p>
            </div>
        </div>
    `;

    return sendEmail({ to: userEmail, subject, text, html });
}; 