import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Textarea } from "@/components/ui-temp"
import { type Tag } from "@/components/TagInput"
import TagManager from "@/components/TagManager"
import { AlertTriangle, ArrowLeft, GitMerge, RefreshCcw, Save, X } from "lucide-react"
import { tagApi } from "../services/api"

interface Note {
  id: string
  title: string
  tags: Tag[]
  content: string
  locked: boolean
  createdAt: Date
  updatedAt: Date
  isBeingEdited?: boolean
  editedBy?: string
}

export default function NotePage() {
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<Tag[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictData, setConflictData] = useState<{ title: string; content: string; tags: Tag[] } | null>(null)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [showAsModal, setShowAsModal] = useState(false)

  const setIsTagsLoading = useState(true)[1]
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navigate = useNavigate()
  const params = useParams()
  const id = params.id as string
  const isNewNote = id === "new"

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsTagsLoading(true)
        const tags = await tagApi.getAllTags()
        setAllTags(tags)
      } catch (err) {
        console.error("Error al cargar etiquetas:", err)
        setError("No se pudieron cargar las etiquetas. Por favor, recarga la página.")
      } finally {
        setIsTagsLoading(false)
      }
    }

    fetchTags()
  }, [])

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
          setError("La nota está siendo editada por otro usuario. Intenta más tarde.");
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
        setError("No se puede guardar la nota porque está bloqueada por otro usuario.");
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
      setError("Ocurrió un error al guardar la nota. Intenta nuevamente.");
    } finally {
      setIsSaving(false)
    }
  }, [title, content, tags, isSaving, isNewNote, navigate, id])

  useEffect(() => {
    if (isLoading || isNewNote || note?.locked) return

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

  useEffect(() => {
    const checkScreenSize = () => {
      setShowAsModal(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const handleCreateTag = async (newTag: Tag) => {
    try {
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null
      const token = user?.token;

      const response = await fetch("http://localhost:8000/tags/",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          },
          body: JSON.stringify(newTag),
        });
        if (!response.ok){
          throw new Error("Error al crear la etiqueta");
        }
        const createdTag = await response.json();
        setAllTags([...allTags, createdTag])
    } catch (error){
      console.error("Error al crear la etiqueta", error);
      setError("No se pudo crear la etiqueta. Intenta nuevamente.")
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
      const token = user?.token;

      const response = await fetch(`http://localhost:8000/tags/${tagId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok){
        throw new Error("Error al eliminar la etiqueta");
      }
      setAllTags(allTags.filter((tag) => tag.id !== tagId));
      if (tags.some((tag) => tag.id === tagId)) {
        setTags(tags.filter((tag) => tag.id !== tagId));
      }
    } catch (error) {
      console.error("Error al eliminar la etiqueta", error);
      setError("No se pudo eliminar la etiqueta. Intenta nuevamente.");
    }
  }

  const resolveConflict = (action: "merge" | "discard" | "retry") => {
    if (!conflictData) return

    let mergedTags = [...tags]
    if (action === "merge") {
      mergedTags = [...tags, ...conflictData.tags.filter(tag => 
        !tags.some(t => t.id === tag.id)
      )]
    }

    switch (action) {
      case "merge":
        setTitle(conflictData.title)
        setTags(mergedTags)
        break
      case "discard":
        setTitle(conflictData.title)
        setContent(conflictData.content)
        setTags(conflictData.tags)
        break
    }

    setHasConflict(false)
    setShowConflictModal(false)
    setConflictData(null)
  }

  const goBack = () => {
    navigate("/dashboard")
  }

  const EditorContent = () => {
    if (!note) return null
    return (
      <>
        {hasConflict && showConflictModal && (
          <Card className="mb-6 border-yellow-500">
            <CardContent className="p-4">
              <Alert className="border-yellow-500" title={""} description={""}>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Conflicto de edición</AlertTitle>
                <AlertDescription>
                  Esta nota ha sido modificada en otra instancia
                </AlertDescription>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => resolveConflict("merge")} variant="outline" size="sm">
                    <GitMerge className="mr-2 h-4 w-4" /> Fusionar cambios
                  </Button>
                  <Button onClick={() => resolveConflict("discard")} variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" /> Descartar cambios
                  </Button>
                  <Button onClick={() => resolveConflict("retry")} variant="outline" size="sm">
                    <RefreshCcw className="mr-2 h-4 w-4" /> Reintentar
                  </Button>
                </div>
              </Alert>
            </CardContent>
          </Card>
        )}
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold"
              placeholder="Título de la nota"
            />
          </div>
          <div>
            <label htmlFor="content" className="label">
              Contenido
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[40vh] resize-none"
              placeholder="Escribe tu nota aqui..."
            />
          </div>
          <div>
            <label htmlFor="content" className="text-sm font-medium mb-2 block">Etiquetas</label>
            <TagManager
              allTags={allTags}
              selectedTags={tags}
              onTagsChange={setTags}
              onTagCreate={handleCreateTag}
              onTagDelete={handleDeleteTag}
            />
          </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center">
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-xl font-bold">Cargando...</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 flex justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-[40%] min-w-[300px]">
            <div className="h-8 w-3/4 bg-muted rounded "></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (showAsModal) {
    return (
      <Dialog open={true} onOpenChange={() => navigate("/dashboard")}>
        <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[50%]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-2" onClick={goBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {note?.title}
            </DialogTitle>
            <DialogDescription>Edita tu nota y guarda los cambios</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <EditorContent />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => saveNote()} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Guardando...." : "Guardar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-xl font-bold">{note?.title}</h1>
        </div>
        <Button onClick={() => saveNote()} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </header>
      <main className="flex-1 p-4 md:p-6 flex justify-center">
        <Card className="w-full max-w-[40%] min-w-[400px]">
          <CardHeader>
            <CardTitle>Editor de Nota</CardTitle>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4">{error}</div>
            )}
            <CardDescription>Edita tu nota y guarda los cambios</CardDescription>
          </CardHeader>
          <CardContent>
            <EditorContent />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => saveNote()} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
