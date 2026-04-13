import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { txtUsername: '', txtPassword: '', showPw: false, error: '', loading: false };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({ txtUsername: e.target.value, error: '' });
  }

  handlePasswordChange(e) {
    this.setState({ txtPassword: e.target.value, error: '' });
  }

  render() {
    const { error, loading, showPw, txtUsername, txtPassword } = this.state;
    return (
      <div style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px',
        background: 'linear-gradient(135deg, #fff5f5 0%, #fff 50%, #fff5f5 100%)',
      }}>
        <div style={{
          background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px',
          boxShadow: '0 12px 48px rgba(215,0,24,0.1), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1.5px solid #f5e0e0', overflow: 'hidden',
        }}>
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #d70018, #ff6b6b, #d70018)' }} />

          <div style={{ padding: '36px 36px 32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <img
                src="/logo.png"
                alt="VLUPhone"
                style={{ width: '72px', height: '72px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 6px 20px rgba(215,0,24,0.25)', display: 'block', margin: '0 auto 14px' }}
                onError={e => { e.target.style.display='none'; }}
              />
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1a1a1a', margin: '0 0 6px', letterSpacing: '-0.3px' }}>Đăng nhập</h2>
              <p style={{ fontSize: '13.5px', color: '#aaa', margin: 0 }}>Chào mừng bạn trở lại VLUPhone!</p>
            </div>

            {error && (
              <div style={{ background: 'rgba(215,0,24,0.07)', border: '1px solid rgba(215,0,24,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px', color: '#d70018', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                Tên đăng nhập
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none', zIndex: 1, lineHeight: 1 }}>👤</span>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  placeholder="Nhập username..."
                  value={txtUsername}
                  onChange={this.handleUsernameChange}
                  onKeyDown={e => e.key === 'Enter' && this.handleLogin(e)}
                  style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', background: '#fafafa', boxSizing: 'border-box', color: '#1a1a1a', WebkitAppearance: 'none' }}
                  onFocus={e => { e.target.style.borderColor = '#d70018'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(215,0,24,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none', zIndex: 1, lineHeight: 1 }}>🔒</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Nhập password..."
                  value={txtPassword}
                  onChange={this.handlePasswordChange}
                  onKeyDown={e => e.key === 'Enter' && this.handleLogin(e)}
                  style={{ width: '100%', padding: '12px 42px 12px 40px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', background: '#fafafa', boxSizing: 'border-box', color: '#1a1a1a', WebkitAppearance: 'none' }}
                  onFocus={e => { e.target.style.borderColor = '#d70018'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(215,0,24,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => this.setState({ showPw: !showPw })}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', color: '#aaa', padding: '4px', lineHeight: 1 }}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={e => this.handleLogin(e)}
              disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#e8a0a8' : 'linear-gradient(135deg, #d70018, #ff2233)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(215,0,24,0.35)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {loading ? <>⏳ Đang đăng nhập...</> : '🔐 Đăng nhập'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
              <span style={{ fontSize: '12px', color: '#ccc' }}>hoặc</span>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13.5px', color: '#888', margin: '0 0 8px' }}>
                Chưa có tài khoản?{' '}
                <span onClick={() => this.props.navigate('/signup')} style={{ color: '#d70018', fontWeight: 800, cursor: 'pointer' }}>
                  Đăng ký ngay
                </span>
              </p>

            </div>
          </div>
        </div>
      </div>
    );
  }

  handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const { txtUsername, txtPassword } = this.state;
    if (!txtUsername || !txtPassword) { this.setState({ error: 'Vui lòng nhập username và password!' }); return; }
    this.setState({ loading: true });
    axios.post('/api/customer/login', { username: txtUsername, password: txtPassword })
      .then(res => {
        this.setState({ loading: false });
        if (res.data.success) {
          this.context.setToken(res.data.token);
          this.context.setCustomer(res.data.customer);
          this.props.navigate('/home');
        } else {
          this.setState({ error: res.data.message || 'Sai tên đăng nhập hoặc mật khẩu!' });
        }
      })
      .catch(() => this.setState({ loading: false, error: 'Lỗi kết nối server!' }));
  }
}
export default withRouter(Login);
