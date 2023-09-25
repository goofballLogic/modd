namespace Messages {
    public interface IMessageHandler
    {
        public IEnumerable<Message>? On(Message message);
    }
}
