// port number prefix is 404

import { describe, expect, it } from '@jest/globals'
import createApp from '@sumor/ssl-server'
import sendResponse from '../src/sendResponse.js'
import axios from 'axios'
import https from 'https'

const port = 40400
describe('send response', () => {
  it('main', async () => {
    const app = createApp()
    app.get('/json1', (req, res) => {
      res.set('Content-Type', 'application/json')
      sendResponse(res, { a: 1 })
    })
    app.get('/json2', (req, res) => {
      res.set('content-type', 'application/json')
      sendResponse(res, { a: 1 })
    })
    app.get('/json3', (req, res) => {
      sendResponse(res, { a: 1 })
    })
    app.get('/html', (req, res) => {
      res.set('Content-Type', 'text/html')
      sendResponse(res, '<html></html>')
    })
    app.get('/emptyHtml', (req, res) => {
      res.set('Content-Type', 'text/html')
      sendResponse(res, undefined)
    })
    app.get('/redirect', (req, res) => {
      res.redirect('/json1')
      sendResponse(res, { a: 2 })
    })
    await app.listen(port)

    try {
      const response1 = await axios({
        method: 'get',
        url: `https://localhost:${port}/json1`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response1.data).toEqual({
        code: 'OK',
        data: { a: 1 }
      })

      const response2 = await axios({
        method: 'get',
        url: `https://localhost:${port}/json2`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response2.data).toEqual({
        code: 'OK',
        data: { a: 1 }
      })

      const response3 = await axios({
        method: 'get',
        url: `https://localhost:${port}/json3`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response3.data).toEqual({
        code: 'OK',
        data: { a: 1 }
      })

      const response4 = await axios({
        method: 'get',
        url: `https://localhost:${port}/html`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response4.data).toEqual('<html></html>')

      const response5 = await axios({
        method: 'get',
        url: `https://localhost:${port}/emptyHtml`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response5.data).toEqual('')

      const response6 = await axios({
        method: 'get',
        url: `https://localhost:${port}/redirect`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response6.data).toEqual({
        code: 'OK',
        data: { a: 1 }
      })

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })
})
