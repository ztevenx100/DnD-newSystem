import React, { useState, ChangeEvent } from 'react';

import { Tooltip, Typography } from "@material-tailwind/react";

interface InputSkill {
    id: string;
    label: string;
    description: string;
}

interface InputNumberProps {
    inputskill: InputSkill;
}

const FornInputSkill: React.FC<InputNumberProps> = ({inputskill })  => {
  const [inputValues, setInputValues] = useState<number[]>([0, 0, 0, 0]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = parseFloat(value) || 0; // Parsea como número o establece 0 si no es un número válido.
    setInputValues(newValues);
  };

  const sum = inputValues.slice(0, 3).reduce((acc, currentValue) => acc + currentValue, 0);

  return (
    <>

        <Tooltip 
            className="bg-dark text-light px-2 py-1" placement="right"
            content={
                <div className="w-80">
                <Typography color="blue-gray" className="font-medium">
                    {inputskill.label}
                </Typography>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-80"
                    >
                    {inputskill.description}
                </Typography>
                </div>
            }
        >
            <label htmlFor={inputskill.id + "Main"} className="form-lbl col-span-3 bg-grey-lighter ">{inputskill.label}</label>
        </Tooltip>
        <input type="number" 
            id={inputskill.id + "Main"} 
            placeholder={inputskill.id.toUpperCase()} 
            min="1"
            className="form-input stats-main col-span-3 focus:border-black focus:shadow"
            value={sum}
            readOnly
        />
        <input type="number" 
            id={inputskill.id + "Dice"} 
            placeholder="Dado" 
            min="1" 
            className="form-input stats-sub ml-2 col-start-1 col-end-2 focus:border-black focus:shadow"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(0, e.target.value)}
            value={inputValues[0]}
        />
        <input type="number" 
            id={inputskill.id + "Class"} 
            placeholder="Clase" 
            min="1" 
            className="form-input stats-sub col-start-2 col-end-3 focus:border-black focus:shadow"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(1, e.target.value)}
            value={inputValues[1]}
            readOnly
        />
        <input type="number" 
            id={inputskill.id + "Level"} 
            placeholder="Nivel" 
            min="1" 
            className="form-input stats-sub-end mr-2 col-start-3 col-end-4 focus:border-black focus:shadow"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(2, e.target.value)}
            value={inputValues[2]}
        />
    
    </>
  );
};

export default FornInputSkill;
