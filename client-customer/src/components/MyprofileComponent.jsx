import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myprofile extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '', txtPassword: '',
      txtName: '', txtPhone: '', txtEmail: '',
      success: false, error: ''
    };
  }

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;
    const { success, error } = this.state;

    return (
      <div className="profile-page">
        <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>👤 Hồ sơ cá nhân</h1>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #eee', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {success && (
            <div style={{ background: 'rgba(0,166,80,0.08)', border: '1px solid rgba(0,166,80,0.25)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#00a650', fontSize: '13px' }}>
              ✅ Cập nhật thông tin thành công!
            </div>
          )}
          {error && (
            <div style={{ background: 'rgba(215,0,24,0.06)', border: '1px solid rgba(215,0,24,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#d70018', fontSize: '13px' }}>
              ⚠️ {error}
            </div>
          )}

          {[
            { label: 'Tên đăng nhập', key: 'txtUsername', type: 'text' },
            { label: 'Mật khẩu', key: 'txtPassword', type: 'password' },
            { label: 'Họ và tên', key: 'txtName', type: 'text' },
            { label: 'Số điện thoại', key: 'txtPhone', type: 'tel' },
            { label: 'Email', key: 'txtEmail', type: 'email' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                {f.label}
              </label>
              <input
                type={f.type}
                value={this.state[f.key]}
                onChange={(e) => this.setState({ [f.key]: e.target.value, success: false, error: '' })}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', fontFamily: 'Be Vietnam Pro, sans-serif', outline: 'none', transition: 'border-color 0.2s', color: '#1a1a1a' }}
                onFocus={(e) => e.target.style.borderColor = '#d70018'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>
          ))}

          <button
            onClick={(e) => this.handleUpdate(e)}
            style={{ width: '100%', padding: '13px', background: '#d70018', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif', boxShadow: '0 4px 16px rgba(215,0,24,0.3)', marginTop: '4px' }}
          >
            💾 Lưu thay đổi
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const c = this.context.customer;
    if (c) {
      this.setState({
        txtUsername: c.username || '',
        txtPassword: c.password || '',
        txtName: c.name || '',
        txtPhone: c.phone || '',
        txtEmail: c.email || ''
      });
    }
  }

  handleUpdate(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    if (!txtUsername || !txtPassword || !txtName || !txtPhone || !txtEmail) {
      this.setState({ error: 'Vui lòng điền đầy đủ thông tin!' });
      return;
    }

    const id = this.context.customer._id;
    const customer = { username: txtUsername, password: txtPassword, name: txtName, phone: txtPhone, email: txtEmail };

    // FIX: dùng relative URL thay vì hardcoded localhost:3001
    axios.put('/api/customer/customers/' + id, customer, {
      headers: { 'x-access-token': this.context.token }
    }).then((res) => {
      if (res.data) {
        this.setState({ success: true, error: '' });
        this.context.setCustomer(res.data);
      } else {
        this.setState({ error: 'Cập nhật thất bại!' });
      }
    }).catch(() => this.setState({ error: 'Lỗi kết nối server!' }));
  }
}

export default Myprofile;
