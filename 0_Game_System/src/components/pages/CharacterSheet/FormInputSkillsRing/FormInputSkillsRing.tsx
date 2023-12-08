import React, { useState, ChangeEvent } from 'react';
import { SkillTypes, Skill, SkillsAcquired} from '../../../interfaces/typesCharacterSheet';


interface RingTypes {
  value: string;
  name: string;
}

interface FormInputSkillsRingProps{
    id: number;
    level: number;
    levelEvaluated: number;
    ringTypes: RingTypes[];
    skillForType: SkillTypes[];
    values: SkillsAcquired;
    onSelectChange: (id: number, ring: string, skill: string) => void;
}

const FormInputSkillsRing: React.FC<FormInputSkillsRingProps> = ({ id, level, levelEvaluated, ringTypes, skillForType, values, onSelectChange }) => {

  const [skillTypeRing, setSkillTypeRing] = useState<string>('');
  const [skillsList, setSkillsList] = useState<Skill[]>([]);

  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10) || 0;
        updateSkills(newLevel);
    };

    const updateSkills = (newLevel: number) => {
        //const filteredSkills = skills.filter(skill => skill.level <= newLevel);
        //setSelectedSkill('');
        //setSkillsList(filteredSkills);
    };

    const handleSkillTypeRingChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newTypeRing = e.target.value;
        onSelectChange(id, newTypeRing, '');
        if (newTypeRing !== '') {
            // Aquí puedes ajustar las opciones del campo "skill" según el tipo de anillo seleccionado.
            // Por ahora, simplemente las reiniciamos al array original de habilidades.
            const newSkillList: Skill[] = (skillForType.find(option => option.id === newTypeRing) || {}).skills || [];
            setSkillsList( newSkillList );
        }
    };

    const handleSkillChange = (id: number, newSkill: string) => {
        onSelectChange(id, values.ring, newSkill);
    };

  return (
    <>

        <input type="number" 
            id={"levelSkill"+levelEvaluated} 
            placeholder="Nivel"
            className="form-input skill-level ml-2 row-span-2 focus:border-black focus:shadow"
            onChange={handleLevelChange}
            value={levelEvaluated}
            readOnly
        />
        <select 
            id={"skillTypeRing"+levelEvaluated} 
            className="form-input stats-sub mr-2"
            onChange={handleSkillTypeRingChange}
            value={values.ring}
            disabled={level < levelEvaluated} // Deshabilita si el nivel es menor a levelEvaluated
        >
            <option value=""/>
            {ringTypes.map((ringType,index) => (
                <option key={index} value={ringType.value}>{ringType.name}</option>
            ))}
        </select>
        <select 
            id={"skill"+levelEvaluated} 
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
