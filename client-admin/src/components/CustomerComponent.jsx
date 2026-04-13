import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

// ── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ customer, onSave, onClose }) {
  const [form, setForm] = React.useState({
    name:     customer.name     || '',
    username: customer.username || '',
    password: '',
    phone:    customer.phone    || '',
    email:    customer.email    || '',
  });
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState('');

  const inp = (label, key, type = 'text', hint = '') => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '5px' }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErr(''); }}
        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#1a1a1a', background: '#fafafa', transition: 'border-color 0.15s' }}
        onFocus={e => e.target.style.borderColor = '#d70018'}
        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
      />
      {hint && <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#bbb' }}>{hint}</p>}
    </div>
  );

  const handleSave = () => {
    if (!form.name || !form.username || !form.phone || !form.email) {
      setErr('Vui lòng điền đầy đủ thông tin!'); return;
    }
    setSaving(true);
    onSave({ ...form }, () => setSaving(false), setErr);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'modalPop 0.2s ease' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1a1f2e,#2d3556)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff' }}>✏️ Chỉnh sửa khách hàng</h3>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Cập nhật thông tin tài khoản</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ padding: '24px' }}>
          {err && <div style={{ background: 'rgba(215,0,24,0.07)', border: '1px solid rgba(215,0,24,0.2)', borderRadius: '8px', padding: '9px 13px', marginBottom: '14px', color: '#d70018', fontSize: '13px' }}>⚠️ {err}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
            {inp('Họ và tên', 'name')}
            {inp('Tên đăng nhập', 'username')}
            {inp('Số điện thoại', 'phone', 'tel')}
            {inp('Email', 'email', 'email')}
          </div>
          {inp('Mật khẩu mới', 'password', 'password', '⚠ Để trống nếu không đổi mật khẩu')}

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', background: '#f3f4f6', border: 'none', borderRadius: '9px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#555' }}>
              Hủy
            </button>
            <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '11px', background: saving ? '#9ca3af' : 'linear-gradient(135deg,#d70018,#ff2233)', border: 'none', borderRadius: '9px', fontSize: '13.5px', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', color: '#fff', boxShadow: '0 4px 14px rgba(215,0,24,0.3)' }}>
              {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Delete Modal ─────────────────────────────────────────────────────
function DeleteModal({ customer, onConfirm, onClose }) {
  const [deleting, setDeleting] = React.useState(false);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'modalPop 0.2s ease' }}>
        <div style={{ padding: '28px 28px 24px', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>🗑️</div>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>Xóa tài khoản?</h3>
          <p style={{ fontSize: '13.5px', color: '#666', margin: '0 0 6px', lineHeight: 1.5 }}>
            Bạn sắp xóa tài khoản <strong style={{ color: '#d70018' }}>{customer.name}</strong>
          </p>
          <p style={{ fontSize: '12.5px', color: '#ef4444', margin: '0 0 24px', background: 'rgba(239,68,68,0.06)', padding: '8px 12px', borderRadius: '8px' }}>
            ⚠️ Hành động này không thể hoàn tác!
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', background: '#f3f4f6', border: 'none', borderRadius: '9px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#555' }}>
              Hủy
            </button>
            <button
              disabled={deleting}
              onClick={() => { setDeleting(true); onConfirm(() => setDeleting(false)); }}
              style={{ flex: 1, padding: '11px', background: deleting ? '#9ca3af' : 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', borderRadius: '9px', fontSize: '13.5px', fontWeight: 800, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', color: '#fff' }}>
              {deleting ? '⏳ Đang xóa...' : '🗑️ Xóa tài khoản'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      selectedCustomer: null,   // clicked row → show orders
      editCustomer: null,        // open edit modal
      deleteCustomer: null,      // open delete confirm modal
      sendingId: null,
      search: '',
    };
  }

  render() {
    const { customers, orders, selectedCustomer, editCustomer, deleteCustomer, sendingId, search } = this.state;

    const filtered = customers.filter(c =>
      !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.username?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
    );

    return (
      <div>
        <style>{`
          @keyframes modalPop { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
          @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
          .cust-row { cursor:pointer; transition:background 0.12s; }
          .cust-row:hover { background:#fafafa !important; }
          .cust-row.active { background:#fff5f5 !important; }
          .act-btn { display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border:none;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.15s;white-space:nowrap; }
          .act-btn:hover { opacity:0.85;transform:translateY(-1px); }
          .act-btn:disabled { opacity:0.5;cursor:not-allowed;transform:none; }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>👥 Quản lý khách hàng</h1>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>{customers.length} tài khoản</p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text" placeholder="🔍 Tìm kiếm khách hàng..."
              value={search}
              onChange={e => this.setState({ search: e.target.value })}
              style={{ padding: '8px 14px 8px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'inherit', outline: 'none', width: '240px', background: '#fff', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#d70018'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '20px' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th style={{ minWidth: '260px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                  {search ? 'Không tìm thấy kết quả' : 'Chưa có khách hàng nào'}
                </td></tr>
              ) : filtered.map(item => (
                <tr
                  key={item._id}
                  className={`cust-row${selectedCustomer?._id === item._id ? ' active' : ''}`}
                  onClick={() => this.handleRowClick(item)}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                        background: item.active === 1 ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '14px', color: '#fff',
                      }}>
                        {(item.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>{item.name}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>{item.phone}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>{item.email}</td>
                  <td>
                    {item.active === 1
                      ? <span style={{ display:'inline-flex',alignItems:'center',gap:'5px',background:'rgba(16,185,129,0.1)',color:'#059669',padding:'4px 11px',borderRadius:'20px',fontSize:'12px',fontWeight:700 }}>✅ Hoạt động</span>
                      : <span style={{ display:'inline-flex',alignItems:'center',gap:'5px',background:'rgba(239,68,68,0.1)',color:'#dc2626',padding:'4px 11px',borderRadius:'20px',fontSize:'12px',fontWeight:700 }}>🚫 Bị khóa</span>}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {/* Lock/Unlock */}
                      {item.active === 1
                        ? <button className="act-btn" style={{ background:'#fef2f2',color:'#ef4444',border:'1px solid #fecaca' }} onClick={() => this.handleToggleActive(item)}>🔒 Khóa</button>
                        : <button className="act-btn" style={{ background:'#f0fdf4',color:'#16a34a',border:'1px solid #bbf7d0' }} onClick={() => this.handleToggleActive(item)}>🔓 Mở khóa</button>
                      }
                      {/* Edit */}
                      <button className="act-btn" style={{ background:'#eff6ff',color:'#2563eb',border:'1px solid #bfdbfe' }} onClick={() => this.setState({ editCustomer: item })}>
                        ✏️ Sửa
                      </button>
                      {/* Delete */}
                      <button className="act-btn" style={{ background:'#fef2f2',color:'#dc2626',border:'1px solid #fecaca' }} onClick={() => this.setState({ deleteCustomer: item })}>
                        🗑️ Xóa
                      </button>
                      {/* Send mail */}
                      <button
                        className="act-btn"
                        disabled={sendingId === item._id}
                        style={{ background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe' }}
                        onClick={() => this.handleSendMail(item._id)}
                      >
                        {sendingId === item._id ? '⏳' : '📧'} Mail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders of selected customer */}
        {selectedCustomer && orders.length > 0 && (
          <div className="card" style={{ padding: 0, overflow: 'hidden', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                🧾 Đơn hàng của: <span style={{ color: 'var(--primary)' }}>{selectedCustomer.name}</span>
              </h3>
              <button onClick={() => this.setState({ selectedCustomer: null, orders: [] })} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)' }}>
                ✕ Đóng
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(item => (
                  <tr key={item._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      #{item._id?.slice(-8)?.toUpperCase()}
                    </td>
                    <td style={{ fontSize: '13px' }}>{new Date(item.cdate).toLocaleDateString('vi-VN')}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{(item.total || 0).toLocaleString()}₫</td>
                    <td>
                      {item.status === 'PENDING'  && <span className="badge badge-warning">⏳ Chờ duyệt</span>}
                      {item.status === 'APPROVED' && <span className="badge badge-success">✅ Đã duyệt</span>}
                      {item.status === 'CANCELED' && <span className="badge badge-danger">❌ Đã hủy</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editCustomer && (
          <EditModal
            customer={editCustomer}
            onClose={() => this.setState({ editCustomer: null })}
            onSave={(data, done, setErr) => this.handleEdit(editCustomer._id, data, done, setErr)}
          />
        )}

        {/* Delete Modal */}
        {deleteCustomer && (
          <DeleteModal
            customer={deleteCustomer}
            onClose={() => this.setState({ deleteCustomer: null })}
            onConfirm={(done) => this.handleDelete(deleteCustomer._id, done)}
          />
        )}
      </div>
    );
  }

  componentDidMount() { this.apiGetCustomers(); }

  handleRowClick(item) {
    if (this.state.selectedCustomer?._id === item._id) {
      this.setState({ selectedCustomer: null, orders: [] });
    } else {
      this.setState({ selectedCustomer: item });
      this.apiGetOrdersByCustID(item._id);
    }
  }

  handleToggleActive(item) {
    const newActive = item.active === 1 ? 0 : 1;
    const label = newActive === 1 ? 'mở khóa' : 'khóa';
    if (!window.confirm(`Xác nhận ${label} tài khoản "${item.name}"?`)) return;
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/active/' + item._id, { active: newActive }, config)
      .then(() => this.apiGetCustomers());
  }

  handleEdit(id, data, done, setErr) {
    const config = { headers: { 'x-access-token': this.context.token } };
    // Only send password if filled
    const body = { ...data };
    if (!body.password) delete body.password;
    axios.put('/api/admin/customers/' + id, body, config)
      .then(res => {
        done();
        if (res.data) {
          this.setState({ editCustomer: null });
          this.apiGetCustomers();
        } else {
          setErr('Cập nhật thất bại!');
        }
      })
      .catch(() => { done(); setErr('Lỗi kết nối server!'); });
  }

  handleDelete(id, done) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/customers/' + id, config)
      .then(() => {
        done();
        this.setState({ deleteCustomer: null, selectedCustomer: null, orders: [] });
        this.apiGetCustomers();
      })
      .catch(() => { done(); alert('Lỗi xóa tài khoản!'); });
  }

  handleSendMail(id) {
    this.setState({ sendingId: id });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config)
      .then(res => {
        this.setState({ sendingId: null });
        alert(res.data?.message || '📧 Đã gửi email!');
      })
      .catch(() => { this.setState({ sendingId: null }); alert('Lỗi gửi mail!'); });
  }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then(res => this.setState({ customers: res.data }));
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then(res => this.setState({ orders: res.data }));
  }
}

export default Customer;
