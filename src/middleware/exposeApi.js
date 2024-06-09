export default apisMeta => {
  const apisPath = Object.keys(apisMeta)
  apisPath.sort((x, y) => (x > y ? 1 : -1))
  return (req, res, next) => {
    const exposeApis = {}
    for (const path of apisPath) {
      const apiData = apisMeta[path]
      exposeApis[apisMeta[path].route] = {
        name: apiData.name,
        desc: apiData.desc,
        parameters: apiData.parameters
      }
    }
    req.exposeApis = exposeApis
    next()
  }
}
