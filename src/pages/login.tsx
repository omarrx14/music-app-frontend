import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Music, Github, Twitter } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "https://musicgendemo.onrender.com/api/users/token",
                `username=${email}&password=${password}`,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );
            localStorage.setItem("token", response.data.access_token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed. Please check your email and password.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-violet-500 to-purple-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <Music className="mx-auto h-12 w-12 text-white" />
                    <h2 className="mt-4 text-3xl font-bold text-white">MusicGen</h2>
                    <p className="mt-2 text-sm text-purple-100">Sign in to create your next hit</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <Input
                            className="w-full px-3 py-2 bg-white bg-opacity-30 border border-transparent rounded-md text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-salmon-400 focus:border-transparent"
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            className="w-full px-3 py-2 bg-white bg-opacity-30 border border-transparent rounded-md text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-salmon-400 focus:border-transparent"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Button type="submit" className="w-full bg-salmon-500 hover:bg-salmon-600 text-white font-semibold py-2 rounded-md transition duration-300">
                            Sign In
                        </Button>
                    </div>
                </form>
                <div className="flex items-center justify-between">
                    <hr className="w-full border-purple-300" />
                    <span className="px-2 text-sm text-purple-200">Or</span>
                    <hr className="w-full border-purple-300" />
                </div>
                <div className="flex justify-center space-x-4">
                    <Button variant="outline" className="bg-white bg-opacity-20 text-white hover:bg-opacity-30">
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                    </Button>
                    <Button variant="outline" className="bg-white bg-opacity-20 text-white hover:bg-opacity-30">
                        <Twitter className="mr-2 h-4 w-4" />
                        Twitter
                    </Button>
                </div>
                <div className="text-center">
                    <a href="#" className="text-sm text-purple-100 hover:underline">
                        Forgot your password?
                    </a>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-violet-500 to-salmon-500"></div>
            </div>
        </div>
    );
}
