import { extend } from '@vue/shared'
import { assert, miniProgram } from './testUtils'

const options = {
  miniProgram: {
    ...miniProgram,
    component: extend({}, miniProgram.component, {
      mergeVirtualHostAttributes: true,
    }),
  },
}
const optionsX = {
  isX: true,
  ...options,
}

describe('complier: options with mergeVirtualHostAttributes', () => {
  test('root node with mergeVirtualHostAttributes', () => {
    assert(
      `<image/>`,
      `<image class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<view><image/></view>`,
      `<view class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"><image/></view>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<view ref="page"><image ref="img" /></view>`,
      `<view ref=\"page\" id=\"{{c}}\" style=\"{{$eS[c] + ';' + virtualHostStyle}}\" class=\"{{[virtualHostClass]}}\" hidden=\"{{virtualHostHidden}}\"><image ref=\"img\" id=\"r0-2a9ec0b0\" style=\"{{$eS[a]}}\"/></view>`,
      `(_ctx, _cache) => {
  const __returned__ = { a: _sei('r0-2a9ec0b0', 'image', 'img'), b: _s(_ses('r0-2a9ec0b0')), c: _sei(_ctx.virtualHostId !== '' ? _ctx.virtualHostId : 'r1-2a9ec0b0', 'view', 'page'), d: _s(_ses(_ctx.virtualHostId !== '' ? _ctx.virtualHostId : 'r1-2a9ec0b0')) }
  return __returned__
}`,
      optionsX
    )
  })
  test('root node style with mergeVirtualHostAttributes', () => {
    assert(
      `<image style="width:100%"/>`,
      `<image class="{{[virtualHostClass]}}" style="{{'width:100%' + ';' + virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<image :style="style"/>`,
      `<image style="{{a + ';' + virtualHostStyle}}" class="{{[virtualHostClass]}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return { a: _s(_ctx.style) }
}`,
      options
    )
    assert(
      `<image style="width:100%" :style="style"/>`,
      `<image style="{{'width:100%' + ';' + a + ';' + virtualHostStyle}}" class="{{[virtualHostClass]}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return { a: _s(_ctx.style) }
}`,
      options
    )
  })
  test('root node class with mergeVirtualHostAttributes', () => {
    assert(
      `<image class="class1"/>`,
      `<image class="{{['class1', virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<image :class="class1"/>`,
      `<image class="{{[a, virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return { a: _n(_ctx.class1) }
}`,
      options
    )
    assert(
      `<image class="class1" :class="class1"/>`,
      `<image class="{{['class1', a, virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return { a: _n(_ctx.class1) }
}`,
      options
    )
  })
  test('root node hidden with mergeVirtualHostAttributes', () => {
    assert(
      `<image :hidden="hidden"/>`,
      `<image hidden="{{virtualHostHidden !== '' ? virtualHostHidden : a}}" class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return { a: _ctx.hidden }
}`,
      options
    )
    assert(
      `<image :hidden="!show"/>`,
      `<image hidden="{{virtualHostHidden !== '' ? virtualHostHidden : a}}" class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return { a: !_ctx.show }
}`,
      options
    )
    assert(
      `<image :hidden="false"/>`,
      `<image hidden="{{virtualHostHidden !== '' ? virtualHostHidden : false}}" class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<image hidden/>`,
      `<image class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden !== '' ? virtualHostHidden : true}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<image v-show="show"/>`,
      `<image class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden !== '' ? virtualHostHidden : !a}}" id="{{virtualHostId}}"/>`,
      `(_ctx, _cache) => {
  return { a: _ctx.show }
}`,
      options
    )
  })
  test('root node id with mergeVirtualHostAttributes', () => {
    assert(
      `<image id="id1"/>`,
      `<image class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId !== '' ? virtualHostId : 'id1'}}"/>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<image :id="id1"/>`,
      `<image id="{{virtualHostId !== '' ? virtualHostId : a}}" class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}"/>`,
      `(_ctx, _cache) => {
  return { a: _ctx.id1 }
}`,
      options
    )
    assert(
      `<image id="id1" :id="id1"/>`,
      `<image id="{{virtualHostId !== '' ? virtualHostId : 'id1'}}" class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}"/>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<view :id="id1"></view>`,
      `<view id=\"{{a}}\" style=\"{{$eS[a] + ';' + virtualHostStyle}}\" class=\"{{[virtualHostClass]}}\" hidden=\"{{virtualHostHidden}}\"></view>`,
      `(_ctx, _cache) => {
  const __returned__ = { a: _sei(_ctx.virtualHostId !== '' ? _ctx.virtualHostId : _ctx.id1, 'view'), b: _s(_ses(_ctx.virtualHostId !== '' ? _ctx.virtualHostId : _ctx.id1)) }
  return __returned__
}`,
      optionsX
    )
    assert(
      `<view id="page"><image ref="img" /></view>`,
      `<view id=\"{{c}}\" style=\"{{$eS[c] + ';' + virtualHostStyle}}\" class=\"{{[virtualHostClass]}}\" hidden=\"{{virtualHostHidden}}\"><image ref=\"img\" id=\"r0-2a9ec0b0\" style=\"{{$eS[a]}}\"/></view>`,
      `(_ctx, _cache) => {
  const __returned__ = { a: _sei('r0-2a9ec0b0', 'image', 'img'), b: _s(_ses('r0-2a9ec0b0')), c: _sei(_ctx.virtualHostId !== '' ? _ctx.virtualHostId : 'page', 'view'), d: _s(_ses(_ctx.virtualHostId !== '' ? _ctx.virtualHostId : 'page')) }
  return __returned__
}`,
      optionsX
    )
    assert(
      `<view id="page" ref="page"><image ref="img" /></view>`,
      `<view ref=\"page\" id=\"{{c}}\" style=\"{{$eS[c] + ';' + virtualHostStyle}}\" class=\"{{[virtualHostClass]}}\" hidden=\"{{virtualHostHidden}}\"><image ref=\"img\" id=\"r0-2a9ec0b0\" style=\"{{$eS[a]}}\"/></view>`,
      `(_ctx, _cache) => {
  const __returned__ = { a: _sei('r0-2a9ec0b0', 'image', 'img'), b: _s(_ses('r0-2a9ec0b0')), c: _sei((_ctx.virtualHostId !== '' ? _ctx.virtualHostId : 'page') !== '' ? _ctx.virtualHostId !== '' ? _ctx.virtualHostId : 'page' : 'r1-2a9ec0b0', 'view', 'page'), d: _s(_ses((_ctx.virtualHostId !== '' ? _ctx.virtualHostId : 'page') !== '' ? _ctx.virtualHostId !== '' ? _ctx.virtualHostId : 'page' : 'r1-2a9ec0b0')) }
  return __returned__
}`,
      optionsX
    )
  })
  test('user component attrs with mergeVirtualHostAttributes', () => {
    assert(
      `<view><custom-image/></view>`,
      `<view class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"><custom-image u-i="2a9ec0b0-0"/></view>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<view><custom-image v-show="show"/></view>`,
      `<view class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"><custom-image virtualHostHidden="{{!a}}" hidden="{{!a}}" u-i="2a9ec0b0-0"/></view>`,
      `(_ctx, _cache) => {
  return { a: _ctx.show }
}`,
      options
    )
    assert(
      `<view><custom-image id="i"/></view>`,
      `<view class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"><custom-image id="i" virtualHostId="i" u-i="2a9ec0b0-0" u-p="{{a||''}}"/></view>`,
      `(_ctx, _cache) => {
  return { a: _p({ id: 'i' }) }
}`,
      options
    )
    assert(
      `<view><custom-image :id="i"/></view>`,
      `<view class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"><custom-image id="{{a}}" virtualHostId="{{a}}" u-i="2a9ec0b0-0" u-p="{{b||''}}"/></view>`,
      `(_ctx, _cache) => {
  return { a: _ctx.i, b: _p({ id: _ctx.i }) }
}`,
      options
    )
    assert(
      `<custom-view v-show="show"><image /></custom-view>`,
      `<custom-view u-s="{{['d']}}" u-i="2a9ec0b0-0" class="{{[virtualHostClass]}}" virtualHostClass="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" virtualHostStyle="{{virtualHostStyle}}" hidden="{{virtualHostHidden !== '' ? virtualHostHidden : !a}}" virtualHostHidden="{{virtualHostHidden !== '' ? virtualHostHidden : !a}}" id="{{virtualHostId}}" virtualHostId="{{virtualHostId}}"><image/></custom-view>`,
      `(_ctx, _cache) => {
  return { a: _ctx.show }
}`,
      options
    )
    assert(
      `<view><custom-image class="class1" style="width:100%"/></view>`,
      `<view class="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" id="{{virtualHostId}}"><custom-image class="class1" virtualHostClass="class1" style="width:100%" virtualHostStyle="width:100%" u-i="2a9ec0b0-0"/></view>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
    assert(
      `<custom-view><custom-image/></custom-view>`,
      `<custom-view u-s="{{['d']}}" u-i="2a9ec0b0-0" class="{{[virtualHostClass]}}" virtualHostClass="{{[virtualHostClass]}}" style="{{virtualHostStyle}}" virtualHostStyle="{{virtualHostStyle}}" hidden="{{virtualHostHidden}}" virtualHostHidden="{{virtualHostHidden}}" id="{{virtualHostId}}" virtualHostId="{{virtualHostId}}"><custom-image u-i="2a9ec0b0-1,2a9ec0b0-0"/></custom-view>`,
      `(_ctx, _cache) => {
  return {}
}`,
      options
    )
  })
})
