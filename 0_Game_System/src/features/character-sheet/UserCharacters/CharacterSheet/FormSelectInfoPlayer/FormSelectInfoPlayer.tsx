import { ChangeEvent } from "react";
import { UseFormRegister, FieldPath, FieldValues } from "react-hook-form";
import { Option } from "@/shared/utils/types/typesCharacterSheet";

type SelectFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  id: string;
  label: string;
  options: Option[];
  selectedValue?: string;
  onSelectChange?: (selectedValue: string) => void;
  className?: string;
  register?: UseFormRegister<TFieldValues>;
  name?: FieldPath<TFieldValues>;
  required?: boolean;
};

const FormSelectInfoPlayer = <TFieldValues extends FieldValues = FieldValues>({
  id,
  label,
  options,
  selectedValue,
  onSelectChange,
  className = '',
  register,
  name,
  required = false,
}: SelectFieldProps<TFieldValues>) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onSelectChange) {
      onSelectChange(e.target.value);
    }
  };

  const safeOptions = Array.isArray(options) ? options : [];

  // Use React Hook Form register if provided, otherwise fallback to manual handling
  const selectProps = register && name 
    ? {
        ...register(name, { 
          required: required ? `${label} es obligatorio` : false,
          onChange: handleSelectChange 
        }),
        value: undefined // Let React Hook Form handle the value
      }
    : {
        value: selectedValue,
        onChange: handleSelectChange
      };
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
        required={required}
        {...selectProps}
      >
        <option value="" />
        {safeOptions.length > 0 ? (
          safeOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))
        ) : (
          <option disabled value="">No options available</option>
        )}
      </select>
    </>
  );
};

export default FormSelectInfoPlayer;
