// port number prefix is 402

import { describe, expect, it } from '@jest/globals'
import bodyParser from '../src/middleware/bodyParser.js'
import exposeApi from '../src/middleware/exposeApi.js'
import createApp from '@sumor/ssl-server'
import axios from 'axios'
import https from 'https'
import fse from 'fs-extra'

const port = 40200
describe('middleware', () => {
  it('body parser', async () => {
    const app = createApp()

    try {
      app.all('/data', bodyParser())
      app.all('/data', (req, res) => {
        res.send(req.data)
      })
      await app.listen(port)

      const response = await axios({
        method: 'post',
        url: `https://localhost:${port}/data?a=1`,
        data: {
          b: 2
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response.data).toEqual({ a: '1', b: 2 })

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })

  it('body parser for file', async () => {
    const app = createApp()

    try {
      app.all('/data', bodyParser([{ name: 'file' }]))
      app.all('/data', async (req, res) => {
        const fileInfo = req.data.file[0]
        fileInfo.content = await fse.readFile(fileInfo.path, 'utf8')
        fileInfo.params = { a: req.data.a, b: req.data.b }
        res.send(fileInfo)
      })
      await app.listen(port)

      // mock multipart/form-data upload file
      const formData = new FormData()
      const file = new Blob(['OK'], { type: 'text/plain' })
      formData.append('file', file, 'file.txt')
      formData.append('b', 2)

      const response = await axios({
        method: 'post',
        url: `https://localhost:${port}/data?a=1`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })

      expect(response.data.name).toEqual('file.txt')
      expect(response.data.content).toEqual('OK')
      expect(response.data.params).toEqual({ a: '1', b: '2' })

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })
  it('exposeApi', async () => {
    const app = createApp()

    try {
      app.use(
        exposeApi({
          'api.add': {
            route: '/api/add',
            name: 'add'
          },
          'api.plus': {
            route: '/api/plus',
            name: 'plus'
          },
          'api.minus': {
            route: '/api/minus',
            name: 'minus'
          }
        })
      )
      app.post('/meta', (req, res) => {
        res.send(req.exposeApis)
      })
      await app.listen(port)

      const response = await axios({
        method: 'post',
        url: `https://localhost:${port}/meta`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })

      const apiPaths = Object.keys(response.data)
      expect(response.data['/api/plus'].name).toEqual('plus')
      expect(apiPaths[0]).toEqual('/api/add')
      expect(apiPaths[1]).toEqual('/api/minus')

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })
})
