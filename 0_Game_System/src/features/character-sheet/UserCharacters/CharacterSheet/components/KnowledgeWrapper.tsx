import React from 'react';
import { FieldPath, FieldValues } from "react-hook-form";
import Knowledge from '../components/Knowledge';
import '../components/FormField.css';

// Mantenemos la misma interfaz que el componente original
interface CheckboxItem {
  id: string;
  name: string;
  value: string;
}

interface KnowledgeWrapperProps<TFieldValues extends FieldValues = FieldValues> {
  id: string;
  label: string;
  checkboxes: CheckboxItem[];
  selectedValues?: string[];
  onSelectedValuesChange?: (newValues: string[]) => void;
  name?: FieldPath<TFieldValues>;
  externalStyles?: string;
}

const KnowledgeWrapper: React.FC<KnowledgeWrapperProps> = ({
  id,
  label,
  checkboxes,
  selectedValues = [],
  onSelectedValuesChange,
  externalStyles = ''
}) => {
  // Manejador de cambios, simplemente delega al callback proporcionado
  const handleChange = (newValues: string[]) => {
    if (onSelectedValuesChange) {
      onSelectedValuesChange(newValues);
    }
  };

  return (
    <div className={`form-field-wide ${externalStyles}`}>
      <Knowledge
        id={id}
        title={label}
        options={checkboxes}
        selectedValues={selectedValues}
        onChange={handleChange}
      />
    </div>
  );
};

export default KnowledgeWrapper;
