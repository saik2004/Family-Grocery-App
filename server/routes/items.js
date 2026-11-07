const express = require("express");
const router = express.Router();
const itemRoute = require("../controllers/itemController");

router.get("/", itemRoute.getItem);
router.post("/", itemRoute.createItem);
router.post("/bulk", itemRoute.createBulkItems);
router.patch("/:id", itemRoute.updateItem);
router.delete("/:id", itemRoute.deleteItem);

module.exports = router;