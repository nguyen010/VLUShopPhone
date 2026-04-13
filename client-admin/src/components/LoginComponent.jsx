import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Navigate } from 'react-router-dom';

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { txtUsername: '', txtPassword: '', showPw: false, loading: false, error: '' };
  }

  render() {
    if (this.context.token !== '') return <Navigate to="/home" replace />;
    const { loading, error, showPw } = this.state;

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3556 50%, #1a1f2e 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(215,0,24,0.12) 0%, transparent 70%)', top: '-100px', right: '-100px', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', bottom: '-80px', left: '-60px', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px',
          padding: '44px 40px 36px', width: '100%', maxWidth: '400px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)', position: 'relative',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img
              src="/logo.png" alt="VLUPhone"
              style={{ width: '76px', height: '76px', borderRadius: '20px', objectFit: 'cover', marginBottom: '16px', boxShadow: '0 8px 28px rgba(215,0,24,0.5)', display: 'block', margin: '0 auto 16px' }}
              onError={e => { e.target.style.display='none'; }}
            />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>VLUPhone Admin</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Hệ thống quản trị bán hàng</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px', color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>Tên đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none', opacity: 0.6 }}>👤</span>
              <input
                type="text" placeholder="Nhập username..."
                value={this.state.txtUsername}
                onChange={e => this.setState({ txtUsername: e.target.value, error: '' })}
                onKeyDown={e => e.key === 'Enter' && this.btnLoginClick(e)}
                style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '14px', fontFamily: 'Be Vietnam Pro, sans-serif', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#d70018'; e.target.style.boxShadow = '0 0 0 3px rgba(215,0,24,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '7px' }}>Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none', opacity: 0.6 }}>🔒</span>
              <input
                type={showPw ? 'text' : 'password'} placeholder="Nhập password..."
                value={this.state.txtPassword}
                onChange={e => this.setState({ txtPassword: e.target.value, error: '' })}
                onKeyDown={e => e.key === 'Enter' && this.btnLoginClick(e)}
                style={{ width: '100%', padding: '12px 42px 12px 40px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '14px', fontFamily: 'Be Vietnam Pro, sans-serif', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#d70018'; e.target.style.boxShadow = '0 0 0 3px rgba(215,0,24,0.2)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => this.setState({ showPw: !showPw })} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: 'rgba(255,255,255,0.4)', padding: '2px' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={e => this.btnLoginClick(e)}
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: loading ? 'rgba(215,0,24,0.5)' : 'linear-gradient(135deg, #d70018, #ff2233)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif', boxShadow: '0 6px 24px rgba(215,0,24,0.4)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? '⏳ Đang đăng nhập...' : '🔐 Đăng nhập'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.2)', margin: '20px 0 0' }}>
            © 2026 VLUPhone Management System
          </p>
        </div>
      </div>
    );
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;
    if (!txtUsername || !txtPassword) { this.setState({ error: 'Vui lòng nhập username và password!' }); return; }
    this.setState({ loading: true });
    axios.post('/api/admin/login', { username: txtUsername, password: txtPassword })
      .then(res => {
        this.setState({ loading: false });
        if (res.data.success) {
          this.context.setToken(res.data.token);
          this.context.setUsername(txtUsername);
        } else {
          this.setState({ error: res.data.message });
        }
      })
      .catch(() => this.setState({ loading: false, error: 'Lỗi kết nối server!' }));
  }
}
export default Login;
