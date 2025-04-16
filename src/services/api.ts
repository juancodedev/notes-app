import type { Tag } from "../pages/Dashboard"

// URL base de la API (reemplazar con tu URL real cuando implementes)
const API_URL = "http://localhost:8000"

// Variable global para almacenamiento temporal
let apiTags: Tag[] = []

// Guardar en el almacenamiento simulado
const saveToApi = () => {
    localStorage.setItem("api_tags", JSON.stringify(apiTags))
}

// API para etiquetas
export const tagApi = {
    // Obtener todas las etiquetas
    async getAllTags(): Promise<Tag[]> {
        try {
            // Simular retraso de red
            const response = await fetch(`${API_URL}/tags`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
                throw new Error("Error al cargar las notas");
            }
            const data = await response.json();
            apiTags = data;
            return [...data]
        } catch (error) {
            console.error("Error al obtener etiquetas:", error)
            throw error
        }
    },

    // Crear una nueva etiqueta

    async createTag(tag: Omit<Tag, "id">): Promise<Tag> {
        const { name, color } = tag;
        const payload = {
            name,
            color,
            updatedAt: new Date(),
        }
        try {
            // Simular retraso de red
            const response = await fetch(`${API_URL}/tags/`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
            throw new Error("Error al eliminar la etiqueta");
            }
            const data = await response.json();
            
            // Generar ID único
            const newTag: Tag = {
                ...tag,
                id: data.id || `tag-${Date.now()}`, // Usa el ID de la API si está disponible
            };

            apiTags = [...apiTags, newTag]
            saveToApi()

            return newTag
        } catch (error) {
            console.error("Error creating tag:", error)
            throw error
        }
    },

    // Actualizar una etiqueta existente
    async updateTag(id: string, updates: Partial<Omit<Tag, "id">>): Promise<Tag> {
        try {
            // Simular retraso de red
            const response = await fetch(`${API_URL}/tags/${id}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(updates)
            });
    
            if (!response.ok) {
                throw new Error("Error al actualizar la etiqueta");
            }

            const updatedTag = await response.json();
            const tagIndex = apiTags.findIndex((tag) => tag.id === id);
            if (tagIndex === -1) {
                console.error(`Etiqueta con ID ${id} no encontrada`);
                throw new Error("Etiqueta no encontrada");
            }

            apiTags = [
                ...apiTags.slice(0, tagIndex),
                updatedTag,
                ...apiTags.slice(tagIndex + 1),
            ];
            saveToApi();

            return updatedTag
        } catch (error) {
            console.error("Error updating tag:", error)
            throw error
        }
    },

    // Eliminar una etiqueta
    async deleteTag(id: string): Promise<void> {
        try {
            const response = await fetch(`${API_URL}/tags/${id}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json"
                },
            });
            if (response.ok) {
                apiTags = apiTags.filter((tag) => tag.id !== id);
                saveToApi();
            } else {
                throw new Error("Error al borrar la etiqueta en el servidor");
            }

            apiTags = apiTags.filter((tag) => tag.id !== id);
            saveToApi()
        } catch (error) {
            console.error("Error deleting tag:", error)
            throw error
        }
    },
}
