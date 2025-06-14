import { ChangeEvent, useEffect, useRef } from 'react'
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
    // Usar useRef para almacenar la última actualización enviada y evitar repeticiones
    const lastUpdateRef = useRef<{ring: string, stat: string}>({ring: '', stat: ''});
    
    useEffect(() => {
        // Evitar ejecuciones innecesarias si no hay un anillo seleccionado
        if (!values.ring) return;

        // Guardar valores actuales para comparación
        const currentRingType = values.ring;
        const ringTypeObj = ringTypes.find(ring => ring.id === currentRingType);
        const currentStat = ringTypeObj?.stat || '';

        // Verificar si esta actualización ya fue procesada
        if (lastUpdateRef.current.ring === currentRingType && 
            lastUpdateRef.current.stat === currentStat) {
            return;
        }

        // Solo realizar la actualización si hay un tipo de anillo seleccionado y se necesita actualizar la lista
        if (currentRingType && (
            skillList.skills.length === 0 || // No hay habilidades cargadas
            !skillList.id || // No hay ID de habilidad establecido
            skillList.id !== currentStat // O la habilidad actual no corresponde al stat del anillo
        )) {
            // Solo llamar a onSelectTypeChange si realmente encontramos una estadística válida
            if (currentStat !== '') {
                console.debug(`Updating ring ${id} with stat ${currentStat}`);
                
                // Actualizar referencia para evitar procesamiento repetido
                lastUpdateRef.current = {ring: currentRingType, stat: currentStat};
                
                // Usar un timeout para dividir las actualizaciones
                const timeoutDuration = parseInt(id, 10) * 75; // Ampliar aún más el escalonamiento (0ms, 75ms, 150ms)
                const timer = setTimeout(() => {
                    onSelectTypeChange(id, currentStat);
                }, timeoutDuration);
                
                return () => {
                    clearTimeout(timer);
                    // No reiniciar la referencia en cleanup para mantener el "procesado" 
                    // en remontajes rápidos del componente
                };
            }
        }
    // Dependencias específicas para prevenir bucles innecesarios
    }, [id, values.ring, ringTypes, skillList.skills.length, skillList.id, onSelectTypeChange]);
    
    const handleSkillTypeRingChange = (newRing: string) => {
        const ringType = ringTypes.find(ring => ring.id === newRing);
        const stat: string = ringType?.stat || '';
        
        // Verificar si ya estamos en el mismo valor para evitar updates redundantes
        if (newRing === values.ring) return;
        
        if (stat !== '') {
            onSelectTypeChange(id, stat);
        }
        
        onSelectChange(id, newRing, values.name || '', stat);
    };
    
    const handleSkillChange = (id: string, newSkill: string) => {
        // Verificar si ya estamos en el mismo valor para evitar updates redundantes
        if (newSkill === values.name) return;
        
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