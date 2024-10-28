import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Music } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true); // Para alternar entre login y registro
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const response = await axios.post(
                    "https://vercel.com/sso-api?url=https%3A%2F%2Fmusic-gen-demo-jznv2kxl2-omars-projects-b5a3697e.vercel.app%2F&nonce=8e745ddf96017f7851c89a8e72b386d8594e124f3004788db7fac8a7cbfca37c/api/users/token",
                    `username=${username}&password=${password}`,
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
                        },
                        withCredentials: true, // Permite el uso de credenciales si el backend las requiere
                    }
                );
                localStorage.setItem("token", response.data.access_token);
                navigate("/dashboard");
            } else {
                await axios.post("https://music-gen-demo-omars-projects-b5a3697e.vercel.app/api/users/signup/", {
                    username,
                    email,
                    password,
                });
                setIsLogin(true); // Cambia a modo login después del registro exitoso
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Nueva función para manejar la solicitud GET
    const handleGetRequest = async () => {
        try {
            const response = await axios.get("https://3.143.246.68");
            console.log("Datos recibidos:", response.data);
            alert("Datos recibidos correctamente.");
        } catch (error) {
            console.error("Error en la solicitud GET:", error);
            alert("Hubo un problema al realizar la solicitud GET.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-violet-500 to-purple-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <Music className="mx-auto h-12 w-12 text-white" />
                    <h2 className="mt-4 text-3xl font-bold text-white">MusicGen</h2>
                    <p className="mt-2 text-sm text-purple-100">
                        {isLogin ? "Sign in to create your next hit" : "Sign up to join MusicGen"}
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <Input
                            className="w-full px-3 py-2 bg-white bg-opacity-30 border border-transparent rounded-md text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-salmon-400"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div>
                            <Input
                                type="email"
                                className="w-full px-3 py-2 bg-white bg-opacity-30 border border-transparent rounded-md text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-salmon-400"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <Input
                            type="password"
                            className="w-full px-3 py-2 bg-white bg-opacity-30 border border-transparent rounded-md text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-salmon-400"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-salmon-500 hover:bg-salmon-600 text-white font-semibold py-2 rounded-md transition duration-300">
                        {isLogin ? "Sign In" : "Sign Up"}
                    </Button>
                </form>
                {/* Botón adicional para la solicitud GET */}
                <div className="flex justify-center mt-4">
                    <Button onClick={handleGetRequest} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-300">
                        Probar Solicitud GET
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <p
                        className="text-purple-200 cursor-pointer"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </p>
                </div>
            </div>
        </div>
    );
}
