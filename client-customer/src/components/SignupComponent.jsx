import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Step 1: signup form
      txtUsername: '', txtPassword: '', txtName: '',
      txtPhone: '', txtEmail: '',
      showPw: false, error: '', loading: false,

      // Step 2: activation (shown after signup success)
      step: 'signup',   // 'signup' | 'activate'
      newCustomerId: '',
      txtToken: '',
      activating: false,
      activateError: '',
      activateSuccess: false,
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleNameChange     = this.handleNameChange.bind(this);
    this.handlePhoneChange    = this.handlePhoneChange.bind(this);
    this.handleEmailChange    = this.handleEmailChange.bind(this);
    this.handleTokenChange    = this.handleTokenChange.bind(this);
  }

  handleUsernameChange(e) { this.setState({ txtUsername: e.target.value, error: '' }); }
  handlePasswordChange(e) { this.setState({ txtPassword: e.target.value, error: '' }); }
  handleNameChange(e)     { this.setState({ txtName: e.target.value, error: '' }); }
  handlePhoneChange(e)    { this.setState({ txtPhone: e.target.value, error: '' }); }
  handleEmailChange(e)    { this.setState({ txtEmail: e.target.value, error: '' }); }
  handleTokenChange(e)    { this.setState({ txtToken: e.target.value, activateError: '' }); }

  // ── InputField helper ───────────────────────────────────────────────────
  renderInput({ label, name, type, placeholder, value, onChange, extra }) {
    return (
      <div style={{ marginBottom: '14px' }}>
        <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>
          {label}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={type}
            name={name}
            autoComplete={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{
              width: '100%', padding: '11px 14px',
              border: '1.5px solid #e8e8e8', borderRadius: '10px',
              fontSize: '14px', fontFamily: 'inherit', outline: 'none',
              background: '#fafafa', color: '#1a1a1a', boxSizing: 'border-box',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              paddingRight: extra ? '42px' : '14px',
            }}
            onFocus={e => { e.target.style.borderColor = '#d70018'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(215,0,24,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#e8e8e8'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
          />
          {extra}
        </div>
      </div>
    );
  }

  render() {
    const { step, error, loading, showPw, activateError, activating, activateSuccess,
            txtUsername, txtPassword, txtName, txtPhone, txtEmail, txtToken, newCustomerId } = this.state;

    return (
      <div style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px',
        background: 'linear-gradient(135deg,#fff5f5 0%,#fff 50%,#fff5f5 100%)',
      }}>
        <style>{`
          .auth-inp:focus { border-color:#d70018!important; background:#fff!important; box-shadow:0 0 0 3px rgba(215,0,24,0.08)!important; }
          @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
          @keyframes successPop { 0%{transform:scale(0.8);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        `}</style>

        {step === 'signup' ? (
          // ══════════ STEP 1: ĐĂNG KÝ ══════════
          <div style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '440px',
            boxShadow: '0 12px 48px rgba(215,0,24,0.10), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1.5px solid #f5e0e0', overflow: 'hidden',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg,#d70018,#ff6b6b,#d70018)' }} />
            <div style={{ padding: '32px 36px' }}>

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
                { label: 'Tên đăng nhập', name: 'username', type: 'text', placeholder: 'Nhập username...', value: txtUsername, onChange: this.handleUsernameChange },
                { label: 'Họ và tên',     name: 'name',     type: 'text', placeholder: 'Nhập họ và tên...', value: txtName, onChange: this.handleNameChange },
                { label: 'Số điện thoại', name: 'phone',    type: 'tel',  placeholder: 'Nhập số điện thoại...', value: txtPhone, onChange: this.handlePhoneChange },
                { label: 'Email',         name: 'email',    type: 'email',placeholder: 'Nhập email...', value: txtEmail, onChange: this.handleEmailChange },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>{f.label}</label>
                  <input
                    className="auth-inp"
                    type={f.type} name={f.name} autoComplete={f.name}
                    placeholder={f.placeholder} value={f.value} onChange={f.onChange}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fafafa', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
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
                    style={{ width: '100%', padding: '11px 42px 11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', background: '#fafafa', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  />
                  <button type="button" onClick={() => this.setState({ showPw: !showPw })}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#aaa', padding: '2px' }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={() => this.handleSignup()}
                disabled={loading}
                style={{ width: '100%', padding: '13px', background: loading ? '#e8a0a8' : 'linear-gradient(135deg,#d70018,#ff2233)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(215,0,24,0.35)', transition: 'all 0.2s', marginBottom: '16px' }}
              >
                {loading ? '⏳ Đang tạo tài khoản...' : '🚀 Tạo tài khoản'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '13.5px', color: '#888', margin: 0 }}>
                Đã có tài khoản?{' '}
                <span onClick={() => this.props.navigate('/login')} style={{ color: '#d70018', fontWeight: 800, cursor: 'pointer' }}>
                  Đăng nhập ngay
                </span>
              </p>
            </div>
          </div>

        ) : (
          // ══════════ STEP 2: KÍCH HOẠT ══════════
          <div style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px',
            boxShadow: '0 12px 48px rgba(215,0,24,0.10), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1.5px solid #f5e0e0', overflow: 'hidden',
            animation: 'slideUp 0.3s ease',
          }}>
            {/* Red header */}
            <div style={{ background: 'linear-gradient(135deg,#d70018,#9a0010)', padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: '180px', height: '180px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', top: '-60px', right: '-40px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                  🔐
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Xác nhận tài khoản</h2>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: 0 }}>Mã kích hoạt đã được gửi về email của bạn</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '24px 32px 28px' }}>

              {/* Email notice */}
              <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #86efac', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>📧</span>
                <div style={{ fontSize: '13px', color: '#15803d', lineHeight: 1.5 }}>
                  <strong>Email đã được gửi!</strong> Kiểm tra hộp thư <strong style={{ color: '#d70018' }}>{txtEmail}</strong> để lấy <strong>User ID</strong> và <strong>Mã kích hoạt</strong>.
                </div>
              </div>

              {activateSuccess ? (
                // Success state
                <div style={{ textAlign: 'center', padding: '20px 0', animation: 'successPop 0.4s ease' }}>
                  <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#059669', margin: '0 0 6px' }}>Kích hoạt thành công!</h3>
                  <p style={{ fontSize: '13px', color: '#555', margin: '0 0 20px' }}>Tài khoản của bạn đã sẵn sàng. Hãy đăng nhập để mua sắm!</p>
                  <button type="button" onClick={() => this.props.navigate('/login')}
                    style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#d70018,#ff2233)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(215,0,24,0.35)' }}>
                    🔐 Đăng nhập ngay
                  </button>
                </div>
              ) : (
                <>
                  {activateError && (
                    <div style={{ background: 'rgba(215,0,24,0.07)', border: '1px solid rgba(215,0,24,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', color: '#d70018', fontSize: '13px' }}>
                      ⚠️ {activateError}
                    </div>
                  )}

                  {/* User ID (pre-filled, readonly) */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>User ID</label>
                    <input
                      type="text" readOnly value={newCustomerId}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #d70018', borderRadius: '10px', fontSize: '13px', fontFamily: 'monospace', fontWeight: 700, color: '#d70018', background: '#fff8f8', boxSizing: 'border-box', letterSpacing: '0.5px' }}
                    />
                    <p style={{ fontSize: '11px', color: '#bbb', margin: '4px 0 0 2px' }}>🔒 ID này đã được điền sẵn từ tài khoản vừa tạo</p>
                  </div>

                  {/* Token input */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>Mã kích hoạt (Token)</label>
                    <input
                      className="auth-inp"
                      type="text" name="token" autoComplete="off"
                      placeholder="Nhập mã token từ email..."
                      value={txtToken} onChange={this.handleTokenChange}
                      onKeyDown={e => e.key === 'Enter' && this.handleActivate()}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', fontFamily: 'monospace', outline: 'none', background: '#fafafa', color: '#1a1a1a', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s', letterSpacing: '0.5px' }}
                    />
                    <p style={{ fontSize: '11.5px', color: '#bbb', margin: '5px 0 0 2px' }}>💡 Token có trong email xác nhận vừa gửi đến {txtEmail}</p>
                  </div>

                  {/* Activate button */}
                  <button
                    type="button"
                    onClick={() => this.handleActivate()}
                    disabled={activating}
                    style={{ width: '100%', padding: '13px', background: activating ? '#e8a0a8' : 'linear-gradient(135deg,#d70018,#ff2233)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 800, cursor: activating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(215,0,24,0.35)', transition: 'all 0.2s', marginBottom: '14px' }}
                  >
                    {activating ? '⏳ Đang kích hoạt...' : '🔓 Kích hoạt tài khoản'}
                  </button>

                  {/* Resend */}
                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#aaa', margin: 0 }}>
                    Không nhận được email?{' '}
                    <span onClick={() => this.handleResend()} style={{ color: '#d70018', fontWeight: 700, cursor: 'pointer' }}>
                      Gửi lại
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
        )}
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
    this.setState({ loading: true, error: '' });
    axios.post('/api/customer/signup', {
      username: txtUsername, password: txtPassword,
      name: txtName, phone: txtPhone, email: txtEmail,
    }).then(res => {
      this.setState({ loading: false });
      if (res.data.success) {
        // Move to activation step with customer ID pre-filled
        this.setState({
          step: 'activate',
          newCustomerId: res.data.customer?._id || '',
        });
      } else {
        this.setState({ error: res.data.message || 'Đăng ký thất bại!' });
      }
    }).catch(() => this.setState({ loading: false, error: 'Lỗi kết nối server!' }));
  }

  handleActivate() {
    const { newCustomerId, txtToken } = this.state;
    if (!txtToken.trim()) {
      this.setState({ activateError: 'Vui lòng nhập mã token!' });
      return;
    }
    this.setState({ activating: true, activateError: '' });
    axios.post('/api/customer/active', { id: newCustomerId, token: txtToken.trim() })
      .then(res => {
        this.setState({ activating: false });
        if (res.data) {
          this.setState({ activateSuccess: true });
        } else {
          this.setState({ activateError: 'Mã token không đúng. Vui lòng kiểm tra lại email!' });
        }
      })
      .catch(() => this.setState({ activating: false, activateError: 'Lỗi kết nối server!' }));
  }

  handleResend() {
    const { txtEmail, newCustomerId } = this.state;
    if (!txtEmail) return;
    axios.post('/api/customer/resend-activation', { email: txtEmail, id: newCustomerId })
      .then(() => alert('📧 Đã gửi lại email kích hoạt đến ' + txtEmail))
      .catch(() => alert('Lỗi gửi mail, vui lòng thử lại!'));
  }
}

export default withRouter(Signup);
