const express = require("express");
const router = express.Router();
const { findByName } = require("../../models/product.model");

router.get("/search", async (req, res) => {
  const keyword = req.query.q || "";
  try {
    const result = await findByName(keyword);

    // Lọc trùng theo title + import
    const seen = new Set();
    const uniqueProducts = result.filter(item => {
      const key = `${item.title}-${item.import}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Trả về kết quả đã lọc
    res.json(uniqueProducts.map(item => ({
      title: item.title,
      id: item._id
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tìm kiếm" });
  }
});

module.exports = router;
