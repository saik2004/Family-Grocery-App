const mongoose = require("mongoose");
const Item = require("../models/items");

// 1. CREATE one item (POST /api/items)
exports.createItem = async (req, res) => {
  try {
    const { nameTa, nameEn, image } = req.body;

    const existing = await Item.findOne({ nameTa, status: "pending" });
    if (existing) {
      return res.status(409).json({
        message: "Item already in the list",
        item: existing,
      });
    }

    const item = await Item.create({ nameTa, nameEn, image });

    return res.status(201).json({
      message: "Product created successfully",
      item,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// 2. GET list (GET /api/items): pending + bought today, newest first
exports.getItem = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const items = await Item.find({
      $or: [
        { status: "pending" },
        { status: "bought", boughtAt: { $gte: since } },
      ],
    }).sort({ addedAt: -1 });

    return res.status(200).json({
      message: "Items retrieved successfully",
      items,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 3. BULK create (POST /api/items/bulk): Mom's "Send to Dad" button
// Body: { "items": [ { "nameTa": "...", "nameEn": "...", "image": "..." }, ... ] }
exports.createBulkItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Send a non-empty items array" });
    }

    // Names already pending in the database
    const names = items.map((i) => i.nameTa);
    const pendingItems = await Item.find({
      nameTa: { $in: names },
      status: "pending",
    });
    const pendingNames = new Set(pendingItems.map((i) => i.nameTa));

    // Keep only new names, and drop repeats inside the array itself
    const seen = new Set();
    const toCreate = [];
    const skipped = [];

    for (const { nameTa, nameEn, image, quantity } of items) {
      if (pendingNames.has(nameTa) || seen.has(nameTa)) {
        skipped.push(nameTa);
      } else {
        seen.add(nameTa);
        toCreate.push({ nameTa, nameEn, image, quantity });
      }
    }

    const created = toCreate.length ? await Item.insertMany(toCreate) : [];

    return res.status(201).json({
      message: `${created.length} items sent, ${skipped.length} already in list`,
      created,
      skipped,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// 4. UPDATE / toggle bought (PATCH /api/items/:id): Dad ticks off
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.status === "pending") {
      item.status = "bought";
      item.boughtAt = new Date();
    } else {
      item.status = "pending";
      item.boughtAt = null;
    }

    await item.save();

    return res.status(200).json({
      message: "Item updated successfully",
      item,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 5. DELETE (DELETE /api/items/:id): Mom removes a wrong item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({
      message: "Item deleted successfully",
      item,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
