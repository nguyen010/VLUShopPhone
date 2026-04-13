import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '', txtPassword: '', txtName: '',
      txtPhone: '', txtEmail: '',
      showPw: false, error: '', loading: false,
      success: false,  // hiện thông báo thành công
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange     = this.handleNameChange.bind(this);
    this.handlePhoneChange    = this.handlePhoneChange.bind(this);
    this.handleEmailChange    = this.handleEmailChange.bind(this);
  }

  handleUsernameChange(e) { this.setState({ txtUsername: e.target.value, error: '' }); }
  handlePasswordChange(e) { this.setState({ txtPassword: e.target.value, error: '' }); }
  handleNameChange(e)     { this.setState({ txtName: e.target.value, error: '' }); }
  handlePhoneChange(e)    { this.setState({ txtPhone: e.target.value, error: '' }); }
  handleEmailChange(e)    { this.setState({ txtEmail: e.target.value, error: '' }); }

  render() {
    const { error, loading, showPw, success,
            txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    return (
      <div style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px',
        background: 'linear-gradient(135deg,#fff5f5 0%,#fff 50%,#fff5f5 100%)',
      }}>
        <style>{`
          .auth-inp { transition: border-color 0.2s, box-shadow 0.2s, background 0.2s !important; }
          .auth-inp:focus { border-color: #d70018 !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(215,0,24,0.08) !important; outline: none !important; }
          @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
          @keyframes successPop { 0%{transform:scale(0.8);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
          .signup-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(215,0,24,0.45) !important; }
        `}</style>

        <div style={{
          background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '440px',
          boxShadow: '0 12px 48px rgba(215,0,24,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1.5px solid #f5e0e0', overflow: 'hidden',
          animation: 'slideUp 0.3s ease',
        }}>
          <div style={{ height: '4px', background: 'linear-gradient(90deg,#d70018,#ff6b6b,#d70018)' }} />

          <div style={{ padding: '32px 36px' }}>

            {/* ── SUCCESS STATE ── */}
            {success ? (
              <div style={{ textAlign: 'center', padding: '10px 0', animation: 'successPop 0.4s ease' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#059669', margin: '0 0 10px' }}>
                  Tạo tài khoản thành công!
                </h2>
                <p style={{ fontSize: '14px', color: '#555', margin: '0 0 8px', lineHeight: 1.6 }}>
                  Xin chào <strong style={{ color: '#d70018' }}>{txtName}</strong>!<br/>
                  Tài khoản của bạn đã được kích hoạt ngay lập tức.
                </p>
                <div style={{
                  background: '#f0fdf4', border: '1.5px solid #86efac',
                  borderRadius: '10px', padding: '12px 16px', margin: '16px 0 24px',
                  fontSize: '13px', color: '#15803d', textAlign: 'left', lineHeight: 1.6,
                }}>
                  ✅ Tài khoản: <strong>{txtUsername}</strong><br/>
                  ✅ Trạng thái: <strong>Hoạt động</strong><br/>
                  ✅ Có thể đăng nhập ngay!
                </div>
                <button
                  type="button"
                  onClick={() => this.props.navigate('/login')}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'linear-gradient(135deg,#d70018,#ff2233)',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    fontSize: '15px', fontWeight: 800, cursor: 'pointer',
                    fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(215,0,24,0.35)',
                    transition: 'all 0.2s',
                  }}
                >
                  🔐 Đăng nhập ngay
                </button>
              </div>
            ) : (
              /* ── FORM STATE ── */
              <>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
                  <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1a1a1a', margin: '0 0 5px', letterSpacing: '-0.3px' }}>Tạo tài khoản</h2>
                  <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>Đăng ký để mua sắm dễ dàng hơn</p>
                </div>

                {/* Error */}
                {error && (
                  <div style={{ background: 'rgba(215,0,24,0.07)', border: '1px solid rgba(215,0,24,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#d70018', fontSize: '13px' }}>
                    ⚠️ {error}
                  </div>
                )}

                {/* Fields */}
                {[
                  { label: 'Tên đăng nhập', name: 'username', type: 'text',  placeholder: 'Nhập username...', value: txtUsername, onChange: this.handleUsernameChange },
                  { label: 'Họ và tên',     name: 'name',     type: 'text',  placeholder: 'Nhập họ và tên...', value: txtName, onChange: this.handleNameChange },
                  { label: 'Số điện thoại', name: 'phone',    type: 'tel',   placeholder: 'Nhập số điện thoại...', value: txtPhone, onChange: this.handlePhoneChange },
                  { label: 'Email',         name: 'email',    type: 'email', placeholder: 'Nhập email...', value: txtEmail, onChange: this.handleEmailChange },
                ].map(f => (
                  <div key={f.name} style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>{f.label}</label>
                    <input
                      className="auth-inp"
                      type={f.type} name={f.name} autoComplete={f.name}
                      placeholder={f.placeholder} value={f.value} onChange={f.onChange}
                      onKeyDown={e => e.key === 'Enter' && this.handleSignup()}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', background: '#fafafa', color: '#1a1a1a', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}

                {/* Password */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>Mật khẩu</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="auth-inp"
                      type={showPw ? 'text' : 'password'} name="password" autoComplete="new-password"
                      placeholder="Nhập mật khẩu..." value={txtPassword} onChange={this.handlePasswordChange}
                      onKeyDown={e => e.key === 'Enter' && this.handleSignup()}
                      style={{ width: '100%', padding: '11px 42px 11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', background: '#fafafa', color: '#1a1a1a', boxSizing: 'border-box' }}
                    />
                    <button type="button" onClick={() => this.setState({ showPw: !showPw })}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#aaa', padding: '2px' }}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  className="signup-btn"
                  type="button"
                  onClick={() => this.handleSignup()}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px', marginBottom: '16px',
                    background: loading ? '#e8a0a8' : 'linear-gradient(135deg,#d70018,#ff2233)',
                    color: '#fff', border: 'none', borderRadius: '10px',
                    fontSize: '15px', fontWeight: 800,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 20px rgba(215,0,24,0.35)',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? '⏳ Đang tạo tài khoản...' : '🚀 Tạo tài khoản'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '13.5px', color: '#888', margin: 0 }}>
                  Đã có tài khoản?{' '}
                  <span onClick={() => this.props.navigate('/login')} style={{ color: '#d70018', fontWeight: 800, cursor: 'pointer' }}>
                    Đăng nhập ngay
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  handleSignup() {
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    if (!txtUsername || !txtPassword || !txtName || !txtPhone || !txtEmail) {
      this.setState({ error: 'Vui lòng điền đầy đủ thông tin!' });
      return;
    }
    if (!txtEmail.includes('@')) {
      this.setState({ error: 'Email không hợp lệ!' });
      return;
    }
    if (txtPassword.length < 3) {
      this.setState({ error: 'Mật khẩu phải có ít nhất 3 ký tự!' });
      return;
    }
    this.setState({ loading: true, error: '' });
    axios.post('/api/customer/signup', {
      username: txtUsername, password: txtPassword,
      name: txtName, phone: txtPhone, email: txtEmail,
    }).then(res => {
      this.setState({ loading: false });
      if (res.data.success) {
        // Hiện thông báo thành công ngay, không cần kích hoạt email
        this.setState({ success: true });
        // Tự động chuyển sang login sau 5 giây
        setTimeout(() => {
          this.props.navigate('/login');
        }, 5000);
      } else {
        this.setState({ error: res.data.message || 'Đăng ký thất bại!' });
      }
    }).catch(() => this.setState({ loading: false, error: 'Lỗi kết nối server!' }));
  }
}

export default withRouter(Signup);
