// port number prefix is 405

import { describe, expect, it } from '@jest/globals'
import createApp from '@sumor/ssl-server'
import axios from 'axios'
import https from 'https'
import apiMiddleware from '../src/index.js'

const port = 40500
describe('entry', () => {
  it('host', async () => {
    const app = createApp()
    await apiMiddleware(app, `${process.cwd()}/test/demo`)
    await app.listen(port)

    try {
      const response1 = await axios({
        method: 'get',
        url: `https://localhost:${port}/plus?a=1&b=2`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response1.data.data).toBe(3)

      let error1
      try {
        await axios({
          method: 'get',
          url: `https://localhost:${port}/plus?a=1111&b=2`,
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        })
      } catch (e) {
        error1 = e
      }
      expect(error1.response.data.code).toBe('SUMOR_API_FIELDS_VALIDATION_FAILED')

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })
})
