'use client';

import { usePathname, useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Deconnexion from "../deconnexion";

const iconpath = [
  { src: "/icon/menu/accueil_black.png", path: "/dashboard" },
  { src: "/icon/menu/liste-a-puces_black.png", path: "/dashboard/listMedic" },
  { src: "/icon/menu/plus_black.png", path: "/dashboard/add_medicament" },
  { src: "/icon/menu/notification_black.png", path: "/dashboard/notif_param" },
];

const iconpath_white = [
  { src: "/icon/menu/accueil.png", path: "/dashboard" },
  { src: "/icon/menu/liste-a-puces.png", path: "/dashboard/listMedic" }, 
  { src: "/icon/menu/plus.png", path: "/dashboard/add_medicament" },
  { src: "/icon/menu/notification.png", path: "/dashboard/notif_param" },
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
          setBgLeft(elementRect.left - parentRect.left);
          setBgTop(elementRect.top - parentRect.top);
        }
      });
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col justify-between h-full relative z-10 pr-[40px]">
      <Card className="rounded-full card bg-white/25 backdrop-blur-md shadow-xl w-25">
        <div className="relative responsive px-5 py-4">
          {/* fond bleu dynamique */}
          <motion.div
            layoutId="activeBackground"
            className="absolute bg-[#407BFF] rounded-full z-0"
            style={{
              top: bgTop,
              left: bgLeft,
              height: 64,
              width: 64,
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
              className="relative icon z-10 h-16 flex justify-center items-center cursor-pointer"
            >
              <img
                src={
                  index === activeIndex
                    ? iconpath_white[index].src
                    : iconpath[index].src
                }
                alt={`Icon ${index}`}
                className="w-8 h-8 object-contain"
              />
            </div>
          ))}
        </div>
      </Card>
      {/* <Deconnexion /> */}
      < Deconnexion />
    </div>

  );
}
