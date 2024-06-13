export default middleware => {
  return async (req, res, next) => {
    if (!(req instanceof Error)) {
      try {
        await middleware(req, res, next)
      } catch (e) {
        next(e, req, res, next)
      }
    }
  }
}
