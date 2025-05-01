import { CHARACTER_CLASSES, CHARACTER_RACES, CHARACTER_JOBS, CHARACTER_KNOWLEDGE } from './constants';

export const getClassName = (value?: string): string => {
    return CHARACTER_CLASSES.find(option => option.value === value)?.name || '';
};

export const getRaceName = (value?: string): string => {
    return CHARACTER_RACES.find(option => option.value === value)?.name || '';
};

export const getJobName = (value?: string): string => {
    return CHARACTER_JOBS.find(option => option.value === value)?.name || '';
};

export const getKnowledgeName = (values?: string[]): string => {
    if (!values) return '';
    return values.map(value => 
        CHARACTER_KNOWLEDGE.find(option => option.value === value)?.name
    ).filter(Boolean).join(', ');
};

export const getMainSkillName = (value?: string): string => {
    return CHARACTER_CLASSES.find(option => option.value === value)?.name || '';
};

export const getExtraSkillName = (value?: string): string => {
    return CHARACTER_JOBS.find(option => option.value === value)?.name || '';
};

export const getSkillName = (name: string, stat: string): string => {
    const statName = CHARACTER_KNOWLEDGE.find(option => option.value === stat)?.name;
    return `${name} (${statName})`;
};