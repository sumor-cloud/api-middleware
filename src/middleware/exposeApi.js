export default apisMeta => {
  const apiPaths = Object.keys(apisMeta)
  apiPaths.sort((x, y) => (x > y ? 1 : -1))
  return (req, res, next) => {
    const exposeApis = {}
    for (const path of apiPaths) {
      const apiData = apisMeta[path]
      const route = `/${path.replace(/\./g, '/')}`
      exposeApis[route] = {
        name: apiData.name,
        desc: apiData.desc,
        parameters: apiData.parameters
      }
    }
    req.exposeApis = exposeApis
    next()
  }
}
