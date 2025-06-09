"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Image from "next/image";



export function Param({ onModif ,onDelete, id }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer px-6">
        <Image src="/icon/param.png" alt="button param" width={24} height={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="cursor-pointer" inset={false} onClick={() => onModif(id)}>Modifier</DropdownMenuItem> 
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem className="cursor-pointer" inset={false} onClick={() => onDelete(id)}>Supprimer</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
