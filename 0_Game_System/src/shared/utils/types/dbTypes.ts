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
    
    // Permite acceder a las propiedades con índices de string
    [key: string]: string | number | boolean | object | undefined;
}

export interface DBEstadisticaPersonaje {
    epe_id: string;
    epe_personaje: string;
    epe_sigla: string;
    epe_nombre: string;
    epe_num_dado: number;
    epe_num_clase: number;
    epe_num_nivel: number;
}

export interface DBHabilidadPersonaje {
    hpe_id: string;
    hpe_personaje: string;
    hpe_habilidad: string;
    hpe_campo: string;
    hpe_alineacion: string | null;
    hab_habilidad?: {
        id: string;
        nombre: string;
        descripcion: string;
        tipo: string;
        nivel: number;
    };
}

export interface DBInventarioPersonaje {
    inp_id: string;
    inp_personaje: string;
    inp_nombre: string;
    inp_descripcion: string;
    inp_cantidad: number;
}

export interface DBHabilidad {
    hab_id: string;
    hab_nombre: string;
    hab_descripcion?: string;
    hab_tipo: string;
    hab_siglas: string;
    had_estadistica_base: string;
    hab_nivel: number;
    hab_dado?: string;
    hab_vlr_min?: number;
    hab_vlr_solventar?: number;
    hab_turnos?: number;
    
    // Campos adicionales de compatibilidad
    id?: string;
    nombre?: string;
    descripcion?: string;
    tipo?: string;
    sigla?: string;
    estadistica_base?: string;
    nivel?: number;
    
    // Permite acceder a las propiedades con índices de string
    [key: string]: string | number | boolean | undefined;
}

// Tipos para mundo
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
    mis_tipo: string;
    mis_cumplido: boolean;
}

// Tipo para sonidos
export interface DBSonido {
    son_id: string;
    son_nombre: string;
    son_url: string;
    son_duracion?: number;
    son_tipo?: string; 
    son_estado?: string;
}

// Tipos para sistemas de juego
export interface DBSistemaJuego {
    sju_id: string;
    sju_nombre: string;
    sju_descripcion?: string;
    sju_estado?: string;
    
    // Allow string indexing for type safety
    [key: string]: string | undefined;
}

export const initialPersonajesUsuario: DBPersonajesUsuario = {
    pus_id: "",
    pus_usuario: "",
    pus_nombre: "",
    pus_clase: "",
    pus_raza: "",
    pus_trabajo: "",
    pus_nivel: 1,
    pus_puntos_suerte: 0,
    pus_vida: 0,
    pus_descripcion: "",
    pus_conocimientos: "",
    pus_arma_principal: "",
    pus_arma_secundaria: "",
    pus_alineacion: "",
    pus_sistema_juego: "",
    pus_cantidad_oro: 0,
    pus_cantidad_plata: 0,
    pus_cantidad_bronce: 0
};