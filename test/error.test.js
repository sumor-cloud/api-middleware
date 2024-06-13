// port number prefix is 403

import { describe, expect, it } from '@jest/globals'
import createApp from '@sumor/ssl-server'
import axios from 'axios'
import errorCatcher from '../src/error/errorCatcher.js'
import errorMiddleware from '../src/error/errorMiddleware.js'
import APIError from '../src/i18n/APIError.js'
import https from 'https'

const port = 40300
describe('error', () => {
  it('error catcher', async () => {
    const app = createApp()

    try {
      app.use(
        errorCatcher(async (req, res, next) => {
          req.customErrorMessage = 'test error'
          next()
        })
      )
      app.use(
        errorCatcher(async (req, res) => {
          throw new Error(req.customErrorMessage)
        })
      )

      app.get(
        '/error',
        errorCatcher(async (req, res) => {
          res.send('not catch error')
        })
      )

      app.use((err, req, res, next) => {
        res.send(err.message)
      })

      await app.listen(port)

      const response = await axios({
        method: 'get',
        url: `https://localhost:${port}/error`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response.data).toEqual('test error')

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })

  it('error middleware', async () => {
    const app = createApp()

    try {
      app.use(
        '/error',
        errorCatcher(async (req, res) => {
          throw new Error('test error')
        })
      )

      app.get(
        '/error',
        errorCatcher(async (req, res) => {
          res.send('not catch error')
        })
      )

      app.get(
        '/error2',
        errorCatcher(async (req, res) => {
          throw new APIError('SUMOR_API_FIELDS_VALIDATION_FAILED', {}, [
            new APIError('SUMOR_API_FIELDS_VALIDATION_FAILED')
          ])
        })
      )

      app.use(errorMiddleware)

      await app.listen(port)

      let error1
      try {
        await axios({
          method: 'get',
          url: `https://localhost:${port}/error`,
          headers: {
            Accept: 'application/json'
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })
      } catch (e) {
        error1 = e
      }
      expect(error1.response.data).toEqual({ code: 'UNKNOWN_ERROR', message: 'test error' })

      let error2
      try {
        await axios({
          method: 'get',
          url: `https://localhost:${port}/error2`,
          headers: {
            Accept: 'text/html'
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })
      } catch (e) {
        error2 = e
      }
      expect(error2.response.data.substring(0, 6)).toEqual('<html>')
      expect(error2.response.data).toContain('SUMOR_API_FIELDS_VALIDATION_FAILED')
      expect(error2.response.data).toContain('API fields validation failed')

      let error3
      try {
        await axios({
          method: 'get',
          url: `https://localhost:${port}/error2`,
          headers: {
            Accept: 'application/json'
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })
      } catch (e) {
        error3 = e
      }
      expect(error3.response.data).toEqual({
        code: 'SUMOR_API_FIELDS_VALIDATION_FAILED',
        message: 'API fields validation failed',
        errors: [
          {
            code: 'SUMOR_API_FIELDS_VALIDATION_FAILED',
            message: 'API fields validation failed'
          }
        ]
      })

      // multiple language
      let error4
      try {
        await axios({
          method: 'get',
          url: `https://localhost:${port}/error2`,
          headers: {
            Accept: 'application/json',
            'Accept-Language': 'zh-CN'
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })
      } catch (e) {
        error4 = e
      }
      expect(error4.response.data.message).toEqual('API 字段验证失败')

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })
})
