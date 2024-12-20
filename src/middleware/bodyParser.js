import bodyParser from 'body-parser'
import multer from 'multer'
import fse from 'fs-extra'

const uploadPath = `${process.cwd()}/tmp/uploads`
await fse.ensureDir(uploadPath)
const upload = multer({ dest: 'tmp/uploads/' })

export default parameters => {
  parameters = parameters || {}

  const uploadParameters = []
  for (const name in parameters) {
    if (parameters[name].type === 'file') {
      uploadParameters.push({ name })
    }
  }
  return [
    bodyParser.urlencoded({ extended: false }),
    bodyParser.json(),
    bodyParser.text(),
    upload.fields(uploadParameters),
    (req, res, next) => {
      const files = {}
      req.files = req.files || {}
      for (const name in req.files) {
        if (req.files[name] && req.files[name].length > 0) {
          const reqFiles = req.files[name].map(file => {
            return {
              name: file.originalname,
              size: file.size,
              mime: file.mimetype,
              encoding: file.encoding,
              path: `${uploadPath}/${file.filename}`
            }
          })
          if (parameters[name].multiple !== true) {
            files[name] = reqFiles[0]
          } else {
            files[name] = reqFiles
          }
        }
      }
      req.data = { ...req.params, ...req.query, ...req.body, ...files }
      next()
    }
  ]
}
