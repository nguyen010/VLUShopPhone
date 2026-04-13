import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import axios from 'axios';
import MyContext from '../contexts/MyContext';

// ── SVG Icons ──────────────────────────────────────────────────────────────
function IconPhone({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
}
function IconTablet({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
}
function IconLaptop({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="13" rx="2"/><path d="M1 21h22"/>
    </svg>
  );
}
function IconApple({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}
function IconSamsung({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <circle cx="12" cy="18.5" r="1" fill={color} stroke="none"/>
      <line x1="9" y1="6" x2="15" y2="6"/>
    </svg>
  );
}
function IconXiaomi({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <rect x="9" y="5" width="6" height="3" rx="1" fill={color} stroke="none"/>
      <circle cx="12" cy="18.5" r="1" fill={color} stroke="none"/>
    </svg>
  );
}
function IconOppo({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="3"/>
      <circle cx="12" cy="6" r="1.5" fill={color} stroke="none"/>
      <circle cx="12" cy="18.5" r="1" fill={color} stroke="none"/>
    </svg>
  );
}
function IconRealme({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <path d="M9 7h4a2 2 0 0 1 0 4H9" stroke={color}/>
      <circle cx="12" cy="18.5" r="1" fill={color} stroke="none"/>
    </svg>
  );
}

function getCatIcon(name = '', size = 16, color = 'currentColor') {
  const n = name.toLowerCase();
  if (n.includes('ipad') || n.includes('tablet')) return <IconTablet size={size} color={color} />;
  if (n.includes('macbook') || n.includes('laptop')) return <IconLaptop size={size} color={color} />;
  if (n.includes('iphone') || n.includes('apple')) return <IconApple size={size} color={color} />;
  if (n.includes('samsung')) return <IconSamsung size={size} color={color} />;
  if (n.includes('xiaomi') || n.includes('redmi')) return <IconXiaomi size={size} color={color} />;
  if (n.includes('oppo')) return <IconOppo size={size} color={color} />;
  if (n.includes('realme')) return <IconRealme size={size} color={color} />;
  return <IconPhone size={size} color={color} />;
}

// ── Mobile Bottom Nav ──────────────────────────────────────────────────────
function MobileBottomNav({ cartCount, navigate }) {
  const path = window.location.pathname;
  const active = (p) => path === p || path.startsWith(p + '/');

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-inner">
        <Link to="/home" className={`mobile-nav-btn${active('/home') ? ' active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Trang chủ
        </Link>

        <Link to="/product" className={`mobile-nav-btn${active('/product') ? ' active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          Sản phẩm
        </Link>

        <Link to="/mycart" className={`mobile-nav-btn${active('/mycart') ? ' active' : ''}`} style={{ position: 'relative' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span className="mobile-nav-cart-badge">{cartCount}</span>
          )}
          Giỏ hàng
        </Link>

        <Link to="/myorders" className={`mobile-nav-btn${active('/myorders') ? ' active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Đơn hàng
        </Link>

        <Link to="/myprofile" className={`mobile-nav-btn${active('/myprofile') ? ' active' : ''}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Tài khoản
        </Link>
      </div>
    </nav>
  );
}

// ── Mobile Drawer ──────────────────────────────────────────────────────────
function MobileDrawer({ open, onClose, categories, customer, token, onLogout, navigate }) {
  if (!open) return null;

  return (
    <>
      <div className="mobile-menu-overlay" onClick={onClose} />
      <div className="mobile-drawer">
        {/* Header */}
        <div className="mobile-drawer-header">
          <Link to="/home" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/logo.png" alt="VLUPhone"
              style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>VLUPhone</span>
          </Link>
          <button className="mobile-drawer-close" onClick={onClose}>✕</button>
        </div>

        {/* User info */}
        {token !== '' && customer && (
          <div style={{ padding: '14px 16px', background: '#fff5f5', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#d70018', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {(customer.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#1a1a1a' }}>{customer.name}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{customer.email}</div>
            </div>
          </div>
        )}

        {/* Danh mục */}
        <div className="mobile-drawer-section">
          <div className="mobile-drawer-label">Danh mục sản phẩm</div>
          {categories.map(cat => (
            <Link key={cat._id} to={'/product/category/' + cat._id} className="mobile-drawer-link" onClick={onClose}>
              <span className="icon" style={{ background: '#fff0f0' }}>
                {getCatIcon(cat.name, 18, '#d70018')}
              </span>
              {cat.name}
            </Link>
          ))}
          <Link to="/product" className="mobile-drawer-link" onClick={onClose}>
            <span className="icon">📋</span>
            Tất cả sản phẩm
          </Link>
        </div>

        {/* Lọc giá */}
        <div className="mobile-drawer-section">
          <div className="mobile-drawer-label">Lọc theo giá</div>
          {[
            { label: 'Dưới 3 triệu', to: '/product/price/0/3000000' },
            { label: 'Từ 3 - 7 triệu', to: '/product/price/3000000/7000000' },
            { label: 'Từ 7 - 13 triệu', to: '/product/price/7000000/13000000' },
            { label: 'Trên 13 triệu', to: '/product/price/13000000/999999999' },
          ].map(p => (
            <Link key={p.to} to={p.to} className="mobile-drawer-link" onClick={onClose}>
              <span className="icon">💰</span>
              {p.label}
            </Link>
          ))}
        </div>

        {/* Tài khoản */}
        <div className="mobile-drawer-section">
          <div className="mobile-drawer-label">Tài khoản</div>
          {token === '' ? (
            <>
              <Link to="/login" className="mobile-drawer-link" onClick={onClose}>
                <span className="icon">🔑</span> Đăng nhập
              </Link>
              <Link to="/signup" className="mobile-drawer-link" onClick={onClose}>
                <span className="icon">📝</span> Đăng ký
              </Link>
            </>
          ) : (
            <>
              <Link to="/myprofile" className="mobile-drawer-link" onClick={onClose}>
                <span className="icon">👤</span> Thông tin cá nhân
              </Link>
              <Link to="/myorders" className="mobile-drawer-link" onClick={onClose}>
                <span className="icon">📦</span> Đơn hàng của tôi
              </Link>
              <div className="mobile-drawer-link" onClick={() => { onLogout(); onClose(); }}
                style={{ color: '#d70018' }}>
                <span className="icon" style={{ background: '#fff0f0' }}>🚪</span>
                Đăng xuất
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

class Menu extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtKeyword: '',
      categories: [],
      megaOpen: false,
      hoveredCat: null,
      closeTimer: null,
      drawerOpen: false,
    };
    this.megaRef = React.createRef();
  }

  getSubItems(cat) {
    const n = (cat.name || '').toLowerCase();
    if (n.includes('iphone') || n.includes('apple')) return [
      { label: 'iPhone 17 Pro Max', to: '/product/search/iphone 17 pro max', badge: 'HOT' },
      { label: 'iPhone 17 Pro', to: '/product/search/iphone 17 pro', badge: 'HOT' },
      { label: 'iPhone 17', to: '/product/search/iphone 17', badge: 'MỚI' },
      { label: 'iPhone 16 Series', to: '/product/search/iphone 16' },
      { label: 'iPhone 15 Series', to: '/product/search/iphone 15' },
      { label: 'iPhone SE', to: '/product/search/iphone se' },
    ];
    if (n.includes('samsung')) return [
      { label: 'Galaxy S26 Ultra', to: '/product/search/galaxy s26', badge: 'MỚI' },
      { label: 'Galaxy S25 Series', to: '/product/search/galaxy s25', badge: 'HOT' },
      { label: 'Galaxy A Series', to: '/product/search/galaxy a' },
      { label: 'Galaxy Z Fold', to: '/product/search/galaxy z fold' },
      { label: 'Galaxy Z Flip', to: '/product/search/galaxy z flip' },
    ];
    if (n.includes('xiaomi') || n.includes('redmi')) return [
      { label: 'Xiaomi 15 Series', to: '/product/search/xiaomi 15', badge: 'MỚI' },
      { label: 'Xiaomi 14 Series', to: '/product/search/xiaomi 14' },
      { label: 'Redmi Note Series', to: '/product/search/redmi note', badge: 'HOT' },
      { label: 'POCO Series', to: '/product/search/poco' },
    ];
    if (n.includes('oppo')) return [
      { label: 'OPPO Find X', to: '/product/search/oppo find', badge: 'HOT' },
      { label: 'OPPO Reno', to: '/product/search/oppo reno', badge: 'MỚI' },
      { label: 'OPPO A Series', to: '/product/search/oppo a' },
    ];
    if (n.includes('ipad') || n.includes('tablet')) return [
      { label: 'iPad Pro', to: '/product/search/ipad pro', badge: 'HOT' },
      { label: 'iPad Air', to: '/product/search/ipad air', badge: 'MỚI' },
      { label: 'iPad mini', to: '/product/search/ipad mini' },
    ];
    if (n.includes('macbook') || n.includes('laptop')) return [
      { label: 'MacBook Pro', to: '/product/search/macbook pro', badge: 'HOT' },
      { label: 'MacBook Air M3', to: '/product/search/macbook air m3' },
      { label: 'MacBook Air M4', to: '/product/search/macbook air m4', badge: 'MỚI' },
    ];
    if (n.includes('realme')) return [
      { label: 'Realme GT Series', to: '/product/search/realme gt', badge: 'HOT' },
      { label: 'Realme C Series', to: '/product/search/realme c' },
    ];
    return [
      { label: `${cat.name} mới nhất`, to: '/product/category/' + cat._id, badge: 'MỚI' },
      { label: `${cat.name} bán chạy`, to: '/product/category/' + cat._id, badge: 'HOT' },
    ];
  }

  openMega() {
    if (this.state.closeTimer) clearTimeout(this.state.closeTimer);
    this.setState({ megaOpen: true });
  }
  closeMega() {
    const t = setTimeout(() => this.setState({ megaOpen: false, hoveredCat: null }), 160);
    this.setState({ closeTimer: t });
  }
  cancelClose() {
    if (this.state.closeTimer) clearTimeout(this.state.closeTimer);
  }

  handleSearch(e) {
    e.preventDefault();
    const kw = this.state.txtKeyword.trim();
    if (kw) {
      this.props.navigate('/product/search/' + kw);
      this.setState({ txtKeyword: '' });
    }
  }

  handleLogout() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }

  componentDidMount() {
    axios.get('/api/customer/categories').then(res => this.setState({ categories: res.data }));
  }

  componentWillUnmount() {
    if (this.state.closeTimer) clearTimeout(this.state.closeTimer);
  }

  render() {
    const { customer, token, mycart } = this.context;
    const { categories, megaOpen, hoveredCat, txtKeyword, drawerOpen } = this.state;
    const activeCat = hoveredCat ? categories.find(c => c._id === hoveredCat) : null;

    const makePriceTo = (min, max) => {
      const base = `/product/price/${min}/${max}`;
      return hoveredCat ? `${base}?cid=${hoveredCat}` : base;
    };
    const PRICE_ITEMS = [
      { label: 'Dưới 3 triệu',     to: makePriceTo(0, 3000000) },
      { label: 'Từ 3 - 7 triệu',   to: makePriceTo(3000000, 7000000) },
      { label: 'Từ 7 - 13 triệu',  to: makePriceTo(7000000, 13000000) },
      { label: 'Từ 13 - 20 triệu', to: makePriceTo(13000000, 20000000) },
      { label: 'Trên 20 triệu',    to: makePriceTo(20000000, 0) },
    ];

    return (
      <>
        <header style={{
          background: 'linear-gradient(135deg, #c8000f 0%, #a8000c 100%)',
          position: 'sticky', top: 0, zIndex: 200,
          boxShadow: '0 2px 16px rgba(160,0,10,0.4)',
        }}>
          <style>{`
            @keyframes megaDrop { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
            .mnu-search::placeholder { color: #999; }
            .mnu-search:focus { outline: none; }
            .mnu-catlink { display:flex;align-items:center;gap:6px;padding:7px 12px;color:rgba(255,255,255,0.92);font-size:13px;font-weight:600;white-space:nowrap;text-decoration:none;border-radius:6px;transition:background 0.15s;cursor:pointer;font-family:inherit; }
            .mnu-catlink:hover,.mnu-catlink:focus { background:rgba(255,255,255,0.16);color:#fff; }
            .mnu-userlink { color:rgba(255,255,255,0.88);text-decoration:none;font-size:13px;font-weight:500;white-space:nowrap;transition:color 0.15s;padding:4px 2px; }
            .mnu-userlink:hover { color:#fff; }
            /* Hide desktop elements on mobile */
            @media(max-width:600px){
              .desktop-only { display:none !important; }
              .mobile-search-form { max-width:100% !important; margin-right:8px !important; }
            }
            @media(min-width:601px){
              .mobile-hamburger { display:none !important; }
            }
          `}</style>

          <div style={{
            maxWidth: '1440px', margin: '0 auto',
            display: 'flex', alignItems: 'center',
            padding: '0 12px', height: '56px', gap: '0',
          }}>

            {/* ── MOBILE: Hamburger ── */}
            <button
              className="mobile-hamburger"
              onClick={() => this.setState({ drawerOpen: true })}
              style={{
                background: 'rgba(0,0,0,0.15)', border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: '8px', width: '38px', height: '38px',
                color: '#fff', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px',
              }}
            >
              <svg width="17" height="14" viewBox="0 0 18 14" fill="none">
                <rect y="0" width="18" height="2.2" rx="1.1" fill="white"/>
                <rect y="5.9" width="18" height="2.2" rx="1.1" fill="white"/>
                <rect y="11.8" width="18" height="2.2" rx="1.1" fill="white"/>
              </svg>
            </button>

            {/* ── LOGO ── */}
            <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '7px', textDecoration: 'none', flexShrink: 0, marginRight: '14px' }}>
              <img src="/logo.png" alt="VLUPhone"
                style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-0.4px', lineHeight: 1 }}>VLUPhone</span>
            </Link>

            {/* ── DESKTOP: Danh mục dropdown ── */}
            <div ref={this.megaRef} className="desktop-only" style={{ position: 'relative', flexShrink: 0, marginRight: '14px' }}
              onMouseEnter={() => this.openMega()}
              onMouseLeave={() => this.closeMega()}
            >
              <button style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: megaOpen ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.15)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                borderRadius: '8px', padding: '7px 14px',
                color: '#fff', fontFamily: 'Be Vietnam Pro, sans-serif',
                fontWeight: 700, fontSize: '13.5px', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'background 0.15s', height: '38px',
              }}>
                <svg width="15" height="13" viewBox="0 0 18 14" fill="none">
                  <rect y="0" width="18" height="2.2" rx="1.1" fill="white"/>
                  <rect y="5.9" width="18" height="2.2" rx="1.1" fill="white"/>
                  <rect y="11.8" width="18" height="2.2" rx="1.1" fill="white"/>
                </svg>
                Danh mục
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ transition: 'transform 0.2s', transform: megaOpen ? 'rotate(180deg)' : 'none' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {megaOpen && (
                <div
                  onMouseEnter={() => this.cancelClose()}
                  onMouseLeave={() => this.closeMega()}
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                    background: '#fff', borderRadius: '14px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
                    border: '1px solid #eee',
                    display: 'grid', gridTemplateColumns: '190px 170px 230px',
                    minWidth: '590px', zIndex: 9999, overflow: 'hidden',
                    animation: 'megaDrop 0.15s ease',
                  }}
                >
                  {/* Col 1 */}
                  <div style={{ borderRight: '1px solid #f3f3f3', paddingBottom: '8px' }}>
                    <div style={{ padding: '12px 16px 6px', fontSize: '10px', fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Hãng điện thoại</div>
                    {categories.map(cat => (
                      <div key={cat._id} onMouseEnter={() => { this.cancelClose(); this.setState({ hoveredCat: cat._id }); }}>
                        <Link to={'/product/category/' + cat._id}
                          onClick={() => this.setState({ megaOpen: false, hoveredCat: null })}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '9px 16px', textDecoration: 'none',
                            fontSize: '13.5px', fontWeight: hoveredCat === cat._id ? 700 : 500,
                            color: hoveredCat === cat._id ? '#d70018' : '#333',
                            background: hoveredCat === cat._id ? '#fff5f5' : 'transparent',
                            borderLeft: `3px solid ${hoveredCat === cat._id ? '#d70018' : 'transparent'}`,
                            transition: 'all 0.1s',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                            <span style={{ display:'flex', alignItems:'center', color: hoveredCat === cat._id ? '#d70018' : '#999' }}>
                              {getCatIcon(cat.name, 17, hoveredCat === cat._id ? '#d70018' : '#999')}
                            </span>
                            {cat.name}
                          </span>
                          <span style={{ color: '#ddd', fontSize: '13px' }}>›</span>
                        </Link>
                      </div>
                    ))}
                    <div style={{ height: '1px', background: '#f3f3f3', margin: '6px 0' }} />
                    <Link to="/product" onClick={() => this.setState({ megaOpen: false })}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', textDecoration: 'none', color: '#d70018', fontSize: '13px', fontWeight: 700 }}>
                      📋 Tất cả sản phẩm
                    </Link>
                  </div>

                  {/* Col 2 */}
                  <div style={{ borderRight: '1px solid #f3f3f3', paddingBottom: '8px' }}>
                    <div style={{ padding: '12px 16px 6px', fontSize: '10px', fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Mức giá</div>
                    {PRICE_ITEMS.map(p => (
                      <Link key={p.to} to={p.to} onClick={() => this.setState({ megaOpen: false })}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', textDecoration: 'none', color: '#444', fontSize: '13px', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontSize: '14px' }}>💰</span> {p.label}
                      </Link>
                    ))}
                  </div>

                  {/* Col 3 */}
                  <div style={{ background: '#fafafa', paddingBottom: '8px', minHeight: '200px' }}>
                    {activeCat ? (
                      <>
                        <div style={{ padding: '12px 16px 6px', fontSize: '10px', fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '1.2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#d70018' }}>{getCatIcon(activeCat.name, 13, '#d70018')}</span>
                          {activeCat.name}
                        </div>
                        {this.getSubItems(activeCat).map((sub, i) => (
                          <Link key={i} to={sub.to}
                            onClick={() => this.setState({ megaOpen: false, hoveredCat: null })}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', textDecoration: 'none', color: '#444', fontSize: '13px', transition: 'background 0.1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#eeeeee'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span>{sub.label}</span>
                            {sub.badge && (
                              <span style={{ background: sub.badge === 'HOT' ? '#d70018' : '#00a650', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>{sub.badge}</span>
                            )}
                          </Link>
                        ))}
                        <div style={{ margin: '8px 16px 0', paddingTop: '8px', borderTop: '1px dashed #e0e0e0' }}>
                          <Link to={'/product/category/' + activeCat._id}
                            onClick={() => this.setState({ megaOpen: false, hoveredCat: null })}
                            style={{ fontSize: '12.5px', color: '#d70018', fontWeight: 700, textDecoration: 'none' }}>
                            Xem tất cả {activeCat.name} →
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', color: '#ccc' }}>
                        <span style={{ opacity: 0.3, marginBottom: '8px' }}>{getCatIcon('phone', 34, '#bbb')}</span>
                        <span style={{ fontSize: '12px' }}>Hover vào hãng để xem</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── SEARCH BOX ── */}
            <form className="mobile-search-form" onSubmit={e => this.handleSearch(e)}
              style={{ flex: 1, display: 'flex', maxWidth: '700px', marginRight: '14px' }}>
              <input
                className="mnu-search"
                type="text"
                placeholder="Tìm kiếm điện thoại..."
                value={txtKeyword}
                onChange={e => this.setState({ txtKeyword: e.target.value })}
                style={{
                  flex: 1, padding: '9px 12px',
                  border: 'none', borderRadius: '8px 0 0 8px',
                  fontSize: '14px', fontFamily: 'Be Vietnam Pro, sans-serif',
                  outline: 'none', background: '#fff', color: '#1a1a1a',
                  minWidth: 0,
                }}
              />
              <button type="submit" style={{
                padding: '9px 14px', background: '#8a0009',
                border: 'none', borderRadius: '0 8px 8px 0',
                color: '#fff', fontSize: '16px', cursor: 'pointer',
                transition: 'background 0.15s', flexShrink: 0,
              }}>🔍</button>
            </form>

            {/* ── DESKTOP: User + Cart ── */}
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', flexShrink: 0 }}>
              {token === '' ? (
                <>
                  <Link to="/login" className="mnu-userlink">Đăng nhập</Link>
                  <Link to="/signup" className="mnu-userlink">Đăng ký</Link>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0,
                    }}>
                      {(customer?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {customer?.name}
                    </span>
                  </div>
                  <Link to="/myprofile" className="mnu-userlink">Tài khoản</Link>
                  <Link to="/myorders" className="mnu-userlink">Đơn hàng</Link>
                  <Link to="/home" className="mnu-userlink" onClick={() => this.handleLogout()}>Đăng xuất</Link>
                </>
              )}
              <Link to="/mycart" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(0,0,0,0.18)', border: '1.5px solid rgba(255,255,255,0.2)',
                padding: '7px 12px', borderRadius: '8px', height: '38px',
                textDecoration: 'none', color: '#fff', fontSize: '13.5px', fontWeight: 700,
                transition: 'background 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.28)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.18)'}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span style={{
                  background: '#fff', color: '#d70018', fontWeight: 800, fontSize: '11px',
                  minWidth: '18px', height: '18px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: '0 2px',
                }}>
                  {mycart.length}
                </span>
              </Link>
            </div>

          </div>
        </header>

        {/* ── Mobile Drawer ── */}
        <MobileDrawer
          open={drawerOpen}
          onClose={() => this.setState({ drawerOpen: false })}
          categories={categories}
          customer={customer}
          token={token}
          onLogout={() => this.handleLogout()}
          navigate={this.props.navigate}
        />

        {/* ── Mobile Bottom Navigation ── */}
        <MobileBottomNav cartCount={mycart.length} navigate={this.props.navigate} />
      </>
    );
  }
}

export default withRouter(Menu);
