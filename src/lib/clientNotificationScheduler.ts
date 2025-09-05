import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { sendMedicationReminder } from './email';

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
    emailNotificationsEnabled?: boolean;
}

export const checkMedicationsForUser = async (userId: string) => {
    try {
        console.log('🔍 Vérification des rappels pour l\'utilisateur:', userId);
        
        // Récupérer les médicaments de l'utilisateur
        const q = query(
            collection(db, "medicaments"),
            where("uid", "==", userId),
            where("pris", "==", false)
        );
        
        const querySnapshot = await getDocs(q);
        const medicaments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Medicament[];

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

        console.log(`⏰ Heure actuelle: ${currentTimeString}`);
        console.log(`📋 Médicaments trouvés: ${medicaments.length}`);

        // Récupérer les informations de l'utilisateur
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) {
            console.log('❌ Utilisateur non trouvé');
            return;
        }

        const userData = userDoc.data() as User;
        
        // Vérifier si les notifications email sont activées
        if (!userData.emailNotificationsEnabled || !userData.email) {
            console.log('⚠️ Notifications email désactivées');
            return;
        }

        let emailsEnvoyes = 0;

        // Vérifier chaque médicament
        for (const medicament of medicaments) {
            const [medicamentHour, medicamentMinutes] = medicament.heure.split(':').map(Number);
            
            // Si l'heure actuelle correspond à l'heure de prise du médicament
            if (currentHour === medicamentHour && currentMinutes === medicamentMinutes) {
                console.log(`💊 Rappel pour ${medicament.nom} à ${medicament.heure}`);
                
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
            }
        }

        console.log(`📊 ${emailsEnvoyes} emails envoyés pour l'utilisateur ${userId}`);
        return emailsEnvoyes;

    } catch (error) {
        console.error("❌ Erreur lors de la vérification des rappels :", error);
    }
};

// Fonction pour démarrer le scheduler côté client
export const startClientNotificationScheduler = (userId: string) => {
    // Vérifier toutes les minutes
    const interval = setInterval(() => {
        checkMedicationsForUser(userId);
    }, 60000);
    
    // Vérifier immédiatement au démarrage
    checkMedicationsForUser(userId);
    
    console.log('🔄 Scheduler côté client démarré pour l\'utilisateur:', userId);
    
    // Retourner la fonction pour arrêter le scheduler
    return () => {
        clearInterval(interval);
        console.log('⏹️ Scheduler côté client arrêté');
    };
};
