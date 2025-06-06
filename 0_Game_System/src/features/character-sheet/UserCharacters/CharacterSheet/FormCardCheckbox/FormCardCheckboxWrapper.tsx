import React from 'react';
import { FieldPath, FieldValues } from "react-hook-form";
import { useCharacterSheet } from '../context/CharacterSheetContext';
import FormCardCheckbox from './FormCardCheckbox';

interface CheckboxItem {
  id: string;
  name: string;
  value: string;
}

/**
 * Props para el FormCardCheckboxWrapper
 */
interface FormCardCheckboxWrapperProps<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  label: string;
  checkboxes: CheckboxItem[];
  selectedValues?: string[];
  onSelectedValuesChange?: (newValues: string[]) => void;
  name?: FieldPath<TFieldValues>;
  externalStyles?: string;
}

/**
 * Wrapper component que conecta FormCardCheckbox con el contexto de CharacterSheet
 * 
 * Este componente:
 * - Obtiene el control function del contexto para React Hook Form
 * - Pasa las props necesarias al componente original
 * - Mantiene la compatibilidad con el comportamiento existente
 */
const FormCardCheckboxWrapper = <TFieldValues extends FieldValues = FieldValues>({
  id,
  label,
  checkboxes,
  selectedValues,
  onSelectedValuesChange,
  name,
  externalStyles = '',
}: FormCardCheckboxWrapperProps<TFieldValues>) => {
  const { control } = useCharacterSheet();

  return (
    <div className={externalStyles}>
      <FormCardCheckbox
        id={id}
        label={label}
        checkboxes={checkboxes}
        selectedValues={selectedValues}
        onSelectedValuesChange={onSelectedValuesChange}
        control={control}
        name={name}
      />
    </div>
  );
};

// Memoize the component for performance optimization
export default React.memo(FormCardCheckboxWrapper) as typeof FormCardCheckboxWrapper;
