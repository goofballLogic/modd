
using Messages.Taxonomy;

namespace Messages.ObjectClasses
{

    public class Checkout : IMessageHandler
    {

        private CartTotalsUpdated _latestTotals = new(0, 0);

        public IEnumerable<Message>? On(Message message) => message switch
        {
            CartTotalsUpdated cartTotalsUpdated => OnCartTotalsUpdated(cartTotalsUpdated),
            AtCheckout _ => OnAtCheckout(),
            _ => null
        };

        private IEnumerable<Message>? OnAtCheckout()
        {
            Console.WriteLine($"{_latestTotals.ItemCount} items, total cost: {_latestTotals.TotalCost}");
            return null;
        }

        private IEnumerable<Message>? OnCartTotalsUpdated(CartTotalsUpdated cartTotalsUpdated)
        {
            _latestTotals = cartTotalsUpdated with {};
            return null;
        }
    }
}
