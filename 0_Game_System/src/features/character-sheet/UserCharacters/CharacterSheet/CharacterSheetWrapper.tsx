import React, { useState, useEffect } from 'react';
import { CharacterSheetProvider } from './context/CharacterSheetContext';
import { CharacterSheet as OriginalCharacterSheet } from './CharacterSheet';
import { CharacterSheetProps } from './types/characterSheetProps';
import { useParams } from 'react-router-dom';
import { getUrlCharacter } from "@database/storage/dbStorage";

/**
 * CharacterSheetWrapper es un componente que envuelve el componente original
 * CharacterSheet con el contexto necesario para la refactorización.
 * 
 * Este es el primer paso para la refactorización incremental del componente.
 * En futuras etapas, este componente se convertirá en el contenedor principal
 * y el componente CharacterSheet original se descompondrá en componentes más pequeños.
 */
export const CharacterSheetWrapper: React.FC<CharacterSheetProps> = (props) => {
  // Comenzamos a implementar más funcionalidad en el contexto
  const params = useParams();
  const [characterImage, setCharacterImage] = useState<string | undefined>(undefined);
  
  // Implementación real de la función para manejar el cambio de imagen
  const handleCharacterImageChange = async (value: string, file: File) => {
    setCharacterImage(value);
    console.log('Cambio de imagen detectado:', file.name);
    // En el futuro, aquí se llamará a la función para guardar la imagen en el almacenamiento
  };
  
  // Efecto para cargar la imagen del personaje si existe
  useEffect(() => {
    const loadCharacterImage = async () => {
      if (params.id && props.user?.usu_id) {
        try {
          const url = await getUrlCharacter(props.user.usu_id, params.id);
          if (url) {
            const refreshParam = Math.random().toString(36).substring(7);
            setCharacterImage(url + "?" + refreshParam);
          }
        } catch (error) {
          console.error("Error al cargar la imagen del personaje:", error);
        }
      }
    };
    
    loadCharacterImage();
  }, [params.id, props.user?.usu_id]);
    // Importamos el useParams para obtener el ID del personaje
  // En futuras iteraciones, también importaremos useNavigate, useLoaderData, etc.
  // para centralizar toda la lógica aquí
  
  // Comenzamos a implementar el contexto para poder usar posteriormente los componentes refactorizados
  // Esta es una transición gradual para mantener la aplicación funcionando en todo momento
  // Extendemos el contexto con más valores reales
  // Hook para manejar las operaciones de carga de datos
  const [loading, _setLoading] = useState(false); // prefijo _ indica que es intencionalmente no utilizado por ahora
  const [systemGame, _setSystemGame] = useState({ sju_id: "", sju_nombre: "", sju_descripcion: "" });
  const [systemGameList, _setSystemGameList] = useState([]);
  const [totalStats, _setTotalStats] = useState({ str: 0, int: 0, dex: 0, con: 0, per: 0, cha: 0, total: 0 });
  
  // Estos estados se utilizarán completamente en futuras iteraciones de la refactorización
  
  const contextValue = {
    // Valores reales que estamos implementando
    characterImage, 
    handleCharacterImageFileChange: handleCharacterImageChange,
    params,
    loading,
    newRecord: params.id ? false : true,
    systemGame,
    SystemGameList: systemGameList,
    
    // Funcionalidad relacionada con las estadísticas
    totalStats,
    getStatTotal: (statId: string) => {
      switch(statId) {
        case 'STR': return totalStats.str;
        case 'INT': return totalStats.int;
        case 'DEX': return totalStats.dex;
        case 'CON': return totalStats.con;
        case 'PER': return totalStats.per;
        case 'CHA': return totalStats.cha;
        default: return 0;
      }
    },
    
    // Estos valores serán completados en futuras iteraciones
    // pero ya comienzan a tomar forma con implementaciones básicas
    skillsRingList: [],
    fieldSkill: [],
    optionsSkillClass: [],
    optionsSkillExtra: [],
    skillsTypes: [],
    emptyRequiredFields: [],
    clearValidationError: (fieldId: string) => {
      // Esta función será implementada más adelante
      console.log(`Clearing validation error for field: ${fieldId}`);
    },
    
    // Handlers que serán implementados completamente en futuras iteraciones
    handleCharacterClassChange: (value: string) => {
      console.log(`Character class changed to: ${value}`);
    },
    handleCharacterJobSelectChange: (value: string) => {
      console.log(`Character job changed to: ${value}`);
    },
    handleSelectRaceChange: (value: string) => {
      console.log(`Character race changed to: ${value}`);
    },
    handleSystemGameChange: (currentSystem: string) => {
      console.log(`Game system changed to: ${currentSystem}`);
    },
    handleSelectSkillChange: (currentSkill: string) => {
      console.log(`Skill changed to: ${currentSkill}`);
    },
    handleSelectExtraSkillChange: (currentSkill: string) => {
      console.log(`Extra skill changed to: ${currentSkill}`);
    },
    handleSelectedRingSkillChange: (id: string, ring: string, skill: string, stat: string) => {
      console.log(`Ring skill changed - id: ${id}, ring: ${ring}, skill: ${skill}, stat: ${stat}`);
    },
    handleSelectedTypeRingSkillChange: async (id: string, type: string) => {
      console.log(`Ring skill type changed - id: ${id}, type: ${type}`);
    },
    handleAddObject: () => {
      console.log('Adding object to inventory');
    },
    
    // Métodos para obtener datos que se implementarán completamente después
    getInventory: async () => {
      console.log('Getting inventory data');
    },
    getStats: async () => {
      console.log('Getting stats data');
    },
    getSkills: async () => {
      console.log('Getting skills data');
    },
    getCharacterImage: async () => {
      // Ya implementada parcialmente arriba
      console.log('Getting character image');
    },
    
    user: props.user || {} as any,
    navigate: () => {},
    
    // Métodos de React Hook Form que serán implementados después
    methods: {} as any,
    register: () => {},
    setValue: () => {},
    getValues: () => ({}),
    control: {},
    errors: {},
    handleSubmit: () => () => {},
    watch: () => {},
  };
    // Comenzamos a utilizar el Provider para envolver el componente original
  // Esto no cambia la funcionalidad actual, pero prepara la estructura para
  // futuras refactorizaciones
  return (
    <CharacterSheetProvider value={contextValue}>
      <OriginalCharacterSheet {...props} />
    </CharacterSheetProvider>
  );
};

export default CharacterSheetWrapper;
