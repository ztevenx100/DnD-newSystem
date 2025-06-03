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
  // Esta es una transición gradual para mantener la aplicación funcionando en todo momento  // Extendemos el contexto con más valores reales
  const contextValue = {
    // Valores reales que estamos implementando
    characterImage: characterImage, 
    handleCharacterImageFileChange: handleCharacterImageChange,
    params,
    
    // Estos valores serán completados en futuras iteraciones
    methods: {} as any,
    loading: false,
    newRecord: true,
    systemGame: { sju_id: "", sju_nombre: "", sju_descripcion: "" },
    SystemGameList: [],
    skillsRingList: [],
    fieldSkill: [],
    optionsSkillClass: [],
    optionsSkillExtra: [],
    skillsTypes: [],
    emptyRequiredFields: [],
    clearValidationError: () => {},
    handleCharacterClassChange: () => {},
    handleCharacterJobSelectChange: () => {},
    handleSelectRaceChange: () => {},
    handleSystemGameChange: () => {},
    handleSelectSkillChange: () => {},
    handleSelectExtraSkillChange: () => {},
    handleSelectedRingSkillChange: () => {},
    handleSelectedTypeRingSkillChange: async () => {},
    handleAddObject: () => {},
    getInventory: async () => {},
    getStats: async () => {},
    getSkills: async () => {},
    getCharacterImage: async () => {},
    totalStats: { str: 0, int: 0, dex: 0, con: 0, per: 0, cha: 0, total: 0 },
    getStatTotal: () => 0,
    user: props.user || {} as any,
    navigate: () => {},
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
