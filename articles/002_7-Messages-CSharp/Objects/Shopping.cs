namespace Messages.Objects {

    public class Shopping : Bus {

        private Shopping(params IObject[] handlers) : base(handlers) {}

        public static readonly Shopping Instance = new(
            new Cart(),
            new Checkout()
        );
    }
}
