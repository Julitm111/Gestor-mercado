import { ListItem, ShoppingList, Store } from '../types/models';

export const calculateItemSubtotal = (item: Pick<ListItem, 'estimatedPrice' | 'quantity'>): number => {
  const price = typeof item.estimatedPrice === 'number' ? item.estimatedPrice : Number(item.estimatedPrice) || 0;
  const quantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 1;
  return Math.max(0, price * quantity);
};

export const getListEstimatedTotal = (listItems: ListItem[]): number => {
  return listItems.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
};

export const getListProgressPercentage = (total: number, budget: number): number => {
  if (!budget || budget <= 0) return 0;
  return Math.min(Math.round((total / budget) * 100), 999);
};

export const recalculateList = (list: ShoppingList): ShoppingList => {
  const estimatedTotal = getListEstimatedTotal(list.items || []);
  return { ...list, estimatedTotal };
};

export const getCategoryTotals = (listItems: ListItem[]): { category: string; total: number }[] => {
  const map = new Map<string, number>();
  listItems.forEach((item) => {
    const current = map.get(item.category) ?? 0;
    map.set(item.category, current + calculateItemSubtotal(item));
  });
  return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
};

export const getTotalsByStore = (listItems: ListItem[]): { store: string; total: number }[] => {
  const map = new Map<string, number>();
  listItems.forEach((item) => {
    const current = map.get(item.store) ?? 0;
    map.set(item.store, current + calculateItemSubtotal(item));
  });
  return Array.from(map.entries()).map(([store, total]) => ({ store, total }));
};
