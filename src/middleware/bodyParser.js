import bodyParser from 'body-parser'

export default [
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  bodyParser.text(),
  (req, res, next) => {
    req.data = { ...req.params, ...req.query, ...req.body }
    next()
  }
]
