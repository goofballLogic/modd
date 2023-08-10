export function WhenIdle(handler) {
    return message =>
        requestIdleCallback(() => handler(message), { timeout: 500 });
}
