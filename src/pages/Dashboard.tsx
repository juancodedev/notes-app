import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Swal from "sweetalert2";

export type Tag = {
  id: string
  name: string
  color?: string
}

interface Note {
  id: string
  title: string
  content: string
  tags: Tag[]
  locked: boolean
  createdAt: Date
  updatedAt: Date
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    const token = user?.token;

    if (!user) {
      navigate("/")
      return
    }

    const loadNotes = async () => {
      try {

        const response = await fetch("http://localhost:8000/api/notes/", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        });

        if (!response.ok) {
          throw new Error("Error al cargar las notas");
        }
        const data = await response.json();


        setNotes(data)
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

  const createNewNote = () => {
    navigate("/notes/new")
  }
  const editNote = (id: string) => {
    const note = notes.find((note) => note.id === id);

    if (note?.locked) {
      alert("Esta nota está bloqueada y no se puede editar.");
      return;
    }
  
    navigate(`/notes/${id}`);
  }

  const deleteNote = async (id: string) => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    const token = user?.token;

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8000/api/notes/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
          if (!response.ok) {
            throw new Error("Error al eliminar la nota");
          }
          setNotes(notes.filter((note) => note.id !== id))
        } catch (error) {
          console.log("Error al eliminar la nota:", error);
          Swal.fire("Error", "Hubo un problema al eliminar la nota", "error");
        }
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
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

  const logout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }

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

