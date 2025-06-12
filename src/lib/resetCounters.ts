import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc, Timestamp } from 'firebase/firestore';

interface Medication {
    id: string;
    userId: string;
    lastTaken: Timestamp;
    isTaken: boolean;
    // autres propriétés...
}

export const resetDailyCounters = async (userId: string) => {
    try {
        // Récupérer tous les médicaments de l'utilisateur
        const medicationsRef = collection(db, 'medications');
        const q = query(medicationsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const batch = [];
        querySnapshot.forEach((doc) => {
            const medication = doc.data() as Medication;
            const lastTaken = medication.lastTaken?.toDate();
            
            // Vérifier si le médicament a été pris hier ou avant
            if (lastTaken && lastTaken < today) {
                batch.push(updateDoc(doc.ref, {
                    isTaken: false,
                    lastTaken: null,
                    // Réinitialiser d'autres compteurs si nécessaire
                    dailyCount: 0,
                    streak: 0
                }));
            }
        });

        // Exécuter toutes les mises à jour en batch
        if (batch.length > 0) {
            await Promise.all(batch);
            console.log(`${batch.length} médicaments réinitialisés pour ${userId}`);
        }

        return true;
    } catch (error) {
        console.error('Erreur lors de la réinitialisation des compteurs:', error);
        return false;
    }
};

// Fonction pour vérifier si une réinitialisation est nécessaire
export const checkAndResetCounters = async (userId: string) => {
    try {
        const lastResetRef = collection(db, 'userSettings');
        const q = query(lastResetRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (querySnapshot.empty) {
            // Premier accès de l'utilisateur
            await resetDailyCounters(userId);
            return;
        }

        const userSettings = querySnapshot.docs[0];
        const lastReset = userSettings.data().lastReset?.toDate();

        if (!lastReset || lastReset < today) {
            // Réinitialiser les compteurs
            await resetDailyCounters(userId);
            
            // Mettre à jour la date de dernière réinitialisation
            await updateDoc(userSettings.ref, {
                lastReset: Timestamp.now()
            });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification des compteurs:', error);
    }
}; 