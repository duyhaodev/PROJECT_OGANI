const express = require("express");
const router = express.Router();
const { findByName } = require("../../models/product.model");


router.get("/search", async (req, res) => {
  const keyword = req.query.q || "";
  try {
    const result = await findByName(keyword);
    res.json(result.map(item => ({
      title: item.title,
      id:  item._id  
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tìm kiếm" });
  }
});

module.exports = router;
