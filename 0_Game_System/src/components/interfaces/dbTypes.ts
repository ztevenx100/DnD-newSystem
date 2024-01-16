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
    usu_usuario: DBUsuario;
    pus_arma_principal: string;
    pus_arma_secundaria: string;
}