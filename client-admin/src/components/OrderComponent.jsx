import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { orders: [], order: null, sending: false, sentId: null };
  }

  render() {
    const { orders, order, sending, sentId } = this.state;

    return (
      <div>
        <style>{`
          @keyframes fadeSlide { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
          .order-row { cursor: pointer; transition: background 0.12s; }
          .order-row:hover { background: #fff5f5 !important; }
          .order-row.selected { background: #fff0f0 !important; }
          .action-btn { display:inline-flex;align-items:center;gap:5px;padding:5px 12px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.15s; }
          .action-btn:hover { opacity:0.88;transform:translateY(-1px); }
          .btn-approve { background:#10b981;color:#fff; }
          .btn-cancel  { background:#ef4444;color:#fff; }
          .btn-mail    { background:#3b82f6;color:#fff; }
          .btn-mail:disabled { background:#9ca3af;cursor:not-allowed;transform:none; }
        `}</style>

        <div className="page-header">
          <h1 className="page-title">🧾 Quản lý đơn hàng</h1>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{orders.length} đơn hàng</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: order ? '1fr 400px' : '1fr', gap: '20px', alignItems: 'start' }}>

          {/* ── ORDER LIST ── */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                    Chưa có đơn hàng nào
                  </td></tr>
                ) : orders.map(item => (
                  <tr
                    key={item._id}
                    className={`order-row${order?._id === item._id ? ' selected' : ''}`}
                    onClick={() => this.setState({ order: item })}
                  >
                    <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      #{item._id?.slice(-8)?.toUpperCase()}
                    </td>
                    <td style={{ fontSize: '13px' }}>{new Date(item.cdate).toLocaleDateString('vi-VN')}</td>
                    <td style={{ fontWeight: 600 }}>{item.customer?.name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{item.customer?.phone}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {(item.total || 0).toLocaleString()}₫
                    </td>
                    <td>
                      {item.status === 'PENDING'  && <span className="badge badge-warning">⏳ Chờ duyệt</span>}
                      {item.status === 'APPROVED' && <span className="badge badge-success">✅ Đã duyệt</span>}
                      {item.status === 'CANCELED' && <span className="badge badge-danger">❌ Đã hủy</span>}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        {item.status === 'PENDING' && (<>
                          <button className="action-btn btn-approve" onClick={() => this.handleApprove(item._id)}>✅ Duyệt</button>
                          <button className="action-btn btn-cancel"  onClick={() => this.handleCancel(item._id)}>❌ Hủy</button>
                        </>)}
                        {item.status !== 'PENDING' && (
                          <button
                            className="action-btn btn-mail"
                            disabled={sending && sentId === item._id}
                            onClick={() => this.handleSendMail(item._id)}
                          >
                            {sending && sentId === item._id ? '⏳ Đang gửi...' : '📧 Gửi mail'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── ORDER DETAIL PANEL ── */}
          {order && (
            <div className="card" style={{ animation: 'fadeSlide 0.2s ease', position: 'sticky', top: '20px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 2px' }}>📦 Chi tiết đơn hàng</h3>
                  <span style={{ fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    #{order._id?.slice(-8)?.toUpperCase()}
                  </span>
                </div>
                <button onClick={() => this.setState({ order: null })}
                  style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  ✕ Đóng
                </button>
              </div>

              {/* Status badge */}
              <div style={{ marginBottom: '14px' }}>
                {order.status === 'PENDING'  && <span className="badge badge-warning" style={{ fontSize: '13px', padding: '5px 14px' }}>⏳ Chờ duyệt</span>}
                {order.status === 'APPROVED' && <span className="badge badge-success" style={{ fontSize: '13px', padding: '5px 14px' }}>✅ Đã xác nhận & gửi mail</span>}
                {order.status === 'CANCELED' && <span className="badge badge-danger"  style={{ fontSize: '13px', padding: '5px 14px' }}>❌ Đã hủy</span>}
              </div>

              {/* Customer info */}
              <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '12px 14px', marginBottom: '14px', fontSize: '13px' }}>
                <div style={{ fontWeight: 700, color: '#333', marginBottom: '8px' }}>👤 Thông tin khách hàng</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div><span style={{ color: 'var(--text-muted)' }}>Tên:</span> <strong>{order.customer?.name}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>SĐT:</span> <strong>{order.customer?.phone}</strong></div>
                  <div style={{ gridColumn: '1/-1' }}><span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{order.customer?.email}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Ngày đặt:</span> <strong>{new Date(order.cdate).toLocaleDateString('vi-VN')}</strong></div>
                </div>
              </div>

              {/* Product list */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontWeight: 700, color: '#333', fontSize: '13px', marginBottom: '8px' }}>🛍️ Sản phẩm</div>
                {(order.items || []).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <img
                      src={'data:image/jpg;base64,' + item.product?.image}
                      width="40" height="40"
                      style={{ borderRadius: '6px', objectFit: 'cover', flexShrink: 0, border: '1px solid #eee' }}
                      alt=""
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product?.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        x{item.quantity} × {(item.product?.price || 0).toLocaleString()}₫
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                      {((item.product?.price || 0) * item.quantity).toLocaleString()}₫
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '2px solid var(--border)', marginBottom: '16px' }}>
                <span style={{ fontWeight: 700, color: '#333' }}>Tổng cộng</span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>
                  {(order.total || 0).toLocaleString()}₫
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                {order.status === 'PENDING' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button className="action-btn btn-approve" style={{ justifyContent: 'center', padding: '10px' }}
                      onClick={() => this.handleApprove(order._id)}>
                      ✅ Xác nhận & Gửi mail
                    </button>
                    <button className="action-btn btn-cancel" style={{ justifyContent: 'center', padding: '10px' }}
                      onClick={() => this.handleCancel(order._id)}>
                      ❌ Hủy đơn hàng
                    </button>
                  </div>
                )}
                {order.status !== 'PENDING' && (
                  <button
                    className="action-btn btn-mail"
                    disabled={sending && sentId === order._id}
                    style={{ justifyContent: 'center', padding: '10px', fontSize: '13px' }}
                    onClick={() => this.handleSendMail(order._id)}
                  >
                    {sending && sentId === order._id ? '⏳ Đang gửi...' : '📧 Gửi lại mail xác nhận'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() { this.apiGetOrders(); }

  handleApprove(id) {
    if (!window.confirm('Xác nhận duyệt đơn hàng và gửi email thông báo cho khách?')) return;
    this.apiPutOrderStatus(id, 'APPROVED', true);
  }

  handleCancel(id) {
    if (!window.confirm('Xác nhận hủy đơn hàng này?')) return;
    this.apiPutOrderStatus(id, 'CANCELED', false);
  }

  handleSendMail(id) {
    this.setState({ sending: true, sentId: id });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/orders/sendmail/' + id, {}, config)
      .then(res => {
        this.setState({ sending: false, sentId: null });
        alert(res.data?.message || '📧 Đã gửi email!');
      })
      .catch(() => {
        this.setState({ sending: false, sentId: null });
        alert('Lỗi gửi mail!');
      });
  }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then(res => this.setState({ orders: res.data }));
  }

  apiPutOrderStatus(id, status, sendMail) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, { status }, config).then(res => {
      if (res.data) {
        this.apiGetOrders();
        // Update selected order status
        if (this.state.order?._id === id) {
          this.setState(prev => ({ order: { ...prev.order, status } }));
        }
        // Auto send mail when approved
        if (sendMail && status === 'APPROVED') {
          this.setState({ sending: true, sentId: id });
          axios.post('/api/admin/orders/sendmail/' + id, {}, config)
            .then(r => {
              this.setState({ sending: false, sentId: null });
              alert(`✅ Đã duyệt đơn hàng!\n${r.data?.message || '📧 Email đã được gửi đến khách hàng.'}`);
            })
            .catch(() => {
              this.setState({ sending: false, sentId: null });
              alert('✅ Đã duyệt đơn hàng! (Lỗi gửi mail)');
            });
        }
      }
    });
  }
}

export default Order;
