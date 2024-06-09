import multer from 'multer'
import fse from 'fs-extra'

const uploadPath = `${process.cwd()}/tmp/uploads`
await fse.ensureDir(uploadPath)
const upload = multer({ dest: 'tmp/uploads/' })

export default parameters => {
  return [
    upload.fields(parameters),
    (req, res, next) => {
      const files = {}
      for (const name in req.files) {
        files[name] = files[name] || []
        for (const fileIndex in req.files[name]) {
          files[name].push({
            name: req.files[name][fileIndex].originalname,
            size: req.files[name][fileIndex].size,
            mime: req.files[name][fileIndex].mimetype,
            encoding: req.files[name][fileIndex].encoding,
            path: `${uploadPath}/${req.files[name][fileIndex].filename}`
          })
        }
      }
      req.data = { ...req.data, ...files }
      next()
    }
  ]
}
