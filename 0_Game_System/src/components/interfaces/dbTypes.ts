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
    usu_usuario: DBUsuario[];
}