import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Menu from './MenuComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Myorders from './MyordersComponent';
import Checkout from './CheckoutComponent';
import Footer from './FooterComponent';

class Main extends Component {
  render() {
    return (
      <div className="body-customer">
        <Menu />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/product/category/:cid" element={<Product />} />
            <Route path="/product/search/:keyword" element={<Product />} />
            <Route path="/product/price/:min/:max" element={<Product />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/active" element={<Active />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myprofile" element={<Myprofile />} />
            <Route path="/mycart" element={<Mycart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/myorders" element={<Myorders />} />
          </Routes>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Main;
