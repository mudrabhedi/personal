import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: String,
    email: String,
    phone: String,

    products: [
      {
        productId: String,
        name: String,
        title: String,
        image: String,
        price: Number,
        quantity: Number,
        size: String,
      },
    ],

    total: Number,
    items: Number,

    paymentMethod: String,
    paymentStatus: String,
    status: {
      type: String,
      default: "Processing",
    },

    address: {
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      state: String,
      pinCode: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);