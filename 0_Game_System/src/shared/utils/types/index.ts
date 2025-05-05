export * from './dbTypes';
export * from './typesCharacterSheet';
export * from './iconTypes';

export interface DBUsuario {
  id: string;
  nombre: string;
  email: string;
}

export interface DBHabilidad {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  nivel: number;
} 