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
      // Simulación de registro - en una implementación real, esto sería una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulamos un registro exitoso
      localStorage.setItem("user", JSON.stringify({ name, email }))

      navigate("/dashboard")
    } catch (error) {
      console.log(error);
      setError("Error al registrar. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="card w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Crear una cuenta</h2>
          <p className="text-gray-600 text-sm">Ingresa tus datos para registrarte en el Sistema de Notas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="alert alert-error">{error}</div>}

          <div>
            <label htmlFor="name" className="label">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="input"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div>
            <label htmlFor="confirm-password" className="label">
              Confirmar Contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <button onClick={() => navigate("/")} className="text-blue-600 hover:underline">
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

