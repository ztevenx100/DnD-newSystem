import React from 'react';
import CharacterInventory from './CharacterInventory';
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
 * En futuras iteraciones, usaremos completamente el contexto de CharacterSheet 
 * para acceder a los métodos y estado relacionados con el inventario.
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
}) => {
  // Eventualmente usaremos el contexto completo para acceder a los métodos de inventario
  const handleAddInventoryItem = (name: string, description: string, count: number) => {
    onAddItem(name, description, count);
  };

  const handleUpdateInventoryItem = (id: string, field: string, value: any) => {
    onUpdateItem(id, field, value);
  };
  
  const handleRemoveInventoryItem = (id: string) => {
    onRemoveItem(id);
  };
  
  return (
    <div className={`inventory-wrapper ${externalStyles || ''}`}>
      <CharacterInventory
        inventory={inventory || []}
        onAddItem={handleAddInventoryItem}
        onUpdateItem={handleUpdateInventoryItem}
        onRemoveItem={handleRemoveInventoryItem}
        newObjectName={newObjectName || ""}
        newObjectDescription={newObjectDescription || ""}
        newObjectCount={newObjectCount || 1}
        onNewObjectNameChange={onNewObjectNameChange}
        onNewObjectDescriptionChange={onNewObjectDescriptionChange}
        onNewObjectCountChange={onNewObjectCountChange}
      />
    </div>
  );
});

export default CharacterInventoryWrapper;
