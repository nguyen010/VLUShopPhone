import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }

  render() {
    const { products, noPages, curPage, itemSelected } = this.state;

    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">📱 Quản lý sản phẩm</h1>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {products.length} sản phẩm trên trang này
          </span>
        </div>

        <div className="split-layout">
          {/* LEFT: List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá bán</th>
                  <th>Danh mục</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có sản phẩm nào</td></tr>
                ) : products.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => this.trItemClick(item)}
                    style={{ background: itemSelected?._id === item._id ? '#fff8f8' : '' }}
                  >
                    <td>
                      <img
                        src={`data:image/jpg;base64,${item.image}`}
                        width="48" height="48"
                        style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }}
                        alt=""
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{item.name}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {(item.price || 0).toLocaleString()}₫
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-info">{item.category?.name}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
              <div className="pagination">
                {Array.from({ length: noPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`page-btn ${page === curPage ? 'active' : ''}`}
                    onClick={() => page !== curPage && this.lnkPageClick(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Detail */}
          <ProductDetail
            item={itemSelected}
            curPage={curPage}
            updateProducts={this.updateProducts}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetProducts(1);
  }

  lnkPageClick(page) {
    this.setState({ itemSelected: null });
    this.apiGetProducts(page);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  updateProducts = (products, noPages) => {
    this.setState({ products, noPages });
  };

  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/admin/products?page=${page}`, config).then((res) => {
      const result = res.data;
      this.setState({
        products: result.products,
        noPages: result.noPages,
        curPage: result.curPage
      });
    });
  }
}

export default Product;
