export const getCartItemKey = (item) => {
  const id = item.id || item._id || item.title || item.name;
  const size = item.size || "Default";
  return `${String(id)}__${String(size)}`;
};

export const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};

export const writeCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

export const addItemToCartOnce = (item, lockMs = 900) => {
  const itemKey = getCartItemKey(item);
  const now = Date.now();

  window.__cartAddLocks = window.__cartAddLocks || {};

  if (window.__cartAddLocks[itemKey] && now - window.__cartAddLocks[itemKey] < lockMs) {
    return false;
  }

  window.__cartAddLocks[itemKey] = now;

  const cart = readCart();
  const existingIndex = cart.findIndex((cartItem) => getCartItemKey(cartItem) === itemKey);

  if (existingIndex >= 0) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity:
        Number(cart[existingIndex].quantity || 1) + Number(item.quantity || 1),
    };
  } else {
    cart.push({
      ...item,
      quantity: Number(item.quantity || 1),
    });
  }

  writeCart(cart);
  return true;
};
