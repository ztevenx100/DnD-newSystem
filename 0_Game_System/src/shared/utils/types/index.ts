export * from './dbTypes';
export * from './typesCharacterSheet';
export * from './iconTypes';

export interface DBUsuario {
  // Estructura que coincide con la tabla usu_usuario
  usu_id: string;
  usu_nombre: string;
  usu_email: string;
  usu_fec_modificacion?: string;
  
  // Alias para compatibilidad con código existente
  id?: string;
  nombre?: string;
  email?: string;
}

// Esta interfaz se mantiene por compatibilidad pero idealmente todos los componentes
// deberían usar la interfaz de dbTypes.ts para evitar duplicación de código
export interface DBHabilidad {
  id: string;                // Mapea a hab_id
  nombre: string;            // Mapea a hab_nombre
  descripcion: string;       // Mapea a hab_descripcion
  tipo: string;              // Mapea a hab_tipo
  sigla: string;             // Mapea a hab_siglas
  estadistica_base: string;  // Mapea a had_estadistica_base
  nivel: number;             // Mapea a hab_nivel
  dado?: string;             // Mapea a hab_dado
}