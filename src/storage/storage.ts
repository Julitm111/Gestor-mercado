import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { ListItem, Product, ShoppingList, Store } from '../types/models';
import { calculateItemSubtotal, getListEstimatedTotal } from '../utils/calculations';

const STORAGE_KEYS = {
  products: 'mercadoplanner_products',
  shoppingLists: 'mercadoplanner_shopping_lists',
  stores: 'mercadoplanner_stores',
};

export const getProducts = async (): Promise<Product[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.products);
  return raw ? JSON.parse(raw) : [];
};

export const saveProducts = async (products: Product[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
};

export const getShoppingLists = async (): Promise<ShoppingList[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.shoppingLists);
  return raw ? JSON.parse(raw) : [];
};

export const saveShoppingLists = async (lists: ShoppingList[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.shoppingLists, JSON.stringify(lists));
};

export const getStores = async (): Promise<Store[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.stores);
  return raw ? JSON.parse(raw) : [];
};

export const saveStores = async (stores: Store[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.stores, JSON.stringify(stores));
};

export const clearAllData = async (): Promise<void> => {
  const keys = Object.values(STORAGE_KEYS);
  await AsyncStorage.multiRemove(keys);
};

export const seedInitialData = async (): Promise<void> => {
  const [products, stores, lists] = await Promise.all([getProducts(), getStores(), getShoppingLists()]);

  if (stores.length === 0) {
    const initialStores: Store[] = [
      { id: uuidv4(), name: 'D1' },
      { id: uuidv4(), name: 'Ara' },
      { id: uuidv4(), name: 'Éxito' },
      { id: uuidv4(), name: 'Plaza' },
    ];
    await saveStores(initialStores);
  }

  if (products.length === 0) {
    const defaultStore = (await getStores())[0];
    const initialProducts: Product[] = [
      {
        id: uuidv4(),
        name: 'Arroz 1kg',
        category: 'Abarrotes',
        unit: 'kg',
        defaultStore: defaultStore?.name ?? 'D1',
        estimatedPrice: 4500,
      },
      {
        id: uuidv4(),
        name: 'Leche entera 1L',
        category: 'Lácteos',
        unit: 'L',
        defaultStore: defaultStore?.name ?? 'D1',
        estimatedPrice: 3200,
      },
      {
        id: uuidv4(),
        name: 'Huevos docena',
        category: 'Huevos',
        unit: 'docena',
        defaultStore: defaultStore?.name ?? 'D1',
        estimatedPrice: 12000,
      },
      {
        id: uuidv4(),
        name: 'Pechuga de pollo',
        category: 'Carnes',
        unit: 'kg',
        defaultStore: defaultStore?.name ?? 'D1',
        estimatedPrice: 15500,
      },
    ];
    await saveProducts(initialProducts);
  }

  if (lists.length === 0) {
    const productsData = await getProducts();
    const firstStore = (await getStores())[0];
    const seededItems: ListItem[] = [
      {
        id: uuidv4(),
        productId: productsData[0]?.id,
        name: productsData[0]?.name ?? 'Arroz 1kg',
        category: productsData[0]?.category ?? 'Abarrotes',
        unit: productsData[0]?.unit ?? 'kg',
        quantity: 2,
        store: firstStore?.name ?? 'D1',
        estimatedPrice: productsData[0]?.estimatedPrice ?? 4500,
        subtotal: calculateItemSubtotal({ estimatedPrice: productsData[0]?.estimatedPrice ?? 4500, quantity: 2 }),
      },
      {
        id: uuidv4(),
        productId: productsData[1]?.id,
        name: productsData[1]?.name ?? 'Leche entera 1L',
        category: productsData[1]?.category ?? 'Lácteos',
        unit: productsData[1]?.unit ?? 'L',
        quantity: 6,
        store: firstStore?.name ?? 'D1',
        estimatedPrice: productsData[1]?.estimatedPrice ?? 3200,
        subtotal: calculateItemSubtotal({ estimatedPrice: productsData[1]?.estimatedPrice ?? 3200, quantity: 6 }),
      },
    ];

    const list: ShoppingList = {
      id: uuidv4(),
      name: 'Mercado inicial',
      createdAt: new Date().toISOString(),
      budget: 200000,
      items: seededItems,
      estimatedTotal: getListEstimatedTotal(seededItems),
    };

    await saveShoppingLists([list]);
  }
};
