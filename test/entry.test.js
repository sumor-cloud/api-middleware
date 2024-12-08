// port number prefix is 405

import { describe, expect, it } from '@jest/globals'
import createApp from '@sumor/ssl-server'
import axios from 'axios'
import apiMiddleware from '../src/index.js'

const port = 40500
describe('entry', () => {
  it('host', async () => {
    const app = createApp()
    await apiMiddleware(app, `${process.cwd()}/test/demo`)
    await app.listen(null, port)

    try {
      const response1 = await axios({
        proxy: false,
        method: 'get',
        url: `http://localhost:${port}/plus?a=1&b=2`
      })
      expect(response1.data.data).toBe(3)

      let error1
      try {
        await axios({
          proxy: false,
          method: 'get',
          url: `http://localhost:${port}/plus?a=1111&b=2`
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
