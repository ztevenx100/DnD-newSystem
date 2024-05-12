// Database type

export interface DBUsuario{
  usu_id: string;
  usu_nombre: string;
}

export interface DBPersonajesUsuario{
    pus_id: string;
    pus_usuario: string;
    pus_nombre: string;
    pus_nivel: number;
    pus_clase: string;
    pus_raza: string;
    pus_trabajo: string;
    pus_descripcion: string;
    pus_conocimientos: string;
    usu_usuario: DBUsuario;
    pus_arma_principal: string;
    pus_arma_secundaria: string;
    pus_cantidad_oro: number;
    pus_cantidad_plata: number;
    pus_cantidad_bronce: number;
    pus_puntos_suerte: number;
    sju_sistema_juego: DBSistemaJuego | {
      sju_id: string;
      sju_nombre: string;
    };
    url_character_image?: string;
}

export interface DBHabilidadPersonaje{
  hpe_usuario: string;
  hpe_personaje: string;
  hpe_habilidad: string;
  hpe_alineacion: string;
  hpe_campo: string;
  hab_habilidad: {
    hab_id: string;
    hab_nombre: string;
    had_estadistica_base: string;
    hab_siglas: string;
  } | {
    hab_id: string;
    hab_nombre: string;
    had_estadistica_base: string;
    hab_siglas: string;
  } [] | null;
}

export interface DBSistemaJuego{
  sju_id: string;
  sju_nombre: string;
  sju_descripcion?: string;
}

export interface DBEscenario{
  esc_id: string;
  esc_tipo: string;
  esc_nombre: string;
}

export interface DBUbicacion{
  ubi_id: string;
  ubi_tipo: string;
  ubi_nombre: string;
}

export interface DBMapamundi{
  mmu_id: string;
  mmu_sju: string;
  mmu_esc: string;
  esc_escenario: DBEscenario | {
    esc_id: string;
    esc_tipo: string;
    esc_nombre: string;
  } | null;
  mmu_ubi: string;
  ubi_ubicacion: DBUbicacion | {
    ubi_id: string;
    ubi_tipo: string;
    ubi_nombre: string;
  } | null;
  mmu_pos_x: number;
  mmu_pos_y: number;
  lista_sonidos: DBSonidoUbicacion[];
  lista_pnj: DBPersonajeNoJugable[];
  lista_enemigo: DBEnemigo[];
}

export interface DBSonidoUbicacion{
  sub_id: string;
  sub_ubi: string;
  sub_son: string;
  son_sonidos: {
    son_id: string;
    son_nombre: string;
  } | null;
  sub_sound_url: string;
  sub_tipo: string;
  sub_icon: string;
}

export interface DBPersonajeNoJugable{
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
}

export interface DBEnemigo{
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
}
