import React from 'react';
import { Select, SelectItem } from '@nextui-org/react';
import { Option } from "@interfaces/typesCharacterSheet";
import { WEAPONS_LIST } from '../../../../components/pages/UserCharacters/CharacterSheet/constants';

interface FormWeaponsProps {
  mainWeapon: string;
  secondaryWeapon: string;
  mainSkill: string;
  extraSkill: string;
  skillOptions: Option[];
  onMainWeaponChange: (weapon: string) => void;
  onSecondaryWeaponChange: (weapon: string) => void;
  onMainSkillChange: (skill: string) => void;
  onExtraSkillChange: (skill: string) => void;
  disabled?: boolean;
}

const FormWeapons: React.FC<FormWeaponsProps> = ({
  mainWeapon,
  secondaryWeapon,
  mainSkill,
  extraSkill,
  skillOptions,
  onMainWeaponChange,
  onSecondaryWeaponChange,
  onMainSkillChange,
  onExtraSkillChange,
  disabled = false
}) => {
  return (
    <fieldset className="fieldset-form initial-armament col-span-1 row-span-1 bg-white shadow-lg rounded">
      <legend>Armamento inicial</legend>

      <div className="mb-4">
        <label htmlFor="mainWeapon" className="form-lbl bg-grey-lighter">
          Arma principal
        </label>
        <input
          list="weapons"
          id="mainWeapon"
          value={mainWeapon}
          onChange={e => onMainWeaponChange(e.target.value)}
          placeholder="Arma principal"
          className="form-input mr-2"
          disabled={disabled}
        />
        <datalist id="weapons">
          {WEAPONS_LIST.map((weapon) => (
            <option key={weapon} value={weapon}>{weapon}</option>
          ))}
        </datalist>
      </div>

      <div className="mb-4">
        <label htmlFor="secondaryWeapon" className="form-lbl bg-grey-lighter">
          Arma secundaria
        </label>
        <input
          list="weapons"
          id="secondaryWeapon"
          value={secondaryWeapon}
          onChange={e => onSecondaryWeaponChange(e.target.value)}
          placeholder="Arma secundaria"
          className="form-input mr-2"
          disabled={disabled}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="mainSkill" className="form-lbl bg-grey-lighter">
          Habilidad innata
        </label>
        <Select
          id="mainSkill"
          selectedKeys={mainSkill ? [mainSkill] : []}
          onChange={e => onMainSkillChange(e.target.value)}
          className="form-input"
          isDisabled={disabled}
        >
          {skillOptions.map((skill) => (
            <SelectItem key={skill.value} value={skill.value}>
              {skill.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="extraSkill" className="form-lbl bg-grey-lighter">
          Habilidad extra
        </label>
        <Select
          id="extraSkill"
          selectedKeys={extraSkill ? [extraSkill] : []}
          onChange={e => onExtraSkillChange(e.target.value)}
          className="form-input"
          isDisabled={disabled}
        >
          {skillOptions.map((skill) => (
            <SelectItem key={skill.value} value={skill.value}>
              {skill.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    </fieldset>
  );
};

export default FormWeapons;