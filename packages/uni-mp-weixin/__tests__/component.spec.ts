import { assert } from './testUtils'
import { customElements } from '../src/compiler/options'
describe('mp-weixin: transform component', () => {
  test(`component with v-show`, () => {
    assert(
      `<custom v-show="ok"/>`,
      `<custom data-c-h="{{!a}}" u-i="2a9ec0b0-0" bind:__l="__l"/>`,
      `(_ctx, _cache) => {
  return { a: _ctx.ok }
}`
    )
  })
  test(`built-in component`, () => {
    const code = customElements.map((tag) => `<${tag}/>`).join('')
    assert(
      code,
      code,
      `(_ctx, _cache) => {
  return {}
}`
    )
  })
  test('lazy element: textarea', () => {
    assert(
      `<textarea></textarea>`,
      `<textarea></textarea>`,
      `(_ctx, _cache) => {
  return {}
}`
    )
    assert(
      `<textarea @input="input"></textarea>`,
      `<block wx:if="{{r0}}"><textarea bindinput="{{a}}"></textarea></block>`,
      `(_ctx, _cache) => {
  return { a: _o(_ctx.input) }
}`
    )
    assert(
      `<textarea v-model="text"></textarea>`,
      `<block wx:if="{{r0}}"><textarea value="{{a}}" bindinput="{{b}}"></textarea></block>`,
      `(_ctx, _cache) => {
  return { a: _ctx.text, b: _o($event => _ctx.text = $event.detail.value) }
}`
    )
    assert(
      `<textarea v-if="ok1" @input="input"/><textarea v-else-if="ok2"/><textarea v-else @input="input"/>`,
      `<textarea wx:if="{{a}}" bindinput="{{b}}"/><textarea wx:elif="{{c}}"/><block wx:else><textarea wx:if="{{r0}}" bindinput="{{d}}"/></block>`,
      `(_ctx, _cache) => {
  return _e({ a: _ctx.ok1 }, _ctx.ok1 ? { b: _o(_ctx.input) } : _ctx.ok2 ? {} : { d: _o(_ctx.input) }, { c: _ctx.ok2 })
}`
    )
  })
  test('lazy element: editor', () => {
    assert(
      `<editor/>`,
      `<editor/>`,
      `(_ctx, _cache) => {
  return {}
}`
    )
    assert(
      `<editor @ready="ready"/>`,
      `<block wx:if="{{r0}}"><editor bindready="{{a}}" data-e-ready="{{a}}"/></block>`,
      `(_ctx, _cache) => {
  return { a: _o(_ctx.ready) }
}`
    )
    assert(
      `<editor v-if="ok1" @ready="ready"/><editor v-else-if="ok2"/><editor v-else/>`,
      `<editor wx:if="{{a}}" bindready="{{b}}" data-e-ready="{{b}}"/><editor wx:elif="{{c}}"/><editor wx:else/>`,
      `(_ctx, _cache) => {
  return _e({ a: _ctx.ok1 }, _ctx.ok1 ? { b: _o(_ctx.ready) } : _ctx.ok2 ? {} : {}, { c: _ctx.ok2 })
}`
    )
    assert(
      `<editor v-if="ok1" @ready="ready"/><editor v-else-if="ok2"/><editor v-else @ready="ready"/>`,
      `<editor wx:if="{{a}}" bindready="{{b}}" data-e-ready="{{b}}"/><editor wx:elif="{{c}}"/><block wx:else><editor wx:if="{{r0}}" bindready="{{d}}" data-e-ready="{{d}}"/></block>`,
      `(_ctx, _cache) => {
  return _e({ a: _ctx.ok1 }, _ctx.ok1 ? { b: _o(_ctx.ready) } : _ctx.ok2 ? {} : { d: _o(_ctx.ready) }, { c: _ctx.ok2 })
}`
    )
  })
  test('lazy element: canvas', () => {
    assert(
      `<canvas/>`,
      `<canvas/>`,
      `(_ctx, _cache) => {
  return {}
}`
    )
    assert(
      `<canvas canvas-id="myCanvas" id="myCanvas"/>`,
      `<canvas canvas-id="myCanvas" id="myCanvas"/>`,
      `(_ctx, _cache) => {
  return {}
}`
    )
    assert(
      `<canvas :id="id"/>`,
      `<block wx:if="{{r0}}"><canvas id="{{a}}"/></block>`,
      `(_ctx, _cache) => {
  return { a: _ctx.id }
}`
    )
    assert(
      `<canvas :canvas-id="id"/>`,
      `<block wx:if="{{r0}}"><canvas canvas-id="{{a}}"/></block>`,
      `(_ctx, _cache) => {
  return { a: _ctx.id }
}`
    )
    assert(
      `<canvas @touchstart="touchstart"/>`,
      `<block wx:if="{{r0}}"><canvas bindtouchstart="{{a}}"/></block>`,
      `(_ctx, _cache) => {
  return { a: _o(_ctx.touchstart) }
}`
    )
    assert(
      `<canvas @touchmove="touchmove"/>`,
      `<block wx:if="{{r0}}"><canvas bindtouchmove="{{a}}"/></block>`,
      `(_ctx, _cache) => {
  return { a: _o(_ctx.touchmove) }
}`
    )
    assert(
      `<canvas @touchcancel="touchcancel"/>`,
      `<block wx:if="{{r0}}"><canvas bindtouchcancel="{{a}}"/></block>`,
      `(_ctx, _cache) => {
  return { a: _o(_ctx.touchcancel) }
}`
    )
    assert(
      `<canvas @touchend="touchend"/>`,
      `<block wx:if="{{r0}}"><canvas bindtouchend="{{a}}"/></block>`,
      `(_ctx, _cache) => {
  return { a: _o(_ctx.touchend) }
}`
    )
    assert(
      `<canvas :canvas-id="id" :id="id"/>`,
      `<block wx:if="{{r0}}"><canvas canvas-id="{{a}}" id="{{b}}"/></block>`,
      `(_ctx, _cache) => {
  return { a: _ctx.id, b: _ctx.id }
}`
    )
    assert(
      `<canvas v-if="ok1" :canvas-id="id"/><canvas v-else-if="ok2"/><canvas v-else/>`,
      `<canvas wx:if="{{a}}" canvas-id="{{b}}"/><canvas wx:elif="{{c}}"/><canvas wx:else/>`,
      `(_ctx, _cache) => {
  return _e({ a: _ctx.ok1 }, _ctx.ok1 ? { b: _ctx.id } : _ctx.ok2 ? {} : {}, { c: _ctx.ok2 })
}`
    )
    assert(
      `<canvas v-if="ok1" :canvas-id="id"/><canvas v-else-if="ok2"/><canvas v-else :canvas-id="id"/>`,
      `<canvas wx:if="{{a}}" canvas-id="{{b}}"/><canvas wx:elif="{{c}}"/><block wx:else><canvas wx:if="{{r0}}" canvas-id="{{d}}"/></block>`,
      `(_ctx, _cache) => {
  return _e({ a: _ctx.ok1 }, _ctx.ok1 ? { b: _ctx.id } : _ctx.ok2 ? {} : { d: _ctx.id }, { c: _ctx.ok2 })
}`
    )
  })
})
