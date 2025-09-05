import { NextResponse } from 'next/server';
import { checkAndSendMedicationReminders } from '../../../src/lib/notificationScheduler';

export const runtime = 'nodejs';

export async function POST() {
    try {
        await checkAndSendMedicationReminders();
        return NextResponse.json({ message: 'Vérification des rappels effectuée' });
    } catch (error) {
        console.error('Erreur lors de la vérification des rappels:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la vérification des rappels' },
            { status: 500 }
        );
    }
}
