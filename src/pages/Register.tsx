import { Alert, AlertDescription, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label } from "@/components/ui"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username: email,
          password,
        }),
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify({ email, token: data.access_token, id: data.id }))
      navigate("/dashboard")
    } catch (error) {
      console.log(error);
      setError("Error al registrar. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
    //   <div className="card w-full max-w-md">
    //     <div className="mb-6">
    //       <h2 className="text-2xl font-bold">Crear una cuenta</h2>
    //       <p className="text-gray-600 text-sm">Ingresa tus datos para registrarte en el Sistema de Notas</p>
    //     </div>

    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       {error && <div className="alert alert-error">{error}</div>}



    //       <div>

    //       </div>

    //       <div>

    //       </div>

    //       <div>

    //       </div>


    //     </form>

    //     <div className="mt-6 text-center text-sm">

    //     </div>
    //   </div>
    // </div>
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-x-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2x1 font-bold">Crear una Cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para registrarte en el Sistema de Notas </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="password">
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
            <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-2 text-center text-sm">
        ¿Ya tienes una cuenta?{" "}

          </div>
          <a onClick={() => navigate("/")} className="text-primary underline-offset-4 hover:underline">
            Iniciar Sesión
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
