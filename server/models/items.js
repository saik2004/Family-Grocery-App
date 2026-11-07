const mongoose = require("mongoose");

const itemsSchema = new mongoose.Schema({
  nameTa: {
    type: String,
    required: true,
    trim: true,
  },

  nameEn: {
    type: String,
    trim: true,
  },

  image: {
    type: String,
  },
  quantity: {
    type: String,
    default: "1",
  },
  status: {
    type: String,
    enum: ["pending", "bought"],
    default: "pending",
  },

  addedAt: {
    type: Date,
    default: Date.now,
  },

  boughtAt: {
    type: Date,
    default: null,
  },
});

const itemModel = mongoose.model("item", itemsSchema);

module.exports = itemModel;
