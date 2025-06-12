import React from 'react';
import { InputStats } from '../context/CharacterSheetTypes';
import { Tooltip } from "@nextui-org/react";
import './CharacterStats.css';

interface CharacterStatsProps {
  stats: InputStats[];
  onStatChange: (statId: string, field: 'valueDice' | 'valueClass' | 'valueLevel', value: number) => void;
  getStatTotal: (statId: string) => number;
}

/**
 * Componente para mostrar y gestionar las estadísticas del personaje
 */
export const CharacterStats: React.FC<CharacterStatsProps> = ({
  stats,
  onStatChange,
  getStatTotal
}) => {
  const handleInputChange = (
    statId: string, 
    field: 'valueDice' | 'valueClass' | 'valueLevel', 
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Validar que sea un número entre 1 y 20
    const value = parseInt(e.target.value, 10);
    const validValue = isNaN(value) ? 1 : Math.min(Math.max(value, field === 'valueDice' ? 1 : 0), 20);
    onStatChange(statId, field, validValue);
  };
  // Mostrar un solo stat (para compatibilidad con el componente original)
  if (stats.length === 1) {
    const stat = stats[0];
    return (
      <div className="character-stats-container">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-header">
              <Tooltip content={stat.description}>
                <span className="stat-name">{stat.label}</span>
              </Tooltip>
              <span className="stat-total">{getStatTotal(stat.id)}</span>
            </div>

            <div className="stat-part">
              <span className="stat-part-label">Base</span>
              <input
                type="number"
                className="stat-part-value numeric-input"
                value={stat.valueDice}
                min={1}
                max={20}
                onChange={(e) => handleInputChange(stat.id, 'valueDice', e)}
              />
            </div>
            <div className="stat-part">
              <span className="stat-part-label">Clase</span>
              <input
                type="number"
                className="stat-part-value numeric-input"
                value={stat.valueClass}
                min={0}
                max={20}
                onChange={(e) => handleInputChange(stat.id, 'valueClass', e)}
              />
            </div>
            <div className="stat-part">
              <span className="stat-part-label">Nivel</span>
              <input
                type="number"
                className="stat-part-value numeric-input"
                value={stat.valueLevel}
                min={0}
                max={20}
                onChange={(e) => handleInputChange(stat.id, 'valueLevel', e)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Vista completa para todas las estadísticas
  return (
    <div className="character-stats-container">
      <div className="stats-header">
        <h3 className="stats-title">Estadísticas del Personaje</h3>
        <div className="stats-total">
          Total: <span className="stats-total-value">{getStatTotal('total')}</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-item">
            <div className="stat-header">
              <Tooltip content={stat.description}>
                <span className="stat-name">{stat.label}</span>
              </Tooltip>
              <span className="stat-total">{getStatTotal(stat.id)}</span>
            </div>

            {/* Valor de los dados */}
            <div className="stat-part">
              <span className="stat-part-label">Base</span>
              <input
                type="number"
                className="stat-part-value numeric-input"
                value={stat.valueDice}
                min={1}
                max={20}
                onChange={(e) => handleInputChange(stat.id, 'valueDice', e)}
              />
            </div>

            {/* Bonificación de clase */}
            <div className="stat-part">
              <span className="stat-part-label">Clase</span>
              <input
                type="number"
                className="stat-part-value numeric-input"
                value={stat.valueClass}
                min={0}
                max={20}
                onChange={(e) => handleInputChange(stat.id, 'valueClass', e)}
              />
            </div>

            {/* Bonificación de nivel */}
            <div className="stat-part">
              <span className="stat-part-label">Nivel</span>
              <input
                type="number"
                className="stat-part-value numeric-input"
                value={stat.valueLevel}
                min={0}
                max={20}
                onChange={(e) => handleInputChange(stat.id, 'valueLevel', e)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterStats;
