export function setReturlUrl({ignoredPaths = []}) {
  return (req, res, next) => {
    if (ignoredPaths.every(route => req.originalUrl.indexOf(route) !== 0)) {
      req.session.returnUrl = req.originalUrl;
    }
    next();
  };
}
