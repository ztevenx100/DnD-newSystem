import React from 'react';
import { InventoryObject } from '../context/CharacterSheetTypes';
import './CharacterInventory.css';

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
 * Versión mejorada con responsive design
 */
const CharacterInventory: React.FC<CharacterInventoryProps> = ({
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
  const handleAddItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newObjectName.trim()) {
      onAddItem(newObjectName, newObjectDescription, newObjectCount);
    }
  };

  return (
    <div className="inventory-container">
      {/* Encabezado del inventario con contador */}
      <div className="inventory-header">
        <h3 className="inventory-title">Inventario del Personaje</h3>
        <div className="inventory-count">
          Total de items: <span>{inventory.length}</span>
        </div>
      </div>
        {/* Sección para añadir nuevo objeto */}
      <div className="inventory-form">
        <h4 className="inventory-form-title">Añadir nuevo elemento</h4>
        
        <div className="inventory-form-fields">
          <div className="inventory-field">
            <label htmlFor="newObjectName" className="field-label">Nombre</label>
            <input
              id="newObjectName"
              type="text"
              className="field-input"
              value={newObjectName}
              onChange={(e) => onNewObjectNameChange(e.target.value)}
              placeholder="Nombre del objeto"
              required
            />
          </div>
          
          <div className="inventory-field">
            <label htmlFor="newObjectDescription" className="field-label">Descripción</label>
            <textarea
              id="newObjectDescription"
              className="field-input textarea"
              value={newObjectDescription}
              onChange={(e) => onNewObjectDescriptionChange(e.target.value)}
              placeholder="Descripción del objeto"
              rows={3}
            />
          </div>
          
          <div className="inventory-field inventory-count-field">
            <label htmlFor="newObjectCount" className="field-label">Cantidad</label>
            <input
              id="newObjectCount"
              type="number"
              className="field-input count-input"
              min="1"
              max="99"
              value={newObjectCount}
              onChange={(e) => onNewObjectCountChange(parseInt(e.target.value, 10) || 1)}
            />
          </div>
        </div>
        
        <div className="inventory-form-actions">
          <button 
            type="button" 
            className="add-item-button"
            onClick={handleAddItem}
            disabled={!newObjectName.trim()}
          >
            Añadir Objeto
          </button>
        </div>
      </div>
      
      {/* Lista de objetos en el inventario */}
      <div className="inventory-items-container">
        <h4 className="inventory-section-title">Objetos</h4>
        
        {inventory.length === 0 ? (
          <div className="empty-inventory">
            No hay objetos en el inventario
          </div>
        ) : (
          <div className="inventory-items-grid">
            {inventory.map((item) => (
              <div key={item.id} className="inventory-item">
                <div className="inventory-item-header">
                  {item.readOnly ? (
                    <div className="inventory-item-name">{item.name}</div>
                  ) : (
                    <input
                      type="text"
                      className="inventory-item-name-input"
                      value={item.name}
                      onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                    />
                  )}
                </div>
                
                <div className="inventory-item-body">
                  {item.readOnly ? (
                    <div className="inventory-item-description">{item.description}</div>
                  ) : (
                    <textarea
                      className="inventory-item-description-input"
                      value={item.description}
                      onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                      rows={2}
                    />
                  )}
                </div>
                
                <div className="inventory-item-footer">
                  <div className="inventory-item-count">
                    <span className="count-label">Cantidad:</span>
                    {item.readOnly ? (
                      <span className="count-value-readonly">{item.count}</span>
                    ) : (
                      <input
                        type="number"
                        className="count-value"
                        min="1"
                        max="99"
                        value={item.count}
                        onChange={(e) => onUpdateItem(item.id, 'count', parseInt(e.target.value, 10) || 1)}
                      />
                    )}
                  </div>
                  
                  {!item.readOnly && (
                    <button 
                      type="button"
                      className="remove-button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Eliminar objeto"
                      title="Eliminar objeto"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterInventory;
