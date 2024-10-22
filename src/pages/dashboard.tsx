import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Music, Home, Mic, PlayCircle, Settings, Search, Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Cargar los proyectos recientes desde el backend
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/api/projects", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        fetchProjects();
    }, []);

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem("token"); // Eliminar el token de autenticación del localStorage
        navigate("/"); // Redirigir al usuario a la página de inicio de sesión
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-600 via-violet-500 to-purple-700">
            {/* Sidebar */}
            <aside className="w-64 bg-white bg-opacity-10 text-white p-6">
                <div className="flex items-center mb-8">
                    <Music className="h-8 w-8 mr-2" />
                    <span className="text-2xl font-bold">MusicGen</span>
                </div>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:bg-opacity-10" onClick={() => navigate("/dashboard")}>
                                <Home className="mr-2 h-4 w-4" /> Dashboard
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:bg-opacity-10" onClick={() => navigate("/piano-roll")}>
                                <Mic className="mr-2 h-4 w-4" /> Crear
                            </Button>

                        </li>
                        <li>
                            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:bg-opacity-10" onClick={() => navigate("/projects")}>
                                <PlayCircle className="mr-2 h-4 w-4" /> Biblioteca
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:bg-opacity-10">
                                <Settings className="mr-2 h-4 w-4" /> Ajustes
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" className="w-full justify-start text-white hover:bg-white hover:bg-opacity-10" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                            </Button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <header className="bg-white bg-opacity-10 p-4 flex justify-between items-center">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-purple-300" />
                        <Input
                            className="pl-8 bg-white bg-opacity-20 border-none text-white placeholder-purple-300"
                            placeholder="Buscar..."
                            onChange={(e) => console.log(e.target.value)} // Implementar la búsqueda aquí
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="text-white">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate("/profile")}>
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                {/* Dashboard content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card Component Replacement */}
                    <div className="bg-white bg-opacity-10 text-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Creaciones Recientes</h3>
                        {projects.length === 0 ? (
                            <p>No tienes proyectos recientes.</p>
                        ) : (
                            <ul className="space-y-2">
                                {projects.map((project) => (
                                    <li
                                        key={project.id}
                                        className="hover:underline cursor-pointer"
                                        onClick={() => navigate(`/projects/${project.id}`)}
                                    >
                                        {project.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white bg-opacity-10 text-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Estadísticas</h3>
                        <p>Aquí se mostrarán tus estadísticas de uso.</p>
                    </div>

                    <div className="bg-white bg-opacity-10 text-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Tendencias</h3>
                        <p>Aquí verás las tendencias musicales actuales.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
