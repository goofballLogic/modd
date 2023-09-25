namespace Messages {

    public abstract record Message {

        public readonly string Description;

        public Message(string description) {
            Description = description;
        }

    }

}
