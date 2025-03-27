import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Tag } from "./Dashboard"

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: Tag[]
}

// Lista de etiquetas predefinidas
const predefinedTags: Tag[] = [
  { id: "tag-1", name: "Trabajo", color: "bg-blue-500" },
  { id: "tag-2", name: "Personal", color: "bg-green-500" },
  { id: "tag-3", name: "Importante", color: "bg-red-500" },
  { id: "tag-4", name: "Ideas", color: "bg-purple-500" },
  { id: "tag-5", name: "Proyecto", color: "bg-yellow-500" },
]

export default function NotePage() {
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navigate = useNavigate()
  const params = useParams()
  const id = params.id as string

  const isNewNote = id === "new"

  // Cargar nota
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      navigate("/")
      return
    }

    if (isNewNote) {
      setNote({
        id: "new",
        title: "Nueva Nota",
        content: "",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setTitle("Nueva Nota")
      setContent("")
      setTags([])
      setIsLoading(false)
      return
    }

    const loadNote = async () => {
      try {
        // Simulación de carga de nota
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Notas de ejemplo con etiquetas
        const exampleNotes: Record<string, Note> = {
          "1": {
            id: "1",
            title: "Bienvenido a Sistema de Notas",
            content: "Esta es tu primera nota. Puedes editarla o crear nuevas notas.",
            tags: [predefinedTags[1], predefinedTags[0]],
            createdAt: new Date(Date.now() - 86400000 * 2),
            updatedAt: new Date(Date.now() - 86400000 * 2),
          },
          "2": {
            id: "2",
            title: "Ideas para proyectos",
            content: "Lista de ideas para futuros proyectos...",
            tags: [predefinedTags[3], predefinedTags[4]],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }

        // Obtener la nota según el ID
        const exampleNote = exampleNotes[id] || {
          id,
          title: "Nota",
          content: "Contenido de la nota",
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        setNote(exampleNote)
        setTitle(exampleNote.title)
        setContent(exampleNote.content)
        setTags(exampleNote.tags)
      } catch (error) {
        console.log("Error al cargar la nota:", error);
        navigate("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    loadNote()
  }, [id, isNewNote, navigate])

  // Guardar automáticamente después de 2 segundos de inactividad
  useEffect(() => {
    if (isLoading || isNewNote) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (title !== note?.title || content !== note?.content || JSON.stringify(tags) !== JSON.stringify(note?.tags)) {
        saveNote(false)
      }
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content, tags, note, isNewNote, isLoading])

  // Guardar nota
  const saveNote = async (showToast = true) => {
    if (isSaving) return

    setIsSaving(true)

    try {
      // Simulación de guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedNote = {
        ...note!,
        title,
        content,
        tags,
        updatedAt: new Date(),
      }

      setNote(updatedNote)

      if (isNewNote) {
        // Redirigir a la nota recién creada (simulado con ID 2)
        navigate("/notes/2")
      }
    } catch (error) {
      console.log("Error al guardar la nota:", error);
      // Error silencioso
    } finally {
      setIsSaving(false)
    }
  }

  // Volver al dashboard
  const goBack = () => {
    navigate("/dashboard")
  }

  // Seleccionar etiqueta
  const toggleTag = (tag: Tag) => {
    if (tags.some((t) => t.id === tag.id)) {
      setTags(tags.filter((t) => t.id !== tag.id))
    } else {
      setTags([...tags, tag])
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 flex items-center">
          <button className="btn btn-outline mr-2" onClick={goBack}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Cargando...</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 flex justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-2xl">
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button className="btn btn-outline mr-2" onClick={goBack}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{note?.title}</h1>
        </div>
        <button className="btn btn-primary" onClick={() => saveNote(true)} disabled={isSaving}>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          {isSaving ? "Guardando..." : "Guardar"}
        </button>
      </header>

      <main className="flex-1 p-4 md:p-6 flex justify-center">
        <div className="card w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Editor de Nota</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="label">
                Título
              </label>
              <input
                id="title"
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título de la nota"
              />
            </div>

            <div>
              <label htmlFor="content" className="label">
                Contenido
              </label>
              <textarea
                id="content"
                className="input min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu nota aquí..."
              />
            </div>

            <div>
              <label className="label">Etiquetas</label>
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag.id}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tags.some((t) => t.id === tag.id)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn btn-primary" onClick={() => saveNote(true)} disabled={isSaving}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

