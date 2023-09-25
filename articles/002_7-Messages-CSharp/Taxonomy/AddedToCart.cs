using Messages.Catalog;

namespace Messages.Taxonomy
{
    public record AddedToCart(Product Product, int Quantity)
        : Message("Added to cart");

}
