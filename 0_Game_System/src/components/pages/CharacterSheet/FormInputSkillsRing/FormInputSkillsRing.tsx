import React, { useState, ChangeEvent } from 'react';

interface Skill {
  id: number;
  name: string;
  level: number;
}
interface RingTypes {
  value: string;
  name: string;
}

interface FormInputSkillsRingProps{
    level: number;
    levelEvaluated: number;
    ringTypes: RingTypes[];
}

const FormInputSkillsRing: React.FC<FormInputSkillsRingProps> = ({ level, levelEvaluated, ringTypes }) => {

  const [skillTypeRing, setSkillTypeRing] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: 'Skill 1', level: 3 },
    { id: 2, name: 'Skill 2', level: 5 },
    // Add more skills as needed
  ]);

  const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(e.target.value, 10) || 0;
        updateSkills(newLevel);
    };

    const updateSkills = (newLevel: number) => {
        const filteredSkills = skills.filter(skill => skill.level <= newLevel);
        setSelectedSkill('');
        setSkills(filteredSkills);
    };

    const handleSkillTypeRingChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newTypeRing = e.target.value;
        setSkillTypeRing(newTypeRing);
        setSelectedSkill('');
        if (newTypeRing !== '') {
            // Aquí puedes ajustar las opciones del campo "skill" según el tipo de anillo seleccionado.
            // Por ahora, simplemente las reiniciamos al array original de habilidades.
            setSkills([]);
        }
    };

    const handleSkillChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedSkill(e.target.value);
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
            value={skillTypeRing}
            disabled={level < levelEvaluated} // Deshabilita si el nivel es menor a levelEvaluated
        >
            <option value=""/>
            {ringTypes.map((ringType,index) => (
                <option key={index} value={ringType.name}>{ringType.name}</option>
            ))}
        </select>
        <select 
            id={"skill"+levelEvaluated} 
            className="form-input stats-sub mr-2"
            value={selectedSkill}
            onChange={handleSkillChange}
            disabled={!skillTypeRing} // Deshabilita si no se ha seleccionado un tipo de anillo
        >
            <option value=""/>
            {ringTypes.map((ringType,index) => (
                <option key={index} value={ringType.name}>{ringType.name}</option>
            ))}
        </select>

    </>
  );
};

export default FormInputSkillsRing;
