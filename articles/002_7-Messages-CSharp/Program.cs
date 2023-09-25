using Messages.Taxonomy;
using Messages.Objects;
using Messages.Catalog;

var shopping = Shopping.Instance;

shopping.On(new AddedToCart(Product.YoYo, 2));

shopping.On(new AddedToCart(Product.SkippingRope, 1));

shopping.On(new AtCheckout());
