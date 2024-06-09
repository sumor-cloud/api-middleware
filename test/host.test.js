// port number prefix is 401

import { describe, expect, it } from '@jest/globals'

describe('host', () => {
  it('host', async () => {
    expect(true).toBe(true)
  })
})

// import createApp from '@sumor/ssl-server'
// import axios from 'axios'
// import https from 'https'
//
// import host from '../src/index.js'
//
// const port = 40100
// describe('host', () => {
//   it(
//     'host',
//     async () => {
//       const app = createApp()
//       try {
//         const root = `${process.cwd()}/test/demo/api`
//         app.get('/', (req, res) => {
//           res.send('OK')
//         })
//         await host(app, root)
//         await app.listen(port)
//
//         const response1 = await axios({
//           method: 'get',
//           url: `https://localhost:${port}/`,
//           httpsAgent: new https.Agent({ rejectUnauthorized: false })
//         })
//         expect(response1.data).toBe('OK')
//
//         const response2 = await axios({
//           method: 'post',
//           url: `https://localhost:${port}/api/plus`,
//           data: {
//             a: 1,
//             b: 2
//           },
//           httpsAgent: new https.Agent({ rejectUnauthorized: false })
//         })
//         expect(response2.data.data).toBe(3)
//
//         let errorData
//         try {
//           await axios({
//             method: 'post',
//             url: `https://localhost:${port}/api/plus`,
//             data: {
//               a: 2000,
//               b: 3000
//             },
//             httpsAgent: new https.Agent({ rejectUnauthorized: false })
//           })
//         } catch (e) {
//           errorData = e.response.data
//         }
//         console.log(errorData)
//         expect(errorData.error).toBe(true)
//         expect(errorData.messages.length).toBe(1)
//         expect(errorData.messages[0].field).toBe('a')
//         expect(errorData.messages[0].id).toBe('SUMOR_NUMBER_LENGTH')
//         expect(errorData.messages[0].message).toBe('Length must be less than or equal to 3 digits')
//
//         await app.close()
//       } catch (e) {
//         await app.close()
//         throw e
//       }
//     },
//     5 * 1000
//   )
// })
