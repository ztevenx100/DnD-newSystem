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
    usu_usuario: DBUsuario;
    pus_arma_principal: string;
    pus_arma_secundaria: string;
    pus_cantidad_oro: number;
    pus_cantidad_plata: number;
    pus_cantidad_bronce: number;
    sju_sistema_juego: DBSistemaJuego;
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
}