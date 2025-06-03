import { DBUsuario } from '@shared/utils/types';

/**
 * Props para el componente CharacterSheet
 */
export interface CharacterSheetProps {
  changeBackground: (newBackground: string) => void;
  user?: DBUsuario;
}
