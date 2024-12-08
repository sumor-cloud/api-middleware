import loadApi from './load.js'
import bodyParser from './middleware/bodyParser.js'
import checkData from './checkData.js'
import fileClearUp from './fileClearUp.js'
import clientEnv from './middleware/clientEnv.js'
import errorCatcher from './error/errorCatcher.js'
import errorMiddleware from './error/errorMiddleware.js'
import sendResponse from './sendResponse.js'

const exposeApis = {}

export default async (app, path, options) => {
  options = options || {}
  options.prepare = options.prepare || function () {}
  options.finalize = options.finalize || function () {}
  options.exception = options.exception || function () {}

  const apisMeta = await loadApi(path, options.prefix)

  for (const path in apisMeta) {
    // add exposeApi to global object
    exposeApis[apisMeta[path].route] = {
      name: apisMeta[path].name,
      desc: apisMeta[path].desc,
      parameters: apisMeta[path].parameters
    }

    let middlewares = bodyParser(apisMeta[path].parameters)

    middlewares.push(clientEnv)

    middlewares.push(async function (req, res, next) {
      req.exposeApis = exposeApis

      // if path is prefix/metadata, return metadata
      if (req.path === `${options.prefix}/metadata`) {
        res.set('Content-Type', 'application/json;charset=utf-8')
        res.json({
          code: 'OK',
          data: exposeApis
        })
      } else {
        next()
      }
    })

    middlewares.push(async function (req, res, next) {
      await options.prepare(req, res)

      req.data = checkData(req.data, apisMeta[path].parameters)
      const response = await apisMeta[path].program(req, res)

      await options.finalize(req, res)

      await fileClearUp(req)

      sendResponse(res, response)
    })

    middlewares = middlewares.map(errorCatcher)

    middlewares.push(async (error, req, res, next) => {
      error.language = req.client.language
      req.logger.trace(error)
      await options.exception(req, res)

      next(error, req, res, next)
    })
    middlewares.push(errorMiddleware)

    app.all(apisMeta[path].route, ...middlewares)
  }
}
