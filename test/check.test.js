import { describe, expect, it } from '@jest/globals'
import checkData from '../src/checkData.js'
describe('check', () => {
  it('format', () => {
    const data1 = checkData(
      {
        text: ' demo '
      },
      {
        parameters: {
          text: {
            type: 'string'
          }
        }
      }
    )
    expect(data1.text).toEqual('demo')
  })
  it('error', () => {
    const definition = {
      parameters: {
        text: {
          type: 'string',
          length: 4
        }
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
