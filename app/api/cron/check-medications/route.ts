import { NextResponse } from 'next/server';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { sendMedicationReminder } from '../../../../src/lib/email';

// Initialiser Firebase côté serveur
const firebaseConfig = {
  apiKey: "AIzaSyCQIG4VXmqiYVXqlif1rf5QxpEBt6Y9o4I", 
  authDomain: "prise-medoc.firebaseapp.com",
  projectId: "prise-medoc",
  storageBucket: "prise-medoc.firebasestorage.app",
  messagingSenderId: "2555944769",
  appId: "1:2555944769:web:d839cea57cacc6c53b8bc0",
  measurementId: "G-DSEGPZ4GFN"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export const runtime = 'nodejs';

interface Medicament {
    id: string;
    nom: string;
    heure: string;
    pris: boolean;
    uid: string;
}

interface User {
    uid: string;
    email: string;
    fcmToken?: string;
    emailNotificationsEnabled?: boolean;
}

export async function GET() {
    try {
        console.log('🔍 Vérification des rappels de médicaments...');
        
        // Récupérer tous les médicaments non pris
        const q = query(
            collection(db, "medicaments"),
            where("pris", "==", false)
        );
        
        const querySnapshot = await getDocs(q);
        const medicaments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Medicament[];

        // Utiliser l'heure locale française (UTC+1 ou UTC+2 selon la saison)
        const currentTime = new Date();
        const frenchTime = new Date(currentTime.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
        const currentHour = frenchTime.getHours();
        const currentMinutes = frenchTime.getMinutes();
        const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

        console.log(`⏰ Heure actuelle: ${currentTimeString}`);
        console.log(`📋 Médicaments trouvés: ${medicaments.length}`);
        
        // Log détaillé des médicaments
        medicaments.forEach(med => {
            console.log(`💊 Médicament: ${med.nom} à ${med.heure} (pris: ${med.pris})`);
        });

        let emailsEnvoyes = 0;

        // Vérifier chaque médicament
        for (const medicament of medicaments) {
            const [medicamentHour, medicamentMinutes] = medicament.heure.split(':').map(Number);
            
            // Si l'heure actuelle correspond à l'heure de prise du médicament
            if (currentHour === medicamentHour && currentMinutes === medicamentMinutes) {
                console.log(`💊 Rappel pour ${medicament.nom} à ${medicament.heure}`);
                
                // Récupérer les informations de l'utilisateur
                const userDoc = await getDoc(doc(db, "users", medicament.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    
                    // Vérifier si les notifications email sont activées
                    if (userData.emailNotificationsEnabled && userData.email) {
                        try {
                            console.log(`📧 Envoi email de rappel pour ${medicament.nom} à ${userData.email}`);
                            await sendMedicationReminder(
                                userData.email,
                                medicament.nom,
                                medicament.heure
                            );
                            console.log(`✅ Email de rappel envoyé à ${userData.email} pour ${medicament.nom}`);
                            emailsEnvoyes++;
                        } catch (error) {
                            console.error(`❌ Erreur envoi email pour ${medicament.nom}:`, error);
                        }
                    } else {
                        console.log(`⚠️ Notifications email désactivées pour l'utilisateur ${medicament.uid}`);
                    }
                } else {
                    console.log(`❌ Utilisateur ${medicament.uid} non trouvé`);
                }
            }
        }

        return NextResponse.json({ 
            message: `Vérification terminée. ${emailsEnvoyes} emails envoyés.`,
            emailsEnvoyes,
            heureVerification: currentTimeString
        });

    } catch (error) {
        console.error("❌ Erreur lors de la vérification des rappels :", error);
        return NextResponse.json(
            { error: 'Erreur lors de la vérification des rappels' },
            { status: 500 }
        );
    }
}
