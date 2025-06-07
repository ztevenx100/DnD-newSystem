import React from 'react';
import { InventoryObject } from '../context/CharacterSheetTypes';

interface CharacterInventoryProps {
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
 * Componente para mostrar y gestionar el inventario del personaje
 */
export const CharacterInventory: React.FC<CharacterInventoryProps> = ({
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
  const handleAddItem = () => {
    onAddItem(newObjectName, newObjectDescription, newObjectCount);
  };

  return (
    <div className="character-inventory">
      <h3 className="inventory-title">Inventario del Personaje</h3>
      
      {/* Formulario para añadir un nuevo objeto */}
      <div className="add-item-form">
        <div className="form-group">
          <label htmlFor="newObjectName">Nombre del Objeto</label>
          <input
            id="newObjectName"
            type="text"
            value={newObjectName}
            onChange={(e) => onNewObjectNameChange(e.target.value)}
            placeholder="Nombre del objeto"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newObjectDescription">Descripción</label>
          <textarea
            id="newObjectDescription"
            value={newObjectDescription}
            onChange={(e) => onNewObjectDescriptionChange(e.target.value)}
            placeholder="Descripción del objeto"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newObjectCount">Cantidad</label>
          <input
            id="newObjectCount"
            type="number"
            min="1"
            max="99"
            value={newObjectCount}
            onChange={(e) => onNewObjectCountChange(parseInt(e.target.value, 10) || 1)}
          />
        </div>
        
        <button 
          type="button" 
          className="add-item-button"
          onClick={handleAddItem}
          disabled={!newObjectName.trim()}
        >
          Añadir Objeto
        </button>
      </div>
      
      {/* Lista de objetos en el inventario */}
      <div className="inventory-list">
        {inventory.length > 0 ? (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="inventory-item">
                  <td>
                    {item.readOnly ? (
                      item.name
                    ) : (
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {item.readOnly ? (
                      item.description
                    ) : (
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                      />
                    )}
                  </td>
                  <td>
                    {item.readOnly ? (
                      item.count
                    ) : (
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.count}
                        onChange={(e) => onUpdateItem(item.id, 'count', parseInt(e.target.value, 10) || 1)}
                      />
                    )}
                  </td>
                  <td>
                    {!item.readOnly && (
                      <button
                        type="button"
                        className="remove-item-button"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-inventory">
            No hay objetos en el inventario
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterInventory;
