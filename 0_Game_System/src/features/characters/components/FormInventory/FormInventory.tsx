import React, { useState } from 'react';
import { Tooltip, Button } from '@nextui-org/react';
import { InventoryObject } from '../../types';
import { validateNumeric } from '../../utils/characterHelpers';
import SvgDeleteItem from '@Icons/SvgDeleteItem';

interface FormInventoryProps {
  inventory: InventoryObject[];
  coins: number[];
  onInventoryChange: (inventory: InventoryObject[]) => void;
  onCoinsChange: (coins: number[]) => void;
  onDeleteItem: (id: string) => void;
  disabled?: boolean;
}

const FormInventory: React.FC<FormInventoryProps> = ({
  inventory,
  coins,
  onInventoryChange,
  onCoinsChange,
  onDeleteItem,
  disabled = false
}) => {
  const [newObjectName, setNewObjectName] = useState('');
  const [newObjectDescription, setNewObjectDescription] = useState('');
  const [newObjectCount, setNewObjectCount] = useState(1);

  const handleAddObject = () => {
    if (!newObjectName) {
      alert("Por favor digitar este campo");
      document.getElementById("objectName")?.focus();
      return;
    }

    const newObject: InventoryObject = {
      id: crypto.randomUUID(),
      name: newObjectName,
      description: newObjectDescription || "Descripción del nuevo objeto",
      count: newObjectCount,
      readOnly: false,
    };

    onInventoryChange([...inventory, newObject]);
    setNewObjectName('');
    setNewObjectDescription('');
    setNewObjectCount(1);
  };

  const handleEditCount = (id: string, newCount: string) => {
    const numericValue = validateNumeric(newCount, 1);
    const updatedInventory = inventory.map(obj =>
      obj.id === id ? { ...obj, count: numericValue } : obj
    );
    onInventoryChange(updatedInventory);
  };

  const handleCoinChange = (index: number, value: string) => {
    const numericValue = validateNumeric(value);
    const updatedCoins = [...coins];
    updatedCoins[index] = numericValue;
    onCoinsChange(updatedCoins);
  };

  return (
    <fieldset className="fieldset-form inventory-player row-span-3 col-span-1 bg-white shadow-lg rounded">
      <legend>Inventario</legend>

      {/* Coins Section */}
      <div className="coins-section">
        <label className="form-lbl col-span-3 mb-1 bg-grey-lighter">
          Monedero
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="form-lbl-coins">Oro</label>
            <input
              type="number"
              value={coins[0]}
              className="form-input"
              onChange={e => handleCoinChange(0, e.target.value)}
              disabled={disabled}
            />
          </div>
          <div>
            <label className="form-lbl-coins">Plata</label>
            <input
              type="number"
              value={coins[1]}
              className="form-input"
              onChange={e => handleCoinChange(1, e.target.value)}
              disabled={disabled}
            />
          </div>
          <div>
            <label className="form-lbl-coins">Bronce</label>
            <input
              type="number"
              value={coins[2]}
              className="form-input"
              onChange={e => handleCoinChange(2, e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Inventory Items */}
      <div className="inventory-items mt-4">
        <label className="form-lbl mb-1 col-span-3 bg-grey-lighter">
          Bolsa
        </label>
        {inventory.map((item) => (
          <Tooltip
            key={item.id}
            content={item.description}
            className="bg-dark text-light px-2 py-1"
            placement="left"
          >
            <label className="form-lbl object-item col-span-3 bg-grey-lighter">
              {item.name}
              <input type="hidden" value={item.id} />
              <input
                type="number"
                className="form-input-count"
                value={item.count}
                onChange={e => handleEditCount(item.id, e.target.value)}
                disabled={item.readOnly || disabled}
                maxLength={2}
              />
              <Button
                isIconOnly
                className="btn-delete-object"
                onClick={() => onDeleteItem(item.id)}
                disabled={item.readOnly || disabled}
              >
                <SvgDeleteItem width={25} fill="var(--required-color)" />
              </Button>
            </label>
          </Tooltip>
        ))}
      </div>

      {/* Add New Item Form */}
      {!disabled && (
        <div className="add-item-form mt-4 grid grid-cols-3 gap-2">
          <input
            type="text"
            id="objectName"
            placeholder="Objeto"
            className="form-input col-span-2"
            value={newObjectName}
            onChange={e => setNewObjectName(e.target.value)}
            maxLength={50}
          />
          <input
            type="number"
            id="objectCount"
            placeholder="Cantidad"
            className="form-input"
            value={newObjectCount}
            onChange={e => setNewObjectCount(validateNumeric(e.target.value, 1))}
            maxLength={2}
          />
          <input
            type="text"
            id="objectDescription"
            placeholder="Descripción"
            className="form-input col-span-3"
            value={newObjectDescription}
            onChange={e => setNewObjectDescription(e.target.value)}
            maxLength={100}
          />
          <button
            type="button"
            className="btn-add-object col-span-3"
            onClick={handleAddObject}
          >
            Añadir
          </button>
        </div>
      )}
    </fieldset>
  );
};

export default FormInventory;