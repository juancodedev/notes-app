import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Textarea } from "@/components/ui";
import { Edit, Plus, Search, TagIcon, Trash2 } from "lucide-react";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { Tag } from "@/components/TagInput"
import Swal from "sweetalert2";

// Tipo para las etiquetas
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
  const [showNewNoteModal, setShowNewNoteModal] = useState(false)
  const [allTags, setAllTags] = useState<Tag[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    const token = user?.token;

    if (!user) {
      navigate("/")
      return
    }
    const storedTags = localStorage.getItem("allTags")
    if (storedTags) {
      setAllTags(JSON.parse(storedTags))
    } else {
      localStorage.setItem("allTags", JSON.stringify(predefinedTags))
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
    if (window.innerWidth < 768) {
      setShowNewNoteModal(true)
    } else {
      navigate("/notes/new")
    }
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

  const filterByTag = (tagId: string) => {
    setSelectedTag(selectedTag === tagId ? null : tagId)
  }
  
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 flex item-center justify-between">
        <h1 className="text-xl font-bold">Sistema de Notas</h1>
        <Button variant="ghost" onClick={logout}>
          Cerrar Sesión
        </Button>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar notas..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={createNewNote}>
            <Plus className="mr-2 h-4 w-4" />Nueva Nota
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TagIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtrar por etiqueta:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {getUniqueTags().map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => filterByTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
            {selectedTag && (
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setSelectedTag(null)}>
                Limpiar filtro
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-5 w-3/4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-4 w-1/3 bg-muted rounded"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <CardDescription>
                    {formatRelativeDate(new Date(note.updatedAt))}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="line-clamp-3 text-sm text-muted-foreground mb-2"> {note.content}</p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => editNote(note.id)}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No se encontraron notas</p>
            <Button onClick={createNewNote}>
              <Plus className="mr-2 h-4 w-4" /> Crear Nueva Nota
            </Button>
          </div>
        )}
      </main>
      {showNewNoteModal && (
        <Dialog open={showNewNoteModal} onOpenChange={setShowNewNoteModal}>
          <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[50%]">
            <DialogHeader>
              <DialogTitle>Nueva Nota</DialogTitle>
              <DialogDescription>Crea una nueva nota</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <Input type="text" className="text-xl font-bold" placeholder="Titulo de la Nota" />
                </div>
                <div>
                  <Textarea className="min-h-[40vh] resize-none" placeholder="Escribe tu nota aqui..." />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewNoteModal(false)}>
                Cancelar
              </Button>
              <Button 
              onClick={() => {setShowNewNoteModal(false)
                navigate("/notes/new")
              }}>
                Continuar Editando
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

