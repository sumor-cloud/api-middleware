import { describe, expect, it, beforeAll, afterAll } from '@jest/globals'
import fse from 'fs-extra'

import load from '../src/load.js'

describe('Load', () => {
  const demoPath = `${process.cwd()}/test/demo/api`
  const testPath = `${process.cwd()}/tmp/demo/api`
  beforeAll(async () => {
    await fse.ensureDir(testPath)
    await fse.copy(demoPath, testPath)
    await fse.writeFile(`${testPath}/noDefault.js`, 'const a = 1;export {a}')
    await fse.writeFile(`${testPath}/syntaxTest.js`, 'const a = 1;export {a')
  })
  afterAll(async () => {
    await fse.remove(testPath)
  })
  it('load meta', async () => {
    const meta = await load(testPath)
    expect(meta.plus.route).toEqual('/plus')
    expect(meta.plus.name).toEqual('plus')
    expect(meta.plus.desc).toEqual('')
    expect(meta.plus.parameters.a.name).toEqual('parameter a')

    expect(meta.minus.name).toEqual('')
    expect(meta.minus.parameters).toEqual({})

    expect(meta.noDefault.error).toEqual('missingDefaultExport')
    expect(meta.syntaxTest.error).toEqual('syntaxError')

    const result = await meta.plus.program({
      data: {
        a: 1,
        b: 2
      }
    })
    expect(result).toEqual(3)
  })
  it(
    'load meta for api prefix',
    async () => {
      const meta = await load(testPath, '/api')
      expect(meta.plus.route).toEqual('/api/plus')
    },
    60 * 1000
  )
})
