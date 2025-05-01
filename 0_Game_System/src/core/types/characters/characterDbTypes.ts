// Database types for characters
import { DBSistemaJuego, DBUsuario } from '../gameSystem';

export interface InputStats {
    strength: number;
    dexterity: number;
    intelligence: number;
    constitution: number;
    charisma: number;
    perception: number;
}

export interface DBPersonajesUsuario {
    pus_id: string;
    pus_usuario: string;
    usu_usuario: DBUsuario | null;
    pus_nombre: string;
    pus_nivel: number;
    pus_clase: string;
    pus_raza: string;
    pus_trabajo: string;
    pus_descripcion: string;
    pus_conocimientos: string;
    pus_arma_principal: string;
    pus_arma_secundaria: string;
    pus_cantidad_oro: number;
    pus_cantidad_plata: number;
    pus_cantidad_bronce: number;
    pus_puntos_suerte: number;
    pus_vida: number;
    pus_alineacion: string;
    pus_sistema_juego: string | null;
    sju_sistema_juego: DBSistemaJuego;
    url_character_image?: string;
    stats?: InputStats[];
    skills?: any[];
    skillsRing?: any[];
    inventory?: InventoryObject[];
    systemGame?: { sju_id: string; sju_nombre: string };
}

export interface DBHabilidad {
    hab_id: string;
    hab_nombre: string;
    had_estadistica_base: string;
    hab_siglas: string;
    hab_tipo: string;
}

export interface DBHabilidadPersonaje {
    hpe_usuario: string;
    hpe_personaje: string;
    hpe_habilidad: string;
    hpe_alineacion: string | null;
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
    }[] | null;
}

export interface DBEstadisticaPersonaje {
    epe_personaje: string;
    epe_usuario: string;
    epe_sigla: string;
    epe_nombre: string;
    epe_num_dado: number;
    epe_num_clase: number;
    epe_num_nivel: number;
}

export interface DBInventarioPersonaje {
    inp_id: string;
    inp_usuario: string;
    inp_personaje: string;
    inp_nombre: string;
    inp_descripcion: string;
    inp_cantidad: number;
}

export type InventoryObject = DBInventarioPersonaje;