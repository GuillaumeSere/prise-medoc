import { NextResponse } from 'next/server';
import { sendMedicationReminder } from '../../../src/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, medicationName, time } = body;

        if (!email || !medicationName || !time) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        const success = await sendMedicationReminder(email, medicationName, time);

        if (success) {
            return NextResponse.json(
                { message: 'Email envoyé avec succès' },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: 'Erreur lors de l\'envoi de l\'email' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Erreur API:', error);
        // Retourne l'erreur complète côté client pour le debug
        return NextResponse.json(
            { error: error?.message || JSON.stringify(error) || 'Erreur serveur' },
            { status: 500 }
        );
    }
} 