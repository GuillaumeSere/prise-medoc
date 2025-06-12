importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCQIG4VXmqiYVXqlif1rf5QxpEBt6Y9o4I", 
    authDomain: "prise-medoc.firebaseapp.com",
    projectId: "prise-medoc",
    storageBucket: "prise-medoc.firebasestorage.app",
    messagingSenderId: "2555944769",
    appId: "1:2555944769:web:d839cea57cacc6c53b8bc0",
     measurementId: "G-DSEGPZ4GFN"
});

const messaging = firebase.messaging();

// Gestion des messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log('Message reçu en arrière-plan:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon/menu/notification.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
}); 