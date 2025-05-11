/**
 * Helper function to map database fields to expected property names
 * This helps bridge the gap between database column names and code field names
 */
export function mapSkillFields(skill: any) {
  return {
    id: skill.hab_id || skill.id || '',
    nombre: skill.hab_nombre || skill.nombre || '',
    sigla: skill.hab_siglas || skill.sigla || '',
    tipo: skill.hab_tipo || skill.tipo || '',
    estadistica_base: skill.had_estadistica_base || skill.estadistica_base || skill.hab_estadistica_base || '',
    descripcion: skill.hab_descripcion || skill.descripcion || ''
  };
}
