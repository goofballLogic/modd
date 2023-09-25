namespace Messages.Taxonomy
{
    public record CartTotalsUpdated(int ItemCount, decimal TotalCost)
        : Message("Cart totals updated") {
    }
}
