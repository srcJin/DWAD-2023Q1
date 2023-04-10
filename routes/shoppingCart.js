const express = require("express");
const CartService = require("../services/cart");
const router = express.Router();
const { FlashMessages } = require("../constants");

router.get("/", async (req, res) => {
  const svc = new CartService(req.session.user.id);
  const cartItems = await svc.getCart();

  res.render("cart/index", {
    shoppingCart: cartItems.toJSON(),
  });
});

router.get("/:product_id/add", async (req, res) => {
  const productId = req.params.product_id;
  const svc = new CartService(req.session.user.id);

  const cartItem = await svc.addToCart(productId, 1);
  const product = await cartItem.product().fetch();

  req.flash(
    FlashMessages.SuccessMessages,
    `Successfully added 1 ${product.attributes.name}`
  );

  res.redirect("/products");
});

router.get("/:product_id/remove", async (req, res) => {
  const productId = req.params.product_id;
  const svc = new CartService(req.session.user.id);

  await svc.removeFromCart(productId);

  req.flash(FlashMessages.SuccessMessages, "Successfully removed from cart");
  res.redirect("/cart");
});

router.post("/:product_id/quantity/update", async (req, res) => {
  const productId = req.params.product_id;
  const svc = new CartService(req.session.user.id);

  const newQuantity = parseInt(req.body.newQuantity);
  if (newQuantity <= 0) {
    req.flash(FlashMessages.ErrorMessages, "Cannot have less than 1 quantity");
    res.redirect("/cart");
    return;
  }

  const cartItem = await svc.updateQuantity(productId, newQuantity);
  const product = await cartItem.product().fetch();

  req.flash(
    FlashMessages.SuccessMessages,
    "Successfully updated quantity for " + product.attributes.name
  );
  res.redirect("/cart");
});

module.exports = router;
