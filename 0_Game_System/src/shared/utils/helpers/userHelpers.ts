import { DBUsuario } from '@shared/utils/types';

/**
 * Normaliza un objeto de usuario para garantizar que tenga 
 * los campos esperados en ambos formatos (usu_* y propiedades cortas)
 * 
 * @param user Objeto de usuario que puede estar incompleto
 * @returns Un objeto de usuario completo y normalizado
 */
export function normalizeUser(user: Partial<DBUsuario> | null | undefined): DBUsuario {
  if (!user) {
    // Usuario por defecto para desarrollo
    return {
      usu_id: "43c29fa1-d02c-4da5-90ea-51f451ed8952",
      usu_nombre: "Usuario Temporal",
      usu_email: "temp@example.com",
      id: "43c29fa1-d02c-4da5-90ea-51f451ed8952",
      nombre: "Usuario Temporal",
      email: "temp@example.com"
    };
  }

  // Completa los campos que falten
  const normalized: DBUsuario = {
    // Campos principales
    usu_id: user.usu_id || user.id || "43c29fa1-d02c-4da5-90ea-51f451ed8952",
    usu_nombre: user.usu_nombre || user.nombre || "Usuario Temporal",
    usu_email: user.usu_email || user.email || "temp@example.com",
    
    // Campos alias para compatibilidad
    id: user.id || user.usu_id || "43c29fa1-d02c-4da5-90ea-51f451ed8952",
    nombre: user.nombre || user.usu_nombre || "Usuario Temporal",
    email: user.email || user.usu_email || "temp@example.com"
  };

  return normalized;
}