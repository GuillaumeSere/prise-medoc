"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../src/lib/firebase";
import { Button } from "../../src/components/ui/button";
import Link from "next/link";

export default function Connexion() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const provider = new GoogleAuthProvider();  // on importe le provider Google pour l'authentification

    const connexionFn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password) // la fonction signInWithEmailAndPassword de firebase pour se connecter
            .then((userCredential) => {
                // Connexion réussie
                const user = userCredential.user;
                console.log("Utilisateur connecté :", user);
                router.push("/dashboard");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Erreur de connexion :", errorCode, errorMessage);
            });
    };


    // google connect
    const connexionGoogle = async () => {
        if (loading) return; //afin de ne pas lancer plusieurs fois la fonction
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, provider); //   la fonction signInWithPopup de firebase pour se connecter avec Google
            const user = result.user;
            router.push("/dashboard");
        } catch (error) {
            console.error("Erreur de connexion Google :", error.code || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="rounded-2xl m-2 md:m-5 flex flex-col md:flex-row relative overflow-hidden gap-4 md:gap-70 py-[3%] px-[5%] relative z-10"
            style={{
                minHeight: "calc(100vh - 2.5rem)",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
            }}
        >
            {/* Blobs en fond */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-70 z-0 transform scale-x-150"></div>
            <div className="absolute bottom-15 -left-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute bottom-15 -right-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-15 z-0 transform "></div>
            <div className="absolute top-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-70 z-0 transform scale-x-150"></div>
            <div className="absolute top-15 -left-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute top-15 -right-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-15 z-0 transform "></div>

            {/*  gauche */}
            <div className="w-full md:w-1/2 h-full relative z-10 flex flex-col justify-between p-4 md:p-0">
                <div>
                    <Link href="/" className="text-[#000000] hover:text-[#3b803b] mb-4 transition-colors inline-block">
                        ← Retour à l&apos;accueil
                    </Link>
                    <h3 className="text-2xl md:text-4xl relative font-bold z-10">
                        Bienvenue sur <br /> Prise Médoc.
                    </h3>
                </div>
                <div className="flex flex-col gap-5 relative z-10 mt-8 md:mt-0">
                    <div className="flex flex-row gap-5 items-start">
                        <img className="h-7 w-7 mt-1" src="icon/forme-abstraite2.png" alt="forme verte" />
                        <div className="flex flex-col gap-2">
                            <h4 className="text-lg md:text-xl">Accède à tes informations personnelles</h4>
                            <p className="text-sm text-gray-600">
                                Connecte-toi pour accéder à ta liste de médicaments, voir ceux que tu as pris aujourd&apos;hui et gérer tes rappels.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-row gap-5 items-start">
                        <img className="h-7 w-7 mt-1" src="icon/forme-abstraite2.png" alt="forme verte" />
                        <div className="flex flex-col gap-2">
                            <h4 className="text-lg md:text-xl">Un espace sécurisé rien que pour toi</h4>
                            <p className="text-sm text-gray-600">
                                Ton espace est personnel et protégé. Reprends là où tu t&apos;étais arrêté, en toute tranquillité.
                            </p>
                        </div>
                    </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold mt-10 relative z-10">
                    Prise Médoc.
                </h3>
            </div>

            {/* droite */}
            <div className="w-full md:w-1/2 min-h-[400px] bg-white p-4 md:p-[5%] shadow-xl rounded-2xl flex flex-col items-center justify-center relative z-10 mt-4 md:mt-0">
                <h2 className="text-2xl md:text-3xl font-bold text-center">Se connecter</h2>
                <p className="text-gray-600 text-sm mb-6 text-center"> Vous avez déjà un compte ?{" "}
                    <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => router.push("/inscription")}>
                        S&apos;inscrire
                    </span>
                </p>
                <form onSubmit={connexionFn} className="flex flex-col gap-4 w-full max-w-md">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 rounded-md border border-gray-300 w-full"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 rounded-md border border-gray-300 w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-full hover:bg-blue-600 transition-colors">
                        Se connecter
                    </button>
                    <div className="border-t border-gray-300 my-4"></div>
                    <Button 
                        variant="default"
                        size="default"
                        className="bg-white text-black border border-gray-600 w-full justify-center hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={connexionGoogle}
                    >
                        <img src="icon/google-logo.png" alt="google"
                            className="w-5 h-5" />
                        <span>Continuer avec Google</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}

