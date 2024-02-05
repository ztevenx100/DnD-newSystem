import React, { ChangeEvent,useEffect } from 'react';
import { SkillTypes, SkillsAcquired} from '../../../interfaces/typesCharacterSheet';


interface RingTypes {
  id: string;
  name: string;
}

interface FormInputSkillsRingProps{
    id: string;
    level: number;
    levelEvaluated: number;
    ringTypes: RingTypes[];
    skillList: SkillTypes;
    values: SkillsAcquired;
    onSelectChange: (id: string, ring: string, skill: string) => void;
    onSelectTypeChange: (id: string, type: string) => void;
}

const FormInputSkillsRing: React.FC<FormInputSkillsRingProps> = ({ id, level, levelEvaluated, ringTypes, skillList, values, onSelectChange, onSelectTypeChange }) => {

  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) => {

    useEffect(() => {
        setTimeout(() => {
            handleSkillTypeRingChange(values.ring);
            console.log('handleSkillTypeRingChange');
            
          }, 2000);
      }, [values]);
    };

    const handleSkillTypeRingChange = (newTypeRing: string) => {
        console.log('skillRing' + id);
        
        if (newTypeRing !== '') {
            onSelectTypeChange(id,newTypeRing)
        }
        onSelectChange(id, newTypeRing, '');
    };

    const handleSkillChange = (id: string, newSkill: string) => {
        onSelectChange(id, values.ring, newSkill);
    };

  return (
    <>

        <input type="number" 
            id={"levelSkill"+id} 
            placeholder="Nivel"
            className="form-input skill-level ml-2 row-span-2 focus:border-black focus:shadow"
            onChange={handleLevelChange}
            value={levelEvaluated}
            readOnly
        />
        <select 
            id={"skillTypeRing"+id} 
            className="form-input stats-sub mr-2"
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSkillTypeRingChange(e.target.value)}
            value={values.ring}
            disabled={level < levelEvaluated} // Deshabilita si el nivel es menor a levelEvaluated
        >
            <option value=""/>
            {ringTypes.map((ringType,index) => (
                <option key={index} value={ringType.id}>{ringType.name}</option>
            ))}
        </select>
        <select 
            id={"skillRing"+id} 
            className="form-input stats-sub mr-2"
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSkillChange(id, e.target.value)}
            value={values.name}
            disabled={!values.ring} // Deshabilita si no se ha seleccionado un tipo de anillo
        >
            <option value=""/>
            {skillList.skills.map((elem,index) => (
                <option key={index} value={elem.id}>{elem.name}</option>
            ))}
        </select>

    </>
  );
};

export default FormInputSkillsRing;
