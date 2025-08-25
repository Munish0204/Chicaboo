const express = require("express");
const { getLocations, searchProducts, getAllProducts } = require("../controllers/searchController");

const router = express.Router();

router.get("/locations", getLocations);
router.get("/search", searchProducts);
router.get("/all", getAllProducts);

module.exports = router;
