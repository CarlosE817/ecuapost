export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  verified?: boolean;
}

// Representa los datos de un post como vienen del backend
export interface PostData {
  id: number; // Asumiendo que el ID de la BD es numérico
  contenido: string;
  user_id: string; // ID del usuario que creó el post
  fecha: string;   // Fecha como string (ISO 8601) desde el backend
  username: string; // Nombre de usuario, resuelto por el backend
  displayName?: string; // Opcional, si el backend lo provee
  avatar?: string; // Opcional, si el backend lo provee
  // Campos para likes, comments, etc., se añadirán después
  likes_count?: number;
  comments_count?: number;
}

// El tipo User se mantiene para el usuario de la app (logeado)
// Podríamos considerar un AppUser si queremos diferenciarlo claramente
// del 'user' que podría venir embebido en un PostData si el backend lo hiciera así.
// Por ahora, User es el usuario logeado.