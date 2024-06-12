import Logger from '@sumor/logger'

let requestSequence = 0

export default (req, res, next) => {
  const acceptLanguage = req.get('accept-language') || process.env.LANGUAGE || 'en'
  const languageList = acceptLanguage.split(',')
  req.client = {
    id: ++requestSequence,
    ip: req.headers['x-forwarded-for'] || '0.0.0.0',
    language: languageList[0],
    timezone: req.get('sumor-timezone') || process.env.TIMEZONE || 'Asia/Shanghai'
  }

  req.logger = new Logger({
    scope: 'PROGRAM',
    id: req.client.id
  })

  const httpLogger = new Logger({
    scope: 'HTTP',
    id: req.client.id
  })
  const agent = req.headers['user-agent'] || 'unknown agent'
  httpLogger.info(`${req.method} ${req.originalUrl} IP/${req.client.ip} ${agent}`)

  next()
}
