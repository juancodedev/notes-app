import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Tipo para las etiquetas
export type Tag = {
  id: string
  name: string
  color?: string
}

// Tipo para las notas
interface Note {
  id: string
  title: string
  content: string
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
}

// Lista de etiquetas predefinidas
const predefinedTags: Tag[] = [
  { id: "tag-1", name: "Trabajo", color: "bg-blue-500" },
  { id: "tag-2", name: "Personal", color: "bg-green-500" },
  { id: "tag-3", name: "Importante", color: "bg-red-500" },
  { id: "tag-4", name: "Ideas", color: "bg-purple-500" },
  { id: "tag-5", name: "Proyecto", color: "bg-yellow-500" },
]

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      navigate("/")
      return
    }

    // Cargar notas (simulado)
    const loadNotes = async () => {
      try {
        // Simulación de carga de notas
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Notas de ejemplo con etiquetas
        const exampleNotes: Note[] = [
          {
            id: "1",
            title: "Bienvenido a Sistema de Notas",
            content: "Esta es tu primera nota. Puedes editarla o crear nuevas notas.",
            tags: [predefinedTags[1], predefinedTags[0]],
            createdAt: new Date(Date.now() - 86400000 * 2),
            updatedAt: new Date(Date.now() - 86400000 * 2),
          },
          {
            id: "2",
            title: "Ideas para proyectos",
            content: "Lista de ideas para futuros proyectos...",
            tags: [predefinedTags[3], predefinedTags[4]],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]

        setNotes(exampleNotes)
      } catch (error) {
        console.error("Error al cargar notas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotes()
  }, [navigate])

  // Filtrar notas según la búsqueda y etiqueta seleccionada
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = selectedTag ? note.tags.some((tag) => tag.id === selectedTag) : true

    return matchesSearch && matchesTag
  })

  // Crear nueva nota
  const createNewNote = () => {
    navigate("/notes/new")
  }

  // Editar nota
  const editNote = (id: string) => {
    navigate(`/notes/${id}`)
  }

  // Eliminar nota
  const deleteNote = async (id: string) => {
    try {
      // Simulación de eliminación
      await new Promise((resolve) => setTimeout(resolve, 500))

      setNotes(notes.filter((note) => note.id !== id))
    } catch (error) {
      console.log("Error al eliminar la nota:", error);

    }
  }

  // Filtrar por etiqueta
  const filterByTag = (tagId: string) => {
    setSelectedTag(selectedTag === tagId ? null : tagId)
  }

  // Obtener todas las etiquetas únicas de las notas
  const getUniqueTags = () => {
    const uniqueTags: Tag[] = []
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        if (!uniqueTags.some((t) => t.id === tag.id)) {
          uniqueTags.push(tag)
        }
      })
    })
    return uniqueTags
  }

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }

  // Formatear fecha relativa
  const formatRelativeDate = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "hace unos segundos"
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
    return `hace ${Math.floor(diffInSeconds / 86400)} días`
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Sistema de Notas</h1>
        <button className="btn btn-outline" onClick={logout}>
          Cerrar Sesión
        </button>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="search"
              placeholder="Buscar notas..."
              className="input pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button className="btn btn-primary" onClick={createNewNote}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Nota
          </button>
        </div>

        {/* Filtro de etiquetas */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-sm font-medium">Filtrar por etiqueta:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {getUniqueTags().map((tag) => (
              <button
                key={tag.id}
                className={`px-2 py-1 rounded-full text-xs font-medium ${selectedTag === tag.id ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                onClick={() => filterByTag(tag.id)}
              >
                {tag.name}
              </button>
            ))}
            {selectedTag && (
              <button className="px-2 py-1 text-xs text-blue-600 hover:underline" onClick={() => setSelectedTag(null)}>
                Limpiar filtro
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-5 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <div key={note.id} className="card">
                <h3 className="text-lg font-semibold mb-1">{note.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{formatRelativeDate(new Date(note.updatedAt))}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{note.content}</p>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.map((tag) => (
                      <span key={tag.id} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    className="text-sm text-blue-600 hover:underline flex items-center"
                    onClick={() => editNote(note.id)}
                  >
                    <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>
                  <button
                    className="text-sm text-red-600 hover:underline flex items-center"
                    onClick={() => deleteNote(note.id)}
                  >
                    <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No se encontraron notas</p>
            <button className="btn btn-primary" onClick={createNewNote}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Nueva Nota
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

