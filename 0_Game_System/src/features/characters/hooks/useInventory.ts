import { useState, useCallback } from 'react';
import { InventoryObject } from '../types';

export function useInventory(initialInventory?: InventoryObject[], initialCoins?: number[]) {
  const [inventory, setInventory] = useState<InventoryObject[]>(initialInventory || []);
  const [coins, setCoins] = useState<number[]>(initialCoins || [0, 0, 0]);
  const [deleteItems, setDeleteItems] = useState<string[]>([]);

  const addItem = useCallback((name: string, description: string = "", count: number = 1) => {
    if (!name.trim()) return;

    const newItem: InventoryObject = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description || "Descripción del nuevo objeto",
      count,
      readOnly: false
    };

    setInventory(prev => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<InventoryObject>) => {
    setInventory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
    setDeleteItems(prev => [...prev, id]);
  }, []);

  const updateCoins = useCallback((index: number, value: number) => {
    setCoins(prev => {
      const newCoins = [...prev];
      newCoins[index] = Math.max(0, value);
      return newCoins;
    });
  }, []);

  const clearDeletedItems = useCallback(() => {
    setDeleteItems([]);
  }, []);

  return {
    inventory,
    coins,
    deleteItems,
    setInventory,
    setCoins,
    addItem,
    updateItem,
    deleteItem,
    updateCoins,
    clearDeletedItems
  };
}