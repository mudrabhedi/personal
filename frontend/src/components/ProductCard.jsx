import { useEffect, useMemo, useRef, useState } from "react";
import { X, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const sizes = ["L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL"];

const sizeChart = [
  ["L", '36"', '42"'],
  ["XL", '38"', '44"'],
  ["2XL", '40"', '46"'],
  ["3XL", '42"', '48"'],
  ["4XL", '44"', '50"'],
  ["5XL", '46"', '52"'],
  ["6XL", '48"', '54"'],
  ["7XL", '50"', '56"'],
  ["8XL", '52"', '58"'],
  ["9XL", '54"', '60"'],
];

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addToCartLockRef = useRef(false);

  const productName = product.title || product.name || "Product";
  const productKey = String(productName).toLowerCase().trim();

  const productSlug = productKey
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const productLink = `/product/${productSlug}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getWishlist = () => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  };

  const checkWishlist = () => {
    const wishlist = getWishlist();

    const exists = wishlist.some(
      (item) =>
        String(item.title || item.name).toLowerCase().trim() === productKey
    );

    setIsWishlisted(exists);
  };

  useEffect(() => {
    checkWishlist();

    window.addEventListener("wishlistUpdated", checkWishlist);
    window.addEventListener("storage", checkWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", checkWishlist);
      window.removeEventListener("storage", checkWishlist);
    };
  }, [productKey]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = getWishlist();

    const exists = wishlist.some(
      (item) =>
        String(item.title || item.name).toLowerCase().trim() === productKey
    );

    if (exists) {
      const updatedWishlist = wishlist.filter(
        (item) =>
          String(item.title || item.name).toLowerCase().trim() !== productKey
      );

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast("Removed from wishlist");
      return;
    }

    const updatedWishlist = [
      ...wishlist,
      {
        ...product,
        title: productName,
        name: productName,
        image: product.image,
        href: productLink,
      },
    ];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsWishlisted(true);
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast.success("Added to wishlist");
  };

  const getSizeStock = (size) => {
    const foundSize = product.sizes?.find((item) => item.size === size);
    return foundSize ? Number(foundSize.stock) : 0;
  };

  const availableSizes = useMemo(() => {
    return sizes.filter((size) => getSizeStock(size) > 0);
  }, [product]);

  const selectedSizeStock = selectedSize ? getSizeStock(selectedSize) : 0;

  useEffect(() => {
    if (open) {
      setSelectedSize(availableSizes[0] || "");
      setQty(1);
      setIsAdding(false);
      addToCartLockRef.current = false;
    }
  }, [open, availableSizes]);

  const closeDrawer = () => {
    setOpen(false);
    setSizeChartOpen(false);
  };

  const handleSelectSize = (size) => {
    const stock = getSizeStock(size);

    if (stock <= 0) {
      toast.error(`${size} is out of stock`);
      return;
    }

    setSelectedSize(size);
    setQty(1);
  };

  const handleDecreaseQty = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    if (!selectedSize) {
      toast.error("Select a size first");
      return;
    }

    if (qty >= selectedSizeStock) {
      toast.error(`Only ${selectedSizeStock} available`);
      return;
    }

    setQty((prev) => prev + 1);
  };

  const addCurrentSelectionToCart = () => {
    if (addToCartLockRef.current) return false;
    addToCartLockRef.current = true;
    setIsAdding(true);

    if (!selectedSize) {
      toast.error("Please select a size");
      addToCartLockRef.current = false;
      setIsAdding(false);
      return false;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemId = product.id || product._id || productName;

    const existingIndex = cart.findIndex(
      (item) =>
        String(item.id || item._id || item.title || item.name) === String(itemId) &&
        item.size === selectedSize
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = Number(cart[existingIndex].quantity || 1) + qty;
    } else {
      cart.push({
        ...product,
        id: itemId,
        _id: product._id || itemId,
        title: productName,
        name: productName,
        image: product.image,
        href: productLink,
        size: selectedSize,
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Added to cart", { id: `cart-${itemId}-${selectedSize}` });
    closeDrawer();

    setTimeout(() => {
      addToCartLockRef.current = false;
      setIsAdding(false);
    }, 700);

    return true;
  };

  const handleAddToCart = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    addCurrentSelectionToCart();
  };

  const handleBuyNow = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    const added = addCurrentSelectionToCart();

    if (!added) return;

    setTimeout(() => {
      window.scrollTo(0, 0);
      window.location.href = "/checkout";
    }, 100);
  };

  return (
    <>
      <div className="group min-w-[270px] max-w-[270px] bg-white">
        <Link to={productLink} className="block">
          <div className="relative overflow-hidden bg-[#F7EFEA]">
            <img
              src={product.image}
              alt={productName}
              className="h-[390px] w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            />

            <button
              type="button"
              onClick={toggleWishlist}
              className="absolute right-3 top-3 z-20 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-105 transition"
            >
              <Heart
                size={20}
                className={
                  isWishlisted
                    ? "fill-[#8A5A5D] text-[#8A5A5D]"
                    : "text-[#4B0F1F]"
                }
              />
            </button>

            {availableSizes.length === 0 && (
              <div className="absolute left-3 top-3 bg-black text-white text-xs px-3 py-1">
                OUT OF STOCK
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              className="absolute left-4 right-4 bottom-4 bg-white/95 text-[#4B0F1F] py-3 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out"
            >
              Quick view
            </button>
          </div>

          <div className="pt-3 text-[#1f1f1f]">
            <h3 className="text-[16px] leading-6">{productName}</h3>

            <div className="mt-1 flex items-center gap-2">
              <span className="font-bold text-[18px]">
                Rs. {Number(product.price || 0).toLocaleString("en-IN")}
              </span>

              {product.oldPrice && (
                <span className="text-gray-500 line-through text-sm">
                  Rs. {Number(product.oldPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-[999] flex justify-end">
          <div onClick={closeDrawer} className="absolute inset-0 bg-black/45" />

          <aside className="relative h-full w-full sm:w-[520px] bg-white shadow-2xl overflow-y-auto animate-slideInRight">
            <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
              <h2 className="text-lg text-[#1f1f1f]">
                {sizeChartOpen ? "Size Chart" : "Choose options"}
              </h2>

              <button
                type="button"
                onClick={() =>
                  sizeChartOpen ? setSizeChartOpen(false) : closeDrawer()
                }
              >
                <X size={22} />
              </button>
            </div>

            {!sizeChartOpen ? (
              <div className="px-8 py-10">
                <div className="flex gap-6">
                  <img
                    src={product.image}
                    alt={productName}
                    className="w-32 h-44 object-cover bg-[#F7EFEA]"
                  />

                  <div className="pt-8">
                    <h3 className="font-semibold text-[#111] text-[17px] leading-6">
                      {productName}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-2xl">
                        Rs. {Number(product.price || 0).toLocaleString("en-IN")}
                      </span>

                      {product.oldPrice && (
                        <span className="text-gray-500 line-through">
                          Rs. {Number(product.oldPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center">
                    <p className="text-[#4B0F1F]">Size:</p>

                    <button
                      type="button"
                      onClick={() => setSizeChartOpen(true)}
                      className="text-sm underline text-[#9F5C69]"
                    >
                      Size chart
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-5 gap-3">
                    {sizes.map((size) => {
                      const stock = getSizeStock(size);
                      const isOutOfStock = stock <= 0;
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          disabled={isOutOfStock || isAdding}
                          onClick={() => handleSelectSize(size)}
                          className={`relative h-11 rounded-md border text-sm transition overflow-hidden ${
                            isOutOfStock
                              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                              : isSelected
                              ? "bg-black text-white border-black ring-2 ring-[#9F5C69]"
                              : "bg-white text-[#333] border-gray-300 hover:border-[#9F5C69]"
                          }`}
                        >
                          {size}

                          {isOutOfStock && (
                            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-[140%] bg-gray-400 -translate-x-1/2 -translate-y-1/2 rotate-[-22deg]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSize && (
                    <p className="mt-3 text-xs text-gray-500">
                      {selectedSizeStock} item(s) available in {selectedSize}
                    </p>
                  )}
                </div>

                <div className="mt-8">
                  <p className="text-[#4B0F1F]">Quantity:</p>

                  <div className="mt-5 flex items-center gap-8 text-xl">
                    <button type="button" onClick={handleDecreaseQty} disabled={isAdding}>-</button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      onClick={handleIncreaseQty}
                      disabled={!selectedSize || qty >= selectedSizeStock || isAdding}
                      className="disabled:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!selectedSize || availableSizes.length === 0 || isAdding}
                    className="bg-[#8A5A5D] text-white py-4 font-bold hover:bg-[#70464A] transition disabled:bg-gray-300"
                  >
                    {isAdding ? "ADDING..." : "ADD TO CART"}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!selectedSize || availableSizes.length === 0 || isAdding}
                    className="border py-4 text-center font-bold tracking-[0.2em] border-[#8A5A5D] text-[#8A5A5D] hover:bg-[#8A5A5D] hover:text-white transition disabled:border-gray-300 disabled:text-gray-300"
                  >
                    BUY NOW
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    to={productLink}
                    onClick={closeDrawer}
                    className="underline text-[#9F5C69]"
                  >
                    View details
                  </Link>
                </div>
              </div>
            ) : (
              <div className="px-8 py-8">
                <button
                  type="button"
                  onClick={() => setSizeChartOpen(false)}
                  className="mb-5 text-sm underline text-[#9F5C69]"
                >
                  Back to options
                </button>

                <table className="w-full border border-[#333] text-center text-[#111]">
                  <thead>
                    <tr>
                      <th className="border border-[#333] px-4 py-4">
                        GENERIC SIZE
                      </th>
                      <th className="border border-[#333] px-4 py-4">
                        TO FIT WAIST
                      </th>
                      <th className="border border-[#333] px-4 py-4">
                        TO FIT HIP
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sizeChart.map(([size, waist, hip]) => (
                      <tr key={size}>
                        <td className="border border-[#333] px-4 py-4">
                          {size}
                        </td>
                        <td className="border border-[#333] px-4 py-4">
                          {waist}
                        </td>
                        <td className="border border-[#333] px-4 py-4">
                          {hip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </aside>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-slideInRight {
          animation: slideInRight 0.35s ease-out;
        }
      `}</style>
    </>
  );
}
