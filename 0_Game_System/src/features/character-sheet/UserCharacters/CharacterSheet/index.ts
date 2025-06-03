/**
 * Este archivo exporta la versión envuelta del componente CharacterSheet
 * que usa el contexto para gestionar el estado y las dependencias
 */

// Exportar el componente principal
export { default as CharacterSheet } from './CharacterSheetWrapper';

// Exportamos también el contexto y sus hooks para su uso en componentes futuros
export { useCharacterSheet } from './context/CharacterSheetContext';

// Exportamos los componentes individuales para facilitar su uso en otras partes
export { default as CharacterImage } from './components/CharacterImage';
export { default as CharacterImageWrapper } from './components/CharacterImageWrapper';
export { default as CharacterStats } from './components/CharacterStats';
export { default as CharacterStatsWrapper } from './components/CharacterStatsWrapper';
export { default as CharacterBasicInfo } from './components/CharacterBasicInfo';
export { default as CharacterBasicInfoWrapper } from './components/CharacterBasicInfoWrapper';
export { default as CharacterInventory } from './components/CharacterInventory';
export { default as CharacterInventoryWrapper } from './components/CharacterInventoryWrapper';

// Exportamos las utilidades para la refactorización
export * from './utils/refactoringUtils';
