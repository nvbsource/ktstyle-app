const express = require('express')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const { generateToken } = require('../../helpers/jwtHelpers')
const db = require('../../config/dbRepository')
const verifyToken = require('../../middlewares/authMiddleware')
const {
  successResponse,
  errorResponse,
} = require('../../helpers/responseHelper')

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const categories = await db.query(
      "SELECT id, name, parent_id, item_type FROM Categories"
    );

    // Hàm đệ quy để xây dựng cây danh mục
    const buildCategoryTree = (categories, parentId = null) => {
      return categories
        .filter((category) => category.parent_id === parentId) // Lọc các danh mục con của parentId
        .map((category) => ({
          ...category,
          parent_id: undefined, // Ẩn parent_id trong kết quả trả về
          children:
            buildCategoryTree(categories, category.id).length > 0
              ? buildCategoryTree(categories, category.id)
              : undefined, // Đệ quy tìm các con
        }));
    };

    // Tách riêng danh mục `accessory` và `product`
    const accessoryCategories = categories.data.filter(
      (c) => c.item_type === "accessory"
    );
    const productCategories = categories.data.filter(
      (c) => c.item_type === "product"
    );

    // Xây dựng cây danh mục cho từng loại
    const accessoryTree = buildCategoryTree(accessoryCategories);
    const productTree = buildCategoryTree(productCategories);

    // Định dạng kết quả trả về
    const formatWithOptions = {
      accessories: accessoryTree,
      products: productTree,
    };

    // Trả về danh mục cha và cây đầy đủ
    successResponse(
      res,
      "Danh mục cha và con đã được lấy thành công",
      formatWithOptions
    );
  } catch (err) {
    console.error("Lỗi khi lấy danh mục:", err);
    errorResponse(res, "Lỗi khi lấy danh mục");
  }
});
module.exports = router
