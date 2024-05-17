import { describe, expect, it } from '@jest/globals'

import load from '../src/load.js'

describe('Load', () => {
  it('load meta', async () => {
    const meta = await load(`${process.cwd()}/test/demo/api`)
    expect(meta).toEqual({
      plus: {
        name: 'plus',
        parameters: {
          a: {
            name: 'parameter a',
            type: 'number'
          },
          b: {
            name: 'parameter b',
            type: 'number'
          }
        }
      }
    })
  })
})
