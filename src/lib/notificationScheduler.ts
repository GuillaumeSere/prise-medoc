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
    fcmToken?: string;
    emailNotificationsEnabled?: boolean;
}

export const checkAndSendMedicationReminders = async () => {
    try {
        console.log('Vérification des rappels de médicaments...');
        
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

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        console.log(`Heure actuelle: ${currentHour}:${currentMinutes}`);

        // Vérifier chaque médicament
        for (const medicament of medicaments) {
            const [medicamentHour, medicamentMinutes] = medicament.heure.split(':').map(Number);
            
            // Si l'heure actuelle correspond à l'heure de prise du médicament
            if (currentHour === medicamentHour && currentMinutes === medicamentMinutes) {
                console.log(`Rappel pour ${medicament.nom} à ${medicament.heure}`);
                
                // Récupérer les informations de l'utilisateur
                const userDoc = await getDoc(doc(db, "users", medicament.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    
                    // Vérifier si les notifications email sont activées
                    if (userData.emailNotificationsEnabled && userData.email) {
                        try {
                            console.log(`Envoi email de rappel pour ${medicament.nom} à ${userData.email}`);
                            await sendMedicationReminder(
                                userData.email,
                                medicament.nom,
                                medicament.heure
                            );
                            console.log(`✅ Email de rappel envoyé à ${userData.email} pour ${medicament.nom}`);
                        } catch (error) {
                            console.error(`❌ Erreur envoi email pour ${medicament.nom}:`, error);
                        }
                    } else {
                        console.log(`Notifications email désactivées pour l'utilisateur ${medicament.uid}`);
                    }
                } else {
                    console.log(`Utilisateur ${medicament.uid} non trouvé`);
                }
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification des rappels :", error);
    }
};

// Fonction pour démarrer le scheduler (à appeler au démarrage de l'app)
export const startNotificationScheduler = () => {
    // Vérifier toutes les minutes
    setInterval(checkAndSendMedicationReminders, 60000);
    
    // Vérifier immédiatement au démarrage
    checkAndSendMedicationReminders();
    
    console.log('Scheduler de notifications démarré');
};
