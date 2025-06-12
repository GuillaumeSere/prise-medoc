"use client";

import { useEffect } from 'react';
import useCurrentUser from '../src/hook/user_verif';
import { checkAndResetCounters } from '../src/lib/resetCounters';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useCurrentUser();

    useEffect(() => {
        if (user) {
            // Vérifier et réinitialiser les compteurs si nécessaire
            checkAndResetCounters(user.uid);
        }
    }, [user]);

    return <>{children}</>;
} 