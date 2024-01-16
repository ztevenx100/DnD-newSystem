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
    psu_fue_dado: number;
    psu_fue_clase: number;
    psu_fue_nivel: number;
    psu_int_dado: number;
    psu_int_clase: number;
    psu_int_nivel: number;
    psu_des_dado: number;
    psu_des_clase: number;
    psu_des_nivel: number;
    psu_con_dado: number;
    psu_con_clase: number;
    psu_con_nivel: number;
    psu_per_dado: number;
    psu_per_clase: number;
    psu_per_nivel: number;
    psu_car_dado: number;
    psu_car_clase: number;
    psu_car_nivel: number;
    psu_arma_principal: string;
    psu_arma_secundaria: string;
}