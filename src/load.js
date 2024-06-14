import { meta } from '@sumor/config'
import { pathToFileURL } from 'url'
import logger from './i18n/apiLogger.js'

const programCache = {}
const loadProgram = async path => {
  if (!programCache[path]) {
    const result = {}
    try {
      result.program = await import(pathToFileURL(path))
    } catch (e) {
      result.error = e
    }
    programCache[path] = result
  }
  return programCache[path]
}

export default async (path, prefix) => {
  prefix = prefix || ''
  const result = {}
  const apiMeta = await meta(path, ['js'])
  for (const path in apiMeta) {
    apiMeta[path].route = `${prefix}/${path.replace(/\./g, '/')}`
    apiMeta[path].name = apiMeta[path].name || ''
    apiMeta[path].desc = apiMeta[path].desc || ''
    apiMeta[path].parameters = apiMeta[path].parameters || {}

    let hasFile = false
    for (const parameter in apiMeta[path].parameters) {
      if (apiMeta[path].parameters[parameter].type === 'file') {
        hasFile = true
        break
      }
    }

    const filePath = apiMeta[path].js

    let program
    const programResult = await loadProgram(filePath)
    if (programResult.error) {
      apiMeta[path].error = 'syntaxError'
      logger.code('API_LOAD_FAILED_SYNTAX_ERROR', {
        path: apiMeta[path].route
      })
      logger.error(programResult.error)
    } else {
      program = programResult.program
    }

    if (program) {
      if (program.default) {
        program = program.default
        if (hasFile) {
          logger.code('API_LOAD_SUCCESS_WITH_FILE', {
            path: apiMeta[path].route
          })
        } else {
          logger.code('API_LOAD_SUCCESS', { path: apiMeta[path].route })
        }
      } else {
        apiMeta[path].error = 'missingDefaultExport'
        logger.code('API_LOAD_FAILED_MISSING_DEFAULT', {
          path: apiMeta[path].route
        })
      }
      apiMeta[path].program = program
    }
    result[path] = apiMeta[path]
  }
  return result
}
