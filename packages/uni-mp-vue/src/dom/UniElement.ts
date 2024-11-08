import type { ComponentPublicInstance } from 'vue'
import { UniCSSStyleDeclaration } from './UniCSSStyleDeclaration'

export class UniElement {
  // 跳过vue的响应式
  __v_skip = true
  id: string
  nodeName: string
  tagName: string
  style: UniCSSStyleDeclaration = new UniCSSStyleDeclaration()
  $vm: ComponentPublicInstance

  constructor(id: string, name: string, vm: ComponentPublicInstance) {
    this.id = id
    this.tagName = name.toUpperCase()
    this.nodeName = this.tagName
    this.$vm = vm
  }

  getBoundingClientRectAsync(callback) {
    // TODO defineAsyncApi?
    if (callback) {
      this._getBoundingClientRectAsync((domRect) => {
        callback.success?.(domRect)
        callback.complate?.()
      })
      return
    }
    return new Promise((resolve, reject) => {
      this._getBoundingClientRectAsync(resolve)
    })
  }

  _getBoundingClientRectAsync(callback) {
    const query = uni.createSelectorQuery().in(this.$vm)
    query.select('#' + this.id).boundingClientRect()
    query.exec(function (res) {
      callback(res[0])
    })
  }

  $onStyleChange(callback: (styles: Record<string, string | null>) => void) {
    this.style.$onChange(callback)
  }

  $destroy() {
    this.style.$destroy()
    // @ts-expect-error
    this.style = null
  }
}
