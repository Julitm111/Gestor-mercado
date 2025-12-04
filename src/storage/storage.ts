import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Item, ShoppingList, ShoppingListItem, Store } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

// NOTA: Se usa AsyncStorage porque permite persistir JSON ligero offline sin depender
// de un motor SQL y funciona bien con Expo sin build nativo adicional.
// Los datos se guardan bajo diferentes claves y se leen como arreglos.

const STORAGE_KEYS = {
  categories: 'mercadoplanner_categories',
  stores: 'mercadoplanner_stores',
  catalog: 'mercadoplanner_catalog_items',
  shoppingLists: 'mercadoplanner_shopping_lists',
  shoppingListItems: 'mercadoplanner_shopping_list_items',
};

export const getCategories = async (): Promise<Category[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.categories);
  return raw ? JSON.parse(raw) : [];
};

export const saveCategories = async (categories: Category[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
};

export const getStores = async (): Promise<Store[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.stores);
  return raw ? JSON.parse(raw) : [];
};

export const saveStores = async (stores: Store[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.stores, JSON.stringify(stores));
};

export const getCatalogItems = async (): Promise<Item[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.catalog);
  return raw ? JSON.parse(raw) : [];
};

export const saveCatalogItems = async (items: Item[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(items));
};

export const getShoppingLists = async (): Promise<ShoppingList[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.shoppingLists);
  return raw ? JSON.parse(raw) : [];
};

export const saveShoppingLists = async (lists: ShoppingList[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.shoppingLists, JSON.stringify(lists));
};

export const getShoppingListItems = async (): Promise<ShoppingListItem[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.shoppingListItems);
  return raw ? JSON.parse(raw) : [];
};

export const saveShoppingListItems = async (items: ShoppingListItem[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.shoppingListItems, JSON.stringify(items));
};

export const clearAllData = async (): Promise<void> => {
  const keys = Object.values(STORAGE_KEYS);
  await AsyncStorage.multiRemove(keys);
};

export const seedInitialData = async (): Promise<void> => {
  const [categories, stores, catalog, lists] = await Promise.all([
    getCategories(),
    getStores(),
    getCatalogItems(),
    getShoppingLists(),
  ]);

  if (categories.length === 0) {
    const initialCategories: Category[] = [
      'Verduras',
      'Frutas',
      'Carnes',
      'Lácteos',
      'Abarrotes',
      'Aseo hogar',
      'Aseo personal',
      'Otros',
    ].map((name) => ({ id: uuidv4(), name }));
    await saveCategories(initialCategories);
  }

  if (stores.length === 0) {
    const initialStores: Store[] = [
      { id: uuidv4(), name: 'D1' },
      { id: uuidv4(), name: 'Éxito' },
      { id: uuidv4(), name: 'Ara' },
      { id: uuidv4(), name: 'Plaza de mercado' },
    ];
    await saveStores(initialStores);
  }

  if (catalog.length === 0) {
    const currentCategories = await getCategories();
    const findCategory = (name: string) => currentCategories.find((c) => c.name === name)?.id ?? '';
    const initialItems: Item[] = [
      { id: uuidv4(), name: 'Arroz 1kg', defaultCategoryId: findCategory('Abarrotes'), unit: 'kg' },
      { id: uuidv4(), name: 'Leche entera 1L', defaultCategoryId: findCategory('Lácteos'), unit: 'L' },
      { id: uuidv4(), name: 'Huevos docena', defaultCategoryId: findCategory('Otros'), unit: 'docena' },
      { id: uuidv4(), name: 'Pechuga de pollo', defaultCategoryId: findCategory('Carnes'), unit: 'kg' },
      { id: uuidv4(), name: 'Papel higiénico 4 und', defaultCategoryId: findCategory('Aseo hogar'), unit: 'paq.' },
    ];
    await saveCatalogItems(initialItems);
  }

  if (lists.length === 0) {
    const newList: ShoppingList = {
      id: uuidv4(),
      name: 'Mercado inicial',
      createdAt: new Date().toISOString(),
      budget: 200000,
    };
    await saveShoppingLists([newList]);

    const categoriesData = await getCategories();
    const storesData = await getStores();
    const items: ShoppingListItem[] = [
      {
        id: uuidv4(),
        listId: newList.id,
        name: 'Arroz 1kg',
        itemId: (await getCatalogItems())[0]?.id,
        categoryId: categoriesData.find((c) => c.name === 'Abarrotes')?.id ?? '',
        storeId: storesData[0]?.id,
        quantity: 2,
        unit: 'kg',
        estimatedPrice: 4500,
        isChecked: false,
      },
      {
        id: uuidv4(),
        listId: newList.id,
        name: 'Leche entera 1L',
        itemId: (await getCatalogItems())[1]?.id,
        categoryId: categoriesData.find((c) => c.name === 'Lácteos')?.id ?? '',
        storeId: storesData[1]?.id,
        quantity: 6,
        unit: 'L',
        estimatedPrice: 3200,
        isChecked: false,
      },
    ];
    await saveShoppingListItems(items);
  }
};
