const mongoose = require("mongoose");
const Product = require("../models/product");

// GET /api/products
exports.getCatalog = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/products
exports.addCatalogProduct = async (req, res) => {
  try {
    const { nameTa, nameEn, image } = req.body;

    const existing = await Product.findOne({ nameTa });
    if (existing) {
      return res
        .status(409)
        .json({ message: "இது ஏற்கனவே உள்ளது (Already exists)" });
    }

    const product = new Product({ nameTa, nameEn, image: image || "🛒" });

    if (req.file) {
      product.imageData = req.file.buffer;
      product.imageType = req.file.mimetype;
      product.image = `/api/products/${product._id}/image`;
    }

    await product.save();

    const out = product.toObject();
    delete out.imageData;
    delete out.imageType;
    return res.status(201).json({ message: "Product added", product: out });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getProductImage = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).end();

    const p = await Product.findById(req.params.id).select(
      "+imageData +imageType",
    );
    if (!p || !p.imageData) return res.status(404).end();

    res.set("Content-Type", p.imageType);
    res.set("Cache-Control", "public, max-age=31536000"); // browser keeps it, no re-download
    return res.send(p.imageData);
  } catch (err) {
    console.log("IMAGE ERROR:", err.message);
    return res.status(500).json({ message: err.message });
  }
};
