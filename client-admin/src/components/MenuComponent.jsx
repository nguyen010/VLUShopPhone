import React, { Component } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

function withLocation(ComponentClass) {
  return function (props) {
    const location = useLocation();
    return <ComponentClass {...props} location={location} />;
  };
}

const NAV_ITEMS = [
  { path: '/home',     icon: '📊', label: 'Dashboard' },
  { path: '/product',  icon: '📱', label: 'Sản phẩm' },
  { path: '/category', icon: '📂', label: 'Danh mục' },
  { path: '/order',    icon: '🧾', label: 'Đơn hàng' },
  { path: '/customer', icon: '👥', label: 'Khách hàng' },
];

class Menu extends Component {
  static contextType = MyContext;

  render() {
    const { pathname } = this.props.location;
    const username = this.context.username || 'Admin';

    return (
      <div className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <img
            src="/logo.png"
            alt="VLUPhone"
            style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">VLUPhone</span>
            <span className="sidebar-brand-sub">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={pathname.includes(item.path) ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="sidebar-user-name">{username}</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
          <button
            className="btn btn-delete btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => this.lnkLogoutClick()}
          >
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}

export default withLocation(Menu);
