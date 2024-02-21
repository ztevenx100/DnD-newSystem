import React, { useState, ChangeEvent } from 'react';

interface FormImageFileProps{
  externalStyles:string;
}

const FormImageFile: React.FC<FormImageFileProps> = ({externalStyles}) => {
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | undefined>(undefined);

  const manejarCambioImagen = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];

    if (archivo) {
      const lector = new FileReader();

      lector.onloadend = () => {
        setImagenSeleccionada(lector.result as string);
      };

      lector.readAsDataURL(archivo);
    } else {
      setImagenSeleccionada(undefined);
    }
  };

  return (
    <picture className={'characterImageInput ' + externalStyles}>
        <input id='characterImage' className='inputImageFile' type="file" onChange={manejarCambioImagen} />
        {imagenSeleccionada ? (
            <>
              <img src={imagenSeleccionada} className='characterImagePreview ' alt='Imagen del personaje' />
            </>
        ):(
          <>
            <div className='CharacterImageEmpty'></div>
          </>
        )}
    </picture>
  );
};

export default FormImageFile;
