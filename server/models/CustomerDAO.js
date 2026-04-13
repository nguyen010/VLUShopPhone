const Models = require('./Models');
const nodemailer = require('nodemailer');
const MyConstants = require('../utils/MyConstants');

const CustomerDAO = {

  async selectAll() {
    return await Models.Customer.find({}).exec();
  },

  async selectByID(_id) {
    return await Models.Customer.findById(_id).exec();
  },

  async selectByUsernameOrEmail(username, email) {
    return await Models.Customer.findOne({ $or: [{ username }, { email }] });
  },

  async selectByUsernameAndPassword(username, password) {
    return await Models.Customer.findOne({ username, password });
  },

  async insert(customer) {
    return await Models.Customer.create(customer);
  },

  async active(id, token, active) {
    return await Models.Customer.findOneAndUpdate({ _id: id, token }, { active });
  },

  async update(id, customer) {
    const updateData = {
      username: customer.username,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    };
    // Only update password if provided
    if (customer.password) updateData.password = customer.password;
    return await Models.Customer.findByIdAndUpdate(id, updateData, { new: true });
  },

  async updateActive(_id, active) {
    return await Models.Customer.updateOne({ _id }, { $set: { active } });
  },


  async deleteById(_id) {
    return await Models.Customer.findByIdAndDelete(_id).exec();
  },

  // ── Helper tạo transporter ───────────────────────────────────────────────
  _transporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user: MyConstants.EMAIL_USER, pass: MyConstants.EMAIL_PASS },
    });
  },

  // ── Helper build HTML email ──────────────────────────────────────────────
  _buildHtml({ customerName, customerPhone, orderIdStr, orderDate, statusText, statusColor, itemsHtml, totalStr }) {
    return `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#c8000f 0%,#900008 100%);padding:28px 32px;text-align:center;">
    <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 28px;">
      <span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:1px;">VLUPhone</span>
    </div>
    <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:13px;">Hệ thống bán điện thoại chính hãng</p>
  </td></tr>
  <tr><td style="padding:28px 32px 0;">
    <div style="background:#fff8f8;border-left:4px solid #d70018;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;font-size:15px;color:#333;line-height:1.6;">
        Xin chào <strong style="color:#d70018;">${customerName}</strong> — mã KH: <strong>${customerPhone}</strong>
      </p>
      <p style="margin:8px 0 0;font-size:13.5px;color:#555;line-height:1.6;">
        Cảm ơn Quý khách đã mua sắm tại <strong>VLUPhone</strong>. Đơn hàng của bạn đã được cập nhật!
      </p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #f0f0f0;border-radius:10px;overflow:hidden;margin-bottom:16px;">
      <tr style="background:#fafafa;">
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Mã đơn</td>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Ngày đặt</td>
        <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.8px;">Trạng thái</td>
      </tr>
      <tr>
        <td style="padding:12px 14px;font-family:monospace;font-size:14px;font-weight:700;color:#333;">${orderIdStr}</td>
        <td style="padding:12px 14px;font-size:13px;color:#555;">${orderDate}</td>
        <td style="padding:12px 14px;">
          <span style="background:${statusColor}20;color:${statusColor};font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;">${statusText}</span>
        </td>
      </tr>
    </table>
    <p style="font-size:12px;font-weight:700;color:#555;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Sản phẩm đã mua</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;margin-bottom:20px;">
      <tr style="background:#fafafa;">
        <th style="padding:9px 14px;text-align:left;font-size:11px;color:#888;font-weight:600;">Sản phẩm</th>
        <th style="padding:9px 14px;text-align:center;font-size:11px;color:#888;font-weight:600;">SL</th>
        <th style="padding:9px 14px;text-align:right;font-size:11px;color:#888;font-weight:600;">Đơn giá</th>
      </tr>
      ${itemsHtml}
      <tr style="background:#fff8f8;">
        <td colspan="2" style="padding:12px 14px;font-size:14px;font-weight:800;color:#333;text-align:right;">Tổng cộng:</td>
        <td style="padding:12px 14px;font-size:16px;font-weight:900;color:#d70018;text-align:right;">${totalStr}</td>
      </tr>
    </table>
    <div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #fde8e8;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#d70018;">🎁 Ưu đãi dành cho bạn</p>
      <p style="margin:0 0 5px;font-size:12.5px;color:#555;">✅ <strong>Thu cũ đổi mới</strong> — Trợ giá lên đến <strong>2 triệu</strong></p>
      <p style="margin:0 0 5px;font-size:12.5px;color:#555;">💳 <strong>Trả góp 0%</strong> — 12 tháng không lãi suất</p>
      <p style="margin:0;font-size:12.5px;color:#555;">🛡️ <strong>Bảo hành 12 tháng</strong> — Hỗ trợ toàn quốc</p>
    </div>
    <div style="text-align:center;padding-bottom:24px;">
      <a href="http://localhost:3000/myorders" style="display:inline-block;background:linear-gradient(135deg,#d70018,#ff2233);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:14px;font-weight:800;box-shadow:0 4px 16px rgba(215,0,24,0.35);">
        🔍 XEM CHI TIẾT ĐƠN HÀNG
      </a>
    </div>
  </td></tr>
  <tr><td style="background:#1a1f2e;padding:18px 32px;text-align:center;">
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#fff;">VLUPhone — Điện thoại chính hãng giá tốt nhất</p>
    <p style="margin:0;font-size:11.5px;color:rgba(255,255,255,0.5);">Hotline: <strong style="color:rgba(255,255,255,0.8);">1800 2097</strong> (Miễn phí • 8:00–21:00)</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
  },

  // ── Gửi mail kích hoạt tài khoản (nút Gửi mail trong quản lý khách hàng) ─
  async sendMailActivate(id) {
    const customer = await Models.Customer.findById(id).exec();
    if (!customer) return { success: false, message: 'Không tìm thấy khách hàng!' };

    // Lấy đơn hàng mới nhất
    const orders = await Models.Order.find({ 'customer._id': customer._id }).sort({ cdate: -1 }).exec();
    const order = orders[0] || null;

    const orderIdStr  = order ? '#' + order._id.toString().slice(-8).toUpperCase() : 'N/A';
    const orderDate   = order ? new Date(order.cdate).toLocaleDateString('vi-VN') : '--';
    const statusText  = !order ? '--' : order.status === 'APPROVED' ? '✅ Đã xác nhận' : order.status === 'CANCELED' ? '❌ Đã hủy' : '⏳ Đang xử lý';
    const statusColor = !order ? '#888' : order.status === 'APPROVED' ? '#059669' : order.status === 'CANCELED' ? '#dc2626' : '#f59e0b';
    const totalStr    = order ? (order.total || 0).toLocaleString('vi-VN') + 'đ' : '0đ';
    const itemsHtml   = order ? (order.items || []).map(item => `
      <tr>
        <td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;"><strong>${item.product?.name || 'Sản phẩm'}</strong></td>
        <td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;color:#666;">x${item.quantity || 1}</td>
        <td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:700;color:#d70018;">${(item.product?.price || 0).toLocaleString('vi-VN')}đ</td>
      </tr>`).join('') : '<tr><td colspan="3" style="padding:12px;text-align:center;color:#aaa;font-size:13px;">Chưa có đơn hàng</td></tr>';

    const html = CustomerDAO._buildHtml({ customerName: customer.name, customerPhone: customer.phone, orderIdStr, orderDate, statusText, statusColor, itemsHtml, totalStr });

    try {
      await CustomerDAO._transporter().sendMail({
        from: `"VLUPhone" <${MyConstants.EMAIL_USER}>`,
        to: customer.email,
        subject: `VLUPhone — Thông báo đơn hàng cho ${customer.name}`,
        html,
      });
      return { success: true, message: '📧 Đã gửi email đến: ' + customer.email };
    } catch (err) {
      console.error('sendMailActivate error:', err.message);
      return { success: false, message: 'Lỗi gửi mail: ' + err.message };
    }
  },

  // ── Gửi mail xác nhận cho 1 đơn hàng cụ thể (admin duyệt đơn) ──────────
  async sendMailForOrder(orderId) {
    const order = await Models.Order.findById(orderId).exec();
    if (!order) return { success: false, message: 'Không tìm thấy đơn hàng!' };

    const customer = order.customer;
    if (!customer?.email) return { success: false, message: 'Khách hàng không có email!' };

    const orderIdStr  = '#' + order._id.toString().slice(-8).toUpperCase();
    const orderDate   = new Date(order.cdate).toLocaleDateString('vi-VN');
    const statusText  = order.status === 'APPROVED' ? '✅ Đã xác nhận' : order.status === 'CANCELED' ? '❌ Đã hủy' : '⏳ Đang xử lý';
    const statusColor = order.status === 'APPROVED' ? '#059669' : order.status === 'CANCELED' ? '#dc2626' : '#f59e0b';
    const totalStr    = (order.total || 0).toLocaleString('vi-VN') + 'đ';
    const itemsHtml   = (order.items || []).map(item => `
      <tr>
        <td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;"><strong>${item.product?.name || 'Sản phẩm'}</strong></td>
        <td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:13px;color:#666;">x${item.quantity || 1}</td>
        <td style="padding:9px 14px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:13px;font-weight:700;color:#d70018;">${(item.product?.price || 0).toLocaleString('vi-VN')}đ</td>
      </tr>`).join('');

    const html = CustomerDAO._buildHtml({ customerName: customer.name, customerPhone: customer.phone, orderIdStr, orderDate, statusText, statusColor, itemsHtml, totalStr });

    try {
      await CustomerDAO._transporter().sendMail({
        from: `"VLUPhone" <${MyConstants.EMAIL_USER}>`,
        to: customer.email,
        subject: `VLUPhone — Xác nhận đơn hàng ${orderIdStr} của ${customer.name}`,
        html,
      });
      return { success: true, message: '📧 Đã gửi email xác nhận đến: ' + customer.email };
    } catch (err) {
      console.error('sendMailForOrder error:', err.message);
      return { success: false, message: 'Lỗi gửi mail: ' + err.message };
    }
  },
};

module.exports = CustomerDAO;
