"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

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
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
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
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#EF4444" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </div>
          <span className="text-red-600">Supprimer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
