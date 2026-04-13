import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

function Stars({ id = '' }) {
  const n = (id.charCodeAt(id.length - 1) % 2 === 0) ? 5 : 4.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '5px' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: '11px', color: i <= Math.floor(n) ? '#f59e0b' : '#e0e0e0' }}>★</span>
      ))}
      <span style={{ fontSize: '11px', color: '#aaa', marginLeft: '2px' }}>{n}</span>
    </div>
  );
}

class ProductCard extends Component {
  constructor(props) { super(props); this.state = { hover: false }; }
  render() {
    const { item } = this.props;
    const { hover } = this.state;
    return (
      <div
        onMouseEnter={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
        style={{
          background: '#fff', borderRadius: '10px',
          border: `1.5px solid ${hover ? '#d70018' : '#e8e8e8'}`,
          overflow: 'hidden', transition: 'all 0.22s',
          transform: hover ? 'translateY(-4px)' : 'none',
          boxShadow: hover ? '0 8px 28px rgba(215,0,24,0.13)' : '0 1px 4px rgba(0,0,0,0.06)',
          display: 'flex', flexDirection: 'column', position: 'relative',
        }}
      >
        <Link to={'/product/' + item._id} style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ background: '#fafafa', padding: '14px 12px', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img
              src={'data:image/jpg;base64,' + item.image}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s', transform: hover ? 'scale(1.07)' : 'scale(1)' }}
            />
          </div>
        </Link>
        <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '11px', color: '#bbb', marginBottom: '3px', fontWeight: 500 }}>{item.category?.name}</div>
          <Link to={'/product/' + item._id} style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.4, marginBottom: '5px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px' }}>
              {item.name}
            </div>
          </Link>
          <Stars id={item._id} />
          <div style={{ fontSize: '15px', fontWeight: 900, color: '#d70018', letterSpacing: '-0.3px', marginBottom: '10px' }}>
            {(item.price || 0).toLocaleString()}₫
          </div>
          <Link to={'/product/' + item._id} style={{ marginTop: 'auto', textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '8px', borderRadius: '7px',
              border: `1.5px solid ${hover ? '#d70018' : '#e0e0e0'}`,
              background: hover ? '#d70018' : '#fff',
              color: hover ? '#fff' : '#555',
              fontSize: '12.5px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif',
              transition: 'all 0.2s',
            }}>
              {hover ? '🛒 Xem chi tiết' : 'Xem chi tiết'}
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

// ── Sort Bar — chỉ hiện khi có sản phẩm và đang xem theo category/keyword ──
function SortBar({ sort, onSort, count }) {
  const SORTS = [
    { key: 'default', label: '⭐ Phổ biến' },
    { key: 'price_asc',  label: '↑ Giá Thấp - Cao' },
    { key: 'price_desc', label: '↓ Giá Cao - Thấp' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginRight: '4px' }}>Sắp xếp theo:</span>
      {SORTS.map(s => (
        <button
          key={s.key}
          onClick={() => onSort(s.key)}
          style={{
            padding: '7px 14px',
            border: sort === s.key ? '1.5px solid #d70018' : '1.5px solid #e0e0e0',
            borderRadius: '20px',
            background: sort === s.key ? '#d70018' : '#fff',
            color: sort === s.key ? '#fff' : '#444',
            fontSize: '12.5px', fontWeight: sort === s.key ? 700 : 500,
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {s.label}
        </button>
      ))}
      <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#aaa' }}>{count} sản phẩm</span>
    </div>
  );
}

function applySortedProducts(products, sort) {
  const arr = [...products];
  if (sort === 'price_asc') arr.sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sort === 'price_desc') arr.sort((a, b) => (b.price || 0) - (a.price || 0));
  // 'default' giữ nguyên thứ tự từ server
  return arr;
}

class Product extends Component {
  constructor(props) {
    super(props);
    // showSort: true khi xem theo category hoặc keyword, false khi xem tất cả
    this.state = { products: [], loading: true, title: 'Tất cả sản phẩm', sort: 'default', showSort: false };
  }

  render() {
    const { products, loading, title, sort, showSort } = this.state;
    const displayed = showSort ? applySortedProducts(products, sort) : products;

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px 40px' }}>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: showSort ? '12px' : '20px' }}>
          <span style={{ fontSize: '20px' }}>📱</span>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>{title}</h2>
          <div style={{ width: '4px', height: '20px', background: '#d70018', borderRadius: '2px', marginLeft: '4px' }} />
        </div>

        {/* Sort bar — chỉ khi showSort = true và có sản phẩm */}
        {showSort && !loading && products.length > 0 && (
          <SortBar sort={sort} onSort={s => this.setState({ sort: s })} count={products.length} />
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '14px' }}>
            {Array(10).fill(0).map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '10px', border: '1.5px solid #eee', overflow: 'hidden' }}>
                <div style={{ height: '175px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
                <div style={{ padding: '10px' }}>
                  <div style={{ height: '10px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '6px', width: '60%' }} />
                  <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '6px' }} />
                  <div style={{ height: '14px', background: '#ffe0e0', borderRadius: '4px', width: '50%', marginBottom: '8px' }} />
                  <div style={{ height: '30px', background: '#f0f0f0', borderRadius: '6px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#aaa', background: '#fff', borderRadius: '12px', border: '1.5px dashed #eee' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>🔍</div>
            <p style={{ fontSize: '14px' }}>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '14px' }}>
            {displayed.map(item => <ProductCard key={item._id} item={item} />)}
          </div>
        )}
      </div>
    );
  }

  getCidFromLocation() {
    const search = this.props.location?.search || '';
    const p = new URLSearchParams(search);
    return p.get('cid') || null;
  }

  componentDidMount() {
    const params = this.props.params;
    const cidFilter = this.getCidFromLocation();
    if (params.cid) {
      this.setState({ showSort: true });
      this.apiGetByCat(params.cid);
    } else if (params.min !== undefined && params.max !== undefined) {
      this.setState({ showSort: true });
      this.apiGetAll(params.min, params.max, cidFilter);
    } else if (params.keyword) {
      this.setState({ showSort: true });
      this.apiGetByKeyword(params.keyword);
    } else {
      this.setState({ showSort: false });
      this.apiGetAll();
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    const prev = prevProps.params || {};
    const cidFilter = this.getCidFromLocation();
    const prevCid = new URLSearchParams(prevProps.location?.search || '').get('cid');

    if (params.cid && params.cid !== prev.cid) {
      this.setState({ loading: true, sort: 'default', showSort: true });
      this.apiGetByCat(params.cid);
    } else if (params.min !== undefined && (params.min !== prev.min || params.max !== prev.max || cidFilter !== prevCid)) {
      this.setState({ loading: true, sort: 'default', showSort: true });
      this.apiGetAll(params.min, params.max, cidFilter);
    } else if (params.keyword && params.keyword !== prev.keyword) {
      this.setState({ loading: true, sort: 'default', showSort: true });
      this.apiGetByKeyword(params.keyword);
    } else if (!params.cid && !params.min && !params.keyword && (prev.cid || prev.min || prev.keyword)) {
      this.setState({ loading: true, sort: 'default', showSort: false });
      this.apiGetAll();
    }
  }

  apiGetAll(minStr, maxStr, cidFilter) {
    if (minStr !== undefined && maxStr !== undefined) {
      const min = Number(minStr);
      const max = Number(maxStr);
      let priceLabel = '';
      if (max === 0) priceLabel = `trên ${(min / 1000000).toFixed(0)} triệu`;
      else if (min === 0) priceLabel = `dưới ${(max / 1000000).toFixed(0)} triệu`;
      else priceLabel = `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(0)} triệu`;

      const url = cidFilter
        ? `/api/customer/products/price/${min}/${max}?cid=${cidFilter}`
        : `/api/customer/products/price/${min}/${max}`;

      axios.get(url).then(r => {
        // If filtered by category, get category name from first product
        const catName = cidFilter && r.data[0]?.category?.name ? r.data[0].category.name : '';
        const title = catName ? `${catName} ${priceLabel}` : `Sản phẩm ${priceLabel}`;
        this.setState({ products: r.data, loading: false, title });
      }).catch(() => this.setState({ loading: false }));
    } else {
      axios.get('/api/customer/products')
        .then(r => this.setState({ products: r.data, loading: false, title: 'Tất cả sản phẩm' }))
        .catch(() => this.setState({ loading: false }));
    }
  }

  apiGetByCat(cid) {
    axios.get('/api/customer/products/category/' + cid)
      .then(r => this.setState({ products: r.data, loading: false, title: r.data[0]?.category?.name || 'Danh mục sản phẩm' }))
      .catch(() => this.setState({ loading: false }));
  }

  apiGetByKeyword(kw) {
    axios.get('/api/customer/products/search/' + kw)
      .then(r => this.setState({ products: r.data, loading: false, title: `Kết quả: "${kw}"` }))
      .catch(() => this.setState({ loading: false }));
  }
}

export default withRouter(Product);
