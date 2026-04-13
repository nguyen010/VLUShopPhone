const express = require('express');
const router = express.Router();

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO'); // 🆕


// ================= CATEGORY =================
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});


// ================= PRODUCT =================

router.get('/products/new', async function (req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const products = await ProductDAO.selectTopNew(limit);
  res.json(products);
});

router.get('/products/hot', async function (req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const products = await ProductDAO.selectTopHot(limit);
  res.json(products);
});

router.get('/products/category/:cid', async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});

router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});



router.get('/products/price/:min/:max', async function (req, res) {
  const min = parseInt(req.params.min) || 0;
  const max = parseInt(req.params.max) || 0;
  const cid = req.query.cid || null; // optional category filter
  const products = await ProductDAO.selectByPrice(min, max, cid);
  res.json(products);
});

router.get('/products', async function (req, res) {
  const products = await ProductDAO.selectAll();
  res.json(products);
});

router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});


// ================= CUSTOMER =================

router.post('/signup', async function (req, res) {
  try {
    const { username, password, name, phone, email } = req.body;

    const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

    if (dbCust) {
      return res.json({
        success: false,
        message: 'Tên đăng nhập hoặc email đã tồn tại!'
      });
    }

    // Tạo tài khoản và kích hoạt ngay lập tức (active: 1)
    const newCust = {
      username,
      password,
      name,
      phone,
      email,
      active: 1,
      token: ''
    };

    const result = await CustomerDAO.insert(newCust);

    res.json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.',
      customer: result
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================= ACTIVE =================
router.post('/active', async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;

  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});


// ================= LOGIN =================
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

    if (customer) {
      if (customer.active === 0) {
        return res.json({
          success: false,
          message: 'Tài khoản đã bị khóa. Vui lòng liên hệ admin!'
        });
      }
      const token = JwtUtil.genToken();
      res.json({
        success: true,
        message: 'Đăng nhập thành công!',
        token: token,
        customer: customer
      });
    } else {
      res.json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
  } else {
    res.json({
      success: false,
      message: 'Please input username and password'
    });
  }
});


// ================= CHECK TOKEN =================
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });
});


// ================= UPDATE PROFILE =================
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;

  const customer = {
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email
  };

  const result = await CustomerDAO.update(_id, customer);
  res.json(result);
});


// ================= CHECKOUT =================
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  const now = new Date().getTime();

  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;

  const order = {
    cdate: now,
    total: total,
    status: 'PENDING',
    customer: customer,
    items: items
  };

  const result = await OrderDAO.insert(order);
  res.json(result);
});


// ================= MY ORDERS =================
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;

  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});



// ================= RESEND ACTIVATION =================
router.post('/resend-activation', async function (req, res) {
  const { email, id } = req.body;
  try {
    const customer = await CustomerDAO.selectByID(id);
    if (!customer) return res.json({ success: false, message: 'Không tìm thấy tài khoản!' });

    const nodemailer = require('nodemailer');
    const MyConstants = require('../utils/MyConstants');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: MyConstants.EMAIL_USER, pass: MyConstants.EMAIL_PASS }
    });

    const htmlMail = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:520px;width:100%;">
  <tr><td style="background:linear-gradient(135deg,#c8000f 0%,#900008 100%);padding:32px;text-align:center;">
    <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 28px;margin-bottom:8px;">
      <span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:1px;">VLUPhone</span>
    </div>
    <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px;">Gửi lại mã xác nhận tài khoản</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1a1a1a;">Mã kích hoạt của bạn 🔑</h2>
    <div style="background:linear-gradient(135deg,#fff5f5,#fff);border:1.5px solid #fde8e8;border-radius:12px;padding:20px 24px;margin:20px 0;">
      <div style="margin-bottom:14px;">
        <div style="font-size:11px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:5px;">User ID</div>
        <div style="font-family:monospace;font-size:15px;font-weight:800;color:#d70018;background:#fff;border:1.5px solid #fde8e8;border-radius:8px;padding:10px 14px;word-break:break-all;">${customer._id}</div>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:5px;">Mã kích hoạt (Token)</div>
        <div style="font-family:monospace;font-size:15px;font-weight:800;color:#d70018;background:#fff;border:1.5px solid #fde8e8;border-radius:8px;padding:10px 14px;word-break:break-all;">${customer.token}</div>
      </div>
    </div>
    <div style="text-align:center;">
      <a href="http://localhost:3000/active" style="display:inline-block;background:linear-gradient(135deg,#d70018,#ff2233);color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-size:14px;font-weight:800;box-shadow:0 4px 16px rgba(215,0,24,0.35);">🔓 Kích hoạt ngay</a>
    </div>
  </td></tr>
  <tr><td style="background:#1a1f2e;padding:16px 32px;text-align:center;">
    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5);">VLUPhone — Hotline: 1800 2097</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    await transporter.sendMail({
      from: `"VLUPhone" <${MyConstants.EMAIL_USER}>`,
      to: customer.email,
      subject: '🔐 VLUPhone — Gửi lại mã kích hoạt tài khoản',
      html: htmlMail,
    });
    res.json({ success: true, message: 'Đã gửi lại email!' });
  } catch(err) {
    console.error('Resend error:', err.message);
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;