import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }

  render() {
    const { categories, itemSelected } = this.state;

    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">📂 Quản lý danh mục</h1>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {categories.length} danh mục
          </span>
        </div>

        <div className="split-layout" style={{ gridTemplateColumns: '1fr 320px' }}>
          {/* List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Tên danh mục</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Chưa có danh mục</td></tr>
                ) : categories.map((item, idx) => (
                  <tr
                    key={item._id}
                    onClick={() => this.setState({ itemSelected: item })}
                    style={{ background: itemSelected?._id === item._id ? '#fff8f8' : '' }}
                  >
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{idx + 1}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {item._id?.slice(-10)}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail */}
          <CategoryDetail
            item={itemSelected}
            updateCategories={this.updateCategories}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  updateCategories = (categories) => {
    this.setState({ categories });
  };

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      this.setState({ categories: res.data });
    });
  }
}

export default Category;
