import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { ListItem, Product, ShoppingList, Store } from '../types/models';
import {
  getProducts,
  getShoppingLists,
  getStores,
  saveProducts,
  saveShoppingLists,
  saveStores,
  seedInitialData,
} from '../storage/storage';
import { calculateItemSubtotal, recalculateList } from '../utils/calculations';

interface ShoppingDataContextValue {
  products: Product[];
  shoppingLists: ShoppingList[];
  stores: Store[];
  categories: string[];
  loading: boolean;
  refresh: () => Promise<void>;
  addList: (payload: { name: string; budget: number }) => Promise<void>;
  updateList: (id: string, payload: Partial<ShoppingList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  addListItem: (listId: string, item: Omit<ListItem, 'id' | 'subtotal'>) => Promise<void>;
  updateListItem: (listId: string, itemId: string, changes: Partial<ListItem>) => Promise<void>;
  deleteListItem: (listId: string, itemId: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, changes: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addStore: (name: string) => Promise<void>;
}

const ShoppingDataContext = createContext<ShoppingDataContextValue | undefined>(undefined);

const ensureListTotals = (lists: ShoppingList[]): ShoppingList[] =>
  lists.map((list) => recalculateList({ ...list, items: list.items || [], budget: list.budget ?? 0 }));

export const ShoppingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    await seedInitialData();
    const [productsData, listsData, storesData] = await Promise.all([
      getProducts(),
      getShoppingLists(),
      getStores(),
    ]);

    const normalizedLists = ensureListTotals(
      listsData.map((list) => ({
        ...list,
        items: (list.items || []).map((item) => {
          const quantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 1;
          const estimatedPrice =
            typeof item.estimatedPrice === 'number' ? item.estimatedPrice : Number(item.estimatedPrice) || 0;
          return {
            ...item,
            quantity,
            estimatedPrice,
            subtotal: calculateItemSubtotal({ estimatedPrice, quantity }),
          };
        }),
        budget: typeof list.budget === 'number' ? list.budget : Number(list.budget) || 0,
      })),
    );

    setProducts(productsData);
    setShoppingLists(normalizedLists);
    setStores(storesData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleError = (error: unknown) => {
    console.error(error);
    Alert.alert('Error', 'Hubo un problema al guardar los datos.');
  };

  const persistLists = async (lists: ShoppingList[]) => {
    setShoppingLists(lists);
    await saveShoppingLists(lists);
  };

  const addList = async (payload: { name: string; budget: number }) => {
    try {
      const newList: ShoppingList = {
        id: uuidv4(),
        name: payload.name,
        budget: payload.budget ?? 0,
        createdAt: new Date().toISOString(),
        items: [],
        estimatedTotal: 0,
      };
      const updatedLists = [newList, ...shoppingLists];
      await persistLists(updatedLists);
    } catch (error) {
      handleError(error);
    }
  };

  const updateList = async (id: string, payload: Partial<ShoppingList>) => {
    try {
      const updated = shoppingLists.map((list) =>
        list.id === id ? recalculateList({ ...list, ...payload, items: payload.items ?? list.items }) : list,
      );
      await persistLists(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteList = async (id: string) => {
    try {
      const updatedLists = shoppingLists.filter((list) => list.id !== id);
      await persistLists(updatedLists);
    } catch (error) {
      handleError(error);
    }
  };

  const addListItem = async (listId: string, item: Omit<ListItem, 'id' | 'subtotal'>) => {
    try {
      const list = shoppingLists.find((l) => l.id === listId);
      if (!list) return;
      const priceFromProduct =
        item.estimatedPrice || products.find((p) => p.id === item.productId)?.estimatedPrice || 0;
      const normalized: ListItem = {
        ...item,
        id: uuidv4(),
        estimatedPrice: priceFromProduct,
        subtotal: calculateItemSubtotal({ estimatedPrice: priceFromProduct, quantity: item.quantity }),
      };
      const updatedLists = shoppingLists.map((l) =>
        l.id === listId ? recalculateList({ ...l, items: [normalized, ...l.items] }) : l,
      );
      await persistLists(updatedLists);
    } catch (error) {
      handleError(error);
    }
  };

  const updateListItem = async (listId: string, itemId: string, changes: Partial<ListItem>) => {
    try {
      const updatedLists = shoppingLists.map((list) => {
        if (list.id !== listId) return list;
        const items = list.items.map((item) => {
          if (item.id !== itemId) return item;
          const estimatedPrice =
            changes.estimatedPrice ??
            item.estimatedPrice ??
            (item.productId ? products.find((p) => p.id === item.productId)?.estimatedPrice : 0) ??
            0;
          const quantity = changes.quantity ?? item.quantity;
          return {
            ...item,
            ...changes,
            estimatedPrice,
            subtotal: calculateItemSubtotal({ estimatedPrice, quantity }),
          };
        });
        return recalculateList({ ...list, items });
      });
      await persistLists(updatedLists);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteListItem = async (listId: string, itemId: string) => {
    try {
      const updatedLists = shoppingLists.map((list) =>
        list.id === listId ? recalculateList({ ...list, items: list.items.filter((i) => i.id !== itemId) }) : list,
      );
      await persistLists(updatedLists);
    } catch (error) {
      handleError(error);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = { ...product, id: uuidv4() };
      const updated = [newProduct, ...products];
      setProducts(updated);
      await saveProducts(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const updateProduct = async (id: string, changes: Partial<Product>) => {
    try {
      const updated = products.map((p) => (p.id === id ? { ...p, ...changes } : p));
      setProducts(updated);
      await saveProducts(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      await saveProducts(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const addStore = async (name: string) => {
    try {
      if (stores.some((store) => store.name.toLowerCase() === name.toLowerCase())) return;
      const newStore: Store = { id: uuidv4(), name };
      const updated = [...stores, newStore];
      setStores(updated);
      await saveStores(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const categories = useMemo(() => {
    const names = new Set<string>();
    products.forEach((p) => names.add(p.category));
    shoppingLists.forEach((list) => list.items.forEach((item) => names.add(item.category)));
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [products, shoppingLists]);

  const value = useMemo(
    () => ({
      products,
      shoppingLists,
      stores,
      categories,
      loading,
      refresh: loadData,
      addList,
      updateList,
      deleteList,
      addListItem,
      updateListItem,
      deleteListItem,
      addProduct,
      updateProduct,
      deleteProduct,
      addStore,
    }),
    [products, shoppingLists, stores, categories, loading],
  );

  return <ShoppingDataContext.Provider value={value}>{children}</ShoppingDataContext.Provider>;
};

export const useShoppingData = (): ShoppingDataContextValue => {
  const context = useContext(ShoppingDataContext);
  if (!context) throw new Error('useShoppingData debe usarse dentro de ShoppingDataProvider');
  return context;
};
