import React, { ChangeEvent } from 'react';

import { Tooltip } from "@nextui-org/react"

import { InputStats } from '@interfaces/typesCharacterSheet';

interface InputNumberProps {
    inputStats: InputStats;
    onSelectedValuesChange: (newInputStats: InputStats) => void;
}

const FormInputStats: React.FC<InputNumberProps> = ({inputStats,  onSelectedValuesChange})  => {
  // Si inputStats es undefined, retornamos null para evitar errores
  if (!inputStats) {
    return null;
  }
  
  let sum = inputStats.valueDice + inputStats.valueClass + inputStats.valueLevel;

  function validateNumeric(value:string, valueDefault?: number): number{
    if(isNaN(Number(value))){
       alert('Valor no numerico');
       return valueDefault||0;
    } else if (value === '') {
       return valueDefault||0;
    } else {
       return parseInt(value);
    }
  }

    const handleInputChange = (index: number, value: string) => {
        let numericValue = validateNumeric(value);
        switch (index) {
            case 0:
                inputStats.valueDice = numericValue;
                break;
            case 1:
                inputStats.valueClass = numericValue;
                break;
            case 2:
                inputStats.valueLevel = numericValue;
                break;
        
            default:
                break;
        }
        onSelectedValuesChange(inputStats);
        sum = inputStats.valueDice + inputStats.valueClass + inputStats.valueLevel;
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
