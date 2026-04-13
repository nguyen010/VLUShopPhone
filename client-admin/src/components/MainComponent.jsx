import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';

class Main extends Component {
  static contextType = MyContext;

  render() {
    if (this.context.token === '') {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="body-admin">
        <Menu />
        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="category" element={<Category />} />
            <Route path="product" element={<Product />} />
            <Route path="order" element={<Order />} />
            <Route path="customer" element={<Customer />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default Main;
