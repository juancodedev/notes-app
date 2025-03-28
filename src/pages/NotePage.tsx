import { useState, useEffect, useCallback, useRef} from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Tag } from "./Dashboard"

interface Note {
  id: string
  title: string
  tags: Tag[]
  content: string
  locked: boolean
  createdAt: Date
  updatedAt: Date
}

export default function NotePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isNewNote = id === "new"

  useEffect(() => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    const token = user?.token;
    if (!user) {
      navigate("/");
      return
    }

    if (isNewNote) {
      setNote({
        id: "new",
        title: "Nueva Nota",
        content: "",
        tags: [],
        locked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setTitle("Nueva Nota")
      setContent("")
      setTags([])
      setIsLoading(false)
      return
    }

    const loadNoteWithLock = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/notes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (response.status === 423) {
          alert("La nota está siendo editada por otro usuario. Intenta más tarde.");
          navigate("/dashboard");
          return;
        }
        if (!response.ok) {
          throw new Error("Error al cargar la nota");
        }

        const data = await response.json();
        setNote(data)
        setTitle(data.title)
        setContent(data.content)
        setTags(data.tags)
      } catch (error) {
        console.error("Error al cargar la nota:", error);
        navigate("/dashboard")
      } finally {
        setIsLoading(false);
      }
    };
    loadNoteWithLock()
  }, [id, isNewNote, navigate])

  const saveNote = useCallback(async () => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    const token = user?.token;
    if (isSaving) return

    setIsSaving(true)

    try {
      const payload = {
        title,
        content,
        tags,
        locked: false,
        updatedAt: new Date(),
      }

      const url = isNewNote
      ? "http://localhost:8000/api/notes/"
      : `http://localhost:8000/api/notes/${id}`;

      const method = isNewNote ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 423) { 
        alert("No se puede guardar la nota porque está bloqueada por otro usuario.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Error al ${isNewNote ? "crear" : "actualizar"} la nota`);
      }

      const data = await response.json();
      setNote(data)
      navigate("/dashboard")
    } catch (error) {
      console.log("Error al guardar la nota:", error);
      alert("Ocurrió un error al guardar la nota. Intenta nuevamente.");
    } finally {
      setIsSaving(false)
    }
  }, [title, content, tags, isSaving, isNewNote, navigate, id])

  useEffect(() => {
    if (isLoading || isNewNote|| note?.locked) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (title !== note?.title || content !== note?.content || JSON.stringify(tags) !== JSON.stringify(note?.tags)) {
        saveNote()
      }
    }, 2000)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content, tags, note, isNewNote, isLoading, saveNote])


  const goBack = () => {
    navigate("/dashboard")
  }

  // const toggleTag = (tag: Tag) => {
  //   if (tags.some((t) => t.id === tag.id)) {
  //     setTags(tags.filter((t) => t.id !== tag.id))
  //   } else {
  //     setTags([...tags, tag])
  //   }
  // }

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
  
  if (note?.locked) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
          <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 flex items-center">
            <button className="btn btn-outline mr-2" onClick={goBack}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Nota Bloqueada</h1>
          </header>
          <main className="flex-1 p-4 md:p-6 flex justify-center items-center">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Esta nota está bloqueada y no se puede editar.</p>
              <button className="btn btn-primary" onClick={goBack}>
                Volver al Dashboard
              </button>
            </div>
          </main>
        </div>
      );
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
              <label htmlFor="tags" className="label">Etiquetas</label>
              <div id="tags" className="flex flex-wrap gap-2">


                {/* {tags.map((tag) => (
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
                ))} */}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="btn btn-primary" onClick={() => saveNote()} disabled={isSaving}>
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

