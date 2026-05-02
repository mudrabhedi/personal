import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    category: String,
    price: Number,
    oldPrice: Number,
    image: String,
    sizes: [{ size: String, stock: Number }],
    stock: Number,
    featured: Boolean,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);