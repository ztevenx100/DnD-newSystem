import React, { useState, ChangeEvent } from 'react';

interface FormImageFileProps{
  externalStyles:string;
  locationImage:string | undefined;
  onFormImageFileChange: (value: string, file: File) => void;
}

const FormImageFile: React.FC<FormImageFileProps> = ({externalStyles, locationImage, onFormImageFileChange}) => {
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | undefined>(undefined);

  const manageImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];

    if (archivo) {
      const lector = new FileReader();

      lector.onloadend = () => {
        setImagenSeleccionada(lector.result as string);
        onFormImageFileChange(lector.result as string, archivo);
        //console.log('manejarCambioImagen - url:', lector.result ,' - file:',archivo);
      };

      lector.readAsDataURL(archivo);
    } else {
      setImagenSeleccionada(undefined);
    }
  };

  function openNewWindowImage(){
    let myWindow = window.open("", "MsgWindow", "width=800,height=800");
    let imageHtml = "<img src='" + ((imagenSeleccionada)?imagenSeleccionada:locationImage) + "' style='position: absolute; top:0; left:0; width:100%; height: 100%; object-fit: cover; object-position: center top; overflow:hidden; margin: 0;' alt='Imagen del personaje' />";
    myWindow?.document.write(imageHtml);
  }

  return (
    <picture className={'characterImageInput ' + externalStyles}>
      <input id='characterImage' className='inputImageFile' type="file" onChange={manageImageChange} />
      {locationImage ? (
        <>
          <img src={(imagenSeleccionada)?imagenSeleccionada:locationImage} className='characterImagePreview ' alt='Imagen del personaje' onClick={openNewWindowImage} />
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
