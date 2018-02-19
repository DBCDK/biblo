/**
 * @file
 * The Dispatcher is a wrapper for socket.io. It will handle all communication
 * between server and client
 */

/**
 * Register events when a new connections is made.
 *
 * @param transform
 * @param connection
 */
function registerEventOnConnection(transform, connection) {
  const event = transform.event();
  connection.on(`${event}Request`, (request) => {
    transform.trigger(request, connection).forEach((responsePromise) => {
      responsePromise
        .then(response => connection.emit(`${event}Response`, response))
        .catch(error => connection.emit(`${event}Response`, {error}));
    });
  });
}

/**
 * Register events from the provider on new connections
 *
 * @param transforms
 * @param io
 * @constructor
 */
export default function Dispatcher(transforms, io) {
  io.use((connection, next) => {
    transforms.forEach((transform) => registerEventOnConnection(transform, connection));
    next();
  });
}
