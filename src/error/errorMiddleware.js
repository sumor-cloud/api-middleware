import getErrorHtml from './getErrorHtml.js'

export default async (error, req, res, next) => {
  const acceptLanguage = req.get('accept-language') || process.env.LANGUAGE || 'en'
  error.language = acceptLanguage.split(',')[0]

  let errorJson = {
    code: error.code || 'UNKNOWN_ERROR',
    message: error.message
  }

  try {
    errorJson = error.json()
  } catch (e) {
    // do nothing
  }

  try {
    res.status(500)
    const accept = req.accepts(['html', 'json'])
    if (accept === 'html') {
      res.send(
        getErrorHtml({
          title: '服务异常，请稍后再试',
          ...errorJson
        })
      )
    } else {
      res.send(errorJson)
    }
  } catch (e) {
    if (e.code !== 'ERR_HTTP_HEADERS_SENT') {
      throw e
    }
  }
}
