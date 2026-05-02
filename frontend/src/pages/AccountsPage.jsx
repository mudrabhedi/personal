import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Package, MapPin, LogOut, Gift, ShieldCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function AccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (itemToRemove) => {
    const updatedWishlist = wishlist.filter(
      (item) =>
        String(item.name || item.title) !==
        String(itemToRemove.name || itemToRemove.title)
    );

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast("Removed from wishlist");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="bg-[#222] text-white text-center py-3 text-sm">
        🎁 FLAT ₹500 OFF : Orders ₹4500+ (Auto-Applied)
      </div>

      <div className="border-b border-[#E5E5E5]">
        <div className="max-w-[1500px] mx-auto px-8 py-5 grid grid-cols-1 md:grid-cols-4 gap-5 text-sm text-[#111]">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={20} />
            Comfort & Fit Guarantee
          </div>

          <div className="flex items-center justify-center gap-2">
            <Heart size={20} />
            Loved by 1,00,000+ Women
          </div>

          <div className="flex items-center justify-center gap-2">
            <Truck size={20} />
            7-Day Return & Exchange
          </div>

          <div className="flex items-center justify-center gap-2">
            <Gift size={20} />
            COD Available
          </div>
        </div>
      </div>

      <div className="border-b border-[#E5E5E5]">
        <div className="max-w-[900px] mx-auto px-8 py-10 flex items-center justify-center gap-12 text-[#333]">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-1 ${
              activeTab === "orders"
                ? "border-b border-black text-black"
                : "text-gray-500"
            }`}
          >
            Orders
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`pb-1 ${
              activeTab === "addresses"
                ? "border-b border-black text-black"
                : "text-gray-500"
            }`}
          >
            Addresses
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-1 ${
              activeTab === "wishlist"
                ? "border-b border-black text-black"
                : "text-gray-500"
            }`}
          >
            Wishlist
          </button>

          <button onClick={handleLogout} className="text-gray-500">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-14">
        {activeTab === "orders" && (
          <div className="text-center min-h-[300px]">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-medium text-[#111]">Orders</h1>
              <span className="bg-[#222] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                0
              </span>
            </div>

            <Package className="mx-auto mt-8 text-gray-400" size={42} />

            <p className="mt-5 text-gray-500">
              You have not placed any orders yet.
            </p>

            <Link
              to="/"
              className="inline-flex mt-8 bg-[#8A5A5D] text-white px-10 py-4 font-semibold hover:bg-[#70464A] transition"
            >
              START SHOPPING
            </Link>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="text-center min-h-[300px]">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-medium text-[#111]">Addresses</h1>
              <span className="bg-[#222] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                0
              </span>
            </div>

            <MapPin className="mx-auto mt-8 text-gray-400" size={42} />

            <p className="mt-5 text-gray-500">
              No saved addresses yet.
            </p>

            <Link
              to="/checkout"
              className="inline-flex mt-8 bg-[#8A5A5D] text-white px-10 py-4 font-semibold hover:bg-[#70464A] transition"
            >
              ADD ADDRESS
            </Link>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-medium text-[#111]">Wishlist</h1>
              <span className="bg-[#222] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center min-h-[300px]">
                <Heart className="mx-auto mt-8 text-gray-400" size={42} />

                <p className="mt-5 text-gray-500">
                  Your wishlist is empty.
                </p>

                <Link
                  to="/"
                  className="inline-flex mt-8 bg-[#8A5A5D] text-white px-10 py-4 font-semibold hover:bg-[#70464A] transition"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {wishlist.map((item) => (
                  <div
                    key={item.name || item.title}
                    className="border border-[#E5E5E5] bg-white"
                  >
                    <Link to={item.href || "#"}>
                      <div className="bg-[#F7EFEA]">
                        <img
                          src={item.image}
                          alt={item.title || item.name}
                          className="w-full h-80 object-cover"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={item.href || "#"}>
                        <h3 className="text-sm text-[#111] leading-5 hover:underline">
                          {item.title || item.name}
                        </h3>
                      </Link>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-bold text-[#111]">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </span>

                        {item.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{Number(item.oldPrice).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromWishlist(item)}
                        className="mt-4 w-full border border-red-200 text-red-600 py-2 text-sm hover:bg-red-50 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-24 bg-[#222]" />
    </div>
  );
}