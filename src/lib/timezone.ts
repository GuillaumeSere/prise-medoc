/**
 * Utilitaires pour la gestion des fuseaux horaires
 * Assure une gestion cohérente de l'heure française dans toute l'application
 */

export interface FrenchTime {
    hour: number;
    minute: number;
    second: number;
    day: number;
    month: number;
    year: number;
    timeString: string;
    dateString: string;
}

/**
 * Obtient l'heure française actuelle de manière fiable
 * @returns Objet contenant les informations de temps français
 */
export const getFrenchTime = (): FrenchTime => {
    const currentTime = new Date();
    
    // Utiliser Intl.DateTimeFormat pour une gestion correcte du fuseau horaire
    const frenchFormatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const frenchTimeParts = frenchFormatter.formatToParts(currentTime);
    
    const hour = parseInt(frenchTimeParts.find(part => part.type === 'hour')?.value || '0');
    const minute = parseInt(frenchTimeParts.find(part => part.type === 'minute')?.value || '0');
    const second = parseInt(frenchTimeParts.find(part => part.type === 'second')?.value || '0');
    const day = parseInt(frenchTimeParts.find(part => part.type === 'day')?.value || '0');
    const month = parseInt(frenchTimeParts.find(part => part.type === 'month')?.value || '0');
    const year = parseInt(frenchTimeParts.find(part => part.type === 'year')?.value || '0');
    
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const dateString = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    
    return {
        hour,
        minute,
        second,
        day,
        month,
        year,
        timeString,
        dateString
    };
};

/**
 * Vérifie si l'heure actuelle correspond à l'heure de prise d'un médicament
 * @param medicationTime Heure de prise du médicament au format "HH:MM"
 * @returns true si c'est l'heure de prendre le médicament
 */
export const isMedicationTime = (medicationTime: string): boolean => {
    const frenchTime = getFrenchTime();
    const [medHour, medMinute] = medicationTime.split(':').map(Number);
    
    return frenchTime.hour === medHour && frenchTime.minute === medMinute;
};

/**
 * Obtient l'heure française formatée pour les logs
 * @returns String formatée pour les logs
 */
export const getFrenchTimeForLogs = (): string => {
    const frenchTime = getFrenchTime();
    return `🇫🇷 ${frenchTime.dateString} ${frenchTime.timeString}`;
};

/**
 * Convertit une heure UTC en heure française
 * @param utcDate Date UTC
 * @returns Objet contenant les informations de temps français
 */
export const convertUTCToFrenchTime = (utcDate: Date): FrenchTime => {
    const frenchFormatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const frenchTimeParts = frenchFormatter.formatToParts(utcDate);
    
    const hour = parseInt(frenchTimeParts.find(part => part.type === 'hour')?.value || '0');
    const minute = parseInt(frenchTimeParts.find(part => part.type === 'minute')?.value || '0');
    const second = parseInt(frenchTimeParts.find(part => part.type === 'second')?.value || '0');
    const day = parseInt(frenchTimeParts.find(part => part.type === 'day')?.value || '0');
    const month = parseInt(frenchTimeParts.find(part => part.type === 'month')?.value || '0');
    const year = parseInt(frenchTimeParts.find(part => part.type === 'year')?.value || '0');
    
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const dateString = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    
    return {
        hour,
        minute,
        second,
        day,
        month,
        year,
        timeString,
        dateString
    };
};
