// port number prefix is 405

import { describe, expect, it } from '@jest/globals'
import createApp from '@sumor/ssl-server'
import axios from 'axios'
import apiMiddleware from '../src/index.js'

let port = 40500
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
  it(
    'upload file',
    async () => {
      const app = createApp()
      await apiMiddleware(app, `${process.cwd()}/test/demo`)
      port++
      await app.listen(null, port)

      try {
        // mock multipart/form-data upload file
        const formData1 = new FormData()
        const file1 = new Blob(['OK'], { type: 'text/plain' })
        formData1.append('file', file1, 'file.txt')
        formData1.append('b', 2)

        const response1 = await axios({
          proxy: false,
          method: 'post',
          url: `http://localhost:${port}/upload?a=1`,
          data: formData1,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        expect(response1.data.data.name).toEqual('file.txt')
        expect(response1.data.data.path).toBeDefined()

        const response2 = await axios({
          proxy: false,
          method: 'post',
          url: `http://localhost:${port}/upload?a=1`,
          data: {
            b: 2
          }
        })

        expect(!!response2.data.data).toBe(false)

        await app.close()
      } catch (e) {
        await app.close()
        throw e
      }
    },
    5 * 1000
  )
})
