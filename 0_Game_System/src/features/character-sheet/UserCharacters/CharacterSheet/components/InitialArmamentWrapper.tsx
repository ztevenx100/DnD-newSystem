import React from 'react';
import InitialArmament from './InitialArmament';
import { Option } from '@shared/utils/types/typesCharacterSheet';

interface InitialArmamentWrapperProps {
  externalStyles?: string;
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

const InitialArmamentWrapper: React.FC<InitialArmamentWrapperProps> = ({
  externalStyles = '',
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
    <div className={externalStyles}>
      <InitialArmament
        mainWeapon={mainWeapon}
        secondaryWeapon={secondaryWeapon}
        skillClass={skillClass}
        skillExtra={skillExtra}
        weaponsList={weaponsList}
        skillClassOptions={skillClassOptions}
        skillExtraOptions={skillExtraOptions}
        onMainWeaponChange={onMainWeaponChange}
        onSecondaryWeaponChange={onSecondaryWeaponChange}
        onSkillClassChange={onSkillClassChange}
        onSkillExtraChange={onSkillExtraChange}
      />
    </div>
  );
};

export default InitialArmamentWrapper;
