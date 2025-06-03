import React from 'react';
import { InputStats } from '../context/CharacterSheetTypes';

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
    const validValue = isNaN(value) ? 1 : Math.min(Math.max(value, 1), 20);
    onStatChange(statId, field, validValue);
  };
  
  return (
    <div className="stats-container">
      <h3 className="stats-title">Estadísticas del Personaje</h3>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-item">
            <div className="stat-header">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-total">{getStatTotal(stat.id)}</span>
            </div>
            <div className="stat-inputs">
              <div className="stat-input-group">
                <label>Dados</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={stat.valueDice}
                  onChange={(e) => handleInputChange(stat.id, 'valueDice', e)}
                />
              </div>
              <div className="stat-input-group">
                <label>Clase</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={stat.valueClass}
                  onChange={(e) => handleInputChange(stat.id, 'valueClass', e)}
                />
              </div>
              <div className="stat-input-group">
                <label>Nivel</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={stat.valueLevel}
                  onChange={(e) => handleInputChange(stat.id, 'valueLevel', e)}
                />
              </div>
            </div>
            <div className="stat-description">{stat.description}</div>
          </div>
        ))}
      </div>
      <div className="stats-total">
        <span className="stats-total-label">Total de Puntos:</span>
        <span className="stats-total-value">{getStatTotal('total')}</span>
      </div>
    </div>
  );
};

export default CharacterStats;
