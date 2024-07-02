import { describe, expect, it } from '@jest/globals'
import checkData from '../src/checkData.js'
describe('check', () => {
  it('format', () => {
    const data1 = checkData(
      {
        text: ' demo '
      },
      {
        text: {
          type: 'string'
        },

        // test2 not passed, check if error
        text2: {
          type: 'string'
        }
      }
    )
    expect(data1.text).toEqual('demo')
    expect(data1.text2).toBeNull()
  })
  it('error', () => {
    const definition = {
      text: {
        type: 'string',
        length: 4
      }
    }
    let error
    try {
      checkData(
        {
          text: ' demo '
        },
        definition
      )
    } catch (e) {
      error = e
    }
    expect(error).toBeUndefined()

    try {
      checkData(
        {
          text: ' demo1 '
        },
        definition
      )
    } catch (e) {
      error = e
    }
    expect(error.code).toEqual('SUMOR_API_FIELDS_VALIDATION_FAILED')
  })
})
