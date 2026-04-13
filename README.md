# PhoneShop - Hướng dẫn cài đặt & Các lỗi đã sửa

## ✅ Các lỗi đã được sửa

### 1. 🔴 CORS (quan trọng nhất)
**Vấn đề:** Server không cho phép request từ client dev (port 3001, 3002)
**Sửa trong:** `server/index.js`
```js
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-access-token', 'authorization']
}));
```

### 2. 🔴 Hardcoded URL trong MyprofileComponent
**Vấn đề:** `axios.put("http://localhost:3001/api/customer/customers/...")`  
**Sửa thành:** `axios.put('/api/customer/customers/...')`  
→ Dùng relative URL để proxy của Vite tự xử lý

### 3. 🟡 Port xung đột
**Vấn đề:** Cả 2 client đều dùng port 3001  
**Sửa:**
- `client-admin`: port **3001**
- `client-customer`: port **3002**
- `server`: port **3000**

### 4. 🟡 Base path sai trong client-customer
**Vấn đề:** `base: "/doancuoikyTHW/"` làm route bị sai  
**Sửa:** Xóa `base` này đi (chỉ cần khi deploy lên subdirectory)

### 5. 🟡 client-admin basename
**Vấn đề:** Routes dùng `/admin/login`, `/admin/home`... không khớp  
**Sửa:** Dùng `<BrowserRouter basename="/admin">` và routes thành `/login`, `/home`...

### 6. 🟢 Admin vite.config - thêm `base: '/admin/'`
Để khi build và deploy qua server, admin app được serve tại `/admin/`

---

## 🚀 Cách chạy dự án

### Bước 1: Chạy Server
```bash
cd server
npm install
node index.js
# Server chạy tại http://localhost:3000
```

### Bước 2: Chạy Admin (terminal mới)
```bash
cd client-admin
npm install
npm run dev
# Admin chạy tại http://localhost:3001
```

### Bước 3: Chạy Customer (terminal mới)
```bash
cd client-customer
npm install
npm run dev
# Customer chạy tại http://localhost:3002
```

---

## 🌐 Cổng truy cập

| App | URL Dev | URL Production |
|-----|---------|----------------|
| API Server | http://localhost:3000 | http://yourdomain.com/api |
| Customer | http://localhost:3002 | http://yourdomain.com/ |
| Admin | http://localhost:3001 | http://yourdomain.com/admin |

---

## 📦 Build Production (deploy 1 server)

```bash
# Build admin
cd client-admin && npm run build

# Build customer
cd client-customer && npm run build

# Chạy server (serve cả 2)
cd server && node index.js
```

---

## 🏗️ Cấu trúc dự án

```
Lab02/
├── server/                  ← Express + MongoDB
│   ├── api/
│   │   ├── admin.js         ← API cho admin (cần JWT)
│   │   └── customer.js      ← API cho customer
│   ├── models/              ← DAO (AdminDAO, CustomerDAO, ProductDAO, CategoryDAO, OrderDAO)
│   ├── utils/               ← JwtUtil, CryptoUtil, EmailUtil, MongooseUtil, MyConstants
│   └── index.js             ← Entry point (CORS fix ở đây)
│
├── client-admin/            ← React (Vite, port 3001)
│   └── src/
│       ├── components/      ← Login, Home, Product, Category, Order, Customer
│       └── contexts/        ← MyContext, MyProvider (token, username)
│
└── client-customer/         ← React (Vite, port 3002)
    └── src/
        ├── components/      ← Home, Product, Cart, Orders, Profile, Login, Signup...
        ├── contexts/        ← MyContext, MyProvider (token, customer, mycart)
        └── utils/           ← CartUtil, withRouter
```
