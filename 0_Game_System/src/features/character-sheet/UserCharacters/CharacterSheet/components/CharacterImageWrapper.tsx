import React from 'react';
import CharacterImage from './CharacterImage';
import { useCharacterSheet } from '../context/CharacterSheetContext';

interface CharacterImageWrapperProps {
  externalStyles: string;
  locationImage?: string;
  onFormImageFileChange: (value: string, file: File) => void;
}

/**
 * Este componente es un wrapper que nos permite utilizar el nuevo componente CharacterImage
 * manteniendo compatibilidad con la interfaz del componente FormImageFile original.
 * 
 * Es un componente transitorio que nos permite refactorizar gradualmente.
 */
const CharacterImageWrapper: React.FC<CharacterImageWrapperProps> = ({
  externalStyles,
  locationImage,
  onFormImageFileChange,
}) => {
  // Intento de usar el contexto, pero solo para logging en esta etapa
  // En futuras iteraciones, utilizaremos completamente el contexto
  try {
    const context = useCharacterSheet();
    console.log('Contexto disponible en CharacterImageWrapper:', !!context);
  } catch (error) {
    console.log('Contexto aún no disponible en CharacterImageWrapper');
  }
  
  // Por ahora, seguimos utilizando los props que recibimos
  // para mantener la compatibilidad con el componente actual
  
  const defaultImageUrl = '/img/png/avatar-default.png';  
  // Fase de transición: usamos el nuevo componente CharacterImage
  // pero mantenemos la compatibilidad con el estilo y estructura existente
  return (
    <div className={'characterImageInput ' + externalStyles}>
      <CharacterImage
        characterImage={locationImage}
        onImageChange={onFormImageFileChange}
        defaultImageUrl={defaultImageUrl}
      />
    </div>
  );
  
  // En futuras iteraciones, reemplazaremos el return anterior por este:
  // return (
  //   <div className={externalStyles}>
  //     <CharacterImage
  //       characterImage={locationImage}
  //       onImageChange={onFormImageFileChange}
  //       defaultImageUrl={defaultImageUrl}
  //     />
  //   </div>
  // );
};

export default CharacterImageWrapper;
