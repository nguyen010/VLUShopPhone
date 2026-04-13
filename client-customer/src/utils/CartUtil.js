const CartUtil = {
  getTotal(mycart) {
    if (!mycart || mycart.length === 0) return 0;

    return mycart.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }
};

export default CartUtil;