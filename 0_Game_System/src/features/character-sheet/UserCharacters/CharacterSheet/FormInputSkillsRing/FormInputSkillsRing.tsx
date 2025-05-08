import { ChangeEvent, useEffect } from 'react'
import { SkillTypes, SkillsAcquired, Skill } from '@/shared/utils/types/typesCharacterSheet'

interface RingTypes {
  id: string;
  name: string;
  stat: string;
}

interface FormInputSkillsRingProps{
    id: string;
    level: number;
    levelEvaluated: number;
    ringTypes: RingTypes[];
    skillList: SkillTypes;
    values: SkillsAcquired;
    onSelectChange: (id: string, ring: string, skill: string, stat: string) => void;
    onSelectTypeChange: (id: string, type: string) => void;
}

const FormInputSkillsRing: React.FC<FormInputSkillsRingProps> = ({ 
    id, 
    level, 
    levelEvaluated, 
    ringTypes, 
    skillList, 
    values, 
    onSelectChange, 
    onSelectTypeChange 
}) => {
    // useEffect se coloca directamente en el componente, no dentro de otra función
    useEffect(() => {
        // Cuando el valor del anillo cambia, actualizamos las habilidades disponibles
        if (values.ring) {
            handleSkillTypeRingChange(values.ring);
        }
    }, [values.ring]);

    const handleSkillTypeRingChange = (newRing: string) => {
        const stat: string = ringTypes.find(ring => ring.id === newRing)?.stat || '';
        if (stat !== '') {
            onSelectTypeChange(id, stat);
        }
        onSelectChange(id, newRing, values.name || '', stat);
    };

    const handleSkillChange = (id: string, newSkill: string) => {
        const stat: string = ringTypes.find(ring => ring.id === values.ring)?.stat || '';
        onSelectChange(id, values.ring, newSkill, stat);
    };

    return (
        <>
            {level >= levelEvaluated ? (
                <>
                    <input type="number" 
                        id={"levelSkill"+id} 
                        placeholder="Nivel"
                        className="form-input skill-level ml-2 row-span-2 focus:border-black focus:shadow"
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
                        {skillList.skills.map((elem: Skill, index: number) => (
                            <option key={index} value={elem.value || ''}>{elem.name}</option>
                        ))}
                    </select>
                </>
            ) : (
                <><div className='col-span-2 py-4'></div></>
            )}
        </>
    );
};

export default FormInputSkillsRing;