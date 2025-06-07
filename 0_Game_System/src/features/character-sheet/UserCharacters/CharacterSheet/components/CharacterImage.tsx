import React from 'react';

interface CharacterImageProps {
  characterImage?: string;
  onImageChange: (value: string, file: File) => void | Promise<void>;
  defaultImageUrl: string;
}

/**
 * Componente para mostrar y gestionar la imagen del personaje
 */
export const CharacterImage: React.FC<CharacterImageProps> = ({
  characterImage,
  onImageChange,
  defaultImageUrl
}) => {
  // Handler para manejar el cambio de imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const urlImage = URL.createObjectURL(file);
    
    onImageChange(urlImage, file);
  };
  return (
    <>
      <input 
        id="characterImage" 
        className="inputImageFile" 
        type="file" 
        onChange={handleFileChange}
        accept="image/*"
      />      {characterImage ? (
        <img 
          src={characterImage} 
          className="characterImagePreview" 
          alt="Imagen del personaje" 
          onClick={() => {
            // Mantener la funcionalidad de abrir la imagen en una ventana nueva
            let myWindow = window.open("", "MsgWindow", "width=800,height=800");
            let imageHtml = `<img src='${characterImage}' style='position: absolute; top:0; left:0; width:100%; height: 100%; object-fit: cover; object-position: center top; overflow:hidden; margin: 0;' alt='Imagen del personaje' />`;
            myWindow?.document.write(imageHtml);
          }} 
        />
      ) : defaultImageUrl ? (
        <img 
          src={defaultImageUrl} 
          className="characterImagePreview" 
          alt="Imagen por defecto"
        />
      ) : (
        <div className="CharacterImageEmpty"></div>
      )}
    </>
  );
};

export default CharacterImage;
