namespace Messages.Objects {

    public class Shopping : Bus {

        private Shopping(params IMessageHandler[] handlers) : base(handlers) {}

        public static readonly Shopping Instance = new(
            new Cart(),
            new Checkout()
        );
    }
}
