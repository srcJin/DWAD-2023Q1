const express = require("express");
const CartService = require("../services/cart");
const router = express.Router();

const dal = require("../dal/cart_items");

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
    "success_messages",
    `Successfully added 1 ${product.attributes.name}`
  );

  res.redirect("/products");
});

module.exports = router;
