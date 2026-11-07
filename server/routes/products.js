const express = require("express");
const multer = require("multer");
const router = express.Router();
const productRoute = require("../controllers/productController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 }, // 1 MB max
});

router.get("/", productRoute.getCatalog);
router.get("/:id/image", productRoute.getProductImage);
router.post("/", upload.single("photo"), productRoute.addCatalogProduct);

module.exports = router;