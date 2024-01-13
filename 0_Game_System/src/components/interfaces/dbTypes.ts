// Database type

export interface DBUsuario{
  usu_id: string;
  usu_nombre: string;
}

export interface DBPersonajesUsuario{
    psu_id: string;
    psu_usuario: string;
    psu_nombre: string;
    psu_nivel: number;
    psu_clase: string;
    psu_raza: string;
    psu_trabajo: string;
    usu_usuario: DBUsuario;
}