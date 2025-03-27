import { useState } from "react"
import { Badge, Button, Input } from "./ui"

export type Tag = {
  id: string
  name: string
  color?: string
}

interface TagInputProps {
  tags: Tag[]
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  placeholder?: string
  disabled?: boolean
}

export function TagInput({
  tags,
  selectedTags,
  onTagsChange,
  placeholder = "Agregar etiquetas...",
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  const handleUnselect = (tag: Tag) => {
    onTagsChange(selectedTags.filter((s) => s.id !== tag.id))
  }

  const handleSelect = (tag: Tag) => {
    if (selectedTags.some((s) => s.id === tag.id)) {
      onTagsChange(selectedTags.filter((s) => s.id !== tag.id))
    } else {
      onTagsChange([...selectedTags, tag])
    }
    setInputValue("")
    setShowDropdown(false)
  }

  const handleCreateTag = () => {
    if (!inputValue.trim()) return

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: inputValue.trim(),
      color: getRandomColor(),
    }

    onTagsChange([...selectedTags, newTag])
    setInputValue("")
    setShowDropdown(false)
  }

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const availableTags = tags.filter((tag) => !selectedTags.some((s) => s.id === tag.id))
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(inputValue.toLowerCase()))

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            {tag.name}
            <button
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleUnselect(tag)}
              disabled={disabled}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <div className="flex items-center">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            disabled={disabled}
          />
        </div>
        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-popover shadow-md">
            <div className="max-h-60 overflow-auto p-2">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                    onClick={() => handleSelect(tag)}
                  >
                    <div className="flex items-center">
                      <div className={`mr-2 h-3 w-3 rounded-full ${tag.color || "bg-gray-500"}`} />
                      {tag.name}
                    </div>
                    {selectedTags.some((s) => s.id === tag.id) && (
                      <span className="text-xs text-muted-foreground">Seleccionada</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between p-2">
                  <span>No se encontraron etiquetas</span>
                  <Button onClick={handleCreateTag}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Crear "{inputValue}"
                  </Button>
                </div>
              )}
              {inputValue && !filteredTags.some((tag) => tag.name.toLowerCase() === inputValue.toLowerCase()) && (
                <div
                  className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                  onClick={handleCreateTag}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Crear "{inputValue}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

