import React, { ChangeEvent } from 'react';
// Definir el tipo para los elementos del array 'options'
type Option = {
    value: string;
    name: string;
  };
  
  type SelectFieldProps = {
    id: string; // Id del select
    label: string;
    options: Option[];
    onSelectChange: (selectedValue: string) => void;
  };

const FormSelectInfoPlayer: React.FC<SelectFieldProps> = ({id, label, options, onSelectChange}) => {
    // Manejar el cambio en la selección
    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onSelectChange(e.target.value);
    };

    return(
        <>
            <label htmlFor={id} className="form-lbl col-start-1 col-end-2 bg-grey-lighter ">{label}</label>
            <select 
                id={id} 
                className="form-input col-start-2 col-end-3 mr-2"
                onChange={handleSelectChange}
                required
                >
                <option value=""/>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                    {option.name}
                    </option>
                ))}
            </select>
        </>
    )
}

export default FormSelectInfoPlayer;