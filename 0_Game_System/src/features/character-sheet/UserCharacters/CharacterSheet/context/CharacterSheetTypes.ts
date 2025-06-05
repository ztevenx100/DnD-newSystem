// Define los tipos básicos para ser usados en el CharacterSheetContext
// Estos tipos pueden ser movidos a un archivo dedicado más adelante si es necesario

// Importamos los tipos necesarios para definir el contexto
import { UseFormReturn } from 'react-hook-form';
import { CharacterForm } from '@features/character-sheet/types/characterForm';
import { 
  DBSistemaJuego,
  DBUsuario 
} from '@shared/utils/types';

// Reexportamos los tipos importados para que estén disponibles desde este módulo
export type { DBSistemaJuego, DBUsuario };

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
  readOnly: boolean;
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

// Definición del tipo para el contexto
export interface CharacterSheetContextType {
  // Propiedades del formulario
  methods: UseFormReturn<CharacterForm>;
  register: any;
  setValue: any;
  getValues: any;
  control: any;
  errors: any;
  handleSubmit: any;
  watch: any;
  
  // Estados principales
  loading: boolean;
  newRecord: boolean;
  characterImage?: string;
  
  // Estados del sistema de juego
  systemGame: DBSistemaJuego;
  SystemGameList: Option[];
  
  // Estados de habilidades
  skillsRingList: SkillTypes[];
  fieldSkill: SkillFields[];
  optionsSkillClass: Option[];
  optionsSkillExtra: Option[];
  skillsTypes: SkillTypes[];
  
  // Validación
  emptyRequiredFields: string[];
  clearValidationError: (fieldId: string) => void;
  // Funciones handler
  handleCharacterClassChange: (value: string) => void;
  handleCharacterJobSelectChange: (value: string) => void;
  handleSelectRaceChange: (value: string) => void;
  handleSystemGameChange: (currentSystem: string) => void;
  handleSelectSkillChange: (currentSkill: string) => void;
  handleSelectExtraSkillChange: (currentSkill: string) => void;
  handleCharacterImageFileChange: (value: string, file: File) => Promise<void>;
  handleSelectedRingSkillChange: (id: string, ring: string, skill: string, stat: string) => void;
  handleSelectedTypeRingSkillChange: (id: string, type: string) => Promise<void>;  handleAddObject: () => void;
  handleDeleteObject: (id: string) => void;
  handleUpdateObject: (id: string, field: string, value: any) => void;
  handleEditCount: (id: string, newCount: string) => void;
  handleNewCount: (value: string) => void;
  
  // Función principal para guardar el personaje
  saveData: () => Promise<void>;
  
  // Validación de inventario
  validateInventoryObject: (object: Partial<InventoryObject>) => InventoryObject;
  validateInventoryItem: (name: string, count: number | string) => string | null;
  
  // Estado de elementos eliminados
  deleteItems: string[];
  setDeleteItems: (items: string[] | ((prevItems: string[]) => string[])) => void;
  
  // Funciones para obtener datos
  getInventory: () => Promise<void>;
  getStats: () => Promise<void>;
  getSkills: () => Promise<void>;
  getCharacterImage: () => Promise<void>;
  
  // Estadísticas y utilidades
  totalStats: StatsTotal;
  setTotalStats: (stats: StatsTotal) => void;
  getStatTotal: (statId: string) => number;
  
  // Datos del usuario y personaje
  user: DBUsuario;
  
  // Utilidades de React Router DOM
  params: any;
  navigate: any;
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
