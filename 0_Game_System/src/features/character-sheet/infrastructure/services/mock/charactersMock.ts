import { DBPersonajesUsuario } from "@shared/utils/types";
import { v4 as uuidv4 } from 'uuid';

// Datos de ejemplo para desarrollo
const mockCharacters: Record<string, DBPersonajesUsuario[]> = {
  'default-user-id': [
    {
      pus_id: uuidv4(),
      pus_usuario: 'default-user-id',
      pus_nombre: 'Aragorn',
      pus_nivel: 5,
      pus_descripcion: 'Heredero de Isildur, rey de Gondor',
      pus_clase: 'Guerrero',
      pus_raza: 'Humano',
      pus_trabajo: 'Montaraz',
      pus_puntos_suerte: 3,
      pus_vida: 85,
      pus_conocimientos: 'Rastreo,Historia de Gondor,Curación básica,Supervivencia',
      pus_arma_principal: 'Andúril, la Llama del Oeste',
      pus_arma_secundaria: 'Daga élfica',
      pus_alineacion: 'Legal Bueno',
      pus_sistema_juego: 'D&D 5e',
      pus_cantidad_oro: 50,
      pus_cantidad_plata: 75,
      pus_cantidad_bronce: 120,
      sju_sistema_juego: {
        sju_id: '1', // Añadido el ID requerido
        sju_nombre: 'D&D 5e'
      }
    },
    {
      pus_id: uuidv4(),
      pus_usuario: 'default-user-id',
      pus_nombre: 'Gandalf',
      pus_nivel: 10,
      pus_descripcion: 'Mago gris, miembro de los Istari',
      pus_clase: 'Mago',
      pus_raza: 'Maiar',
      pus_trabajo: 'Hechicero',
      pus_puntos_suerte: 5,
      pus_vida: 65,
      pus_conocimientos: 'Magia arcana,Historia antigua,Runas,Criaturas mágicas',
      pus_arma_principal: 'Glamdring, el Martillo de Enemigos',
      pus_arma_secundaria: 'Vara de mago',
      pus_alineacion: 'Neutral Bueno',
      pus_sistema_juego: 'D&D 5e',
      pus_cantidad_oro: 120,
      pus_cantidad_plata: 45,
      pus_cantidad_bronce: 80,
      sju_sistema_juego: {
        sju_id: '1', // Añadido el ID requerido
        sju_nombre: 'D&D 5e'
      }
    }
  ]
};

// Añade automáticamente un conjunto de personajes para cualquier ID de usuario
export const getMockCharacters = (userId: string): DBPersonajesUsuario[] => {
  if (!mockCharacters[userId]) {
    // Genera datos aleatorios para este usuario
    mockCharacters[userId] = [
      {
        pus_id: uuidv4(),
        pus_usuario: userId,
        pus_nombre: 'Personaje de ejemplo 1',
        pus_nivel: Math.floor(Math.random() * 20) + 1,
        pus_descripcion: 'Un personaje generado para desarrollo',
        pus_clase: 'Clérigo',
        pus_raza: 'Elfo',
        pus_trabajo: 'Sanador',
        pus_puntos_suerte: 2,
        pus_vida: 70,
        pus_conocimientos: 'Teología,Herbología,Medicina,Historia élfica',
        pus_arma_principal: 'Maza bendita',
        pus_arma_secundaria: 'Símbolo sagrado',
        pus_alineacion: 'Neutral Bueno',
        pus_sistema_juego: 'D&D 5e',
        pus_cantidad_oro: 30,
        pus_cantidad_plata: 50,
        pus_cantidad_bronce: 100,
        sju_sistema_juego: {
          sju_id: '1', // Añadido el ID requerido
          sju_nombre: 'D&D 5e'
        }
      },
      {
        pus_id: uuidv4(),
        pus_usuario: userId,
        pus_nombre: 'Personaje de ejemplo 2',
        pus_nivel: Math.floor(Math.random() * 20) + 1,
        pus_descripcion: 'Otro personaje generado para desarrollo',
        pus_clase: 'Pícaro',
        pus_raza: 'Mediano',
        pus_trabajo: 'Ladrón',
        pus_puntos_suerte: 4,
        pus_vida: 55,
        pus_conocimientos: 'Ganzúas,Trampas,Tasación,Venenos',
        pus_arma_principal: 'Daga envenenada',
        pus_arma_secundaria: 'Ballesta de mano',
        pus_alineacion: 'Caótico Neutral',
        pus_sistema_juego: 'Pathfinder',
        pus_cantidad_oro: 40,
        pus_cantidad_plata: 60,
        pus_cantidad_bronce: 90,
        sju_sistema_juego: {
          sju_id: '2',
          sju_nombre: 'Pathfinder'
        }
      }
    ];
  }
  
  return mockCharacters[userId];
};