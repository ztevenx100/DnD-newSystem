import { InputStats, InventoryObject } from '../../components/pages/UserCharacters/CharacterSheet/models';

export interface DBPersonajesUsuario {
    pus_id: string;
    pus_usuario: string;
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
    url_character_image?: string;
    stats?: InputStats[];
    skills?: any[];
    skillsRing?: any[];
    inventory?: InventoryObject[];
    systemGame?: { sju_id: string; sju_nombre: string };
}