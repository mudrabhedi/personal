import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQty = (id, size) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const decreaseQty = (id, size) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );

    updateCart(updatedCart);
  };

  const removeItem = (id, size) => {
    const updatedCart = cart.filter(
      (item) => !(item.id === id && item.size === size)
    );
    updateCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white pt-28 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#111] mb-8">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-5 border-b border-gray-200 pb-6"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-28 h-36 object-cover bg-[#F7EFEA]"
                  />

                  <div className="flex-1">
                    <h2 className="font-medium text-[#111]">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Size: {item.size}
                    </p>

                    <p className="font-bold mt-2">
                      Rs. {item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="mt-4 flex items-center gap-5">
                      <button
                        onClick={() => decreaseQty(item.id, item.size)}
                        className="border px-3 py-1"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => increaseQty(item.id, item.size)}
                        className="border px-3 py-1"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id, item.size)}
                    className="text-gray-500 hover:text-[#8A5A5D]"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 p-6 h-fit">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="flex justify-between border-b pb-4">
                <span>Total</span>
                <span className="font-bold">
                  Rs. {total.toLocaleString("en-IN")}
                </span>
              </div>

           <a
  href="/checkout"
  className="mt-6 block w-full bg-[#8A5A5D] text-white py-4 font-bold text-center hover:bg-[#70464A]"
>
  CHECKOUT
</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}