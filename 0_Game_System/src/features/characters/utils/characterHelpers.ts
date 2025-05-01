import { CHARACTER_CLASSES, CHARACTER_JOBS, CHARACTER_RACES, CHARACTER_KNOWLEDGE, RING_TYPES } from '../../../components/pages/UserCharacters/CharacterSheet/constants';
import { Option } from '../types';

export const getClassName = (id: string | undefined): string | undefined => {
    return CHARACTER_CLASSES.find((elem) => elem.value === id)?.name;
};

export const getRaceName = (id: string | undefined): string | undefined => {
    return CHARACTER_RACES.find((elem) => elem.value === id)?.name;
};

export const getJobName = (id: string | undefined): string | undefined => {
    return CHARACTER_JOBS.find((elem) => elem.value === id)?.name;
};

export const getKnowledgeName = (ids: string[] | undefined): string | undefined => {
    if (!ids) return '';
    const names = ids.map(id => {
        return CHARACTER_KNOWLEDGE.find((elem) => elem.value === id)?.name;
    }).filter(Boolean);
    return names.join(', ');
};

export const getSkillName = (value: string | undefined, stat: string): string | undefined => {
    if (!value) return undefined;
    let ringName = RING_TYPES.find((elem) => elem.value === stat)?.name;
    return value + (ringName ? ` (${ringName})` : '');
};

export const validateNumeric = (value: string, min: number = 0): number => {
    const num = parseInt(value);
    return isNaN(num) ? min : Math.max(min, num);
};