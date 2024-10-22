import React from "react";
import { Button } from "../ui/button";
import { Pencil, Trash, PlusCircle } from "lucide-react";

export default function Toolbar() {
    return (
        <div className="toolbar flex justify-between w-full px-4 py-2 bg-gray-800 text-white">
            <div className="flex space-x-4">
                <Button variant="ghost" className="flex items-center">
                    <Pencil className="mr-1" /> Dibujar
                </Button>
                <Button variant="ghost" className="flex items-center">
                    <Trash className="mr-1" /> Borrar
                </Button>
                <Button variant="ghost" className="flex items-center">
                    <PlusCircle className="mr-1" /> Agregar Efectos
                </Button>
            </div>
        </div>
    );
}
