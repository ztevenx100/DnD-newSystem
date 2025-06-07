import React from 'react';
import CharacterInventory from './CharacterInventory';
import { useCharacterSheet } from '../context/CharacterSheetContext';
import { InventoryObject } from '../context/CharacterSheetTypes';

interface CharacterInventoryWrapperProps {
  externalStyles: string;
  inventory: InventoryObject[];
  onAddItem: (name: string, description: string, count: number) => void;
  onUpdateItem: (id: string, field: string, value: any) => void;
  onRemoveItem: (id: string) => void;
  newObjectName: string;
  newObjectDescription: string;
  newObjectCount: number;
  onNewObjectNameChange: (value: string) => void;
  onNewObjectDescriptionChange: (value: string) => void;
  onNewObjectCountChange: (value: number) => void;
}

/**
 * Este componente es un wrapper que nos permite utilizar el nuevo componente CharacterInventory
 * manteniendo compatibilidad con la estructura existente.
 * 
 * Es un componente transitorio que nos permite refactorizar gradualmente.
 */
const CharacterInventoryWrapper: React.FC<CharacterInventoryWrapperProps> = React.memo(({
  externalStyles,
  inventory,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  newObjectName,
  newObjectDescription,
  newObjectCount,
  onNewObjectNameChange,
  onNewObjectDescriptionChange,
  onNewObjectCountChange
}) => {  // Intento de usar el contexto, pero solo para logging en esta etapa
  // En futuras iteraciones, utilizaremos completamente el contexto
  try {
    useCharacterSheet(); // Solo para verificar disponibilidad
    // Eliminado console.log para evitar spam en consola
  } catch (error) {
    // Contexto aún no disponible - eliminado console.log
  }
  
  // Por ahora, seguimos utilizando los props que recibimos
  // para mantener la compatibilidad con el componente actual
  
  return (
    <div className={'inventory-wrapper ' + externalStyles}>
      <CharacterInventory
        inventory={inventory}
        onAddItem={onAddItem}
        onUpdateItem={onUpdateItem}
        onRemoveItem={onRemoveItem}
        newObjectName={newObjectName}
        newObjectDescription={newObjectDescription}
        newObjectCount={newObjectCount}
        onNewObjectNameChange={onNewObjectNameChange}
        onNewObjectDescriptionChange={onNewObjectDescriptionChange}
        onNewObjectCountChange={onNewObjectCountChange}
      />
    </div>
  );
});

export default CharacterInventoryWrapper;
