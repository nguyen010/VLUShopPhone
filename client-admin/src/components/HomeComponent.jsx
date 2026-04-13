import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

// ── Mini Sparkline Bar Chart ─────────────────────────────────────────────────
function SparkBars({ data = [], color = '#d70018' }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '36px' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: '3px 3px 0 0',
          background: i === data.length - 1 ? color : color + '55',
          height: `${Math.max(4, (v / max) * 36)}px`,
          transition: 'height 0.4s ease',
        }} />
      ))}
    </div>
  );
}

// ── Donut ring SVG ───────────────────────────────────────────────────────────
function DonutRing({ pct = 0, color = '#d70018', size = 64 }) {
  const r = 24, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#f0f0f0" strokeWidth="6" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 28 28)" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      <text x="28" y="33" textAnchor="middle" fontSize="11" fontWeight="800" fill={color}>{pct}%</text>
    </svg>
  );
}

class Home extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      stats: { products: 0, orders: 0, customers: 0, revenue: 0, pending: 0, approved: 0, canceled: 0 },
      recentOrders: [],
      topProducts: [],
      loaded: false,
    };
  }

  componentDidMount() { this.loadDashboard(); }

  async loadDashboard() {
    const config = { headers: { 'x-access-token': this.context.token } };
    try {
      const [prodRes, orderRes, custRes] = await Promise.all([
        axios.get('/api/admin/products?page=1', config),
        axios.get('/api/admin/orders', config),
        axios.get('/api/admin/customers', config),
      ]);
      const orders = orderRes.data || [];
      const approved = orders.filter(o => o.status === 'APPROVED');
      const pending  = orders.filter(o => o.status === 'PENDING');
      const canceled = orders.filter(o => o.status === 'CANCELED');
      const revenue  = approved.reduce((s, o) => s + (o.total || 0), 0);

      // Top sản phẩm bán chạy từ đơn APPROVED
      const prodMap = {};
      approved.forEach(o => (o.items || []).forEach(it => {
        const name = it.product?.name || 'Unknown';
        prodMap[name] = (prodMap[name] || 0) + (it.quantity || 1);
      }));
      const topProducts = Object.entries(prodMap)
        .sort((a, b) => b[1] - a[1]).slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));

      this.setState({
        stats: {
          products: prodRes.data?.products?.length || 0,
          orders: orders.length,
          customers: custRes.data?.length || 0,
          revenue,
          pending: pending.length,
          approved: approved.length,
          canceled: canceled.length,
        },
        recentOrders: orders.slice(0, 6),
        topProducts,
        loaded: true,
      });
    } catch (err) {
      console.error('Dashboard load error:', err);
      this.setState({ loaded: true });
    }
  }

  render() {
    const { stats, recentOrders, topProducts, loaded } = this.state;
    const approvedPct = stats.orders > 0 ? Math.round((stats.approved / stats.orders) * 100) : 0;
    const pendingPct  = stats.orders > 0 ? Math.round((stats.pending  / stats.orders) * 100) : 0;

    // Fake sparkline from recent orders (group by day for visual)
    const sparkData = [3,5,4,8,6,9,stats.orders].map((v, i) => i === 6 ? stats.orders : v);

    const STAT_CARDS = [
      {
        label: 'Sản phẩm',
        value: stats.products,
        sub: 'Đang bán',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><path d="M8 7V5a2 2 0 0 0-4 0v2"/>
          </svg>
        ),
        grad: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
        shadow: 'rgba(59,130,246,0.35)',
      },
      {
        label: 'Đơn hàng',
        value: stats.orders,
        sub: `${stats.pending} chờ duyệt`,
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        ),
        grad: 'linear-gradient(135deg,#d70018,#9a0010)',
        shadow: 'rgba(215,0,24,0.35)',
      },
      {
        label: 'Khách hàng',
        value: stats.customers,
        sub: 'Đã đăng ký',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
        grad: 'linear-gradient(135deg,#10b981,#059669)',
        shadow: 'rgba(16,185,129,0.35)',
      },
      {
        label: 'Doanh thu',
        value: stats.revenue >= 1000000
          ? (stats.revenue / 1000000).toFixed(1) + 'M₫'
          : stats.revenue.toLocaleString() + '₫',
        sub: 'Đơn đã duyệt',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        ),
        grad: 'linear-gradient(135deg,#f59e0b,#d97706)',
        shadow: 'rgba(245,158,11,0.35)',
      },
    ];

    return (
      <div style={{ animation: loaded ? 'fadeIn 0.3s ease' : 'none' }}>
        <style>{`
          @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
          .dash-statcard { transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
          .dash-statcard:hover { transform: translateY(-4px) !important; }
          .order-row-dash:hover { background: #fafafa !important; }
          .topbar { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px; }
        `}</style>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
              📊 Dashboard
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              Tổng quan hoạt động kinh doanh VLUPhone
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {STAT_CARDS.map((s, i) => (
            <div key={i} className="dash-statcard" style={{
              background: '#fff', borderRadius: '14px', padding: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: '12px',
              boxShadow: `0 4px 20px ${s.shadow}22`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.sub}</div>
                </div>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${s.shadow}`, flexShrink: 0 }}>
                  {s.icon}
                </div>
              </div>
              {/* Mini sparkline only on orders card */}
              {i === 1 && <SparkBars data={sparkData} color="#d70018" />}
              {i !== 1 && <div style={{ height: '36px' }} />}
            </div>
          ))}
        </div>

        {/* ── MIDDLE ROW: Order status + Top products ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

          {/* Order status breakdown */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'rgba(215,0,24,0.08)', padding: '4px 8px', borderRadius: '6px', fontSize: '16px' }}>📈</span>
              Tình trạng đơn hàng
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {[
                  { label: 'Đã duyệt', count: stats.approved, pct: approvedPct, color: '#10b981' },
                  { label: 'Chờ duyệt', count: stats.pending,  pct: pendingPct,  color: '#f59e0b' },
                  { label: 'Đã hủy',   count: stats.canceled, pct: stats.orders > 0 ? Math.round((stats.canceled/stats.orders)*100) : 0, color: '#ef4444' },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>{row.label}</span>
                      <span style={{ fontSize: '12.5px', fontWeight: 800, color: row.color }}>{row.count} đơn ({row.pct}%)</span>
                    </div>
                    <div style={{ height: '7px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${row.pct}%`, height: '100%', background: row.color, borderRadius: '4px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
              <DonutRing pct={approvedPct} color="#10b981" size={80} />
            </div>
          </div>

          {/* Top sản phẩm bán chạy */}
          <div style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '6px', fontSize: '16px' }}>🔥</span>
              Top sản phẩm bán chạy
            </h3>
            {topProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                Chưa có dữ liệu
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topProducts.map((p, i) => {
                  const maxQty = topProducts[0]?.qty || 1;
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : '#cd7f32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                            {i + 1}
                          </span>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                            {p.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#d70018', flexShrink: 0 }}>×{p.qty}</span>
                      </div>
                      <div style={{ height: '5px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${(p.qty / maxQty) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#d70018,#ff4444)', borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RECENT ORDERS ── */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,#fafafa,#fff)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'rgba(59,130,246,0.08)', padding: '4px 8px', borderRadius: '6px', fontSize: '16px' }}>🧾</span>
              Đơn hàng gần đây
            </h3>
            <span style={{ fontSize: '12px', background: 'var(--border)', padding: '3px 10px', borderRadius: '20px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {recentOrders.length} đơn
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>📭</div>
              <div style={{ fontSize: '14px' }}>Chưa có đơn hàng nào</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  {['Mã đơn', 'Khách hàng', 'SĐT', 'Ngày đặt', 'Tổng tiền', 'Trạng thái'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order._id} className="order-row-dash" style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      #{order._id?.slice(-8)?.toUpperCase()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#d70018,#ff4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                          {(order.customer?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{order.customer?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{order.customer?.phone}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {new Date(order.cdate).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)', fontSize: '14px' }}>
                      {(order.total || 0).toLocaleString()}₫
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {order.status === 'PENDING' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245,158,11,0.1)', color: '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                          ⏳ Chờ duyệt
                        </span>
                      )}
                      {order.status === 'APPROVED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.1)', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                          ✅ Đã duyệt
                        </span>
                      )}
                      {order.status === 'CANCELED' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239,68,68,0.1)', color: '#dc2626', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                          ❌ Đã hủy
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
