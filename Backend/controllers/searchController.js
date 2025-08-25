const products = require("../models/productModel");

const getLocations = (req, res) => {
  const locations = [...new Set(products.map((p) => p.location))];
  res.json(locations);
};

const searchProducts = (req, res) => {
  const { query, location } = req.query;

  let results = products;

  if (location) {
    results = results.filter(
      (p) => p.location.toLowerCase() === location.toLowerCase()
    );
  }

  if (query) {
    results = results.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  res.json(results);
};

module.exports = { getLocations, searchProducts };
