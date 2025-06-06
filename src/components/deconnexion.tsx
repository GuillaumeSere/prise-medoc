"use client";
import { useRouter } from "next/navigation";
import useCurrentUser from "../hook/user_verif";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Card } from "./ui/card";
import { useState } from "react";

export default function Deconnexion() {
    const router = useRouter();
    const { user, loading } = useCurrentUser(); // on utilise le hook pour vérifier si l'utilisateur est connecté
    const [showTooltip, setShowTooltip] = useState(false);

    // fonction pour se déconnecter
    const deconnexion = () => {
        signOut(auth) // on utilise la fonction signOut de firebase pour se deco
            .then(() => {
                router.push("/connexion");
            })
            .catch((error) => {
                console.error("Erreur lors de la déconnexion :", error);
            });
    };

    return (
        <div className="relative">
            <Card 
                className="bg-[#ff4040] rounded-full p-2 w-15 h-15 mt-4 flex items-center justify-center cursor-pointer hover:bg-[#ff2020] transition-colors" 
                onClick={deconnexion}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <img
                    src="/icon/menu/deconnexion.png"
                    alt="Icon deconnexion"
                    className="w-6 h-6 object-contain"
                />
            </Card>
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black text-white z-[200] text-sm rounded-md whitespace-nowrap">
                    Se déconnecter
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
                </div>
            )}
        </div>
    );
}