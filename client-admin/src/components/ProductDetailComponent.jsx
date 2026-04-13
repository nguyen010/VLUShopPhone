import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: '',
      cmbCategory: '',
      imgProduct: '',
      loading: false
    };
  }

  render() {
    const { categories, txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;

    return (
      <div className="form-card">
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-primary)' }}>
          {txtID ? '✏️ Cập nhật sản phẩm' : '➕ Thêm sản phẩm mới'}
        </h3>

        <div className="form-group">
          <label className="form-label">ID</label>
          <input className="form-control" type="text" value={txtID} readOnly placeholder="Tự động tạo" />
        </div>

        <div className="form-group">
          <label className="form-label">Tên sản phẩm *</label>
          <input
            className="form-control"
            type="text"
            value={txtName}
            placeholder="Nhập tên sản phẩm..."
            onChange={(e) => this.setState({ txtName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Giá bán (VNĐ) *</label>
          <input
            className="form-control"
            type="number"
            value={txtPrice}
            placeholder="Nhập giá..."
            onChange={(e) => this.setState({ txtPrice: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Danh mục *</label>
          <select
            className="form-control"
            value={cmbCategory}
            onChange={(e) => this.setState({ cmbCategory: e.target.value })}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cate) => (
              <option key={cate._id} value={cate._id}>{cate.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Hình ảnh</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={(e) => this.previewImage(e)}
            style={{ padding: '8px', cursor: 'pointer' }}
          />
          {imgProduct && (
            <img src={imgProduct} className="img-preview" alt="preview" />
          )}
        </div>

        <div className="form-actions">
          <button className="btn btn-add" onClick={(e) => this.btnAddClick(e)}>
            ➕ Thêm mới
          </button>
          <button className="btn btn-update" onClick={(e) => this.btnUpdateClick(e)}>
            ✏️ Cập nhật
          </button>
          <button className="btn btn-delete" onClick={(e) => this.btnDeleteClick(e)}>
            🗑️ Xóa
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item && this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image
      });
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => this.setState({ imgProduct: evt.target.result });
    reader.readAsDataURL(file);
  }

  btnAddClick(e) {
    e.preventDefault();
    const { txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    if (!txtName || !txtPrice || !cmbCategory) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (!imgProduct.startsWith('data:image')) {
      alert('Vui lòng chọn hình ảnh!');
      return;
    }
    const image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
    this.apiPostProduct({ name: txtName, price: parseInt(txtPrice), category: cmbCategory, image });
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtID, txtName, txtPrice, cmbCategory, imgProduct } = this.state;
    if (!txtID) { alert('Vui lòng chọn sản phẩm cần cập nhật!'); return; }
    if (!txtName || !txtPrice || !cmbCategory) { alert('Vui lòng điền đầy đủ thông tin!'); return; }
    let image = imgProduct;
    if (imgProduct.startsWith('data:image')) {
      image = imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
    }
    this.apiPutProduct(txtID, { name: txtName, price: parseInt(txtPrice), category: cmbCategory, image });
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (!this.state.txtID) { alert('Vui lòng chọn sản phẩm cần xóa!'); return; }
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      this.apiDeleteProduct(this.state.txtID);
    }
  }

  resetForm() {
    this.setState({ txtID: '', txtName: '', txtPrice: '', cmbCategory: '', imgProduct: '' });
  }

  apiGetCategories() {
    axios.get('/api/admin/categories', { headers: { 'x-access-token': this.context.token } })
      .then((res) => this.setState({ categories: res.data }));
  }

  apiGetProducts() {
    axios.get(`/api/admin/products?page=${this.props.curPage}`, { headers: { 'x-access-token': this.context.token } })
      .then((res) => {
        const result = res.data;
        this.props.updateProducts(result.products, result.noPages);
      });
  }

  apiPostProduct(prod) {
    axios.post('/api/admin/products', prod, { headers: { 'x-access-token': this.context.token } })
      .then(() => { alert('✅ Thêm sản phẩm thành công!'); this.resetForm(); this.apiGetProducts(); });
  }

  apiPutProduct(id, prod) {
    axios.put(`/api/admin/products/${id}`, prod, { headers: { 'x-access-token': this.context.token } })
      .then(() => { alert('✅ Cập nhật thành công!'); this.apiGetProducts(); });
  }

  apiDeleteProduct(id) {
    axios.delete(`/api/admin/products/${id}`, { headers: { 'x-access-token': this.context.token } })
      .then(() => { alert('✅ Đã xóa sản phẩm!'); this.resetForm(); this.apiGetProducts(); });
  }
}

export default ProductDetail;
