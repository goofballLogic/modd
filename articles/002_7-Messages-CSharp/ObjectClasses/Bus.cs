namespace Messages.ObjectClasses
{
    public abstract class Bus : IObject
    {
        private readonly Queue<Message> _messages = new();

        private readonly IObject[] _handlers;

        protected Bus(IEnumerable<IObject> messageHandlers)
        {
            _handlers = messageHandlers.ToArray();
        }

        public IEnumerable<Message>? On(Message message)
        {
            _messages.Enqueue(message);
            HandleMessages();
            return null;
        }

        private void HandleMessages()
        {
            while (_messages.TryDequeue(out var message))
                HandleMessage(message);
        }

        private void HandleMessage(Message message)
        {
            if (message != null)
            {
                var outboundMessages = _handlers
                    .Select(handler => handler?.On(message))
                    .OfType<IEnumerable<Message>>()
                    .SelectMany(x => x);
                foreach (var outboundMessage in outboundMessages)
                    _messages.Enqueue(outboundMessage);
            }
        }

    }

}
