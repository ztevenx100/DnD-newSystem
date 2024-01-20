import React, { useState, ChangeEvent,useEffect } from 'react';
import { SkillTypes, Skill, SkillsAcquired} from '../../../interfaces/typesCharacterSheet';


interface RingTypes {
  value: string;
  name: string;
}

interface FormInputSkillsRingProps{
    id: string;
    level: number;
    levelEvaluated: number;
    ringTypes: RingTypes[];
    skillForType: SkillTypes[];
    values: SkillsAcquired;
    onSelectChange: (id: string, ring: string, skill: string) => void;
}

const FormInputSkillsRing: React.FC<FormInputSkillsRingProps> = ({ id, level, levelEvaluated, ringTypes, skillForType, values, onSelectChange }) => {

  const [skillsList, setSkillsList] = useState<Skill[]>([]);

  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) => {

    useEffect(() => {
        setTimeout(() => {
            handleSkillTypeRingChange(values.ring);
            console.log('handleSkillTypeRingChange');
            
          }, 2000);
      }, [values]);

    const newLevel = parseInt(e.target.value, 10) || 0;
        //updateSkills(newLevel);
    };

    const handleSkillTypeRingChange = (newTypeRing: string) => {
        onSelectChange(id, newTypeRing, '');
        if (newTypeRing !== '') {
            // Aquí puedes ajustar las opciones del campo "skill" según el tipo de anillo seleccionado.
            // Por ahora, simplemente las reiniciamos al array original de habilidades.
            const newSkillList: Skill[] = (skillForType.find(option => option.id === newTypeRing) || {}).skills || [];
            setSkillsList( newSkillList );
        }
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
                <option key={index} value={ringType.value}>{ringType.name}</option>
            ))}
        </select>
        <select 
            id={"skillRing"+id} 
            className="form-input stats-sub mr-2"
            value={values.name}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSkillChange(id, e.target.value)}
            disabled={!values.ring} // Deshabilita si no se ha seleccionado un tipo de anillo
        >
            <option value=""/>
            {skillsList.map((elem,index) => (
                <option key={index} value={elem.id}>{elem.name}</option>
            ))}
        </select>

    </>
  );
};

export default FormInputSkillsRing;
