import { assert } from './testUtils'

describe('compiler: transform id', () => {
  test('static id', () => {
    assert(
      `<view id="view"/>`,
      `<view id="view" style="{{b}}"/>`,
      `(_ctx, _cache) => {
  return { a: _si('view'), b: _s(_us('view')) }
}`,
      {
        isX: true,
      }
    )
  })
  test('dynamic id', () => {
    assert(
      `<view :id="viewId"/>`,
      `<view id="{{a}}" style="{{b}}"/>`,
      `(_ctx, _cache) => {
  return { a: _si(_ctx.viewId), b: _s(_us(_ctx.viewId)) }
}`,
      {
        isX: true,
      }
    )
  })
})
