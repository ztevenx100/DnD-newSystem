import { useCallback } from 'react';
import * as yup from 'yup';
import { CharacterForm } from '../types/characterForm';

// Define validation schema with Yup for the character form
export const characterSchema = yup.object({
  // Basic information
  name: yup.string().required('El nombre del personaje es obligatorio').max(50, 'El nombre no puede exceder 50 caracteres'),
  userName: yup.string().required('El nombre del jugador es obligatorio'),
  class: yup.string().required('La clase del personaje es obligatoria'),
  race: yup.string().required('La raza del personaje es obligatoria'),
  job: yup.string().required('El trabajo del personaje es obligatorio'),
  level: yup.number()
    .required('El nivel es obligatorio')
    .min(1, 'El nivel mínimo es 1')
    .max(10, 'El nivel máximo es 10')
    .integer('El nivel debe ser un número entero'),
  
  // Character attributes
  luckyPoints: yup.number()
    .required('Los puntos de suerte son obligatorios')
    .min(0, 'Los puntos de suerte no pueden ser negativos')
    .integer('Los puntos de suerte deben ser un número entero'),
  lifePoints: yup.number()
    .required('Los puntos de vida son obligatorios')
    .min(0, 'Los puntos de vida no pueden ser negativos')
    .integer('Los puntos de vida deben ser un número entero'),
    // Character description
  characterDescription: yup.string().required('La descripción del personaje es obligatoria').max(500, 'La descripción no puede exceder 500 caracteres'),
  alignment: yup.string().required('La alineación es obligatoria'),
  knowledge: yup.string().required('El conocimiento es obligatorio'),
  
  // Weapons
  mainWeapon: yup.string().required('El arma principal es obligatoria'),
  secondaryWeapon: yup.string().required('El arma secundaria es obligatoria'),
  
  // Currency
  goldCoins: yup.number()
    .required('La cantidad de oro es obligatoria')
    .min(0, 'La cantidad de oro no puede ser negativa')
    .integer('La cantidad de oro debe ser un número entero')
    .max(999, 'La cantidad de oro no puede ser mayor a 999'),
  silverCoins: yup.number()
    .required('La cantidad de plata es obligatoria')
    .min(0, 'La cantidad de plata no puede ser negativa')
    .integer('La cantidad de plata debe ser un número entero')
    .max(999, 'La cantidad de plata no puede ser mayor a 999'),
  bronzeCoins: yup.number()
    .required('La cantidad de bronce es obligatoria')
    .min(0, 'La cantidad de bronce no puede ser negativa')
    .integer('La cantidad de bronce debe ser un número entero')
    .max(999, 'La cantidad de bronce no puede ser mayor a 999'),
    // Individual stats (compatibility fields)
  strDice: yup.number().required().min(1).max(10).integer(),
  strClass: yup.number().required().min(0).max(3).integer(),
  strLevel: yup.number().required().min(0).max(3).integer(),
  intDice: yup.number().required().min(1).max(10).integer(),
  intClass: yup.number().required().min(0).max(3).integer(),
  intLevel: yup.number().required().min(0).max(3).integer(),
  dexDice: yup.number().required().min(1).max(10).integer(),
  dexClass: yup.number().required().min(0).max(3).integer(),
  dexLevel: yup.number().required().min(0).max(3).integer(),
  conDice: yup.number().required().min(1).max(10).integer(),
  conClass: yup.number().required().min(0).max(3).integer(),
  conLevel: yup.number().required().min(0).max(3).integer(),
  perDice: yup.number().required().min(1).max(10).integer(),
  perClass: yup.number().required().min(0).max(3).integer(),
  perLevel: yup.number().required().min(0).max(3).integer(),
  chaDice: yup.number().required().min(1).max(10).integer(),
  chaClass: yup.number().required().min(0).max(3).integer(),
  chaLevel: yup.number().required().min(0).max(3).integer(),
  
  // Skills
  skillClass: yup.string().required('La habilidad principal es obligatoria'),
  skillExtra: yup.string().required('La habilidad extra es obligatoria'),
    // Inventario nuevo
  newObjectName: yup.string().required().max(50, 'El nombre del objeto no puede exceder 50 caracteres'),
  newObjectDescription: yup.string().required().max(200, 'La descripción del objeto no puede exceder 200 caracteres'),
  newObjectCount: yup.number().required().min(1).max(99).integer(),
    // Array fields
  stats: yup.array().of(
    yup.object({
      id: yup.string().required(),
      label: yup.string().required(),
      description: yup.string().required(),
      valueDice: yup.number()
        .required('El valor base es obligatorio')
        .min(1, 'El valor base mínimo es 1')
        .max(10, 'El valor base máximo es 10')
        .integer('El valor base debe ser un número entero'),
      valueClass: yup.number()
        .required('El bono de clase es obligatorio')
        .min(0, 'El bono de clase mínimo es 0')
        .max(3, 'El bono de clase máximo es 3')
        .integer('El bono de clase debe ser un número entero'),
      valueLevel: yup.number()
        .required('El bono de nivel es obligatorio')
        .min(0, 'El bono de nivel mínimo es 0')
        .max(3, 'El bono de nivel máximo es 3')
        .integer('El bono de nivel debe ser un número entero')
    })
  ).required().min(6, 'Se requieren 6 estadísticas'),
  inventory: yup.array().of(
    yup.object({
      id: yup.string().required(),
      name: yup.string().required('El nombre del objeto es obligatorio').max(50),
      description: yup.string().required('La descripción del objeto es obligatoria').max(200),
      count: yup.number()
        .required('La cantidad es obligatoria')
        .min(1, 'La cantidad mínima es 1')
        .max(99, 'La cantidad máxima es 99')
        .integer('La cantidad debe ser un número entero'),
      readOnly: yup.boolean().required()
    })
  ).required(),
    skills: yup.array().of(
    yup.object({
      id: yup.string().required(),
      value: yup.string().required(),
      name: yup.string().required(),
      description: yup.string(),
      ring: yup.string().required(),
      stat: yup.string()
    })
  ).required().min(3, 'Se requieren al menos 3 slots de anillos de habilidad')
});

export type CharacterSchemaType = yup.InferType<typeof characterSchema>;

/**
 * Custom hook to validate a character form using the Yup schema
 * @returns Object with validation helper functions
 */
export const useCharacterFormValidation = () => {
  /**
   * Validate all character form fields using the schema
   * @param form The character form data to validate
   * @returns Object with validation results
   */
  const validateCharacterForm = useCallback(
    async (form: CharacterForm) => {
      try {
        // Validate with the Yup schema
        await characterSchema.validate(form, {
          abortEarly: false
        });
        return { isValid: true, errors: [] };      } catch (error: unknown) {
        if (error instanceof yup.ValidationError) {
          // Get structured errors from Yup
          const fieldErrors = error.inner.map((err: yup.ValidationError) => ({
            path: err.path || '',
            message: err.message
          }));
          
          return {
            isValid: false,
            errors: fieldErrors
          };
        }
        // Handle unexpected errors
        console.error('Unexpected validation error:', error);
        return {
          isValid: false,
          errors: [{ path: 'form', message: 'Error de validación inesperado' }]
        };
      }
    },
    []
  );

  /**
   * Group validation errors by category for better user feedback
   * @param errors List of validation errors
   * @returns Categorized error messages
   */
  const categorizeErrors = useCallback((errors: { path: string, message: string }[]) => {
    const categories = {
      basicInfo: [] as string[],
      stats: [] as string[],
      inventory: [] as string[],
      skills: [] as string[],
      other: [] as string[]
    };

    // Map fields to categories
    errors.forEach(err => {
      const path = typeof err.path === 'string' ? err.path : '';
      
      // Basic info category
      if (['name', 'userName', 'class', 'race', 'job', 'level', 'alignment'].includes(path)) {
        categories.basicInfo.push(`${path}: ${err.message}`);
      }
      // Stats category
      else if (['luckyPoints', 'lifePoints', 'stats', 'strDice', 'intDice', 'dexDice', 'conDice', 'perDice', 'chaDice'].includes(path) || 
               path.startsWith('stats.')) {
        categories.stats.push(`${path}: ${err.message}`);
      }
      // Inventory category
      else if (['goldCoins', 'silverCoins', 'bronzeCoins', 'inventory'].includes(path) ||
               path.startsWith('inventory.')) {
        categories.inventory.push(`${path}: ${err.message}`);
      }
      // Skills category
      else if (['skillClass', 'skillExtra', 'skills'].includes(path) ||
               path.startsWith('skills.')) {
        categories.skills.push(`${path}: ${err.message}`);
      }
      // Other category
      else {
        categories.other.push(`${path}: ${err.message}`);
      }
    });

    return categories;
  }, []);

  return {
    validateCharacterForm,
    categorizeErrors
  };
};

export default useCharacterFormValidation;
