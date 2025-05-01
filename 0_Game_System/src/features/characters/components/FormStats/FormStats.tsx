import React from 'react';
import { InputStats } from '../../types';
import { Tooltip } from '@nextui-org/react';
import SvgD4Roll from '@Icons/SvgD4Roll';

interface FormStatsProps {
  stats: InputStats[];
  onStatsChange: (newStats: InputStats[]) => void;
  onRandomize?: () => void;
  disabled?: boolean;
}

const FormStats: React.FC<FormStatsProps> = ({ 
  stats, 
  onStatsChange, 
  onRandomize,
  disabled = false 
}) => {
  const handleStatChange = (index: number, field: keyof InputStats, value: number) => {
    const updatedStats = [...stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    onStatsChange(updatedStats);
  };

  return (
    <fieldset className="fieldset-form stats-player row-span-3 col-span-1 col-start-1 bg-white shadow-lg rounded">
      <legend>Estadísticas del personaje</legend>
      
      {onRandomize && (
        <header className="stats-player-header col-span-3 col-start-3">
          <Tooltip
            className="bg-dark text-light px-2 py-1"
            placement="top"
            content="Estadísticas al azar"
          >
            <button
              type="button"
              className="btn-save-character"
              onClick={onRandomize}
              disabled={disabled}
            >
              <SvgD4Roll className="btn-roll" width={30} height={30} />
            </button>
          </Tooltip>
        </header>
      )}

      {stats.map((stat, index) => (
        <div key={stat.id} className="stat-row">
          <label className="form-lbl bg-grey-lighter">
            {stat.label}
          </label>
          <Tooltip content={stat.description}>
            <input
              type="number"
              className="stats-main"
              value={stat.valueDice}
              onChange={e => handleStatChange(index, 'valueDice', parseInt(e.target.value) || 0)}
              min={0}
              max={10}
              disabled={disabled}
            />
          </Tooltip>
          <input
            type="number"
            className="stats-sub"
            value={stat.valueClass}
            onChange={e => handleStatChange(index, 'valueClass', parseInt(e.target.value) || 0)}
            min={0}
            max={10}
            disabled={disabled}
          />
          <input
            type="number"
            className="stats-sub-end"
            value={stat.valueLevel}
            onChange={e => handleStatChange(index, 'valueLevel', parseInt(e.target.value) || 0)}
            min={0}
            max={10}
            disabled={disabled}
          />
        </div>
      ))}
    </fieldset>
  );
};

export default FormStats;