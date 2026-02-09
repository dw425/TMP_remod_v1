import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('starts with empty cart', () => {
    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().totalCount()).toBe(0);
  });

  it('adds an item to the cart', () => {
    useCartStore.getState().add({ id: 1, title: 'Product A', type: 'tool', billing: 'monthly', price: 100 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().totalCount()).toBe(1);
  });

  it('increments quantity for duplicate item with same billing', () => {
    useCartStore.getState().add({ id: 1, title: 'Product A', type: 'tool', billing: 'monthly', price: 100 });
    useCartStore.getState().add({ id: 1, title: 'Product A', type: 'tool', billing: 'monthly', price: 100 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]!.quantity).toBe(2);
    expect(useCartStore.getState().totalCount()).toBe(2);
  });

  it('adds separate items for different billing periods', () => {
    useCartStore.getState().add({ id: 1, title: 'Product A', type: 'tool', billing: 'monthly', price: 100 });
    useCartStore.getState().add({ id: 1, title: 'Product A', type: 'tool', billing: 'annual', price: 1000 });
    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it('removes an item by id', () => {
    useCartStore.getState().add({ id: 1, title: 'Product A', type: 'tool', billing: 'monthly', price: 100 });
    useCartStore.getState().remove(1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('clears all items', () => {
    useCartStore.getState().add({ id: 1, title: 'Product A', type: 'tool', billing: 'monthly', price: 100 });
    useCartStore.getState().add({ id: 2, title: 'Product B', type: 'accelerator', billing: 'annual', price: 200 });
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toEqual([]);
  });
});
