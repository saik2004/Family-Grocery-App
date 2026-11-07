const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    nameTa: { type: String, required: true, unique: true, trim: true },
    nameEn: { type: String, trim: true },
    imageData: { type: Buffer, select: false },
    imageType: { type: String, select: false },
    image: { type: String, default: "🛒" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
