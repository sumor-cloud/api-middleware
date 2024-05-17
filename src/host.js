import bodyParser from 'body-parser'
import { validate } from '@sumor/validator'
import load from './load.js'

export default async (app, root, path = '/api') => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(bodyParser.text())

  const meta = await load(root)
  for (const route in meta) {
    const metaData = meta[route]
    const routePath = route.replace(/\./g, '/')
    app.all(`${path}/${routePath}`, async (req, res) => {
      const program = await import(`${root}/${route}.js`)
      const data = Object.assign({}, req.params, req.query, req.body)
      let messages = []
      for (const parameter in metaData.parameters) {
        const parameterData = metaData.parameters[parameter]
        const fieldMessages = validate(parameterData, data[parameter])
        messages = messages.concat(
          fieldMessages.map(message => {
            return {
              field: parameter,
              ...message
            }
          })
        )
      }
      if (messages.length > 0) {
        res.status(400)
        res.json({ error: true, messages })
      } else {
        const result = await program.default({ data }, req, res)
        res.json({ data: result })
      }
    })
  }
}
