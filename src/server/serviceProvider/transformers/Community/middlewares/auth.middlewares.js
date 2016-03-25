'use strict';

export function quarantinedMiddleware(thisArg, uid, next) {
  return thisArg.callServiceClient('community', 'checkIfProfileIsQuarantined', uid).then((quarantine) => {
    if (JSON.parse(quarantine.body).quarantined) {
      return Promise.resolve({
        statusCode: 403,
        body: {},
        errors: [{
          field: 'general',
          errorMessage: 'Du er i karantæne!'
        }]
      });
    }

    return next();
  });
}
