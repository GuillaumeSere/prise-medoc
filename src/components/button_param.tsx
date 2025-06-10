"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Image from "next/image";

interface ParamProps {
  onModif: (id: string) => void;
  onDelete: (id: string) => void;
  id: string;
}

export function Param({ onModif, onDelete, id }: ParamProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
          <div className="w-6 h-6 text-gray-600 hover:opacity-80 transition-opacity">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-lg">
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-gray-100 p-2 flex items-center gap-2"
          onClick={() => onModif(id)}
          inset={false}
        >
          <div className="w-5 h-5 text-gray-600">
          <Image 
              src="/icon/modifier.png" 
              alt="Supprimer" 
              width={20} 
              height={20}
            />
          </div>
          <span>Modifier</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-red-50 p-2 flex items-center gap-2"
          onClick={() => onDelete(id)}
          inset={false}
        >
          <div className="w-5 h-5">
            <Image 
              src="/icon/delete.png" 
              alt="Supprimer" 
              width={20} 
              height={20}
            />
           </div>
          <span className="text-red-600">Supprimer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
