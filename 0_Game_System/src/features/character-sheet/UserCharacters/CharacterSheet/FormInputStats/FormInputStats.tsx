import React, { ChangeEvent, useState, useEffect } from 'react';
import { Tooltip } from "@nextui-org/react";
import { InputStats } from '@/shared/utils/types/typesCharacterSheet';

/**
 * Props para el componente FormInputStats
 * @interface InputNumberProps
 * @property {InputStats} inputStats - Datos de la estadística a mostrar
 * @property {function} onSelectedValuesChange - Función a llamar cuando cambian los valores
 */
interface InputNumberProps {
    inputStats: InputStats;
    onSelectedValuesChange: (newInputStats: InputStats) => void;
}

/**
 * Componente para mostrar y editar los valores de estadísticas de un personaje
 * Muestra un campo con el total y campos para dado, clase y nivel
 */
const FormInputStats: React.FC<InputNumberProps> = ({inputStats, onSelectedValuesChange}) => {
  // Mantener el total como estado para actualizarlo cuando cambien los valores
  const [sum, setSum] = useState<number>(
    inputStats.valueDice + inputStats.valueClass + inputStats.valueLevel
  );
  
  // Actualizar la suma cuando cambie alguno de los valores
  useEffect(() => {
    setSum(inputStats.valueDice + inputStats.valueClass + inputStats.valueLevel);
  }, [inputStats.valueDice, inputStats.valueClass, inputStats.valueLevel]);

  /**
   * Valida y convierte un valor a número
   * @param {string} value - Valor a validar
   * @param {number} [valueDefault] - Valor por defecto si no es válido
   * @returns {number} - Valor numérico validado
   */
  function validateNumeric(value: string, valueDefault: number = 0): number {
    // Si está vacío, usar valor por defecto
    if (value === '') {
      return valueDefault;
    }
    
    // Convertir a número y validar
    const num = Number(value);
    if (isNaN(num)) {
      alert('El valor debe ser numérico');
      return valueDefault;
    }
    
    // Asegurar que el valor sea un entero no negativo
    return Math.max(0, Math.floor(num));
  }

  /**
   * Maneja los cambios en los inputs de estadísticas
   * @param {number} index - Índice del tipo de valor (0: dado, 1: clase, 2: nivel)
   * @param {string} value - Nuevo valor como string
   */
  const handleInputChange = (index: number, value: string) => {
    const numericValue = validateNumeric(value);
    // Crear una copia del objeto para mantener la inmutabilidad
    const updatedStats = { ...inputStats };
    
    // Actualizar la propiedad correspondiente
    switch (index) {
      case 0:
        updatedStats.valueDice = numericValue;
        break;
      case 1:
        updatedStats.valueClass = numericValue;
        break;
      case 2:
        updatedStats.valueLevel = numericValue;
        break;
      default:
        return; // No hacer nada si el índice es inválido
    }
    
    // Actualizar la suma y notificar el cambio
    const newSum = updatedStats.valueDice + updatedStats.valueClass + updatedStats.valueLevel;
    setSum(newSum);
    onSelectedValuesChange(updatedStats);
  };

    return (
        <>

        <Tooltip 
            className="bg-dark text-light px-2 py-1" placement="right"
            content={
                <div className="w-80">
                    <p className="font-medium" >
                        {inputStats.label}
                    </p>
                    <p className="font-normal opacity-80" >
                        {inputStats.description}
                    </p>
                </div>
            }
        >
            <label htmlFor={inputStats.id.toLowerCase() + "Main"} className="form-lbl col-span-3 bg-grey-lighter ">{inputStats.label}</label>
        </Tooltip>
        <input type="number" 
            id={inputStats.id.toLowerCase() + "Main"} 
            placeholder={inputStats.id} 
            min="1"
            className="form-input stats-main col-span-3 focus:border-black focus:shadow"
            value={sum}
            readOnly
        />
        <Tooltip className="bg-dark text-light px-2 py-1" placement="bottom" content={ "Dado" } >
            <input type="text" 
                id={inputStats.id.toLowerCase() + "Dice"} 
                placeholder="Dado" 
                min="1" 
                className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
                value={inputStats.valueDice}
                maxLength={2}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(0, e.target.value)}
                required
            />
        </Tooltip>
        <Tooltip className="bg-dark text-light px-2 py-1" placement="bottom" content={ "Clase" } >
            <input type="number" 
                id={inputStats.id.toLowerCase() + "Class"} 
                placeholder="Clase" 
                min="1" 
                className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
                value={inputStats.valueClass}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(1, e.target.value)}
                readOnly
            />
        </Tooltip>
        <Tooltip className="bg-dark text-light px-2 py-1" placement="bottom" content={ "Nivel" } >
            <input type="text" 
                id={inputStats.id.toLowerCase() + "Level"} 
                placeholder="Nivel" 
                min="1" 
                className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
                value={inputStats.valueLevel}
                maxLength={2}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(2, e.target.value)}
           />
        </Tooltip>
    
        </>
    );
};

export default FormInputStats;
