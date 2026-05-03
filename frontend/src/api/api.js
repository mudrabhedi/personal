const PRODUCT_STORAGE_KEYS = ["products", "inventory", "adminProducts"];
const ORDER_STORAGE_KEY = "orders";

const safeParse = (key, fallback = []) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const makeId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const normalizeProduct = (product) => {
  const id = product._id || product.id || makeId();
  const title = product.title || product.name || "Untitled Product";
  const image =
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.images?.[0] ||
    "https://via.placeholder.com/600x800?text=Product";

  const sizes = Array.isArray(product.sizes)
    ? product.sizes.map((row) => ({
        size: row.size,
        stock: Number(row.stock) || 0,
      }))
    : [];

  const stock =
    product.stock !== undefined
      ? Number(product.stock) || 0
      : sizes.reduce((sum, row) => sum + Number(row.stock || 0), 0);

  return {
    ...product,
    _id: id,
    id,
    name: product.name || title,
    title,
    price: Number(product.price || product.salePrice || 0),
    oldPrice: Number(product.oldPrice || product.mrp || product.originalPrice || 0),
    image,
    imageUrl: image,
    href: `/product/${slugify(title)}`,
    category: product.category || "Jeans",
    sizes,
    stock,
    status: stock <= 0 ? "Out of stock" : product.status || "Active",
    createdAt:
      product.createdAt ||
      product.dateAdded ||
      product.addedAt ||
      product.updatedAt ||
      new Date().toISOString(),
  };
};

const loadProducts = () => {
  for (const key of PRODUCT_STORAGE_KEYS) {
    const stored = safeParse(key, []);

    if (Array.isArray(stored) && stored.length > 0) {
      const normalized = stored.map(normalizeProduct);
      save("products", normalized);
      return normalized;
    }
  }

  return [];
};

const saveProducts = (products) => {
  const normalized = products.map(normalizeProduct);
  save("products", normalized);
  window.dispatchEvent(new Event("productsUpdated"));
  return normalized;
};

const findProduct = (identifier) => {
  const products = loadProducts();
  const cleanIdentifier = decodeURIComponent(String(identifier || ""));

  return products.find((product) => {
    const title = product.title || product.name;

    return (
      String(product._id) === cleanIdentifier ||
      String(product.id) === cleanIdentifier ||
      slugify(title) === cleanIdentifier ||
      slugify(product.name) === cleanIdentifier ||
      slugify(product.title) === cleanIdentifier ||
      String(product.href || "").endsWith(`/product/${cleanIdentifier}`)
    );
  });
};

const createResponse = (data) => Promise.resolve({ data });

const createError = (message, status = 404) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return Promise.reject(error);
};

export const API = {
  get: async (url) => {
    if (url === "/products") {
      return createResponse(loadProducts());
    }

    if (url.startsWith("/products/")) {
      const identifier = url.replace("/products/", "");
      const product = findProduct(identifier);

      if (!product) {
        return createError("Product not found");
      }

      return createResponse(product);
    }

    if (url === "/orders") {
      return createResponse(safeParse(ORDER_STORAGE_KEY, []));
    }

    return createResponse(null);
  },

  post: async (url, body) => {
    if (url === "/products") {
      const products = loadProducts();
      const product = normalizeProduct({
        ...body,
        _id: body?._id || body?.id || makeId(),
        id: body?.id || body?._id || makeId(),
        createdAt: body?.createdAt || new Date().toISOString(),
      });

      saveProducts([product, ...products]);
      return createResponse(product);
    }

    if (url === "/orders") {
      const orders = safeParse(ORDER_STORAGE_KEY, []);
      const id = body?._id || body?.id || makeId();
      const order = {
        ...body,
        _id: id,
        id,
        createdAt: body?.createdAt || new Date().toISOString(),
        status: body?.status || "Pending",
      };

      save(ORDER_STORAGE_KEY, [order, ...orders]);
      window.dispatchEvent(new Event("ordersUpdated"));
      return createResponse(order);
    }

    return createResponse(body);
  },

  put: async (url, body) => {
    if (url.startsWith("/products/")) {
      const identifier = url.replace("/products/", "");
      const products = loadProducts();
      const index = products.findIndex((product) => {
        const title = product.title || product.name;
        return (
          String(product._id) === identifier ||
          String(product.id) === identifier ||
          slugify(title) === identifier
        );
      });

      if (index === -1) {
        return createError("Product not found");
      }

      const updatedProduct = normalizeProduct({
        ...products[index],
        ...body,
        _id: products[index]._id,
        id: products[index].id,
        updatedAt: new Date().toISOString(),
      });

      products[index] = updatedProduct;
      saveProducts(products);
      return createResponse(updatedProduct);
    }

    return createResponse(body);
  },

  delete: async (url) => {
    if (url.startsWith("/products/")) {
      const identifier = url.replace("/products/", "");
      const products = loadProducts();
      const updatedProducts = products.filter((product) => {
        const title = product.title || product.name;
        return !(
          String(product._id) === identifier ||
          String(product.id) === identifier ||
          slugify(title) === identifier
        );
      });

      saveProducts(updatedProducts);
      return createResponse({ success: true });
    }

    return createResponse({ success: true });
  },
};

export default API;
