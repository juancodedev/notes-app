import type React from "react"
import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function Home() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)
        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: email,
                    password,
                })
            });

            if (!response.ok) {
                throw new Error("Error en el registro");
            }
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify({email, token: data.access_token, id: data.id}))
            console.log(localStorage.getItem("user"));
            navigate("/dashboard")
        } catch (error) {
            setError("Credenciales inválidas. Por favor intenta de nuevo.")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Sistema de Notas</h1>
                <p className="text-gray-600 max-w-md">
                    Una aplicación simple para crear, editar y organizar tus notas personales
                </p>
            </div>

            <div className="card w-full max-w-md">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
                    <p className="text-gray-600 text-sm">Ingresa tus credenciales para acceder a tus notas</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="alert alert-error">{error}</div>}

                    <div>
                        <label htmlFor="email" className="label">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            placeholder="tu@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="label">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    ¿No tienes una cuenta?{" "}
                    <button onClick={() => navigate("/register")} className="text-blue-600 hover:underline">
                        Regístrate
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
                © 2025 Sistema de Notas. Todos los derechos reservados.
            </div>
        </div>
    )
};
