import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    const { mycart } = this.context;

    if (mycart.length === 0) {
      return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 16px' }}>
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Giỏ hàng trống</h3>
            <p style={{ color: '#aaa', marginBottom: '24px' }}>Hãy thêm sản phẩm để bắt đầu mua sắm nhé!</p>
            <button
              style={{ padding: '12px 32px', background: '#d70018', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif' }}
              onClick={() => this.props.navigate('/product')}
            >
              🛍️ Mua sắm ngay
            </button>
          </div>
        </div>
      );
    }

    const total = CartUtil.getTotal(mycart);

    return (
      <div className="cart-page">
        <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          🛒 Giỏ hàng của bạn ({mycart.length} sản phẩm)
        </h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-card">
            <div className="cart-card-header">Sản phẩm đã chọn</div>

            {mycart.map((item) => (
              <div key={item.product._id} className="cart-item-row">
                <img
                  src={'data:image/jpg;base64,' + item.product.image}
                  className="cart-item-img"
                  alt={item.product.name}
                />
                <div style={{ flex: 1 }}>
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-price">{(item.product.price || 0).toLocaleString()}đ / cái</div>
                  <div style={{ marginTop: '8px' }}>
                    <div className="cart-qty-box">
                      <button className="cart-qty-btn" onClick={() => this.updateQty(item, -1)}>−</button>
                      <div className="cart-qty-val">{item.quantity}</div>
                      <button className="cart-qty-btn" onClick={() => this.updateQty(item, 1)}>+</button>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div className="cart-item-total">
                    {((item.product.price || 0) * item.quantity).toLocaleString()}đ
                  </div>
                  <button className="btn-remove" onClick={() => this.removeItem(item.product._id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary-card">
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Tổng đơn hàng</h3>

            {mycart.map(item => (
              <div key={item.product._id} className="summary-row">
                <span style={{ fontSize: '12.5px' }}>{item.product.name} x{item.quantity}</span>
                <span style={{ fontWeight: 600 }}>{((item.product.price || 0) * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}

            <div style={{ borderTop: '1px dashed #eee', paddingTop: '8px', marginTop: '4px' }}>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span style={{ color: '#00a650', fontWeight: 700 }}>Miễn phí</span>
              </div>
            </div>

            <div className="summary-total">
              <span>Tổng cộng</span>
              <span className="summary-total-price">{total.toLocaleString()}đ</span>
            </div>

            {/* ĐẶT HÀNG → chuyển sang trang checkout */}
            <button
              className="btn-checkout"
              onClick={() => this.handleCheckout()}
            >
              💳 Đặt hàng ngay
            </button>

            <button
              onClick={() => this.props.navigate('/product')}
              style={{ width: '100%', marginTop: '10px', padding: '11px', background: 'transparent', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontWeight: 600, fontSize: '13.5px', cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif', color: '#555' }}
            >
              ← Tiếp tục mua sắm
            </button>

            <div style={{ marginTop: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontSize: '12.5px', color: '#555', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>✅ Hàng chính hãng 100%</span>
                <span>🚚 Giao hàng nhanh toàn quốc</span>
                <span>🔄 Đổi trả trong 30 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  updateQty(item, change) {
    const mycart = [...this.context.mycart];
    const idx = mycart.findIndex(x => x.product._id === item.product._id);
    if (idx !== -1) {
      mycart[idx].quantity += change;
      if (mycart[idx].quantity <= 0) mycart.splice(idx, 1);
      this.context.setMycart(mycart);
    }
  }

  removeItem(id) {
    if (window.confirm('Xóa sản phẩm khỏi giỏ hàng?')) {
      const mycart = this.context.mycart.filter(x => x.product._id !== id);
      this.context.setMycart(mycart);
    }
  }

  handleCheckout() {
    const { token, customer } = this.context;
    if (!token || !customer) {
      this.props.navigate('/login');
      return;
    }
    // Chuyển sang trang checkout 2 bước
    this.props.navigate('/checkout');
  }
}

export default withRouter(Mycart);
