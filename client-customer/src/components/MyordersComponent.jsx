import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { orders: [], order: null };
  }

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;

    const { orders, order } = this.state;

    return (
      <div className="orders-page">
        <h1 className="page-title-bar">🧾 Đơn hàng của tôi</h1>

        <div className="data-card">
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
              <p>Bạn chưa có đơn hàng nào</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Số SP</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => this.setState({ order: item })}
                    style={{ background: order?._id === item._id ? '#fff8f8' : '' }}
                  >
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#888' }}>
                      #{item._id?.slice(-10)?.toUpperCase()}
                    </td>
                    <td>{new Date(item.cdate).toLocaleDateString('vi-VN')}</td>
                    <td style={{ textAlign: 'center' }}>{item.items?.length || 0}</td>
                    <td style={{ fontWeight: 800, color: '#d70018' }}>
                      {(item.total || 0).toLocaleString()}₫
                    </td>
                    <td>
                      {item.status === 'PENDING' && <span className="status-badge status-pending">⏳ Chờ duyệt</span>}
                      {item.status === 'APPROVED' && <span className="status-badge status-approved">✅ Đã duyệt</span>}
                      {item.status === 'CANCELED' && <span className="status-badge status-canceled">❌ Đã hủy</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order detail */}
        {order && (
          <div className="data-card">
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700 }}>
                📦 Chi tiết đơn #{order._id?.slice(-10)?.toUpperCase()}
              </h3>
              <button
                onClick={() => this.setState({ order: null })}
                style={{ background: 'none', border: '1px solid #eee', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
              >
                ✕ Đóng
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((item) => (
                  <tr key={item.product?._id}>
                    <td>
                      <img
                        src={'data:image/jpg;base64,' + item.product?.image}
                        width="52" height="52"
                        style={{ borderRadius: '8px', objectFit: 'contain', background: '#f5f5f5', padding: '4px', border: '1px solid #eee' }}
                        alt=""
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.product?.name}</td>
                    <td>{(item.product?.price || 0).toLocaleString()}₫</td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                    <td style={{ fontWeight: 800, color: '#d70018' }}>
                      {((item.product?.price || 0) * item.quantity).toLocaleString()}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '14px 20px', textAlign: 'right', borderTop: '2px solid #eee', fontWeight: 800, fontSize: '16px', color: '#d70018' }}>
              Tổng: {(order.total || 0).toLocaleString()}₫
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      axios.get('/api/customer/orders/customer/' + this.context.customer._id, {
        headers: { 'x-access-token': this.context.token }
      }).then((res) => this.setState({ orders: res.data }));
    }
  }
}

export default Myorders;
