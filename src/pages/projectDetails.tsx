import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";

export default function ProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState({ name: "", description: "" });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project:", error);
            }
        };
        fetchProject();
    }, [projectId]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://127.0.0.1:8000/api/projects/${projectId}`,
                { name: project.name, description: project.description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate("/projects");
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-violet-500 to-purple-700 flex items-center justify-center p-4">
            <form onSubmit={handleUpdate} className="w-full max-w-lg bg-white bg-opacity-10 p-8 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-bold text-white">Editar Proyecto</h2>
                <div>
                    <Input
                        type="text"
                        value={project.name}
                        onChange={(e) => setProject({ ...project, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-white bg-opacity-20 border border-transparent rounded-md text-white placeholder-purple-200"
                    />
                </div>
                <div>
                    <textarea
                        value={project.description}
                        onChange={(e) => setProject({ ...project, description: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-white bg-opacity-20 border border-transparent rounded-md text-white placeholder-purple-200"
                    />
                </div>
                <Button type="submit" className="w-full bg-salmon-500 hover:bg-salmon-600 text-white font-semibold py-2 rounded-md">
                    Guardar Cambios
                </Button>
            </form>
        </div>
    );
}
