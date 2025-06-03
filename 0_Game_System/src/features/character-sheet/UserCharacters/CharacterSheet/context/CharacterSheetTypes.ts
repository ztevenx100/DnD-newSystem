// Define los tipos básicos para ser usados en el CharacterSheetContext
// Estos tipos pueden ser movidos a un archivo dedicado más adelante si es necesario

export interface DBSistemaJuego {
  sju_id: string;
  sju_nombre: string;
  sju_descripcion: string;
}

export interface Option {
  value: string;
  name: string;
  id?: string;
  mainStat?: string;
  extraPoint?: string | number;
}

export interface SkillFields {
  id: string;
  skill: string;
  field: string;
}

export interface SkillTypes {
  id: string;
  skills: any[];  // Esto debería ser tipado más específicamente en el futuro
}

export interface InventoryObject {
  id: string;
  name: string;
  description: string;
  count: number;
  readOnly?: boolean;
}

export interface InputStats {
  id: string;
  label: string;
  description: string;
  valueDice: number;
  valueClass: number;
  valueLevel: number;
}

export interface SkillsAcquired {
  id: string;
  value: string;
  name: string;
  description: string;
  ring: string;
}

export interface StatsTotal {
  str: number;
  int: number;
  dex: number;
  con: number;
  per: number;
  cha: number;
  total: number;
}

// Interfaces específicas del proyecto que pueden necesitar actualización
export interface DBPersonajesUsuario {
  pus_id: string;
  pus_usuario: string;
  pus_nombre: string;
  pus_clase: string;
  pus_nivel: number;
  pus_puntos_suerte?: number;
  pus_vida?: number;
  pus_arma_principal?: string;
  pus_arma_secundaria?: string;
  pus_cantidad_oro?: number;
  pus_cantidad_plata?: number;
  pus_cantidad_bronce?: number;
  pus_descripcion?: string;
  pus_raza?: string;
  pus_trabajo?: string;
  pus_alineacion?: string;
  pus_conocimientos?: string;
  sju_sistema_juego?: any; // Debería ser tipado más específicamente
}

export interface DBUsuario {
  usu_id: string;
  usu_nombre: string;
  // Otros campos que pueda tener el usuario
}

export interface DBInventarioPersonaje {
  inp_id: string;
  inp_nombre: string;
  inp_descripcion: string;
  inp_cantidad: number;
}

export interface DBHabilidad {
  hab_id: string;
  hab_nombre: string;
  hab_sigla: string;
  hab_descripcion: string;
  hab_tipo: string;
  hab_estadistica: string;
}

export interface DBHabilidadPersonaje {
  hpe_id: string;
  hpe_personaje: string;
  hpe_habilidad: string;
  hpe_campo: string;
}

// Esta interfaz puede necesitar ser más específica según tu implementación actual
export interface CharacterValidation {
  validateSingleStat: (statId: string, showAlert: boolean) => any;
}
