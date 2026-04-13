require('../utils/MongooseUtil');
const Models = require('./Models');

const ProductDAO = {

  // lấy tất cả product
  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },

  // lấy product theo id
  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },

  // lấy top product mới
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const products = await Models.Product
      .find(query)
      .sort(mysort)
      .limit(top)
      .exec();
    return products;
  },

  // lấy top product bán chạy
  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product._id',
          sum: { $sum: '$items.quantity' }
        }
      },
      { $sort: { sum: -1 } }, 
      { $limit: top }
    ]).exec();

    var products = [];
    for (const item of items) {
      const product = await ProductDAO.selectByID(item._id);
      if (product) products.push(product);
    }

    // Fallback: nếu chưa có đơn APPROVED, lấy sản phẩm mới nhất thay thế
    if (products.length < top) {
      const existing = new Set(products.map(p => p._id.toString()));
      const fallback = await Models.Product
        .find({})
        .sort({ cdate: -1 })
        .limit(top * 2)
        .exec();
      for (const p of fallback) {
        if (!existing.has(p._id.toString())) {
          products.push(p);
          existing.add(p._id.toString());
        }
        if (products.length >= top) break;
      }
    }

    return products;
  },

  // lấy product theo category id
  async selectByCatID(_cid) {
    const query = { 'category._id': _cid };
    const products = await Models.Product.find(query).exec();
    return products;
  },

  // tìm product theo keyword
  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const products = await Models.Product.find(query).exec();
    return products;
  },
  

  // lấy product theo khoảng giá
  async selectByPrice(min, max, cid) {
    let priceQuery = {};
    if (max === 0) priceQuery = { price: { $gte: min } };
    else if (min === 0) priceQuery = { price: { $lt: max } };
    else priceQuery = { price: { $gte: min, $lte: max } };

    // Nếu có cid thì lọc thêm theo category
    const query = cid
      ? { ...priceQuery, 'category._id': cid }
      : priceQuery;

    const products = await Models.Product.find(query).exec();
    return products;
  },

  // thêm product mới
  async insert(product) {
    const mongoose = require('mongoose');
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
  },

  // cập nhật product
  async update(product) {
    const newvalues = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    };

    const result = await Models.Product.findByIdAndUpdate(
      product._id,
      newvalues,
      { new: true }
    );

    return result;
  },

  // xoá product
  async delete(_id) {
    const result = await Models.Product.findByIdAndDelete(_id);
    return result;
  }
};

module.exports = ProductDAO;
