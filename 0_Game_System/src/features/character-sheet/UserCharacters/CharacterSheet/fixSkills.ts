import { DBHabilidad } from '@shared/utils/types';

/**
 * Helper function to map database fields to expected property names
 * This helps bridge the gap between database column names and code field names
 * @param skill The skill object to normalize
 * @returns A normalized skill object with consistent property names
 */
export function mapSkillFields(skill: DBHabilidad) {
  return {
    id: skill.hab_id || skill.id || '',
    nombre: skill.hab_nombre || skill.nombre || '',
    sigla: skill.hab_siglas || skill.sigla || '',
    tipo: skill.hab_tipo || skill.tipo || '',
    estadistica_base: skill.had_estadistica_base || skill.estadistica_base || '',
    descripcion: skill.hab_descripcion || skill.descripcion || '',
    
    // Preservar los campos originales para compatibilidad
    hab_id: skill.hab_id || skill.id || '',
    hab_nombre: skill.hab_nombre || skill.nombre || '',
    hab_siglas: skill.hab_siglas || skill.sigla || '',
    hab_tipo: skill.hab_tipo || skill.tipo || '',
    had_estadistica_base: skill.had_estadistica_base || skill.estadistica_base || ''
  };
}
