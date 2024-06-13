import fse from 'fs-extra'

export default async req => {
  if (req.files) {
    const uploadPath = `${process.cwd()}/tmp/uploads`
    for (const i in req.files) {
      for (const j in req.files[i]) {
        const path = `${uploadPath}/${req.files[i][j].filename}`
        await fse.remove(path)
      }
    }
  }
}
