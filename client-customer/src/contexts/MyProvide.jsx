import React, { Component } from 'react';
import MyContext from './MyContext';

const CART_KEY = 'vluphone_cart';

class MyProvider extends Component {
  constructor(props) {
    super(props);

    // Load giỏ hàng từ localStorage khi khởi động
    let savedCart = [];
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) savedCart = JSON.parse(raw);
    } catch (e) {
      savedCart = [];
    }

    this.state = {
      token: '',
      customer: null,
      mycart: savedCart,

      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
    };
  }

  setToken = (value) => {
    this.setState({ token: value });
  }

  setCustomer = (value) => {
    this.setState({ customer: value });
  }

  setMycart = (value) => {
    // Lưu vào localStorage mỗi khi giỏ hàng thay đổi
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(value));
    } catch (e) {
      console.warn('Cannot save cart to localStorage');
    }
    this.setState({ mycart: value });
  }

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;
