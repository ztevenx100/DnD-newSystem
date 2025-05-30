export interface DBEscenario {
  esc_id: string;
  esc_tipo: string;
  esc_nombre: string;
  esc_orden: number;
}

export interface DBMapamundi {
  mmu_id: string;
  mmu_sju: string;
  mmu_esc: string;
  esc_escenario: DBEscenario | null;
  mmu_ubi: string;
  ubi_ubicacion: DBUbicacion | null;
  mmu_pos_x: number;
  mmu_pos_y: number;
  lista_sonidos: DBSonidoUbicacion[];
  lista_pnj: DBPersonajeNoJugable[];
  lista_enemigo: DBEnemigo[];
  lista_mision: DBMision[];
}

export interface DBUbicacion {
  ubi_id: string;
  ubi_tipo: string;
  ubi_nombre: string;
}

export interface DBSonidoUbicacion {
  sub_id: string;
  sub_son: string;
  sub_tipo: string;
  sub_icon: string;
  sub_ubi: string;
  sub_sound_url?: string;
  son_sonidos?: {
      son_id: string;
      son_nombre: string;
      son_url?: string;
  } | null;
}

export interface DBPersonajeNoJugable {
  pnj_id: string;
  pnj_nombre: string;
  pnj_raza: string;
  pnj_clase: string;
  pnj_trabajo: string;
  pnj_edad: number;
  pnj_tipo: string;
  pnj_str: number;
  pnj_int: number;
  pnj_dex: number;
  pnj_con: number;
  pnj_cha: number;
  pnj_per: number;
  pnj_vida: number;
}

export interface DBEnemigo {
  ene_id: string;
  ene_nombre: string;
  ene_raza: string;
  ene_clase: string;
  ene_trabajo: string;
  ene_edad: number;
  ene_tipo: string;
  ene_str: number;
  ene_int: number;
  ene_dex: number;
  ene_con: number;
  ene_cha: number;
  ene_per: number;
  ene_vida: number;
}

export interface DBMision {
  mis_id: string;
  mis_nombre: string;
  mis_descripcion: string;
  mis_tipo: string;
  mis_estado: string;
}

export interface stageImageList {
  id: string;
  url: string;
} 