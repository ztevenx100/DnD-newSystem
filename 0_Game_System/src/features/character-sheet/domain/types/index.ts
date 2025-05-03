export interface DBPersonajesUsuario {
  pus_id: string;
  pus_usuario: string;
  pus_nombre: string;
  pus_nivel: number;
  pus_descripcion?: string;
  sju_sistema_juego: {
    sju_id: string;
    sju_nombre: string;
  };
  url_character_image?: string;
} 