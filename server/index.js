const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require('./utils/MongooseUtil');

const app = express();
const PORT = process.env.PORT || 3000;

// ================= CORS =================
app.use(cors({
  origin: [
    'http://localhost:3001',  // client-admin (dev)
    'http://localhost:3002',  // client-customer (dev)
    'http://localhost:3000',  // same origin (production)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-access-token', 'authorization']
}));

// ================= MIDDLEWARE =================
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ================= API =================
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from PhoneShop server!' });
});

// ================= DEPLOY CLIENT (Production) =================
// Admin
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/dist')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/dist', 'index.html'));
});

// Customer
app.use('/', express.static(path.resolve(__dirname, '../client-customer/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/dist', 'index.html'));
});

// ================= RUN =================
app.listen(PORT, () => {
  console.log(`🚀 PhoneShop Server running at http://localhost:${PORT}`);
  console.log(`   Admin API:    http://localhost:${PORT}/api/admin`);
  console.log(`   Customer API: http://localhost:${PORT}/api/customer`);
});
