"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import useCurrentUser from "../hook/user_verif";

export default function AddMedicament() {
  const { user, loading } = useCurrentUser();
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const medicamentId = searchParams.get("id");

  useEffect(() => {
    if (medicamentId) {
      const fetchMedicament = async () => {
        if (loading || !user) return;
        const medicamentRef = doc(db, "medicaments", medicamentId);
        const medicamentDoc = await getDoc(medicamentRef);
        if (medicamentDoc.exists()) {
          const medicamentData = medicamentDoc.data();
          setName(medicamentData.nom);
          setTime(medicamentData.heure);
        }
      };
      fetchMedicament();
    }
  }, [medicamentId, loading, user]);

  const medicamentFn = async (e) => {
    e.preventDefault();
    if (medicamentId) {
      const medicamentRef = doc(db, "medicaments", medicamentId);
      await updateDoc(medicamentRef, {
        nom: name,
        heure: time,
      }).then(() => {
        setIsModalOpen(true);
        setName("");
        setTime("");
      });
    } else {
      await addDoc(collection(db, "medicaments"), {
        nom: name,
        heure: time,
        pris: false,
        uid: user.uid,
      })
        .then(() => {
          setIsModalOpen(true);
          setName("");
          setTime("");
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout du médicament :", error);
        });
    }
  };

  return (
    <div className="flex flex-col w-full h-full relative z-10">
      <h3 className="text-4xl p-0 m-0">
        {medicamentId ? "Modifier le médicament" : "Ajouter un médicament"}
      </h3>
      <Card className="flex flex-col justify-between w-full h-full mt-4 p-[2%] bg-white/25 backdrop-blur-md shadow-xl relative z-10">
        <CardHeader className="p-0">
          <h4 className="text-lg font-medium">
            {medicamentId ? "Modifier le médicament" : "Ajoute un nouveau médicament"}
          </h4>
        </CardHeader>
        <form onSubmit={medicamentFn} className="flex flex-col justify-between h-full p-4">
          <div className="flex flex-col">
            <label htmlFor="nom" className="text-md font-medium mb-3">
              Nom du médicament
            </label>
            <input
              type="text"
              name="nom"
              placeholder="Nom du médicament"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border p-3 rounded-2xl bg-white/15 backdrop-blur-md shadow-xl"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="heure" className="text-md font-medium mb-3">
              Heure de prise
            </label>
            <input
              type="time"
              name="heure"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="border p-3 rounded-2xl bg-white/15 backdrop-blur-md shadow-xl"
            />
          </div>

          <Button
            variant="default"
            size="default"
            type="submit"
            className="inline-flex p-5 bg-white/20 rounded-4xl text-white font-bold items-center justify-center self-end hover:bg-white/30 cursor-pointer shadow-xl border-b-4 border-[#407BFF] transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <img src="../icon/fleche-droite.png" alt="fleche suivant" className="w-10 h-10" />
          </Button>
        </form>

        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader className="space-y-2">
              <AlertDialogTitle className="text-xl font-bold">
                {medicamentId ? "Médicament modifié !" : "Médicament ajouté !"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Que souhaitez-vous faire ensuite ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-2">
              <AlertDialogCancel className="w-1/2" onClick={() => setIsModalOpen(false)}>
                {medicamentId ? "Continuer à modifier" : " Ajouter un autre médicament !"}
              </AlertDialogCancel>
              <AlertDialogAction className="w-1/2" onClick={() => router.push("/dashboard")}>
                Retour au Dashboard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
} 