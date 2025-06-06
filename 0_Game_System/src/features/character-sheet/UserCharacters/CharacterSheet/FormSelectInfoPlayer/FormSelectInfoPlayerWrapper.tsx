import React from 'react';
import { FieldPath, FieldValues } from "react-hook-form";
import { useCharacterSheet } from '../context/CharacterSheetContext';
import FormSelectInfoPlayer from './FormSelectInfoPlayer';
import { Option } from "@/shared/utils/types/typesCharacterSheet";

/**
 * Props para el FormSelectInfoPlayerWrapper
 */
interface FormSelectInfoPlayerWrapperProps<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  label: string;
  options: Option[];
  selectedValue?: string;
  onSelectChange?: (selectedValue: string) => void;
  className?: string;
  name?: FieldPath<TFieldValues>;
  required?: boolean;
  externalStyles?: string;
}

/**
 * Wrapper component que conecta FormSelectInfoPlayer con el contexto de CharacterSheet
 * 
 * Este componente:
 * - Obtiene el register function del contexto
 * - Pasa las props necesarias al componente original
 * - Mantiene la compatibilidad con el comportamiento existente
 */
const FormSelectInfoPlayerWrapper = <TFieldValues extends FieldValues = FieldValues>({
  id,
  label,
  options,
  selectedValue,
  onSelectChange,
  className = '',
  name,
  required = false,
  externalStyles = '',
}: FormSelectInfoPlayerWrapperProps<TFieldValues>) => {
  const { register } = useCharacterSheet();

  return (
    <div className={externalStyles}>
      <FormSelectInfoPlayer
        id={id}
        label={label}
        options={options}
        selectedValue={selectedValue}
        onSelectChange={onSelectChange}
        className={className}
        register={register}
        name={name}
        required={required}
      />
    </div>
  );
};

// Memoize the component for performance optimization
export default React.memo(FormSelectInfoPlayerWrapper) as typeof FormSelectInfoPlayerWrapper;
