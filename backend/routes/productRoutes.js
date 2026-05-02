import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.get("/category/:category", async (req, res) => {
  const products = await Product.find({
    category: new RegExp(`^${req.params.category}$`, "i"),
    status: { $ne: "Hidden" },
  }).sort({ createdAt: -1 });

  res.json(products);
});

router.get("/featured/all", async (req, res) => {
  const products = await Product.find({
    featured: true,
    status: { $ne: "Hidden" },
  }).sort({ createdAt: -1 });

  res.json(products);
});

router.get("/:slug", async (req, res) => {
  const products = await Product.find({ status: { $ne: "Hidden" } });

  const product = products.find(
    (p) =>
      slugify(p.title || p.name) === req.params.slug ||
      String(p._id) === String(req.params.slug)
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

router.post("/", async (req, res) => {
  const totalStock = req.body.sizes.reduce(
    (sum, row) => sum + Number(row.stock || 0),
    0
  );

  const product = await Product.create({
    ...req.body,
    title: req.body.name,
    stock: totalStock,
    status: totalStock <= 0 ? "Out of stock" : req.body.status,
  });

  res.status(201).json(product);
});

router.put("/:id", async (req, res) => {
  const totalStock = req.body.sizes.reduce(
    (sum, row) => sum + Number(row.stock || 0),
    0
  );

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      title: req.body.name,
      stock: totalStock,
      status: totalStock <= 0 ? "Out of stock" : req.body.status,
    },
    { new: true }
  );

  res.json(product);
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;