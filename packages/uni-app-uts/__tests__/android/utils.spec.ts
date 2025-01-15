import { genClassName } from '../../src/index'

describe('uts:utils', () => {
  test(`genClassName`, () => {
    expect(genClassName('@dcloudio-unicloud-db')).toBe('GenDcloudioUnicloudDb')
    expect(genClassName('.uvue-test')).toBe('GenUvueTest')
    expect(genClassName('123-test')).toBe('Gen123Test')
    expect(genClassName('components-test_123-test')).toBe(
      'GenComponentsTest123Test'
    )
    expect(genClassName('components-test_b-test')).toBe(
      'GenComponentsTestBTest'
    )
    expect(genClassName('components-test____---b--test')).toBe(
      'GenComponentsTestBTest'
    )
  })
})
