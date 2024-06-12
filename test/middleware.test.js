// port number prefix is 402

import { describe, expect, it } from '@jest/globals'
import bodyParser from '../src/middleware/bodyParser.js'
import createApp from '@sumor/ssl-server'
import axios from 'axios'
import https from 'https'
import fse from 'fs-extra'
import fileClearUp from '../src/middleware/fileClearUp.js'
import clientEnv from '../src/middleware/clientEnv.js'

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
      app.get('/hello', fileClearUp)
      app.get('/hello', (req, res) => {
        res.send('Hello')
      })

      app.all(
        '/dataFile',
        bodyParser({
          file: { type: 'file' },
          a: { type: 'string' },
          b: { type: 'string' }
        })
      )
      app.all('/dataFile', async (req, res) => {
        const fileInfo = req.data.file[0]
        fileInfo.content = await fse.readFile(fileInfo.path, 'utf8')
        fileInfo.params = { a: req.data.a, b: req.data.b }
        res.send(fileInfo)
      })

      app.all('/dataClean', bodyParser({ file: { type: 'file' } }))
      app.all('/dataClean', async (req, res, next) => {
        const fileInfo = req.data.file[0]
        fileInfo.content = await fse.readFile(fileInfo.path, 'utf8')
        fileInfo.params = { a: req.data.a, b: req.data.b }
        req.sumorResponse = fileInfo
        next()
      })
      app.all('/dataClean', fileClearUp)
      app.all('/dataClean', async (req, res) => {
        res.send(req.sumorResponse)
      })
      await app.listen(port)

      const response = await axios({
        method: 'get',
        url: `https://localhost:${port}/hello?a=1`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response.data).toEqual('Hello')

      // mock multipart/form-data upload file
      const formData = new FormData()
      const file = new Blob(['OK'], { type: 'text/plain' })
      formData.append('file', file, 'file.txt')
      formData.append('b', 2)

      const response1 = await axios({
        method: 'post',
        url: `https://localhost:${port}/dataFile?a=1`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })

      expect(response1.data.name).toEqual('file.txt')
      expect(response1.data.content).toEqual('OK')
      expect(response1.data.params).toEqual({ a: '1', b: '2' })
      expect(response1.data.path).toBeDefined()

      const existsUploadFile = await fse.exists(response1.data.path)
      expect(existsUploadFile).toBe(true)

      // mock multipart/form-data upload file
      const formData2 = new FormData()
      const file2 = new Blob(['OK'], { type: 'text/plain' })
      formData2.append('file', file2, 'file.txt')
      formData2.append('b', 2)

      const responseClean = await axios({
        method: 'post',
        url: `https://localhost:${port}/dataClean?a=1`,
        data: formData2,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })

      expect(responseClean.data.name).toEqual('file.txt')
      expect(responseClean.data.content).toEqual('OK')
      expect(responseClean.data.params).toEqual({ a: '1', b: '2' })
      expect(responseClean.data.path).toBeDefined()

      const existsUploadFileClean = await fse.exists(responseClean.data.path)
      expect(existsUploadFileClean).toBe(false)

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })
  it('clientEnv', async () => {
    const app = createApp()

    try {
      app.all('/data', clientEnv)
      app.all('/data', (req, res) => {
        res.send(req.client)
      })
      await app.listen(port)

      const response = await axios({
        method: 'get',
        url: `https://localhost:${port}/data`,
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response.data).toEqual({
        id: 1,
        ip: '0.0.0.0',
        language: 'en',
        timezone: 'Asia/Shanghai'
      })

      const response2 = await axios({
        method: 'get',
        url: `https://localhost:${port}/data`,
        headers: {
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          'sumor-timezone': 'Asia/Tokyo',
          'x-forwarded-for': '121.141.21.10'
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      })
      expect(response2.data).toEqual({
        id: 2,
        ip: '121.141.21.10',
        language: 'zh-CN',
        timezone: 'Asia/Tokyo'
      })

      await app.close()
    } catch (e) {
      await app.close()
      throw e
    }
  })
})
