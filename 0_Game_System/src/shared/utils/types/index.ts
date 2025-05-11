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
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  sigla: string;
  estadistica_base: string;
  nivel: number;
  dado?: string;
  
  hab_id: string;
  hab_nombre: string;
  hab_descripcion?: string;
  hab_tipo: string;
  hab_siglas: string;
  had_estadistica_base: string;
  hab_nivel: number;
  hab_dado?: string;
  hab_vlr_min?: number;
  hab_vlr_solventar?: number;
  hab_turnos?: number;
}