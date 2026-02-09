import { products } from '@/data/products';
import { useCartStore } from '@/features/cart/cartStore';

export interface RichChatContext {
  currentPath: string;
  currentPage: string;
  userAuthenticated: boolean;
  userName?: string;
  cartItemCount: number;
  cartTotal: number;
  currentProductSlug?: string;
  currentProductTitle?: string;
}

/**
 * Build rich context from the current app state for the chat agent.
 */
export function buildChatContext(basePath: string, pageTitle: string, isAuth: boolean, userName?: string): RichChatContext {
  const cart = useCartStore.getState();
  const cartTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Detect current product from URL
  let currentProductSlug: string | undefined;
  let currentProductTitle: string | undefined;
  const productMatch = basePath.match(/\/products\/([^/]+)/);
  if (productMatch) {
    currentProductSlug = productMatch[1];
    const product = products.find((p) => p.slug === currentProductSlug);
    currentProductTitle = product?.title;
  }

  return {
    currentPath: basePath,
    currentPage: pageTitle,
    userAuthenticated: isAuth,
    userName,
    cartItemCount: cart.items.length,
    cartTotal,
    currentProductSlug,
    currentProductTitle,
  };
}
