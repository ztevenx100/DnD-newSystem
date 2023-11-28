import React, { useState, ChangeEvent } from 'react';

import { Tooltip, Typography } from "@material-tailwind/react";

import { InputStats } from '../../../interfaces/typesCharacterSheet';

interface InputNumberProps {
    inputStats: InputStats;
    onSelectedValuesChange: (newInputStats: InputStats) => void;
}

const FormInputStats: React.FC<InputNumberProps> = ({inputStats,  onSelectedValuesChange})  => {
  //const [inputValues, setInputValues] = useState<number[]>([0, 0, 0]);

  const handleInputChange = (index: number, value: number) => {
    switch (index) {
        case 0:
            inputStats.valueDice = value;
            break;
        case 1:
            inputStats.valueClass = value;
            break;
        case 2:
            inputStats.valueLevel = value;
            break;
    
        default:
            break;
    }
    onSelectedValuesChange(inputStats);

  };

  const sum = inputStats.valueDice + inputStats.valueClass + inputStats.valueLevel;

  return (
    <>

        <Tooltip 
            className="bg-dark text-light px-2 py-1" placement="right"
            content={
                <div className="w-80">
                <Typography color="blue-gray" className="font-medium">
                    {inputStats.label}
                </Typography>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-80"
                    >
                    {inputStats.description}
                </Typography>
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
            <input type="number" 
                id={inputStats.id.toLowerCase() + "Dice"} 
                placeholder="Dado" 
                min="1" 
                className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(0, parseInt(e.target.value))}
                value={inputStats.valueDice}
            />
        </Tooltip>
        <Tooltip className="bg-dark text-light px-2 py-1" placement="bottom" content={ "Clase" } >
            <input type="number" 
                id={inputStats.id.toLowerCase() + "Class"} 
                placeholder="Clase" 
                min="1" 
                className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(1, parseInt(e.target.value))}
                value={inputStats.valueClass}
                readOnly
            />
        </Tooltip>
        <Tooltip className="bg-dark text-light px-2 py-1" placement="bottom" content={ "Nivel" } >
            <input type="number" 
                id={inputStats.id.toLowerCase() + "Level"} 
                placeholder="Nivel" 
                min="1" 
                className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(2, parseInt(e.target.value))}
                value={inputStats.valueLevel}
           />
        </Tooltip>
    
    </>
  );
};

export default FormInputStats;
