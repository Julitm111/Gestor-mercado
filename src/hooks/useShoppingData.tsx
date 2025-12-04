import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import {
  Category,
  Item,
  ShoppingList,
  ShoppingListItem,
  Store,
} from '../types/models';
import {
  getCatalogItems,
  getCategories,
  getShoppingListItems,
  getShoppingLists,
  getStores,
  saveCatalogItems,
  saveCategories,
  saveShoppingListItems,
  saveShoppingLists,
  saveStores,
  seedInitialData,
} from '../storage/storage';

interface ShoppingDataContextValue {
  categories: Category[];
  stores: Store[];
  catalog: Item[];
  shoppingLists: ShoppingList[];
  shoppingListItems: ShoppingListItem[];
  loading: boolean;
  refresh: () => Promise<void>;
  addList: (payload: { name: string; budget?: number }) => Promise<void>;
  updateList: (id: string, payload: Partial<ShoppingList>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  addListItem: (item: Omit<ShoppingListItem, 'id'>) => Promise<void>;
  updateListItem: (id: string, changes: Partial<ShoppingListItem>) => Promise<void>;
  deleteListItem: (id: string) => Promise<void>;
  addCatalogItem: (item: Omit<Item, 'id'>) => Promise<void>;
  updateCatalogItem: (id: string, changes: Partial<Item>) => Promise<void>;
  deleteCatalogItem: (id: string) => Promise<void>;
  addStore: (store: Omit<Store, 'id'>) => Promise<void>;
  updateStore: (id: string, changes: Partial<Store>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
}

const ShoppingDataContext = createContext<ShoppingDataContextValue | undefined>(undefined);

export const ShoppingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [catalog, setCatalog] = useState<Item[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    await seedInitialData();
    const [categoriesData, storesData, catalogData, listsData, listItemsData] = await Promise.all([
      getCategories(),
      getStores(),
      getCatalogItems(),
      getShoppingLists(),
      getShoppingListItems(),
    ]);
    setCategories(categoriesData);
    setStores(storesData);
    setCatalog(catalogData);
    setShoppingLists(listsData);
    setShoppingListItems(listItemsData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleError = (error: unknown) => {
    console.error(error);
    Alert.alert('Error', 'Hubo un problema al guardar los datos.');
  };

  const addList = async (payload: { name: string; budget?: number }) => {
    try {
      const newList: ShoppingList = {
        id: uuidv4(),
        name: payload.name,
        budget: payload.budget,
        createdAt: new Date().toISOString(),
      };
      const updatedLists = [newList, ...shoppingLists];
      setShoppingLists(updatedLists);
      await saveShoppingLists(updatedLists);
    } catch (error) {
      handleError(error);
    }
  };

  const updateList = async (id: string, payload: Partial<ShoppingList>) => {
    try {
      const updated = shoppingLists.map((list) => (list.id === id ? { ...list, ...payload } : list));
      setShoppingLists(updated);
      await saveShoppingLists(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteList = async (id: string) => {
    try {
      const updatedLists = shoppingLists.filter((list) => list.id !== id);
      const updatedItems = shoppingListItems.filter((item) => item.listId !== id);
      setShoppingLists(updatedLists);
      setShoppingListItems(updatedItems);
      await Promise.all([saveShoppingLists(updatedLists), saveShoppingListItems(updatedItems)]);
    } catch (error) {
      handleError(error);
    }
  };

  const addListItem = async (item: Omit<ShoppingListItem, 'id'>) => {
    try {
      const newItem: ShoppingListItem = { ...item, id: uuidv4() };
      const updatedItems = [newItem, ...shoppingListItems];
      setShoppingListItems(updatedItems);
      await saveShoppingListItems(updatedItems);
    } catch (error) {
      handleError(error);
    }
  };

  const updateListItem = async (id: string, changes: Partial<ShoppingListItem>) => {
    try {
      const updatedItems = shoppingListItems.map((item) => (item.id === id ? { ...item, ...changes } : item));
      setShoppingListItems(updatedItems);
      await saveShoppingListItems(updatedItems);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteListItem = async (id: string) => {
    try {
      const updatedItems = shoppingListItems.filter((item) => item.id !== id);
      setShoppingListItems(updatedItems);
      await saveShoppingListItems(updatedItems);
    } catch (error) {
      handleError(error);
    }
  };

  const addCatalogItem = async (item: Omit<Item, 'id'>) => {
    try {
      const newItem: Item = { ...item, id: uuidv4() };
      const updated = [newItem, ...catalog];
      setCatalog(updated);
      await saveCatalogItems(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const updateCatalogItem = async (id: string, changes: Partial<Item>) => {
    try {
      const updated = catalog.map((item) => (item.id === id ? { ...item, ...changes } : item));
      setCatalog(updated);
      await saveCatalogItems(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteCatalogItem = async (id: string) => {
    try {
      const updated = catalog.filter((item) => item.id !== id);
      setCatalog(updated);
      await saveCatalogItems(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const addStore = async (store: Omit<Store, 'id'>) => {
    try {
      const newStore: Store = { ...store, id: uuidv4() };
      const updated = [newStore, ...stores];
      setStores(updated);
      await saveStores(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const updateStore = async (id: string, changes: Partial<Store>) => {
    try {
      const updated = stores.map((store) => (store.id === id ? { ...store, ...changes } : store));
      setStores(updated);
      await saveStores(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const deleteStore = async (id: string) => {
    try {
      const updated = stores.filter((store) => store.id !== id);
      setStores(updated);
      await saveStores(updated);
    } catch (error) {
      handleError(error);
    }
  };

  const value = useMemo(
    () => ({
      categories,
      stores,
      catalog,
      shoppingLists,
      shoppingListItems,
      loading,
      refresh: loadData,
      addList,
      updateList,
      deleteList,
      addListItem,
      updateListItem,
      deleteListItem,
      addCatalogItem,
      updateCatalogItem,
      deleteCatalogItem,
      addStore,
      updateStore,
      deleteStore,
    }),
    [
      categories,
      stores,
      catalog,
      shoppingLists,
      shoppingListItems,
      loading,
    ],
  );

  return <ShoppingDataContext.Provider value={value}>{children}</ShoppingDataContext.Provider>;
};

export const useShoppingData = (): ShoppingDataContextValue => {
  const context = useContext(ShoppingDataContext);
  if (!context) throw new Error('useShoppingData debe usarse dentro de ShoppingDataProvider');
  return context;
};
