/// <reference path="./@vue/global.d.ts" />

declare global {
  const NodeMarker: unique symbol
  interface Node {
    [NodeMarker]: true
  }
  var Node: {
    prototype: Node
    new (): Node
  }

  interface ShadowRoot {}
  var ShadowRoot: {
    prototype: ShadowRoot
    new (): ShadowRoot
  }
  interface HTMLElementEventMap {}
  interface HTMLElementTagNameMap {}

  interface KeyboardEvent extends Event {}
  var KeyboardEvent: {
    prototype: KeyboardEvent
    new (type: string): KeyboardEvent
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $exposed: Record<string, any | null>
    $callMethod(method: string, ...args: Array<any | null>): any | null
  }
}

declare module '@vue/reactivity' {
  interface RefUnwrapBailTypes {
    utsBailTypes: UTSJSONObject
  }
}

export {}
