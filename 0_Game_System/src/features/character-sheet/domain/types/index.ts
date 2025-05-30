export interface DBPersonajesUsuario {
    pus_id: string;
    pus_usuario: string;
    pus_nombre: string;
    pus_clase: string;
    pus_raza: string;
    pus_trabajo: string;
    pus_nivel: number;
    pus_puntos_suerte: number;
    pus_vida: number;
    pus_descripcion: string;
    pus_conocimientos: string;
    pus_arma_principal: string;
    pus_arma_secundaria: string;
    pus_alineacion: string;
    pus_sistema_juego: string;
    pus_cantidad_oro: number;
    pus_cantidad_plata: number;
    pus_cantidad_bronce: number;
    sju_sistema_juego?: {
        sju_id: string;
        sju_nombre: string;
    };
    usu_usuario?: {
        id: string;
        nombre: string;
        email: string;
    };
    url_character_image?: string;
}