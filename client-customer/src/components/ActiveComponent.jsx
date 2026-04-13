import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: '',
      loading: false,
      status: null, // 'success' | 'error' | null
      message: '',
    };
    this.handleIDChange = this.handleIDChange.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
  }

  handleIDChange(e) {
    this.setState({ txtID: e.target.value, status: null });
  }

  handleTokenChange(e) {
    this.setState({ txtToken: e.target.value, status: null });
  }

  render() {
    const { txtID, txtToken, loading, status, message } = this.state;

    return (
      <div style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px',
        background: 'linear-gradient(135deg, #fff5f5 0%, #fff 50%, #fff5f5 100%)',
      }}>
        <style>{`
          @keyframes activePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }
          @keyframes successBounce {
            0% { transform: scale(0.8); opacity: 0; }
            60% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .active-input:focus {
            border-color: #d70018 !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px rgba(215,0,24,0.08) !important;
          }
          .active-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(215,0,24,0.45) !important;
          }
          .active-btn:active:not(:disabled) {
            transform: translateY(0);
          }
          .step-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 10px 0;
          }
          .step-item:not(:last-child) {
            border-bottom: 1px dashed #f0f0f0;
          }
        `}</style>

        <div style={{
          background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '460px',
          boxShadow: '0 16px 56px rgba(215,0,24,0.10), 0 2px 12px rgba(0,0,0,0.06)',
          border: '1.5px solid #f5e0e0', overflow: 'hidden',
          animation: 'fadeSlideUp 0.35s ease',
        }}>
          {/* Top gradient bar */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #d70018, #ff6b6b, #ffd700, #d70018)', backgroundSize: '200% 100%' }} />

          {/* Header section */}
          <div style={{
            background: 'linear-gradient(135deg, #d70018 0%, #a8000f 100%)',
            padding: '32px 36px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Deco circles */}
            <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', top: '-60px', right: '-40px', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '100px', height: '100px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', bottom: '-30px', left: '20px', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Icon */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '30px', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                animation: 'activePulse 2.5s ease-in-out infinite',
              }}>
                🔐
              </div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', margin: '0 0 5px', letterSpacing: '-0.3px' }}>
                  Kích hoạt tài khoản
                </h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
                  Nhập ID và mã token để xác thực
                </p>
              </div>
            </div>
          </div>

          <div style={{ padding: '28px 36px 32px' }}>

            {/* Status messages */}
            {status === 'success' && (
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                border: '1.5px solid #86efac',
                borderRadius: '12px', padding: '14px 16px',
                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px',
                animation: 'successBounce 0.4s ease',
              }}>
                <span style={{ fontSize: '24px', animation: 'successBounce 0.4s ease' }}>✅</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#15803d', marginBottom: '2px' }}>
                    Kích hoạt thành công!
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#166534' }}>
                    {message || 'Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập!'}
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div style={{
                background: 'rgba(215,0,24,0.06)',
                border: '1.5px solid rgba(215,0,24,0.2)',
                borderRadius: '12px', padding: '14px 16px',
                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '22px' }}>⚠️</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#d70018', marginBottom: '2px' }}>
                    Kích hoạt thất bại
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#b91c1c' }}>
                    {message || 'ID hoặc mã token không đúng. Vui lòng kiểm tra lại!'}
                  </div>
                </div>
              </div>
            )}

            {/* User ID input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                User ID
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none', zIndex: 1, lineHeight: 1 }}>🪪</span>
                <input
                  className="active-input"
                  type="text"
                  name="userID"
                  placeholder="Nhập User ID của bạn..."
                  value={txtID}
                  onChange={this.handleIDChange}
                  onKeyDown={e => e.key === 'Enter' && this.btnActiveClick(e)}
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    border: '1.5px solid #e8e8e8', borderRadius: '10px',
                    fontSize: '14px', fontFamily: 'inherit', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                    background: '#fafafa', boxSizing: 'border-box', color: '#1a1a1a',
                  }}
                />
              </div>
            </div>

            {/* Token input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                Mã kích hoạt (Token)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none', zIndex: 1, lineHeight: 1 }}>🔑</span>
                <input
                  className="active-input"
                  type="text"
                  name="activationToken"
                  placeholder="Nhập mã token từ email..."
                  value={txtToken}
                  onChange={this.handleTokenChange}
                  onKeyDown={e => e.key === 'Enter' && this.btnActiveClick(e)}
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    border: '1.5px solid #e8e8e8', borderRadius: '10px',
                    fontSize: '14px', fontFamily: 'inherit', outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                    background: '#fafafa', boxSizing: 'border-box', color: '#1a1a1a',
                    letterSpacing: '0.5px',
                  }}
                />
              </div>
              <p style={{ fontSize: '11.5px', color: '#bbb', margin: '6px 0 0 2px' }}>
                💡 Token được gửi qua email khi đăng ký tài khoản
              </p>
            </div>

            {/* Activate button */}
            <button
              className="active-btn"
              type="button"
              onClick={e => this.btnActiveClick(e)}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading
                  ? '#e8a0a8'
                  : status === 'success'
                    ? 'linear-gradient(135deg, #059669, #10b981)'
                    : 'linear-gradient(135deg, #d70018, #ff2233)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 20px rgba(215,0,24,0.35)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading
                ? <><span style={{ display: 'inline-block', animation: 'activePulse 1s ease-in-out infinite' }}>⏳</span> Đang kích hoạt...</>
                : status === 'success'
                  ? '✅ Đã kích hoạt thành công!'
                  : '🔓 Kích hoạt tài khoản'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px' }}>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
              <span style={{ fontSize: '11px', color: '#ddd', fontWeight: 600, letterSpacing: '0.5px' }}>HƯỚNG DẪN</span>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
            </div>

            {/* Steps guide */}
            <div style={{ background: '#fafafa', borderRadius: '12px', padding: '12px 16px', border: '1px solid #f0f0f0' }}>
              <div className="step-item">
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#d70018', color: '#fff', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>1</div>
                <div style={{ fontSize: '12.5px', color: '#555', lineHeight: 1.5 }}>
                  <strong style={{ color: '#1a1a1a' }}>Đăng ký tài khoản</strong> — Nhận email xác nhận
                </div>
              </div>
              <div className="step-item">
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#d70018', color: '#fff', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>2</div>
                <div style={{ fontSize: '12.5px', color: '#555', lineHeight: 1.5 }}>
                  <strong style={{ color: '#1a1a1a' }}>Lấy User ID & Token</strong> — Từ email được gửi
                </div>
              </div>
              <div className="step-item">
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#d70018', color: '#fff', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>3</div>
                <div style={{ fontSize: '12.5px', color: '#555', lineHeight: 1.5 }}>
                  <strong style={{ color: '#1a1a1a' }}>Nhập vào form</strong> — Và nhấn kích hoạt
                </div>
              </div>
            </div>

            {/* Back to login */}
            <div style={{ textAlign: 'center', marginTop: '18px' }}>
              <span
                onClick={() => this.props.navigate('/login')}
                style={{ fontSize: '13.5px', color: '#d70018', fontWeight: 700, cursor: 'pointer' }}
              >
                ← Quay lại đăng nhập
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  btnActiveClick(e) {
    if (e && e.preventDefault) e.preventDefault();
    const { txtID, txtToken } = this.state;
    if (!txtID || !txtToken) {
      this.setState({ status: 'error', message: 'Vui lòng nhập đầy đủ User ID và mã token!' });
      return;
    }
    this.setState({ loading: true, status: null });
    this.apiActive(txtID, txtToken);
  }

  apiActive(id, token) {
    axios.post('/api/customer/active', { id, token })
      .then(res => {
        const result = res.data;
        if (result) {
          this.setState({ loading: false, status: 'success', message: 'Tài khoản đã được kích hoạt thành công! Hãy đăng nhập để mua sắm.' });
        } else {
          this.setState({ loading: false, status: 'error', message: 'ID hoặc mã token không đúng. Vui lòng kiểm tra lại!' });
        }
      })
      .catch(() => {
        this.setState({ loading: false, status: 'error', message: 'Lỗi kết nối server. Vui lòng thử lại!' });
      });
  }
}

export default withRouter(Active);
