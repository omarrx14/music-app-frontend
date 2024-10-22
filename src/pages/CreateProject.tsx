import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function CreateProject() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("No token found. Please login first.");
                return;
            }
            const response = await axios.post(
                "http://127.0.0.1:8000/api/projects/",
                { name, description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            navigate(`/projects/${response.data.id}`);
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Error creating project. Please check the console for more details.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-violet-500 to-purple-700 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white bg-opacity-10 p-8 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-bold text-white">Crear Nuevo Proyecto</h2>
                <div>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre del Proyecto"
                        required
                        className="w-full px-3 py-2 bg-white bg-opacity-20 border border-transparent rounded-md text-white placeholder-purple-200"
                    />
                </div>
                <div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del Proyecto"
                        required
                        className="w-full px-3 py-2 bg-white bg-opacity-20 border border-transparent rounded-md text-white placeholder-purple-200"
                    />
                </div>
                <Button type="submit" className="w-full bg-salmon-500 hover:bg-salmon-600 text-white font-semibold py-2 rounded-md">
                    Crear Proyecto
                </Button>
            </form>
        </div>
    );
}
