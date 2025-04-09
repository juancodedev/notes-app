import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label } from "@/components/ui";
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
            localStorage.setItem("user", JSON.stringify({ email, token: data.access_token, id: data.id }))
            navigate("/dashboard")
        } catch (error) {
            console.log(error);
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

            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2x1 font-bold">
                        Iniciar Sesión
                    </CardTitle>
                    <CardDescription>
                    Ingresa tus credenciales para acceder a tus notas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="label">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="input"
                                placeholder="tu@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="label">
                                Contraseña
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <div className="mt-2 text-center text-sm">
                        ¿No tienes una cuenta?{" "}
                        <a onClick={() => navigate("/register")} className="text-primary underline-offset-4 hover:underline">
                            Regístrate
                        </a>
                    </div>
                </CardFooter>
            </Card>
            <div className="mt-8 text-center text-xs text-gray-500">
                © 2025 Sistema de Notas. Todos los derechos reservados.
            </div>
        </div>
    )
};
