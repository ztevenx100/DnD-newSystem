import React from 'react';
import './InitialArmament.css';
import { Option } from '@shared/utils/types/typesCharacterSheet';

interface InitialArmamentProps {
  mainWeapon: string;
  secondaryWeapon: string;
  skillClass: string;
  skillExtra: string;
  weaponsList: string[];
  skillClassOptions: Option[];
  skillExtraOptions: Option[];
  onMainWeaponChange: (value: string) => void;
  onSecondaryWeaponChange: (value: string) => void;
  onSkillClassChange: (value: string) => void;
  onSkillExtraChange: (value: string) => void;
}

const InitialArmament: React.FC<InitialArmamentProps> = ({
  mainWeapon,
  secondaryWeapon,
  skillClass,
  skillExtra,
  weaponsList,
  skillClassOptions,
  skillExtraOptions,
  onMainWeaponChange,
  onSecondaryWeaponChange,
  onSkillClassChange,
  onSkillExtraChange
}) => {
  return (
    <div className="initial-armament-container">
      <div className="armament-header">
        <h3 className="armament-title">Armamento y Habilidades</h3>
      </div>
      
      <div className="armament-grid">
        {/* Sección de armas */}
        <div className="weapon-section">
          <div className="weapon-field">
            <label htmlFor="mainWeapon" className="field-label">
              Arma principal
            </label>
            <input
              id="mainWeapon"
              type="text"
              className="field-input"
              value={mainWeapon}
              onChange={(e) => onMainWeaponChange(e.target.value)}
              placeholder="Selecciona un arma principal"
              list="weapons-list"
            />
            <datalist id="weapons-list">
              {weaponsList.map((weapon) => (
                <option key={weapon} value={weapon}>
                  {weapon}
                </option>
              ))}
            </datalist>
          </div>
          
          <div className="weapon-field">
            <label htmlFor="secondaryWeapon" className="field-label">
              Arma secundaria
            </label>
            <input
              id="secondaryWeapon"
              type="text"
              className="field-input"
              value={secondaryWeapon}
              onChange={(e) => onSecondaryWeaponChange(e.target.value)}
              placeholder="Selecciona un arma secundaria"
              list="weapons-list"
            />
          </div>
        </div>
        
        {/* Sección de habilidades */}
        <div className="skills-section">
          <div className="skill-field">
            <label htmlFor="skillClass" className="field-label">
              Habilidad innata
            </label>
            <select
              id="skillClass"
              className="field-input"
              value={skillClass}
              onChange={(e) => onSkillClassChange(e.target.value)}
            >
              <option value="">Selecciona una habilidad innata</option>
              {skillClassOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="skill-field">
            <label htmlFor="skillExtra" className="field-label">
              Habilidad extra
            </label>
            <select
              id="skillExtra"
              className="field-input"
              value={skillExtra}
              onChange={(e) => onSkillExtraChange(e.target.value)}
            >
              <option value="">Selecciona una habilidad extra</option>
              {skillExtraOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialArmament;
