import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = { txtID: '', txtName: '' };
  }

  render() {
    const { txtID, txtName } = this.state;
    return (
      <div className="form-card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>
          {txtID ? '✏️ Cập nhật danh mục' : '➕ Thêm danh mục mới'}
        </h3>

        <div className="form-group">
          <label className="form-label">ID</label>
          <input className="form-control" type="text" value={txtID} readOnly placeholder="Tự động tạo" />
        </div>

        <div className="form-group">
          <label className="form-label">Tên danh mục *</label>
          <input
            className="form-control"
            type="text"
            value={txtName}
            placeholder="Nhập tên danh mục..."
            onChange={(e) => this.setState({ txtName: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-add" onClick={(e) => this.btnAddClick(e)}>➕ Thêm</button>
          <button className="btn btn-update" onClick={(e) => this.btnUpdateClick(e)}>✏️ Cập nhật</button>
          <button className="btn btn-delete" onClick={(e) => this.btnDeleteClick(e)}>🗑️ Xóa</button>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && (!prevProps.item || this.props.item._id !== prevProps.item._id)) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName.trim();
    if (name) {
      this.apiPostCategory({ name });
    } else {
      alert('Vui lòng nhập tên danh mục!');
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName } = this.state;
    if (txtID && txtName.trim()) {
      this.apiPutCategory(txtID, { name: txtName.trim() });
    } else {
      alert('Vui lòng chọn danh mục và nhập tên!');
    }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (!this.state.txtID) { alert('Vui lòng chọn danh mục cần xóa!'); return; }
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      this.apiDeleteCategory(this.state.txtID);
    }
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.props.updateCategories(res.data);
    });
  }

  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      if (res.data) {
        alert('✅ Thêm danh mục thành công!');
        this.setState({ txtID: '', txtName: '' });
        this.apiGetCategories();
      }
    });
  }

  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      if (res.data) {
        alert('✅ Cập nhật thành công!');
        this.apiGetCategories();
      }
    });
  }

  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      if (res.data) {
        alert('✅ Đã xóa danh mục!');
        this.setState({ txtID: '', txtName: '' });
        this.apiGetCategories();
      }
    });
  }
}

export default CategoryDetail;
