export default {
  name: 'plus2',
  parameters: {
    a: {
      name: 'parameter a',
      type: 'number',
      length: 3
    },
    b: {
      name: 'parameter b',
      type: 'number',
      rule: [
        {
          code: 'TOO_BIG',
          message: 'b should be less than 100',
          function: function (value) {
            return value < 100
          }
        }
      ]
    }
  }
}
