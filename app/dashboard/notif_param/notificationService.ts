import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../src/lib/firebase';

interface Medicament {
    id: string;
    nom: string;
    heure: string;
    pris: boolean;
    uid: string;
}

export const checkMedicamentsNotifications = async (userId: string) => {
    try {
        // Récupérer tous les médicaments non pris de l'utilisateur
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

        // Vérifier chaque médicament
        for (const medicament of medicaments) {
            const [medicamentHour, medicamentMinutes] = medicament.heure.split(':').map(Number);
            
            // Si l'heure actuelle correspond à l'heure de prise du médicament
            if (currentHour === medicamentHour && currentMinutes === medicamentMinutes) {
                // Envoyer la notification
                await sendNotification(medicament);
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification des notifications :", error);
    }
};

const sendNotification = async (medicament: Medicament) => {
    try {
        // Vérifier si les notifications sont supportées
        if (!("Notification" in window)) {
            console.log("Ce navigateur ne supporte pas les notifications");
            return;
        }

        // Demander la permission si nécessaire
        if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                console.log("Permission de notification refusée");
                return;
            }
        }

        // Créer et envoyer la notification
        const notification = new Notification("Rappel de médicament", {
            body: `Il est l'heure de prendre votre médicament : ${medicament.nom}`,
            icon: "../../../icon/notification.png",
            tag: medicament.id,
            requireInteraction: true
        });

        // Gérer le clic sur la notification
        notification.onclick = () => {
            window.focus();
            notification.close();
        };

    } catch (error) {
        console.error("Erreur lors de l'envoi de la notification :", error);
    }
}; 