const express = require("express");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const Product = require("../models/Product.model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    const { name, description, price, stock, category, imageUrl } = req.body;
    try {
      const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
      });
      res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      res.status(400).json({ message: "Error creating product", error });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    const { name, description, price, stock, category, imageUrl } = req.body;
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      await product.update({
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
      });
      res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } catch (error) {
      res.status(400).json({ message: "Error updating product", error });
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      await product.destroy();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  }
);

module.exports = router;
