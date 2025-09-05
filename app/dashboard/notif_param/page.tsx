"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../../src/components/ui/card";
import { Switch } from "../../../src/components/ui/switch";
import { Label } from "../../../src/components/ui/label";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../../../src/lib/firebase";
import useCurrentUser from "../../../src/hook/user_verif";
import { Input } from "../../../src/components/ui/input";
import { Button } from "../../../src/components/ui/button";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../src/lib/firebase";

export default function NotifParam() {
    const { user } = useCurrentUser();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
    const [email, setEmail] = useState("");
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);

    useEffect(() => {
        // Initialiser l'email depuis le profil utilisateur si disponible
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    // Charger les préférences de notification depuis Firestore
    useEffect(() => {
        const loadUserPreferences = async () => {
            if (user?.uid) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setEmailNotificationsEnabled(userData.emailNotificationsEnabled || false);
                        if (userData.email) {
                            setEmail(userData.email);
                        }
                        console.log("Préférences chargées:", userData);
                    }
                } catch (error) {
                    console.error("Erreur lors du chargement des préférences:", error);
                } finally {
                    setIsLoadingPreferences(false);
                }
            } else {
                setIsLoadingPreferences(false);
            }
        };

        loadUserPreferences();
    }, [user?.uid]);

    useEffect(() => {
        const initializeNotifications = async () => {
            try {
                // Vérifier si le navigateur supporte les notifications
                if (!("Notification" in window)) {
                    console.log("Ce navigateur ne supporte pas les notifications");
                    return;
                }

                // Vérifier si le service worker est disponible
                if (!('serviceWorker' in navigator)) {
                    console.log("Ce navigateur ne supporte pas les service workers");
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
                    try {
                        if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
                            console.warn("NEXT_PUBLIC_FIREBASE_VAPID_KEY manquant. Le token FCM ne pourra pas être généré.");
                            return;
                        }
                        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                        const token = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                            serviceWorkerRegistration: registration
                        });
                        
                        if (token) {
                            setFcmToken(token);
                            console.log("Token FCM obtenu avec succès");
                            // Sauvegarder le token FCM dans Firestore (collection users)
                            if (user?.uid) {
                                try {
                                    await setDoc(doc(db, "users", user.uid), {
                                        fcmToken: token
                                    }, { merge: true });
                                    console.log("Token FCM sauvegardé dans Firestore (init)");
                                } catch (err) {
                                    console.error("Erreur lors de la sauvegarde du token FCM dans Firestore (init) :", err);
                                }
                            }
                            
                            // Écouter les messages en arrière-plan
                            onMessage(messaging, (payload) => {
                                try {
                                    console.log("Message reçu :", payload);
                                    const notificationTitle = payload.notification?.title || "Nouvelle notification";
                                    const notificationBody = payload.notification?.body || "";
                                    
                                    // Vérifier si les notifications sont autorisées
                                    if (Notification.permission === "granted") {
                                        new Notification(notificationTitle, {
                                            body: notificationBody,
                                            icon: "../../../icon/notification.png",
                                            badge: "../../../icon/notification.png",
                                            tag: "prise-medoc-notification"
                                        });
                                    }
                                } catch (error) {
                                    console.error("Erreur lors de l&apos;affichage de la notification :", error);
                                }
                            });
                        }
                    } catch (error) {
                        console.error("Erreur lors de l&apos;obtention du token FCM:", error);
                        // Réessayer l'initialisation après un délai
                        setTimeout(() => {
                            initializeNotifications();
                        }, 5000);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de l&apos;initialisation des notifications :", error);
            }
        };

        initializeNotifications();

        // Pas de suppression automatique du token lors du démontage de la page de paramètres
        return () => {};
    }, [fcmToken]);

    const handleNotificationToggle = async () => {
        try {
            if (!notificationsEnabled) {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    setNotificationsEnabled(true);
                    // Réinitialiser FCM
                    const messaging = getMessaging(app);
                    if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
                        console.warn("NEXT_PUBLIC_FIREBASE_VAPID_KEY manquant. Le token FCM ne pourra pas être généré.");
                        return;
                    }
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    const token = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                        serviceWorkerRegistration: registration
                    });
                    setFcmToken(token);
                    // Sauvegarder le token FCM dans Firestore (collection users)
                    if (user?.uid && token) {
                        try {
                            await setDoc(doc(db, "users", user.uid), {
                                fcmToken: token
                            }, { merge: true });
                            console.log("Token FCM sauvegardé dans Firestore");
                        } catch (err) {
                            console.error("Erreur lors de la sauvegarde du token FCM dans Firestore :", err);
                        }
                    }
                }
            } else {
                // Désactiver les notifications
                setNotificationsEnabled(false);
                setFcmToken(null);
                // Supprimer le token FCM de Firestore
                if (user?.uid) {
                    try {
                        await setDoc(doc(db, "users", user.uid), {
                            fcmToken: null
                        }, { merge: true });
                        console.log("Token FCM supprimé de Firestore");
                    } catch (err) {
                        console.error("Erreur lors de la suppression du token FCM dans Firestore :", err);
                    }
                }
            }
        } catch (error) {
            console.error("Erreur lors de la modification des paramètres de notification :", error);
        }
    };

    const handleEmailToggle = async () => {
        if (!emailNotificationsEnabled && !email) {
            alert("Veuillez d&apos;abord entrer une adresse email valide");
            return;
        }
        
        const newEmailEnabled = !emailNotificationsEnabled;
        setEmailNotificationsEnabled(newEmailEnabled);
        
        // Sauvegarder les préférences dans Firestore
        if (user?.uid) {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    emailNotificationsEnabled: newEmailEnabled,
                    email: email
                }, { merge: true });
                console.log("Préférences email sauvegardées");
            } catch (err) {
                console.error("Erreur sauvegarde préférences email:", err);
            }
        }
    };

    const handleSaveEmail = async () => {
        if (!email) {
            alert("Veuillez entrer une adresse email valide");
            return;
        }

        setIsSaving(true);
        try {
            // Sauvegarder l'email dans Firestore
            if (user?.uid) {
                await setDoc(doc(db, "users", user.uid), {
                    email: email,
                    emailNotificationsEnabled: true
                }, { merge: true });
            }

            // Envoyer un email de test avec un vrai rappel de médicament
            const testEmail = user?.email || email;
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: testEmail,
                    medicationName: "Test de rappel de médicament",
                    time: new Date().toLocaleTimeString()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Email de test envoyé avec succès ! Vérifiez votre boîte email.");
            } else {
                throw new Error(data.error || "Erreur lors de l&apos;envoi de l&apos;email");
            }
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des paramètres :", error);
            const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
            alert(`Erreur lors de l'envoi de l'email de test: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto p-4 relative z-10">
            <h1 className="text-2xl font-bold mb-6">Paramètres des notifications</h1>
            
            <div className="space-y-6">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="p-6">
                        <h2 className="text-xl font-semibold">Notifications de rappel</h2>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-x-2 mb-6">
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

                <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="p-6">
                        <h2 className="text-xl font-semibold">Notifications par email</h2>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="email-notifications" className="flex-1">
                                    Activer les notifications par email
                                    {isLoadingPreferences && (
                                        <span className="text-xs text-gray-500 ml-2">(Chargement...)</span>
                                    )}
                                </Label>
                                <Switch
                                    id="email-notifications"
                                    checked={emailNotificationsEnabled}
                                    onCheckedChange={handleEmailToggle}
                                    disabled={isLoadingPreferences}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Adresse email</Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                        disabled={!emailNotificationsEnabled}
                                    />
                                    <Button
                                        onClick={handleSaveEmail}
                                        disabled={!emailNotificationsEnabled || isSaving}
                                        className="bg-blue-600 hover:bg-blue-700"
                                        variant="default"
                                        size="default"
                                    >
                                        {isSaving ? "Enregistrement..." : "Enregistrer"}
                                    </Button>
                                </div>
                            </div>

                            {emailNotificationsEnabled && (
                                <div className="mt-4 p-4 bg-green-50 rounded-md">
                                    <p className="text-sm text-green-700 mb-2">
                                        Vous recevrez des rappels par email à l&apos;adresse spécifiée.
                                    </p>
                                    <Button
                                        onClick={async () => {
                                            try {
                                                const response = await fetch('/api/cron/check-medications', {
                                                    method: 'GET'
                                                });
                                                const data = await response.json();
                                                if (response.ok) {
                                                    alert(`Vérification terminée ! ${data.emailsEnvoyes} emails envoyés.`);
                                                } else {
                                                    alert('Erreur lors de la vérification');
                                                }
                                            } catch (error) {
                                                alert('Erreur lors de la vérification');
                                            }
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        size="sm"
                                        variant="default"
                                    >
                                        Tester les rappels maintenant
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}