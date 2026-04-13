import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

// ── Spec Engine: sinh thông số dựa trên tên sản phẩm ─────────────────────────
function generateSpecs(name = '', price = 0) {
  const n = name.toLowerCase();

  // ── MacBook ──────────────────────────────────────────────────────────────
  if (n.includes('macbook')) {
    const isPro = n.includes('pro');
    const isAir = n.includes('air');
    const isM4 = n.includes('m4');
    const isM3 = n.includes('m3');
    const chip = isM4 ? 'Apple M4' : isM3 ? 'Apple M3' : isPro ? 'Apple M3 Pro' : 'Apple M2';
    const screen = isPro ? (n.includes('16') ? '16.2 inch Liquid Retina XDR' : '14.2 inch Liquid Retina XDR') : '13.6 inch Liquid Retina';
    const ram = isPro ? '18GB' : '16GB';
    const storage = n.includes('512') ? '512GB SSD' : n.includes('1tb') ? '1TB SSD' : '256GB SSD';
    return {
      type: 'laptop',
      groups: [
        { title: 'Màn hình', items: [
          { label: 'Kích thước màn hình', value: screen },
          { label: 'Công nghệ màn hình', value: isPro ? 'Liquid Retina XDR (Mini-LED)' : 'Liquid Retina (IPS)' },
          { label: 'Độ phân giải', value: isPro ? '3456 x 2234 pixels' : '2560 x 1664 pixels' },
          { label: 'Tần số quét', value: isPro ? '120Hz ProMotion' : '60Hz' },
          { label: 'Độ sáng tối đa', value: isPro ? '1600 nits (HDR)' : '500 nits' },
        ]},
        { title: 'Hiệu năng', items: [
          { label: 'Chip', value: chip },
          { label: 'CPU', value: isPro ? '12-core CPU' : '8-core CPU' },
          { label: 'GPU', value: isPro ? '18-core GPU' : '10-core GPU' },
          { label: 'RAM', value: ram },
          { label: 'Bộ nhớ trong', value: storage },
          { label: 'Neural Engine', value: '16-core Neural Engine' },
        ]},
        { title: 'Camera & Kết nối', items: [
          { label: 'Camera webcam', value: '1080p FaceTime HD' },
          { label: 'Wi-Fi', value: 'Wi-Fi 6E (802.11ax)' },
          { label: 'Bluetooth', value: 'Bluetooth 5.3' },
          { label: 'Cổng kết nối', value: isPro ? '3x Thunderbolt 4, HDMI, SD Card, MagSafe 3' : '2x Thunderbolt / USB 4, MagSafe 3' },
        ]},
        { title: 'Pin & Trọng lượng', items: [
          { label: 'Dung lượng pin', value: isPro ? '99.6Wh' : '52.6Wh' },
          { label: 'Thời gian sử dụng', value: isPro ? 'Lên đến 22 giờ' : 'Lên đến 18 giờ' },
          { label: 'Trọng lượng', value: isPro ? '2.14 kg' : '1.24 kg' },
          { label: 'Hệ điều hành', value: 'macOS Sequoia' },
        ]},
      ]
    };
  }

  // ── iPad ─────────────────────────────────────────────────────────────────
  if (n.includes('ipad')) {
    const isPro = n.includes('pro');
    const isAir = n.includes('air');
    const isMini = n.includes('mini');
    const chip = isPro ? 'Apple M4' : isAir ? 'Apple M2' : isMini ? 'Apple A17 Pro' : 'Apple A16';
    const screen = isPro ? '13 inch Liquid Retina XDR (OLED)' : isAir ? '13 inch Liquid Retina' : isMini ? '8.3 inch Liquid Retina' : '10.9 inch Liquid Retina';
    const storage = n.includes('512') ? '512GB' : n.includes('256') ? '256GB' : n.includes('128') ? '128GB' : '64GB';
    return {
      type: 'tablet',
      groups: [
        { title: 'Màn hình', items: [
          { label: 'Kích thước màn hình', value: screen },
          { label: 'Công nghệ màn hình', value: isPro ? 'Ultra Retina XDR OLED' : 'Liquid Retina IPS LCD' },
          { label: 'Độ phân giải', value: isPro ? '2752 x 2064 pixels' : isAir ? '2360 x 1640 pixels' : '2266 x 1488 pixels' },
          { label: 'Tần số quét', value: isPro ? '120Hz ProMotion' : '60Hz' },
          { label: 'Độ sáng tối đa', value: isPro ? '1000 nits (HDR)' : '500 nits' },
          { label: 'True Tone & P3', value: 'Hỗ trợ' },
        ]},
        { title: 'Hiệu năng', items: [
          { label: 'Chip', value: chip },
          { label: 'CPU', value: isPro ? '9-core CPU' : '8-core CPU' },
          { label: 'GPU', value: isPro ? '10-core GPU' : '9-core GPU' },
          { label: 'RAM', value: isPro ? '16GB' : '8GB' },
          { label: 'Bộ nhớ trong', value: storage },
          { label: 'Neural Engine', value: '16-core' },
        ]},
        { title: 'Camera', items: [
          { label: 'Camera sau', value: isPro ? '12MP Wide + 10MP Ultra Wide + LiDAR' : '12MP Wide' },
          { label: 'Camera trước', value: '12MP Ultra Wide (Center Stage)' },
          { label: 'Quay video', value: isPro ? '4K 60fps ProRes' : '4K 60fps' },
          { label: 'Face ID', value: isPro ? 'Hỗ trợ (ngang)' : 'Không' },
          { label: 'Touch ID', value: isPro ? 'Không' : 'Hỗ trợ (nút nguồn)' },
        ]},
        { title: 'Kết nối & Pin', items: [
          { label: 'Kết nối', value: isPro ? 'USB-C Thunderbolt 4' : 'USB-C' },
          { label: 'Wi-Fi', value: 'Wi-Fi 6E' },
          { label: 'Bluetooth', value: 'Bluetooth 5.3' },
          { label: 'Pin', value: isPro ? '10,090 mAh' : '28.65Wh' },
          { label: 'Thời gian dùng', value: 'Lên đến 10 giờ' },
          { label: 'Apple Pencil', value: isPro ? 'Apple Pencil Pro' : isAir ? 'Apple Pencil (USB-C)' : 'Apple Pencil (1st gen)' },
        ]},
      ]
    };
  }

  // ── iPhone ───────────────────────────────────────────────────────────────
  if (n.includes('iphone')) {
    const isPro = n.includes('pro');
    const isMax = n.includes('max') || n.includes('plus');
    const is17 = n.includes('17'); const is16 = n.includes('16'); const is15 = n.includes('15');
    const chip = is17 ? (isPro ? 'Apple A19 Pro' : 'Apple A19') : is16 ? (isPro ? 'Apple A18 Pro' : 'Apple A18') : 'Apple A17 Pro';
    const screen = isPro ? (isMax ? '6.9 inch Super Retina XDR ProMotion' : '6.3 inch Super Retina XDR ProMotion') : (isMax ? '6.9 inch Super Retina XDR' : '6.1 inch Super Retina XDR');
    const camera = isPro ? '48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto' : '48MP Main + 12MP Ultra Wide';
    const storage = n.includes('512') ? '512GB' : n.includes('256') ? '256GB' : n.includes('1tb') ? '1TB' : '128GB';
    return {
      type: 'phone',
      groups: [
        { title: 'Màn hình', items: [
          { label: 'Kích thước màn hình', value: screen },
          { label: 'Công nghệ màn hình', value: 'Super Retina XDR OLED' },
          { label: 'Độ phân giải', value: isPro ? '2868 x 1320 pixels' : '2796 x 1290 pixels' },
          { label: 'Tần số quét', value: isPro ? '1-120Hz ProMotion (Always-On)' : '60Hz' },
          { label: 'Độ sáng tối đa', value: isPro ? '2000 nits (ngoài trời)' : '1200 nits' },
          { label: 'Kính bảo vệ', value: 'Ceramic Shield (thế hệ 2)' },
        ]},
        { title: 'Hiệu năng', items: [
          { label: 'Chip', value: chip },
          { label: 'CPU', value: isPro ? '6-core (2 hiệu năng + 4 tiết kiệm)' : '6-core' },
          { label: 'GPU', value: isPro ? '6-core GPU' : '5-core GPU' },
          { label: 'RAM', value: isPro ? '8GB' : '8GB' },
          { label: 'Bộ nhớ trong', value: storage },
          { label: 'Neural Engine', value: '16-core (Apple Intelligence)' },
        ]},
        { title: 'Camera', items: [
          { label: 'Camera sau', value: camera },
          { label: 'Camera trước', value: '12MP TrueDepth, autofocus' },
          { label: 'Quay video', value: isPro ? '4K 120fps ProRes, Log video' : '4K 60fps' },
          { label: 'Tính năng camera', value: isPro ? 'Photographic Styles, Macro, LiDAR' : 'Photographic Styles, Action Mode' },
          { label: 'Chụp đêm', value: 'Hỗ trợ Night Mode' },
        ]},
        { title: 'Pin & Kết nối', items: [
          { label: 'Dung lượng pin', value: isMax ? '4,685 mAh' : '3,279 mAh' },
          { label: 'Sạc nhanh', value: 'Hỗ trợ 30W (USB-C)' },
          { label: 'Sạc không dây', value: 'MagSafe 25W, Qi2 15W' },
          { label: 'Kết nối', value: 'USB-C (USB 3)' },
          { label: 'SIM', value: 'Nano SIM + eSIM' },
          { label: 'Hệ điều hành', value: 'iOS 18' },
        ]},
      ]
    };
  }

  // ── Samsung Galaxy ───────────────────────────────────────────────────────
  if (n.includes('samsung') || n.includes('galaxy')) {
    const isUltra = n.includes('ultra');
    const isS = n.includes(' s') || n.includes('s2') || n.includes('s2');
    const isFold = n.includes('fold');
    const isFlip = n.includes('flip');
    const isA = n.includes(' a');
    const chip = isUltra ? 'Snapdragon 8 Elite for Galaxy' : (isS ? 'Snapdragon 8 Elite' : 'Exynos 1380');
    const screen = isUltra ? '6.9 inch QHD+ Dynamic AMOLED 2X' : isFold ? '7.6 inch QXGA+ Eco AMOLED' : '6.7 inch FHD+ Dynamic AMOLED 2X';
    const camera = isUltra ? '200MP + 50MP + 10MP + 12MP' : (isS ? '50MP + 12MP + 10MP' : '50MP + 12MP');
    const storage = n.includes('512') ? '512GB' : n.includes('256') ? '256GB' : '128GB';
    return {
      type: 'phone',
      groups: [
        { title: 'Màn hình', items: [
          { label: 'Kích thước màn hình', value: screen },
          { label: 'Công nghệ màn hình', value: 'Dynamic AMOLED 2X' },
          { label: 'Độ phân giải', value: isUltra ? '3088 x 1440 pixels (QHD+)' : '2340 x 1080 pixels (FHD+)' },
          { label: 'Tần số quét', value: isUltra || isS ? '1-120Hz (Adaptive)' : '120Hz' },
          { label: 'Độ sáng tối đa', value: isUltra ? '2600 nits' : '1750 nits' },
          { label: 'Kính bảo vệ', value: 'Corning Gorilla Glass Armor 2' },
        ]},
        { title: 'Hiệu năng', items: [
          { label: 'Chip', value: chip },
          { label: 'CPU', value: '8-core (1x3.53GHz + 5x3.0GHz + 2x2.0GHz)' },
          { label: 'GPU', value: 'Adreno 830' },
          { label: 'RAM', value: isUltra ? '12GB' : '8GB' },
          { label: 'Bộ nhớ trong', value: storage },
          { label: 'Galaxy AI', value: 'Tích hợp đầy đủ' },
        ]},
        { title: 'Camera', items: [
          { label: 'Camera sau', value: camera },
          { label: 'Camera trước', value: '12MP' },
          { label: 'Quay video', value: isUltra ? '8K 30fps, 4K 120fps' : '4K 60fps' },
          { label: 'Zoom quang học', value: isUltra ? '5x + 10x periscope' : '3x' },
          { label: 'AI Camera', value: 'ProVisual Engine, Nightography' },
        ]},
        { title: 'Pin & Kết nối', items: [
          { label: 'Dung lượng pin', value: isUltra ? '5,000 mAh' : '4,000 mAh' },
          { label: 'Sạc nhanh', value: isUltra ? '45W có dây' : '25W có dây' },
          { label: 'Sạc không dây', value: '15W Wireless, 9W Reverse' },
          { label: 'Kết nối', value: 'USB-C 3.2 Gen 1' },
          { label: 'SIM', value: 'Nano SIM + eSIM' },
          { label: 'Hệ điều hành', value: 'Android 15 / One UI 7' },
        ]},
      ]
    };
  }

  // ── Xiaomi / Redmi ───────────────────────────────────────────────────────
  if (n.includes('xiaomi') || n.includes('redmi') || n.includes('poco')) {
    const isPoco = n.includes('poco');
    const isNote = n.includes('note');
    const is14 = n.includes('14'); const is15 = n.includes('15');
    const chip = isPoco ? 'Snapdragon 8s Gen 3' : (is15 ? 'Snapdragon 8 Elite' : 'Snapdragon 8 Gen 3');
    const camera = is15 ? '50MP Light Fusion 900 + 50MP Ultra Wide + 50MP Tele' : '50MP + 12MP + 10MP';
    const storage = n.includes('512') ? '512GB' : n.includes('256') ? '256GB' : '128GB';
    const ram = n.includes('12gb') ? '12GB' : n.includes('8gb') ? '8GB' : '8GB';
    return {
      type: 'phone',
      groups: [
        { title: 'Màn hình', items: [
          { label: 'Kích thước màn hình', value: is15 ? '6.73 inch LTPO AMOLED' : '6.67 inch AMOLED' },
          { label: 'Công nghệ màn hình', value: 'LTPO AMOLED, 12-bit' },
          { label: 'Độ phân giải', value: '2712 x 1220 pixels (FHD+)' },
          { label: 'Tần số quét', value: is15 ? '1-120Hz LTPO' : '120Hz' },
          { label: 'Độ sáng tối đa', value: is15 ? '3200 nits' : '1800 nits' },
          { label: 'Kính bảo vệ', value: 'Xiaomi Shield Glass / Gorilla Glass 5' },
        ]},
        { title: 'Hiệu năng', items: [
          { label: 'Chip', value: chip },
          { label: 'CPU', value: '8-core (1x4.32GHz + 5x3.53GHz + 2x2.27GHz)' },
          { label: 'GPU', value: 'Adreno 830' },
          { label: 'RAM', value: ram },
          { label: 'Bộ nhớ trong', value: storage },
          { label: 'HyperOS', value: 'HyperOS 2 (Android 15)' },
        ]},
        { title: 'Camera', items: [
          { label: 'Camera sau', value: camera },
          { label: 'Camera trước', value: '32MP' },
          { label: 'Quay video', value: is15 ? '8K 30fps, 4K 120fps' : '4K 60fps' },
          { label: 'Zoom quang học', value: is15 ? '5x periscope' : '2x' },
          { label: 'AI Camera', value: 'Leica Imaging System' },
        ]},
        { title: 'Pin & Kết nối', items: [
          { label: 'Dung lượng pin', value: is15 ? '5,400 mAh' : '5,000 mAh' },
          { label: 'Sạc nhanh', value: is15 ? '90W HyperCharge' : '67W Turbo' },
          { label: 'Sạc không dây', value: is15 ? '50W' : '30W' },
          { label: 'Kết nối', value: 'USB-C 3.2' },
          { label: 'SIM', value: 'Nano SIM + eSIM' },
          { label: 'Hệ điều hành', value: 'HyperOS 2 (Android 15)' },
        ]},
      ]
    };
  }

  // ── OPPO ─────────────────────────────────────────────────────────────────
  if (n.includes('oppo')) {
    const isFind = n.includes('find');
    const isReno = n.includes('reno');
    const chip = isFind ? 'Snapdragon 8 Elite' : (isReno ? 'Dimensity 9300+' : 'Snapdragon 695');
    const storage = n.includes('512') ? '512GB' : n.includes('256') ? '256GB' : '128GB';
    return {
      type: 'phone',
      groups: [
        { title: 'Màn hình', items: [
          { label: 'Kích thước màn hình', value: isFind ? '6.82 inch LTPO AMOLED' : '6.7 inch AMOLED' },
          { label: 'Công nghệ màn hình', value: 'LTPO AMOLED' },
          { label: 'Độ phân giải', value: '2780 x 1264 pixels' },
          { label: 'Tần số quét', value: isFind ? '1-120Hz LTPO' : '120Hz' },
          { label: 'Độ sáng tối đa', value: isFind ? '4500 nits' : '2000 nits' },
          { label: 'Kính bảo vệ', value: 'Ceramic Shield / Gorilla Glass Victus 2' },
        ]},
        { title: 'Hiệu năng', items: [
          { label: 'Chip', value: chip },
          { label: 'RAM', value: isFind ? '16GB' : '12GB' },
          { label: 'Bộ nhớ trong', value: storage },
          { label: 'ColorOS', value: 'ColorOS 15 (Android 15)' },
          { label: 'AI', value: 'OPPO AI tích hợp' },
        ]},
        { title: 'Camera', items: [
          { label: 'Camera sau', value: isFind ? '50MP Hasselblad + 50MP + 50MP' : '50MP + 8MP + 2MP' },
          { label: 'Camera trước', value: '32MP' },
          { label: 'Quay video', value: isFind ? '4K 120fps' : '4K 30fps' },
          { label: 'AI Camera', value: 'Hasselblad Tuning' },
        ]},
        { title: 'Pin & Kết nối', items: [
          { label: 'Dung lượng pin', value: isFind ? '5,910 mAh' : '4,800 mAh' },
          { label: 'Sạc nhanh', value: isFind ? '100W SUPERVOOC' : '67W SUPERVOOC' },
          { label: 'Sạc không dây', value: isFind ? '50W AirVOOC' : 'Không' },
          { label: 'Hệ điều hành', value: 'ColorOS 15 (Android 15)' },
        ]},
      ]
    };
  }

  // ── Realme ───────────────────────────────────────────────────────────────
  if (n.includes('realme')) {
    const isGT = n.includes('gt');
    const storage = n.includes('256') ? '256GB' : '128GB';
    return {
      type: 'phone',
      groups: [
        { title: 'Màn hình', items: [
          { label: 'Kích thước màn hình', value: isGT ? '6.78 inch LTPO AMOLED' : '6.7 inch AMOLED' },
          { label: 'Công nghệ màn hình', value: 'AMOLED' },
          { label: 'Tần số quét', value: isGT ? '144Hz' : '120Hz' },
          { label: 'Độ sáng tối đa', value: isGT ? '4500 nits' : '1000 nits' },
        ]},
        { title: 'Hiệu năng', items: [
          { label: 'Chip', value: isGT ? 'Snapdragon 8 Gen 3' : 'Dimensity 9300' },
          { label: 'RAM', value: isGT ? '12GB' : '8GB' },
          { label: 'Bộ nhớ trong', value: storage },
          { label: 'Hệ điều hành', value: 'realme UI 6.0 (Android 15)' },
        ]},
        { title: 'Camera', items: [
          { label: 'Camera sau', value: isGT ? '50MP Sony IMX906 + 50MP + 8MP' : '64MP + 8MP + 2MP' },
          { label: 'Camera trước', value: '32MP' },
          { label: 'Quay video', value: '4K 60fps' },
        ]},
        { title: 'Pin & Kết nối', items: [
          { label: 'Dung lượng pin', value: isGT ? '5,000 mAh' : '5,000 mAh' },
          { label: 'Sạc nhanh', value: isGT ? '100W SuperDart' : '67W' },
          { label: 'Hệ điều hành', value: 'realme UI 6.0 (Android 15)' },
        ]},
      ]
    };
  }

  // ── Generic / Unknown ────────────────────────────────────────────────────
  const priceRange = price >= 20000000 ? 'cao cấp' : price >= 10000000 ? 'tầm trung cao' : 'tầm trung';
  return {
    type: 'phone',
    groups: [
      { title: 'Màn hình', items: [
        { label: 'Kích thước màn hình', value: '6.6 inch' },
        { label: 'Công nghệ màn hình', value: 'AMOLED' },
        { label: 'Tần số quét', value: '120Hz' },
      ]},
      { title: 'Hiệu năng', items: [
        { label: 'Phân khúc', value: `Smartphone ${priceRange}` },
        { label: 'RAM', value: '8GB' },
        { label: 'Bộ nhớ trong', value: '128GB' },
      ]},
      { title: 'Pin & Kết nối', items: [
        { label: 'Dung lượng pin', value: '5,000 mAh' },
        { label: 'Sạc nhanh', value: 'Hỗ trợ' },
        { label: 'Hệ điều hành', value: 'Android 15' },
      ]},
    ]
  };
}

// ── Tab component ────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '9px 16px', border: 'none', borderRadius: '8px',
        background: active ? '#d70018' : 'transparent',
        color: active ? '#fff' : '#555',
        fontFamily: 'inherit', fontSize: '13px', fontWeight: active ? 700 : 500,
        cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { product: null, quantity: 1, activeTab: 'overview', imgZoom: false };
  }

  render() {
    const { product, quantity, activeTab, imgZoom } = this.state;
    if (!product) return (
      <div style={{ textAlign: 'center', padding: '80px', color: '#aaa', fontSize: '16px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
        Đang tải sản phẩm...
      </div>
    );

    const specs = generateSpecs(product.name, product.price);
    const isLaptop = specs.type === 'laptop';
    const isTablet = specs.type === 'tablet';

    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 16px 48px' }}>
        <style>{`
          @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
          .spec-row:hover { background: #fff8f8 !important; }
          .detail-tab-scroll::-webkit-scrollbar { display: none; }
          .qty-btn-new:hover { background: #d70018 !important; color: #fff !important; }
          .add-cart-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(215,0,24,0.4) !important; }
        `}</style>

        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '16px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', color: '#666' }} onClick={() => this.props.navigate('/home')}>Trang chủ</span>
          <span>›</span>
          <span style={{ cursor: 'pointer', color: '#666' }} onClick={() => this.props.navigate('/product/category/' + product.category?._id)}>
            {product.category?.name}
          </span>
          <span>›</span>
          <span style={{ color: '#333', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* ── MAIN CARD ── */}
        <div style={{
          background: '#fff', borderRadius: '16px', border: '1px solid #eee',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '0' }}>

            {/* LEFT: Ảnh */}
            <div style={{ borderRight: '1px solid #f0f0f0', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', background: '#fafafa' }}>
              <div
                style={{ width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', background: '#fff', border: '1.5px solid #eee', cursor: 'zoom-in', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => this.setState({ imgZoom: !imgZoom })}
              >
                <img
                  src={'data:image/jpg;base64,' + product.image}
                  alt={product.name}
                  style={{ width: '85%', height: '85%', objectFit: 'contain', transition: 'transform 0.3s', transform: imgZoom ? 'scale(1.15)' : 'scale(1)' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                  🔍 Phóng to
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['✅ Chính hãng', '🔄 Đổi trả 30 ngày', '🚚 Freeship', '🛡️ BH 12 tháng'].map(b => (
                  <span key={b} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: '20px', padding: '4px 10px', fontSize: '11.5px', color: '#555', fontWeight: 500 }}>{b}</span>
                ))}
              </div>
            </div>

            {/* RIGHT: Info */}
            <div style={{ padding: '28px 32px' }}>
              {/* Category badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(215,0,24,0.08)', color: '#d70018', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                <span>{isLaptop ? '💻' : isTablet ? '📱' : '📱'}</span>
                {product.category?.name}
              </div>

              {/* Name */}
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.3, margin: '0 0 16px', letterSpacing: '-0.3px' }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#d70018', letterSpacing: '-1px' }}>
                  {(product.price || 0).toLocaleString('vi-VN')}₫
                </div>
                <div style={{ fontSize: '15px', color: '#bbb', textDecoration: 'line-through' }}>
                  {Math.round((product.price || 0) * 1.1).toLocaleString('vi-VN')}₫
                </div>
                <div style={{ background: '#d70018', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                  -10%
                </div>
              </div>

              {/* Trả góp */}
              <div style={{ background: 'linear-gradient(135deg, #fff8e1, #fff3cd)', border: '1px solid #fcd34d', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💳</span>
                <span><strong>Trả góp 0%</strong> — chỉ từ <strong>{Math.round((product.price || 0) / 12).toLocaleString('vi-VN')}₫/tháng</strong></span>
              </div>

              <div style={{ height: '1px', background: '#f0f0f0', margin: '0 0 20px' }} />

              {/* Quick specs 3 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {specs.groups[0]?.items.slice(0, 3).map((item, i) => (
                  <div key={i} style={{ background: '#fafafa', borderRadius: '10px', padding: '10px 12px', border: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '10.5px', color: '#aaa', fontWeight: 600, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{item.label}</div>
                    <div style={{ fontSize: '12.5px', color: '#1a1a1a', fontWeight: 700, lineHeight: 1.3 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Số lượng */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '8px' }}>Số lượng</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1.5px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden', width: 'fit-content' }}>
                  <button className="qty-btn-new" onClick={() => this.setState({ quantity: Math.max(1, quantity - 1) })}
                    style={{ width: '44px', height: '44px', border: 'none', background: '#f5f5f5', fontSize: '20px', cursor: 'pointer', fontWeight: 700, color: '#555', transition: 'all 0.15s' }}>−</button>
                  <input
                    type="number" min="1" max="99" value={quantity}
                    onChange={(e) => this.setState({ quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    style={{ width: '56px', height: '44px', border: 'none', borderLeft: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', textAlign: 'center', fontSize: '16px', fontWeight: 800, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none', background: '#fff' }}
                  />
                  <button className="qty-btn-new" onClick={() => this.setState({ quantity: Math.min(99, quantity + 1) })}
                    style={{ width: '44px', height: '44px', border: 'none', background: '#f5f5f5', fontSize: '20px', cursor: 'pointer', fontWeight: 700, color: '#555', transition: 'all 0.15s' }}>+</button>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="add-cart-btn"
                  onClick={() => this.handleAddToCart()}
                  style={{ flex: 1, padding: '14px 20px', background: 'linear-gradient(135deg, #d70018, #ff2233)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(215,0,24,0.35)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  🛒 Thêm vào giỏ hàng
                </button>
                <button
                  style={{ padding: '14px 16px', background: '#fff', color: '#d70018', border: '1.5px solid #d70018', borderRadius: '10px', fontSize: '20px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onClick={() => alert('Đã thêm vào yêu thích!')}
                >
                  🤍
                </button>
              </div>
            </div>
          </div>

          {/* ── TABS ── */}
          <div style={{ borderTop: '1px solid #f0f0f0' }}>
            {/* Tab bar */}
            <div className="detail-tab-scroll" style={{ display: 'flex', gap: '4px', padding: '12px 20px 0', overflowX: 'auto', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              <TabBtn active={activeTab === 'overview'} onClick={() => this.setState({ activeTab: 'overview' })} icon="📊" label="Tổng quan" />
              <TabBtn active={activeTab === 'specs'} onClick={() => this.setState({ activeTab: 'specs' })} icon="🔧" label="Thông số kỹ thuật" />
              <TabBtn active={activeTab === 'policy'} onClick={() => this.setState({ activeTab: 'policy' })} icon="🛡️" label="Chính sách" />
            </div>

            {/* Tab content */}
            <div style={{ padding: '24px 28px', animation: 'fadeIn 0.2s ease' }}>

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✨</span> Tính năng nổi bật
                  </h3>
                  <div style={{ background: 'linear-gradient(135deg, #fff5f5, #fff)', border: '1.5px solid #fde8e8', borderRadius: '12px', padding: '20px 24px', marginBottom: '20px' }}>
                    {specs.groups.map((group, gi) => (
                      group.items.slice(0, 2).map((item, ii) => (
                        <div key={`${gi}-${ii}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                          <span style={{ color: '#d70018', fontWeight: 800, flexShrink: 0, marginTop: '1px' }}>●</span>
                          <span style={{ fontSize: '13.5px', color: '#444', lineHeight: 1.5 }}>
                            <strong style={{ color: '#1a1a1a' }}>{item.label}:</strong> {item.value}
                          </span>
                        </div>
                      ))
                    ))}
                  </div>

                  {/* Quick spec boxes */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                    {specs.groups.flatMap(g => g.items).slice(0, 6).map((item, i) => (
                      <div key={i} style={{ background: '#fff', border: '1.5px solid #eee', borderRadius: '10px', padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>{item.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SPECS TAB */}
              {activeTab === 'specs' && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🔧</span> Thông số kỹ thuật đầy đủ
                  </h3>
                  {specs.groups.map((group, gi) => (
                    <div key={gi} style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#d70018', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '3px', height: '14px', background: '#d70018', borderRadius: '2px' }} />
                        {group.title}
                      </div>
                      <div style={{ border: '1px solid #f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                        {group.items.map((item, ii) => (
                          <div
                            key={ii}
                            className="spec-row"
                            style={{
                              display: 'grid', gridTemplateColumns: '200px 1fr',
                              borderBottom: ii < group.items.length - 1 ? '1px solid #f5f5f5' : 'none',
                              transition: 'background 0.12s',
                              background: ii % 2 === 0 ? '#fff' : '#fdfdfd',
                            }}
                          >
                            <div style={{ padding: '11px 16px', fontSize: '13px', color: '#666', fontWeight: 600, borderRight: '1px solid #f5f5f5', background: 'rgba(0,0,0,0.015)' }}>
                              {item.label}
                            </div>
                            <div style={{ padding: '11px 16px', fontSize: '13px', color: '#1a1a1a', fontWeight: 500 }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* POLICY TAB */}
              {activeTab === 'policy' && (
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 16px' }}>🛡️ Chính sách mua hàng</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                    {[
                      { icon: '✅', title: 'Hàng chính hãng 100%', desc: 'Sản phẩm nhập khẩu chính ngạch, có đầy đủ giấy tờ kiểm định' },
                      { icon: '🔄', title: 'Đổi trả trong 30 ngày', desc: 'Miễn phí đổi trả nếu sản phẩm lỗi do nhà sản xuất' },
                      { icon: '🛡️', title: 'Bảo hành 12 tháng', desc: 'Bảo hành chính hãng toàn quốc tại các trung tâm ủy quyền' },
                      { icon: '🚚', title: 'Giao hàng miễn phí', desc: 'Freeship toàn quốc cho đơn hàng từ 500.000₫' },
                      { icon: '💳', title: 'Trả góp 0% lãi suất', desc: 'Hỗ trợ trả góp qua thẻ tín dụng Visa, Mastercard, JCB' },
                      { icon: '📞', title: 'Hỗ trợ 24/7', desc: 'Hotline 1800 2097 — miễn phí, hỗ trợ cả ngày nghỉ lễ' },
                    ].map((p, i) => (
                      <div key={i} style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '24px', flexShrink: 0 }}>{p.icon}</span>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>{p.title}</div>
                          <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>{p.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    axios.get('/api/customer/products/' + this.props.params.id)
      .then((r) => this.setState({ product: r.data }));
  }

  handleAddToCart() {
    const { product, quantity } = this.state;
    if (!quantity || quantity < 1) { alert('Vui lòng nhập số lượng hợp lệ!'); return; }

    const mycart = [...this.context.mycart];
    const idx = mycart.findIndex(x => x.product._id === product._id);

    if (idx === -1) {
      mycart.push({ product, quantity });
    } else {
      mycart[idx].quantity += quantity;
    }

    this.context.setMycart(mycart);
    alert('✅ Đã thêm vào giỏ hàng!');
  }
}

export default withRouter(ProductDetail);
