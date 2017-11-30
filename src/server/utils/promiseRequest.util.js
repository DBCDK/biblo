import request from 'request';

export function promiseRequest(method, req) {
  return new Promise((resolve, reject) => {
    request[method](req, (err, httpResponse) => {
      if (err) {
        reject(err, httpResponse);
      }
      else {
        resolve(httpResponse);
      }
    });
  });
}
