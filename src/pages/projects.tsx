import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";

export default function Projects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("https://music-gen-demo-omars-projects-b5a3697e.vercel.app/api/projects", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    const handleDelete = async (projectId: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://music-gen-demo-omars-projects-b5a3697e.vercel.app/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(projects.filter((project) => project.id !== projectId));
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-violet-500 to-purple-700 p-8">
            <div className="max-w-3xl mx-auto bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Tus Proyectos</h2>
                {projects.length === 0 ? (
                    <p className="text-white">No tienes proyectos disponibles.</p>
                ) : (
                    <ul className="space-y-4">
                        {projects.map((project) => (
                            <li key={project.id} className="bg-white bg-opacity-10 p-4 rounded-lg shadow-md flex justify-between items-center text-white">
                                <div onClick={() => navigate(`/projects/${project.id}`)} className="cursor-pointer hover:underline">
                                    {project.name}
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700">
                                    Eliminar
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
                <Button className="mt-6 bg-salmon-500 hover:bg-salmon-600 text-white font-semibold py-2 px-4 rounded-md" onClick={() => navigate("/projects/new")}>
                    Crear Nuevo Proyecto
                </Button>
            </div>
        </div>
    );
}
