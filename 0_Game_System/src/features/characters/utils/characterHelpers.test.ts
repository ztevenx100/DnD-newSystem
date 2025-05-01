import { getClassName, getRaceName, getJobName, getKnowledgeName, getSkillName, validateNumeric } from './characterHelpers';

describe('Character Helper Functions', () => {
    describe('getClassName', () => {
        it('should return correct class name', () => {
            expect(getClassName('WAR')).toBe('Guerrero');
            expect(getClassName('MAG')).toBe('Mago');
        });

        it('should return undefined for invalid class', () => {
            expect(getClassName('INVALID')).toBeUndefined();
        });
    });

    describe('getRaceName', () => {
        it('should return correct race name', () => {
            expect(getRaceName('HUM')).toBe('Humano');
            expect(getRaceName('ELF')).toBe('Elfo');
        });

        it('should return undefined for invalid race', () => {
            expect(getRaceName('INVALID')).toBeUndefined();
        });
    });

    describe('getJobName', () => {
        it('should return correct job name', () => {
            expect(getJobName('HUN')).toBe('Cazador');
            expect(getJobName('BLA')).toBe('Herrero');
        });

        it('should return undefined for invalid job', () => {
            expect(getJobName('INVALID')).toBeUndefined();
        });
    });

    describe('getKnowledgeName', () => {
        it('should return combined knowledge names', () => {
            expect(getKnowledgeName(['HIS', 'ALC'])).toBe('Historia, Alquimia');
        });

        it('should return empty string for undefined input', () => {
            expect(getKnowledgeName(undefined)).toBe('');
        });

        it('should handle invalid knowledge ids', () => {
            expect(getKnowledgeName(['INVALID', 'HIS'])).toBe('Historia');
        });
    });

    describe('getSkillName', () => {
        it('should return skill name with stat type', () => {
            expect(getSkillName('Test', 'STR')).toBe('Test (Fuerza)');
        });

        it('should return only skill name if stat not found', () => {
            expect(getSkillName('Test', 'INVALID')).toBe('Test');
        });

        it('should return undefined for undefined skill', () => {
            expect(getSkillName(undefined, 'STR')).toBeUndefined();
        });
    });

    describe('validateNumeric', () => {
        it('should return valid number', () => {
            expect(validateNumeric('5')).toBe(5);
        });

        it('should return minimum value for invalid input', () => {
            expect(validateNumeric('abc')).toBe(0);
        });

        it('should respect minimum value', () => {
            expect(validateNumeric('-5')).toBe(0);
            expect(validateNumeric('-5', -10)).toBe(-5);
        });
    });
});