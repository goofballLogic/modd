namespace Messages.Catalog {

    public record Product(string Sku, decimal Price) {

        public static readonly Product YoYo = new("KAY-123-YOLO", 10.99m);

        public static readonly Product SkippingRope = new("KAT-234-SKR", 14.99m);

    }

}
