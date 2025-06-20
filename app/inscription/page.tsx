"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {  createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { auth } from "../../src/lib/firebase"; 
import "../../src/lib/firebase"; 
import { Button } from "../../src/components/ui/button";

export default function Inscription() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const provider = new GoogleAuthProvider();  // on importe le provider Google pour l'authentification

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const inscriptionFn = (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password) // la fonction createUserWithEmailAndPassword de firebase pour créer un utilisateur
      .then((userCredential) => { 
        // Inscription réussie
        const user = userCredential.user;
        // Met à jour le profil avec le username
        return updateProfile(user, {
          displayName: username,
        }).then(() => {
          router.push("/dashboard");
    });
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = "";
        
        switch (errorCode) {
          case "auth/invalid-email":
            errorMessage = "L'adresse email n'est pas valide";
            break;
          case "auth/email-already-in-use":
            errorMessage = "Cette adresse email est déjà utilisée";
            break;
          case "auth/weak-password":
            errorMessage = "Le mot de passe est trop faible";
            break;
          default:
            errorMessage = "Une erreur est survenue lors de l'inscription";
        }
        
        setError(errorMessage);
        console.error("Erreur d'inscription :", errorCode, error.message);
      });
  };

  const connexionGoogle = () => { 
  signInWithPopup(auth, provider) //   la fonction signInWithPopup de firebase pour se connecter avec Google
    .then((result) => {
      const user = result.user;
      router.push("/dashboard"); // redirection après connexion
    })
    .catch((error) => {
      console.error("Erreur de connexion Google :", error.code, error.message);
    });
};


  return (
    <div
      className="rounded-2xl m-5 flex flex-row overflow-hidden gap-70 py-[3%] px-[5%] relative z-10"
      style={{
        height: "calc(100vh - 2.5rem)", 
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
      }}
    >      
      {/* Blobs en fond */}           
      <div className="absolute bottom-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-70 z-0 transform scale-x-150"></div>
      <div className="absolute bottom-15 -left-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
      <div className="absolute bottom-15 -right-10 w-96 h-96 bg-[#77FFB2] rounded-full blur-3xl opacity-70 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-[#88CDFF] rounded-full blur-3xl opacity-15 z-0 transform "></div>
  
  
      {/*  gauche */}
      <div className="w-1/2 h-full relative z-10 flex flex-col justify-between ">
        <h3 className="text-4xl mb-[2%] relative font-bold z-10">
          Bienvenue sur <br /> Prise Médoc.
        </h3>

        <div className="flex flex-col gap-5 relative z-10">
           <div className="flex flex-row gap-5 items-center">
              <Image className="h-7 w-7" src="/icon/forme-abstraite2.png" alt="forme verte" width={28} height={28} />
              <div className="flex flex-col gap-2">
                <h4 className="text-xl">Accède à tes informations personnelles</h4>
                <p className="text-sm text-gray-600">
                  Connecte-toi pour accéder à ta liste de médicaments, voir ceux que tu as pris aujourd&apos;hui et gérer tes rappels.              
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-5 items-center">
              <Image className="h-7 w-7" src="/icon/forme-abstraite2.png" alt="forme verte" width={28} height={28} />
              <div className="flex flex-col gap-2">
                <h4 className="text-xl">Un espace sécurisé rien que pour toi</h4>
                <p className="text-sm text-gray-600">
                  Ton espace est personnel et protégé. Reprends là où tu t&apos;étais arrêté, en toute tranquillité.
                </p>
              </div>
            </div>
        </div>

        <h3 className="text-xl font-bold mt-10 relative z-10">
        Prise Médoc.
        </h3>
      </div>

      <div className="w-1/2 min-h-[400px] bg-white p-[5%] shadow-xl rounded-2xl flex flex-col items-center justify-center relative z-10">
        <h2 className="text-3xl font-bold ">S&apos;inscrire</h2>
        <p className="text-gray-600 text-sm mb-6"> Vous avez déjà un compte ?{" "}
          <span 
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={ () => router.push("/connexion")}>
            Se connecter
          </span>  
        </p>
        {error && (
          <div className="w-3/4 mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}
        <form onSubmit={inscriptionFn} className="flex flex-col gap-4 w-3/4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border rounded-xl w-full"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-xl w-full"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-xl w-full"
          />
          <button type="submit" className="p-3 bg-blue-600 text-white rounded-xl w-full">
            S&apos;inscrire
          </button>

          <div className="border-t border-gray-300 my-4"></div>
          <Button 
            variant="outline"
            size="default"
            className="bg-white text-blac border border-gray-600 w-full justify-center hover:bg-gray-100 cursor-pointer"
            onClick={connexionGoogle}>
            <Image src="/icon/google-logo.png" alt="google" width={20} height={20} className="w-5 h-5" />
            Google
          </Button>
        </form>
      </div>

    </div>);
}
