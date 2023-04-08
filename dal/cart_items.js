const { CartItems } = require("../models");

// SELECT * FROM cart_items WHERE user_id={userId}
exports.getCartForUser = (userId) =>
  CartItems.collection()
    .where({ user_id: userId })
    .fetch({
      require: false,
      withRelated: ["product", "product.category"],
    });

exports.getCartItemByUserAndProduct = (userId, productId) =>
  CartItems.where({ user_id: userId, product_id: productId }).fetch({
    require: false,
  });

exports.createCartItem = (userId, productId, quantity) => {
  const cartItem = new CartItems({
    user_id: userId,
    product_id: productId,
    quantity,
  });
  return cartItem.save();
};

exports.removeFromCart = async (userId, productId) => {
  const cartItem = await this.getCartItemByUserAndProduct(userId, productId);
  if (cartItem) {
    await cartItem.destroy();
  }
};

exports.updateQuantity = async (userId, productId, newQuantity) => {
  const cartItem = await this.getCartItemByUserAndProduct(userId, productId);
  if (cartItem) {
    cartItem.set("quantity", newQuantity);
    return await cartItem.save();
  }

  return null;
};
