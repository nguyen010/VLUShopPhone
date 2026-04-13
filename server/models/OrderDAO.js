require('../utils/MongooseUtil');
const Models = require('./Models');

const OrderDAO = {
  // insert order
  async insert(order) {
    const mongoose = require('mongoose');

    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);

    return result;
  },

  // lấy order theo customer id
  async selectByCustID(_cid) {
    const query = { 'customer._id': _cid };
    const orders = await Models.Order.find(query).exec();

    return orders;
  },

  // lấy tất cả order (mới nhất trước)
  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // giảm dần

    const orders = await Models.Order
      .find(query)
      .sort(mysort)
      .exec();

    return orders;
  },


  // lấy order theo customer._id (dùng cho admin gửi mail)
  async selectByCustomerID(cid) {
    const query = { 'customer._id': cid };
    const mysort = { cdate: -1 };
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },

  // update status
  async update(_id, newStatus) {
    const newvalues = { status: newStatus };

    const result = await Models.Order.findByIdAndUpdate(
      _id,
      newvalues,
      { new: true } // trả về dữ liệu sau update
    );

    return result;
  }
};

module.exports = OrderDAO;