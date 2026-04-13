import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <img src="/logo.png" alt="VLUPhone" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} onError={e => { e.target.style.display='none'; }} />
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>VLUPhone</span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Hệ thống bán điện thoại chính hãng uy tín hàng đầu Việt Nam
              </p>
            </div>
            <h4>Tổng đài hỗ trợ</h4>
            <div className="footer-hotline">1800 2097</div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Miễn phí • 8:00 – 21:00</p>
            <div style={{ marginTop: '14px' }}>
              <h4>Thanh toán</h4>
              <div className="payment-icons">
                <span className="payment-icon">💳 Visa</span>
                <span className="payment-icon">VNPay</span>
                <span className="payment-icon">Momo</span>
                <span className="payment-icon">ZaloPay</span>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Thông tin</h4>
            <p>Mua hàng online</p>
            <p>Chính sách bảo hành</p>
            <p>Chính sách đổi trả</p>
            <p>Tra cứu đơn hàng</p>
            <p>Hướng dẫn mua hàng</p>
          </div>

          <div className="footer-col">
            <h4>Dịch vụ</h4>
            <p>Khách hàng doanh nghiệp</p>
            <p>Thu cũ đổi mới</p>
            <p>Ưu đãi thanh toán</p>
            <p>Bảo hiểm điện thoại</p>
            <p>Tuyển dụng</p>
          </div>

          <div className="footer-col">
            <h4>Kết nối với chúng tôi</h4>
            <div className="social-icons">
              <div className="social-icon">📘</div>
              <div className="social-icon">▶️</div>
              <div className="social-icon">📸</div>
              <div className="social-icon">🎵</div>
            </div>
            <h4 style={{ marginTop: '8px' }}>Đăng ký nhận tin</h4>
            <div className="footer-newsletter">
              <input type="email" placeholder="Email của bạn..." />
              <button>Đăng ký</button>
            </div>
            <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
              Nhận ưu đãi và tin tức mới nhất
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 PhoneShop. Tất cả quyền được bảo lưu. | Được phát triển bởi VLU Team
        </div>
      </footer>
    );
  }
}

export default Footer;
