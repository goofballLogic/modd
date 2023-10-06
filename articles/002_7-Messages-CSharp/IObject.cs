namespace Messages {
    public interface IObject
    {
        public IEnumerable<Message>? On(Message message);
    }
}
