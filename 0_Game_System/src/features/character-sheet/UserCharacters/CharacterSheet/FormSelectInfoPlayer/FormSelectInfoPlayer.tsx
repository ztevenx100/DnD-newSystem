import React, { ChangeEvent } from "react";
import { Option } from "@/shared/utils/types/typesCharacterSheet";

type SelectFieldProps = {
  id: string;
  label: string;
  options: Option[];
  selectedValue: string;
  onSelectChange: (selectedValue: string) => void;
  className?: string;
};

const FormSelectInfoPlayer: React.FC<SelectFieldProps> = ({
  id,
  label,
  options,
  selectedValue,
  onSelectChange,
  className = '',
}) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(`Select ${id} changed to: ${e.target.value}`);
    onSelectChange(e.target.value);
  };
  // Log debugging info
  React.useEffect(() => {
    console.log(`FormSelectInfoPlayer ${id} rendering with:`, {
      selectedValue,
      options: options.map(o => `${o.value}: ${o.name}`).join(', '),
      hasSelectedValue: options.some(o => o.value === selectedValue)
    });
  }, [id, selectedValue, options]);

  return (
    <>
      <label
        htmlFor={id}
        className="form-lbl col-start-1 col-end-2 bg-grey-lighter "
      >
        {label}
      </label>
      <select
        id={id}
        className={`form-input col-start-2 col-end-3 mr-2 ${className}`}
        value={selectedValue}
        onChange={handleSelectChange}
        required
      >
        <option value="" />
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default FormSelectInfoPlayer;
