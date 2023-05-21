const cartData = require("../dal/cart_items");

class CartService {
  constructor(userId) {
    this.userId = userId;
  }

  getCart() {
    return cartData.getCartForUser(this.userId);
  }

  async addToCart(productId, quantity) {
    let cartItem = await cartData.getCartItemByUserAndProduct(
      this.userId,
      productId
    );
    if (cartItem) {
      return await cartData.updateQuantity(
        this.userId,
        productId,
        quantity + cartItem.get("quantity")
      );
    }

    return await cartData.createCartItem(this.userId, productId, quantity);
  }

  async removeFromCart(productId) {
    await cartData.removeFromCart(this.userId, productId);
  }

  async updateQuantity(productId, newQuantity) {
    let cartItem = await cartData.updateQuantity(
      this.userId,
      productId,
      newQuantity
    );
    return cartItem;
  }
}

module.exports = CartService;
