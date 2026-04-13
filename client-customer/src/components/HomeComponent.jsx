import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

// ── Helpers ─────────────────────────────────────────────────────────────────
function Stars({ id = '', count = 0 }) {
  const n = count > 0 ? 5 : ((id.charCodeAt(id.length - 1) || 0) % 2 === 0 ? 5 : 4.5);
  const full = Math.floor(n);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: '11px', color: i <= full ? '#f59e0b' : i - 0.5 === n ? '#f59e0b' : '#ddd' }}>★</span>
      ))}
      <span style={{ fontSize: '10.5px', color: '#bbb', marginLeft: '2px' }}>{n}</span>
    </div>
  );
}

function DiscountBadge({ price }) {
  if (price >= 20000000) return <span style={bStyle('#7c3aed')}>Cao cấp</span>;
  if (price >= 10000000) return <span style={bStyle('#d70018')}>HOT</span>;
  if (price >= 5000000)  return <span style={bStyle('#059669')}>Phổ biến</span>;
  return <span style={bStyle('#f59e0b')}>Giá tốt</span>;
}
function bStyle(bg) {
  return { background: bg, color: '#fff', fontSize: '9.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '3px', letterSpacing: '0.3px', display: 'inline-block' };
}

// ── Product Card ──────────────────────────────────────────────────────────────
class ProductCard extends Component {
  constructor(props) { super(props); this.state = { hovered: false }; }

  render() {
    const { item, topBadge } = this.props;
    const { hovered } = this.state;

    return (
      <div
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        style={{
          background: '#fff',
          borderRadius: '10px',
          border: `1.5px solid ${hovered ? '#d70018' : '#e8e8e8'}`,
          overflow: 'hidden',
          transition: 'all 0.22s cubic-bezier(.4,0,.2,1)',
          transform: hovered ? 'translateY(-5px)' : 'none',
          boxShadow: hovered ? '0 12px 32px rgba(215,0,24,0.14)' : '0 1px 5px rgba(0,0,0,0.06)',
          display: 'flex', flexDirection: 'column',
          position: 'relative', cursor: 'pointer',
        }}
      >
        {/* Badges */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {topBadge && <span style={bStyle(topBadge.color)}>{topBadge.label}</span>}
          <DiscountBadge price={item.price} />
        </div>

        {/* Wishlist icon */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 2, width: '26px', height: '26px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
          🤍
        </div>

        {/* Image */}
        <Link to={'/product/' + item._id} style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ background: '#f9fafb', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '14px' }}>
            <img
              src={'data:image/jpeg;base64,' + item.image}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.35s', transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
            />
          </div>
        </Link>

        {/* Body */}
        <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '11px', color: '#c0c0c0', fontWeight: 600 }}>{item.category?.name}</div>

          <Link to={'/product/' + item._id} style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px' }}>
              {item.name}
            </div>
          </Link>

          <Stars id={item._id} />

          <div style={{ fontSize: '16px', fontWeight: 900, color: '#d70018', letterSpacing: '-0.3px', marginTop: '2px' }}>
            {(item.price || 0).toLocaleString()}₫
          </div>

          <Link to={'/product/' + item._id} style={{ textDecoration: 'none', marginTop: '6px' }}>
            <button style={{
              width: '100%', padding: '8px',
              borderRadius: '7px',
              border: `1.5px solid ${hovered ? 'transparent' : '#e8e8e8'}`,
              background: hovered ? '#d70018' : '#fff',
              color: hovered ? '#fff' : '#555',
              fontSize: '12.5px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif',
              transition: 'all 0.2s',
            }}>
              {hovered ? '🛒 Xem chi tiết' : 'Xem chi tiết'}
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

// ── Skeleton card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid #eee', overflow: 'hidden', minWidth: '188px', maxWidth: '188px', flex: '0 0 188px' }}>
      <div style={{ height: '188px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ padding: '10px 12px' }}>
        {[60, 90, 70, 50, 100].map((w, i) => (
          <div key={i} style={{ height: i === 3 ? 16 : 11, background: i === 3 ? '#ffe4e4' : '#f0f0f0', borderRadius: '4px', width: w + '%', marginBottom: '8px' }} />
        ))}
        <div style={{ height: '32px', background: '#f0f0f0', borderRadius: '7px' }} />
      </div>
    </div>
  );
}

// ── Section header ──────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, link, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px' }}>{icon}</span>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#1a1a1a', margin: 0, letterSpacing: '-0.3px' }}>{title}</h2>
          {sub && <div style={{ fontSize: '12px', color: '#aaa', marginTop: '1px' }}>{sub}</div>}
        </div>
        <div style={{ width: '3px', height: '22px', background: '#d70018', borderRadius: '2px' }} />
      </div>
      {link && (
        <Link to={link} style={{ fontSize: '13px', color: '#d70018', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1.5px solid #d70018', borderRadius: '20px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d70018'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d70018'; }}
        >
          Xem tất cả →
        </Link>
      )}
    </div>
  );
}

// ── Horizontal slider with arrow buttons ──────────────────────────────────────
class ProductSlider extends Component {
  constructor(props) { super(props); this.ref = React.createRef(); }

  slide(dir) {
    if (this.ref.current) this.ref.current.scrollLeft += dir * 620;
  }

  render() {
    const { items, loading, badge } = this.props;
    return (
      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <button onClick={() => this.slide(-1)} style={arrowStyle('left')}>‹</button>
        <div ref={this.ref} style={trackStyle}>
          {loading
            ? Array(7).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : items.map(item => (
              <div key={item._id} style={{ minWidth: '188px', maxWidth: '188px', flex: '0 0 188px' }}>
                <ProductCard item={item} topBadge={badge} />
              </div>
            ))
          }
        </div>
        <button onClick={() => this.slide(1)} style={arrowStyle('right')}>›</button>
      </div>
    );
  }
}

// ── Category tabs ──────────────────────────────────────────────────────────────
class CategorySection extends Component {
  constructor(props) {
    super(props);
    this.state = { cats: [], activeCat: null, catProds: [], loading: false };
    this.ref = React.createRef();
  }

  componentDidMount() {
    axios.get('/api/customer/categories').then(r => {
      const cats = r.data;
      this.setState({ cats });
      if (cats.length > 0) this.loadCat(cats[0]);
    });
  }

  loadCat(cat) {
    this.setState({ activeCat: cat._id, loading: true });
    axios.get('/api/customer/products/category/' + cat._id).then(r => {
      this.setState({ catProds: r.data.slice(0, 10), loading: false });
    }).catch(() => this.setState({ loading: false }));
  }

  render() {
    const { cats, activeCat, catProds, loading } = this.state;
    if (cats.length === 0) return null;

    return (
      <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #eee', padding: '20px', marginBottom: '28px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0', marginBottom: '16px', overflowX: 'auto', scrollbarWidth: 'none', gap: '0' }}>
          {cats.map(c => (
            <button
              key={c._id}
              onClick={() => this.loadCat(c)}
              style={{
                padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: '14px', fontWeight: 700,
                color: activeCat === c._id ? '#d70018' : '#666',
                borderBottom: `3px solid ${activeCat === c._id ? '#d70018' : 'transparent'}`,
                marginBottom: '-2px', whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div style={{ display: 'flex', gap: '14px', overflow: 'hidden' }}>
            {Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : catProds.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#ccc', fontSize: '14px' }}>Chưa có sản phẩm</div>
        ) : (
          <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
            {catProds.map(item => (
              <div key={item._id} style={{ minWidth: '188px', maxWidth: '188px', flex: '0 0 188px' }}>
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <Link to="/product" style={{ fontSize: '13px', color: '#d70018', fontWeight: 700, textDecoration: 'none' }}>
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </div>
    );
  }
}

// ── Main Home ──────────────────────────────────────────────────────────────────
class Home extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { newprods: [], hotprods: [], loading: true };
  }

  componentDidMount() {
    Promise.all([
      axios.get('/api/customer/products/new?limit=12'),
      axios.get('/api/customer/products/hot?limit=12'),
    ]).then(([nRes, hRes]) => {
      this.setState({ newprods: nRes.data, hotprods: hRes.data, loading: false });
    }).catch(() => this.setState({ loading: false }));
  }

  render() {
    const { newprods, hotprods, loading } = this.state;

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 16px 40px' }}>
        <style>{`
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
          .slider-hide::-webkit-scrollbar { display: none; }
        `}</style>

        {/* ── HERO BANNER ── */}
        <div style={{
          borderRadius: '14px', overflow: 'hidden', marginBottom: '20px',
          background: 'linear-gradient(120deg, #c8000f 0%, #900008 55%, #5a0005 100%)',
          boxShadow: '0 6px 28px rgba(215,0,24,0.28)',
          position: 'relative',
        }}>
          {/* Deco circles */}
          <div style={{ position: 'absolute', width: '320px', height: '320px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', top: '-100px', right: '140px', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: '200px', height: '200px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', bottom: '-80px', right: '50px', pointerEvents: 'none' }} />

          {/* Main row: text left + phone right */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '28px 40px 20px', position: 'relative', zIndex: 1 }}>
            {/* Left: text + buttons */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                ⚡ Ưu đãi hôm nay
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: '0 0 3px', letterSpacing: '-0.5px' }}>
                Điện thoại chính hãng
              </h1>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#ffd700', lineHeight: 1.2, marginBottom: '18px', letterSpacing: '-0.5px' }}>
                giá tốt nhất
              </div>
              {/* Buttons row */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to="/product">
                  <button className="hero-btn-white">Mua ngay →</button>
                </Link>
                <Link to="/product/search/iphone">
                  <button className="hero-btn-outline">🍎 iPhone</button>
                </Link>
                <Link to="/product/search/samsung">
                  <button className="hero-btn-outline">📱 Samsung</button>
                </Link>
                <Link to="/product/search/xiaomi">
                  <button className="hero-btn-outline">🔥 Xiaomi</button>
                </Link>
              </div>
            </div>

            {/* Right: logo image */}
            <div style={{ paddingLeft: '20px', flexShrink: 0 }}>
              <img
                src="/logo.png"
                alt="VLUPhone"
                style={{ width: '100px', height: '100px', borderRadius: '24px', objectFit: 'cover', boxShadow: '0 12px 40px rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.2)', display: 'block', animation: 'float 3s ease-in-out infinite' }}
                onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML='<span style="font-size:96px;display:block;filter:drop-shadow(0 8px 20px rgba(0,0,0,0.35));line-height:1">📱</span>'; }}
              />
            </div>
          </div>

          {/* Promo chips row — separate row BELOW buttons, never overlaps */}
          <div style={{ display: 'flex', gap: '8px', padding: '0 40px 16px', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
            {['🚚 Freeship toàn quốc', '🔄 Đổi trả 30 ngày', '✅ Chính hãng 100%', '💳 Trả góp 0%'].map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.9)', fontSize: '11.5px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── 4 PROMO CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { bg: 'linear-gradient(135deg,#1a56db,#3b82f6)', icon: '💳', t: 'Trả góp 0%', s: '12 tháng không lãi suất', link: '/product' },
            { bg: 'linear-gradient(135deg,#059669,#10b981)', icon: '🔄', t: 'Thu cũ đổi mới', s: 'Lên đời tiết kiệm hơn', link: '/product' },
            { bg: 'linear-gradient(135deg,#d97706,#f59e0b)', icon: '🎁', t: 'Khuyến mãi', s: 'Giảm đến 30% hôm nay', link: '/product' },
            { bg: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', icon: '🛡️', t: 'Bảo hành 12 tháng', s: 'Hỗ trợ tận nhà', link: '/product' },
          ].map(b => (
            <Link key={b.t} to={b.link} style={{ textDecoration: 'none' }}>
              <div
                style={{ background: b.bg, borderRadius: '10px', padding: '14px 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }}
              >
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>{b.t}</div>
                  <div style={{ fontSize: '11.5px', opacity: 0.85, marginTop: '2px' }}>{b.s}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── SẢN PHẨM MỚI ── */}
        <SectionHeader icon="✨" title="Sản phẩm mới nhất" link="/product" sub="Cập nhật liên tục mỗi ngày" />
        <ProductSlider items={newprods} loading={loading} badge={{ label: 'MỚI', color: '#059669' }} />

        {/* ── DANH MỤC TAB ── */}
        <SectionHeader icon="📋" title="Sản phẩm theo danh mục" sub="Khám phá theo hãng yêu thích" />
        <CategorySection />

        {/* ── BÁN CHẠY NHẤT ── */}
        {(loading || hotprods.length > 0) && (
          <>
            <SectionHeader icon="🔥" title="Bán chạy nhất" link="/product" sub="Được khách hàng tin tưởng" />
            <ProductSlider items={hotprods} loading={loading} badge={{ label: 'HOT', color: '#d70018' }} />
          </>
        )}

        {/* ── BOTTOM BANNER ── */}
        <div style={{ borderRadius: '12px', background: 'linear-gradient(120deg,#1a1f2e 0%,#2d3556 100%)', padding: '28px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
              Tải ứng dụng
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>PhoneShop Mobile App</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '14px' }}>
              Mua sắm nhanh hơn, nhận thông báo ưu đãi trực tiếp
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['🍎 App Store', '▶️ Google Play'].map(s => (
                <div key={s} style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.85 }}>
            <img
              src="/logo.png"
              alt="VLUPhone"
              style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.15)' }}
              onError={e => { e.target.style.display='none'; }}
            />
          </div>
        </div>

      </div>
    );
  }
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const trackStyle = {
  display: 'flex', gap: '14px',
  overflowX: 'auto', scrollBehavior: 'smooth',
  paddingBottom: '6px', paddingTop: '4px',
  scrollbarWidth: 'none', msOverflowStyle: 'none',
};

const arrowStyle = (side) => ({
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  [side]: '-15px',
  width: '32px', height: '32px',
  background: '#fff', border: '1.5px solid #e0e0e0', borderRadius: '50%',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  fontSize: '18px', fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 10, transition: 'all 0.2s', color: '#555', lineHeight: 1,
});

export default Home;
