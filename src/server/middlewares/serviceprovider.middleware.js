'use strict';

function callServiceProvider(req, res, next, event, query, timeout) {
  return new Promise((resolve, reject) => {
    let promises = [];
    let timer;
    if (timeout && timeout > 0) {
      promises.push(new Promise((resolve1, reject1) => {
        timer = setTimeout(reject1, timeout, {error: 'Promise timed out!'});
      }));
    }

    let connection = {
      request: {
        user: req.user,
        session: req.session
      }
    };

    promises.push(new Promise((resolve2, reject2) => {
      Promise.all(req.app.get('serviceProvider').trigger(event, query, connection))
        .then((result) => {
          resolve2(result);
        })
        .catch((err) => {
          reject2(err);
        });
    }));

    Promise.race(promises).then((result) => {
      clearTimeout(timer);
      resolve(result);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

export function ssrMiddleware(req, res, next) {
  req.callServiceProvider = (event, query, timeout) => callServiceProvider(req, res, next, event, query, timeout);
  next();
}
