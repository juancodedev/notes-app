import { useState } from "react"
import type { Tag } from "../pages/Dashboard"

interface TagManagerProps {
    allTags: Tag[]
    selectedTags: Tag[]
    onTagsChange: (tags: Tag[]) => void
    onTagCreate: (tag: Tag) => void
    onTagDelete: (tagId: string) => void
}

export default function TagManager({ allTags, selectedTags, onTagsChange, onTagCreate, onTagDelete }: TagManagerProps) {
    const [newTagName, setNewTagName] = useState("")
    const [showTagInput, setShowTagInput] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

    const toggleTag = (tag: Tag) => {
        if (selectedTags.some((t) => t.id === tag.id)) {
            onTagsChange(selectedTags.filter((t) => t.id !== tag.id))
        } else {
            onTagsChange([...selectedTags, tag])
        }
    }

    const handleCreateTag = () => {
        if (!newTagName.trim()) return

        const newTag: Tag = {
            id: `tag-${Date.now()}`,
            name: newTagName.trim(),
            color: getRandomColor(),
        }

        onTagCreate(newTag)
        onTagsChange([...selectedTags, newTag])
        setNewTagName("")
        setShowTagInput(false)
    }

    const confirmDeleteTag = (tagId: string) => {
        onTagDelete(tagId)
        if (selectedTags.some((t) => t.id === tagId)) {
            onTagsChange(selectedTags.filter((t) => t.id !== tagId))
        }
        setShowDeleteConfirm(null)
    }

    const getRandomColor = () => {
        const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-red-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500",
            "bg-indigo-500",
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                    <div key={tag.id} className="flex items-center">
                        <button
                            className={`px-2 py-1 rounded-full text-xs font-medium ${selectedTags.some((t) => t.id === tag.id)
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag.name}
                        </button>
                        <button className="ml-1 text-gray-400 hover:text-red-500" onClick={() => setShowDeleteConfirm(tag.id)}>
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {showDeleteConfirm === tag.id && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                                <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                                    <h3 className="text-lg font-bold mb-2">Eliminar etiqueta</h3>
                                    <p className="mb-4">¿Estás seguro de que deseas eliminar la etiqueta "{tag.name}"?</p>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                            onClick={() => setShowDeleteConfirm(null)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => confirmDeleteTag(tag.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showTagInput ? (
                <div className="flex items-center mt-2">
                    <input
                        type="text"
                        className="input flex-grow"
                        placeholder="Nombre de la etiqueta"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
                    />
                    <button className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleCreateTag}>
                        Crear
                    </button>
                    <button
                        className="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => {
                            setShowTagInput(false)
                            setNewTagName("")
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            ) : (
                <button
                    className="flex items-center text-blue-600 hover:underline text-sm"
                    onClick={() => setShowTagInput(true)}
                >
                    <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear nueva etiqueta
                </button>
            )}
        </div>
    )
}

