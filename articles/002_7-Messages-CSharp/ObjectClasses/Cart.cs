using Messages;
using Messages.Catalog;
using Messages.Taxonomy;

public class Cart : IMessageHandler {

    private readonly List<(Product, int)> _added = new();
    private int _itemCount;
    private decimal _totalCost;

    public IEnumerable<Message>? On(Message message) => message switch {
        AddedToCart addedToCart => HandleAddedToCart(addedToCart),
        _ => null
    };

    private IEnumerable<Message>? HandleAddedToCart(AddedToCart addedToCart)
    {
        var (product, quantity) = (addedToCart.Product, addedToCart.Quantity);
        _added.Add((product, quantity));
        _totalCost += quantity * product.Price;
        _itemCount += quantity;
        return new[] { new CartTotalsUpdated(_itemCount, _totalCost) };
    }

}
