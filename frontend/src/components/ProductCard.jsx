import { useEffect, useMemo, useState } from "react";
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

export default function ProductCard({ product, onAddToCart }) {
  useEffect(() => {
  window.scrollTo(0, 0);
}, []);
  const [open, setOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const createSlug = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

const productLink = `/product/${String(product.title || product.name)
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, "")
  .replace(/\s+/g, "-")}`;
  const productKey = String(product.title || product.name).toLowerCase().trim();

  const isLoggedIn = () => {
    return (
      localStorage.getItem("user") ||
      localStorage.getItem("token") ||
      localStorage.getItem("loggedInUser")
    );
  };

const checkWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  setIsWishlisted(
    wishlist.some(
      (item) =>
        String(item.title || item.name).toLowerCase().trim() === productKey
    )
  );
};

  useEffect(() => {
    checkWishlist();

    window.addEventListener("wishlistUpdated", checkWishlist);
    window.addEventListener("storage", checkWishlist);

    return () => {
      window.removeEventListener("wishlistUpdated", checkWishlist);
      window.removeEventListener("storage", checkWishlist);
    };
  }, [product.id]);

  const addProductToWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

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
      title: product.title || product.name,
      name: product.name || product.title,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      href: productLink,
      category: product.category,
    },
  ];

  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  setIsWishlisted(true);
  window.dispatchEvent(new Event("wishlistUpdated"));
  toast.success("Added to wishlist");
};

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn()) {
      setLoginPopupOpen(true);
      return;
    }

    addProductToWishlist();
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();

    if (!authForm.email || !authForm.password) {
      toast.error("Please enter email and password");
      return;
    }

    if (authMode === "signup" && !authForm.name) {
      toast.error("Please enter your name");
      return;
    }

    const userData = {
      name: authForm.name || "Customer",
      email: authForm.email,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    setLoginPopupOpen(false);
    setAuthForm({
      name: "",
      email: "",
      password: "",
    });

    toast.success(authMode === "signup" ? "Account created" : "Logged in");
    addProductToWishlist();
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
      const firstAvailableSize = availableSizes[0] || "";
      setSelectedSize(firstAvailableSize);
      setQty(1);
    }
  }, [open, availableSizes]);

  const closeDrawer = () => {
    setOpen(false);
    setSizeChartOpen(false);
  };

  const handleDecreaseQty = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    if (!selectedSize) {
      toast.error("Select a size first");
      return;
    }

    const stock = getSizeStock(selectedSize);

    if (qty >= stock) {
      toast.error(`Only ${stock} available`);
      return;
    }

    setQty((prev) => prev + 1);
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

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const stock = getSizeStock(selectedSize);

    if (stock <= 0) {
      toast.error("This size is out of stock");
      return;
    }

    if (qty > stock) {
      toast.error(`Only ${stock} item(s) available`);
      setQty(stock);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex(
      (item) => String(item.id) === String(product.id) && item.size === selectedSize
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        ...product,
        href: productLink,
        size: selectedSize,
        quantity: qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    onAddToCart?.({
      ...product,
      href: productLink,
      size: selectedSize,
      quantity: qty,
    });

    toast.success("Added to cart");
    closeDrawer();
  };

  return (
    <>
      <div className="group min-w-[270px] max-w-[270px] bg-white">
        <Link to={productLink} className="block">
          <div className="relative overflow-hidden bg-[#F7EFEA]">
            <img
              src={product.image}
              alt={product.title || product.name}
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
            <h3 className="text-[16px] leading-6">
              {product.title || product.name}
            </h3>

            <div className="mt-1 flex items-center gap-2">
              <span className="font-bold text-[18px]">
                Rs. {Number(product.price).toLocaleString("en-IN")}
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

      {loginPopupOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
          <div
            onClick={() => setLoginPopupOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="relative bg-white w-full max-w-md p-7 shadow-2xl animate-fadeIn">
            <button
              onClick={() => setLoginPopupOpen(false)}
              className="absolute right-5 top-5 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-semibold text-[#111]">
              {authMode === "login" ? "Login" : "Create Account"}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Login or sign up to add this product to your wishlist.
            </p>

            <form onSubmit={handleAuthSubmit} className="mt-6 space-y-4">
              {authMode === "signup" && (
                <input
                  value={authForm.name}
                  onChange={(e) =>
                    setAuthForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Full name"
                  className="w-full border border-[#D9D9D9] px-4 py-3 focus:outline-none focus:border-[#111]"
                />
              )}

              <input
                type="email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Email address"
                className="w-full border border-[#D9D9D9] px-4 py-3 focus:outline-none focus:border-[#111]"
              />

              <input
                type="password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Password"
                className="w-full border border-[#D9D9D9] px-4 py-3 focus:outline-none focus:border-[#111]"
              />

              <button
                type="submit"
                className="w-full bg-[#8A5A5D] text-white py-4 font-semibold hover:bg-[#70464A] transition"
              >
                {authMode === "login"
                  ? "Login & Add to Wishlist"
                  : "Sign Up & Add to Wishlist"}
              </button>
            </form>

            <button
              onClick={() =>
                setAuthMode((prev) => (prev === "login" ? "signup" : "login"))
              }
              className="mt-5 text-sm underline text-[#8A5A5D]"
            >
              {authMode === "login"
                ? "New here? Create an account"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[999] flex justify-end">
          <div
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/45 animate-fadeIn"
          />

          <aside className="relative h-full w-full sm:w-[520px] bg-white shadow-2xl overflow-y-auto animate-slideInRight">
            <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
              <h2 className="text-lg text-[#1f1f1f]">
                {sizeChartOpen ? "Size Chart" : "Choose options"}
              </h2>

              <button
                onClick={() =>
                  sizeChartOpen ? setSizeChartOpen(false) : closeDrawer()
                }
              >
                <X size={22} />
              </button>
            </div>

            {!sizeChartOpen ? (
              <div className="px-8 py-10 animate-fadeIn">
                <div className="flex gap-6">
                  <img
                    src={product.image}
                    alt={product.title || product.name}
                    className="w-32 h-44 object-cover bg-[#F7EFEA]"
                  />

                  <div className="pt-8">
                    <h3 className="font-semibold text-[#111] text-[17px] leading-6">
                      {product.title || product.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-2xl">
                        Rs. {Number(product.price).toLocaleString("en-IN")}
                      </span>

                      {product.oldPrice && (
                        <span className="text-gray-500 line-through">
                          Rs. {Number(product.oldPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {availableSizes.length === 0 && (
                      <p className="mt-3 text-sm font-medium text-red-600">
                        Currently out of stock
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center">
                    <p className="text-[#4B0F1F]">Size:</p>

                    <button
                      onClick={() => setSizeChartOpen(true)}
                      className="text-sm underline text-[#9F5C69] hover:text-[#4B0F1F] transition"
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
                          disabled={isOutOfStock}
                          onClick={() => handleSelectSize(size)}
                          title={
                            isOutOfStock
                              ? `${size} out of stock`
                              : `${stock} available`
                          }
                          className={`relative h-11 rounded-md border text-sm transition-all duration-300 overflow-hidden ${
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
                    <button
                      onClick={handleDecreaseQty}
                      disabled={!selectedSize}
                      className="px-2 hover:text-[#9F5C69] transition disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      -
                    </button>

                    <span>{qty}</span>

                    <button
                      onClick={handleIncreaseQty}
                      disabled={!selectedSize || qty >= selectedSizeStock}
                      className="px-2 hover:text-[#9F5C69] transition disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || availableSizes.length === 0}
                    className="bg-[#8A5A5D] text-white py-4 font-bold tracking-wide hover:bg-[#70464A] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {availableSizes.length === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                  </button>

                  <Link
                    to={productLink}
                    onClick={closeDrawer}
                    className="border py-4 text-center font-bold tracking-[0.25em] border-[#8A5A5D] text-[#8A5A5D] hover:bg-[#8A5A5D] hover:text-white transition"
                  >
                    BUY IT NOW
                  </Link>
                </div>

                <div className="mt-8 text-center">
                  <Link to={productLink} className="underline text-[#9F5C69]">
                    View details
                  </Link>
                </div>
              </div>
            ) : (
              <div className="px-8 py-8 animate-fadeIn">
                <button
                  onClick={() => setSizeChartOpen(false)}
                  className="mb-5 text-sm underline text-[#9F5C69]"
                >
                  Back to options
                </button>

                <div className="overflow-x-auto">
                  <table className="w-full border border-[#333] text-center text-[#111]">
                    <thead>
                      <tr>
                        <th className="border border-[#333] px-4 py-4 font-semibold">
                          GENERIC SIZE
                        </th>
                        <th className="border border-[#333] px-4 py-4 font-semibold">
                          TO FIT WAIST
                        </th>
                        <th className="border border-[#333] px-4 py-4 font-semibold">
                          TO FIT HIP
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {sizeChart.map(([size, waist, hip]) => (
                        <tr key={size}>
                          <td className="border border-[#333] px-4 py-4">{size}</td>
                          <td className="border border-[#333] px-4 py-4">{waist}</td>
                          <td className="border border-[#333] px-4 py-4">{hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slideInRight {
          animation: slideInRight 0.35s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </>
  );
}