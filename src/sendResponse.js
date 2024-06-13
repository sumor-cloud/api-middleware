export default (res, data) => {
  let currentContentType = res.get('Content-Type')
  if (!currentContentType) {
    res.set('Content-Type', 'application/json;charset=utf-8')
    currentContentType = 'application/json;charset=utf-8'
  }
  let result
  if (!currentContentType.includes('application/json')) {
    result = data || ''
  } else {
    result = {
      code: 'OK'
    }
    if (data) {
      result.data = data
    }
  }
  try {
    res.send(result)
  } catch (e) {
    if (e.code !== 'ERR_HTTP_HEADERS_SENT') {
      throw e
    }
  }
}
