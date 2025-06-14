import React from 'react';
import './Knowledge.css';

interface CheckboxItem {
  id: string;
  name: string;
  value: string;
}

interface KnowledgeProps {
  id: string;
  title: string;
  options: CheckboxItem[];
  selectedValues?: string[];
  onChange: (values: string[]) => void;
}

const Knowledge: React.FC<KnowledgeProps> = ({
  id,
  title,
  options,
  selectedValues = [],
  onChange
}) => {
  // Manejar el cambio de checkbox
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      // Añadir el valor si está seleccionado
      onChange([...selectedValues, value]);
    } else {
      // Eliminar el valor si se deselecciona
      onChange(selectedValues.filter(v => v !== value));
    }
  };

  return (
    <div className="knowledge-container">
      <h3 className="knowledge-title">{title}</h3>
      
      <div className="knowledge-options">
        {options.map((option) => (
          <div key={option.id} className="knowledge-option">
            <input
              type="checkbox"
              id={`${id}-${option.id}`}
              className="knowledge-checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
            />
            <label htmlFor={`${id}-${option.id}`} className="knowledge-label">
              {option.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Knowledge;
