namespace Messages.Taxonomy
{
    public record CartTotalsUpdated(int ItemCount, decimal TotalCost)
        : Message("Cart totals updated") {

        // public CartTotalsUpdated(CartTotalsUpdated cartTotalsUpdated)
        //     : base(cartTotalsUpdated) { }
    }
}
