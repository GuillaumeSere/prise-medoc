"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../../src/components/ui/card";
import { Switch } from "../../../src/components/ui/switch";
import { Label } from "../../../src/components/ui/label";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../../../src/lib/firebase";
import useCurrentUser from "../../../src/hook/user_verif";

export default function NotifParam() {
    const { user } = useCurrentUser();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [fcmToken, setFcmToken] = useState<string | null>(null);

    useEffect(() => {
        const initializeNotifications = async () => {
            try {
                // Vérifier si le navigateur supporte les notifications
                if (!("Notification" in window)) {
                    console.log("Ce navigateur ne supporte pas les notifications");
                    return;
                }

                // Vérifier la permission actuelle
                const permission = Notification.permission;
                setNotificationsEnabled(permission === "granted");

                // Initialiser Firebase Cloud Messaging
                const messaging = getMessaging(app);
                
                // Demander la permission si nécessaire
                if (permission !== "granted") {
                    const newPermission = await Notification.requestPermission();
                    setNotificationsEnabled(newPermission === "granted");
                }

                // Obtenir le token FCM
                if (permission === "granted") {
                    const token = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
                    });
                    setFcmToken(token);
                    
                    // Écouter les messages en arrière-plan
                    onMessage(messaging, (payload) => {
                        console.log("Message reçu :", payload);
                        new Notification(payload.notification?.title || "Nouvelle notification", {
                            body: payload.notification?.body,
                            icon: "/icon/notification.png"
                        });
                    });
                }
            } catch (error) {
                console.error("Erreur lors de l'initialisation des notifications :", error);
            }
        };

        initializeNotifications();
    }, []);

    const handleNotificationToggle = async () => {
        try {
            if (!notificationsEnabled) {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    setNotificationsEnabled(true);
                    // Réinitialiser FCM
                    const messaging = getMessaging(app);
                    const token = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
                    });
                    setFcmToken(token);
                }
            } else {
                // Désactiver les notifications
                setNotificationsEnabled(false);
                setFcmToken(null);
            }
        } catch (error) {
            console.error("Erreur lors de la modification des paramètres de notification :", error);
        }
    };

    return (
        <div className="container mx-auto p-4 relative z-10">
            <h1 className="text-2xl font-bold mb-6">Paramètres des notifications</h1>
            
            <Card className="w-full max-w-md mx-auto relative">
                <CardHeader className="p-6">
                    <h2 className="text-xl font-semibold">Notifications de rappel</h2>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="notifications" className="flex-1">
                            Activer les notifications de rappel
                        </Label>
                        <Switch
                            id="notifications"
                            checked={notificationsEnabled}
                            onCheckedChange={handleNotificationToggle}
                        />
                    </div>
                    
                    {notificationsEnabled && (
                        <div className="mt-4 p-4 bg-green-50 rounded-md">
                            <p className="text-sm text-green-700">
                                Les notifications sont activées. Vous recevrez des rappels pour vos médicaments.
                            </p>
                        </div>
                    )}
                    
                    {!notificationsEnabled && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                            <p className="text-sm text-yellow-700">
                                Les notifications sont désactivées. Activez-les pour recevoir des rappels.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}