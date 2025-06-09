'use client';

import { usePathname, useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Deconnexion from "../deconnexion";

const iconpath = [
  { src: "/icon/menu/accueil_black.png", path: "/dashboard", label: "Accueil" },
  { src: "/icon/menu/liste-a-puces_black.png", path: "/dashboard/listMedic", label: "Liste des médicaments" },
  { src: "/icon/menu/plus_black.png", path: "/dashboard/add_medicament", label: "Ajouter un médicament" },
  { src: "/icon/menu/notification_black.png", path: "/dashboard/notif_param", label: "Paramètres" },
];

const iconpath_white = [
  { src: "/icon/menu/accueil.png", path: "/dashboard", label: "Accueil" },
  { src: "/icon/menu/liste-a-puces.png", path: "/dashboard/listMedic", label: "Liste des médicaments" },
  { src: "/icon/menu/plus.png", path: "/dashboard/add_medicament", label: "Ajouter un médicament" },
  { src: "/icon/menu/notification.png", path: "/dashboard/notif_param", label: "Paramètres" },
];

export default function MenuBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [hovered, setHovered] = useState<number | null>(null);
  const [bgTop, setBgTop] = useState<number>(0);
  const [bgLeft, setBgLeft] = useState<number>(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // On utilise le pathname pour déterminer quel élément est actif
  // Si hovered est défini, on l'utilise pour déterminer l'index actif
const activeIndex = hovered ?? iconpath.findIndex((item) =>
  pathname === item.path
);


  const fnClick = (index: number) => {
    router.push(iconpath[index].path);
  };

  useEffect(() => {
    const activeRef = itemRefs.current[activeIndex];
    if (activeRef) {
      requestAnimationFrame(() => {
        const parentRect = activeRef.parentElement?.getBoundingClientRect();
        const elementRect = activeRef.getBoundingClientRect();
        if (parentRect) {
          // Calcul du centre de l'élément actif
          const centerX = elementRect.left - parentRect.left + (elementRect.width / 2);
          const centerY = elementRect.top - parentRect.top + (elementRect.height / 2);
          
          // Ajustement pour centrer le fond
          setBgLeft(centerX - (window.innerWidth < 640 ? 24 : 32)); // 24px pour mobile (w-12), 32px pour desktop (w-16)
          setBgTop(centerY - (window.innerWidth < 640 ? 24 : 32));
        }
      });
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col justify-between h-full relative z-[100] pr-4 sm:pr-[40px]">
      <Card className="rounded-full card bg-white/25 backdrop-blur-md shadow-xl w-16 sm:w-25">
        <div className="relative responsive px-2 sm:px-5 py-2 sm:py-4">
          {/* fond bleu dynamique */}
          <motion.div
            layoutId="activeBackground"
            className="absolute bg-[#407BFF] rounded-full z-0 w-12 h-12 sm:w-16 sm:h-16"
            style={{
              top: bgTop,
              left: bgLeft,
              transform: 'translate(-50%, -50%)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {iconpath.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => fnClick(index)}
              className="relative icon z-[100] h-12 sm:h-16 flex justify-center items-center cursor-pointer"
            >
              <img
                src={
                  index === activeIndex
                    ? iconpath_white[index].src
                    : iconpath[index].src
                }
                alt={`Icon ${index}`}
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
              {hovered === index && (
                <div className="absolute left-full ml-2 px-3 py-1 bg-black text-white text-sm rounded-md whitespace-nowrap z-[200]">
                  {item.label}
                  <div className="absolute top-1/2 right-full transform -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-black"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Deconnexion />
    </div>
  );
}
