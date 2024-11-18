import { getCurrentPage, initPageVm, invokeHook } from '@dcloudio/uni-core'
import {
  EventChannel,
  ON_READY,
  ON_UNLOAD,
  SYSTEM_DIALOG_PAGE_PATH_STARTER,
  formatLog,
} from '@dcloudio/uni-shared'
import {
  type ComponentPublicInstance,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
} from 'vue'
import type { VuePageComponent } from './define'
import { addCurrentPage, getPage$BasePage } from './getCurrentPages'
import { OPEN_DIALOG_PAGE } from '../../../x/constants'

export function setupPage(component: VuePageComponent) {
  const oldSetup = component.setup
  component.inheritAttrs = false // 禁止继承 __pageId 等属性，避免告警
  component.setup = (props, ctx) => {
    const {
      attrs: { __pageId, __pagePath, /*__pageQuery,*/ __pageInstance },
    } = ctx
    if (__DEV__) {
      console.log(formatLog(__pagePath as string, 'setup'))
    }
    const instance = getCurrentInstance()!
    const pageVm = instance.proxy!
    initPageVm(pageVm, __pageInstance as Page.PageInstance['$page'])
    if (__X__) {
      instance.$dialogPages = []
      let uniPage: UniPage
      if (
        (__pageInstance as Page.PageInstance['$page']).openType ===
        OPEN_DIALOG_PAGE
      ) {
        const currentPage = getCurrentPage() as unknown as UniPage
        if (
          (__pagePath as string).startsWith(SYSTEM_DIALOG_PAGE_PATH_STARTER)
        ) {
          const systemDialogPages = currentPage.vm.$systemDialogPages
          uniPage = systemDialogPages[systemDialogPages.length - 1]
        } else {
          uniPage = new UniDialogPageImpl()
        }
        uniPage.getElementById = (
          id: string.IDString | string
        ): UniElement | null => {
          const currentPage = getCurrentPage() as unknown as UniPage
          if (currentPage !== uniPage.getParentPage()) {
            return null
          }
          const containerNode = pageVm.$el?._parent
          if (containerNode == null) {
            console.warn('bodyNode is null')
            return null
          }
          return containerNode.querySelector(`#${id}`)
        }
      } else {
        uniPage = new UniNormalPageImpl()
        uniPage.getElementById = (
          id: string.IDString | string
        ): UniElement | null => {
          const currentPage = getCurrentPage() as unknown as UniPage
          if (currentPage !== uniPage) {
            return null
          }
          const bodyNode = pageVm.$el?.parentNode
          if (bodyNode == null) {
            console.warn('bodyNode is null')
            return null
          }
          return bodyNode.querySelector(`#${id}`)
        }
      }
      pageVm.$basePage = pageVm.$page as Page.PageInstance['$page']
      pageVm.$page = uniPage
      uniPage.route = pageVm.$basePage.route
      // @ts-expect-error
      uniPage.optionsByJS = pageVm.$basePage.options
      Object.defineProperty(uniPage, 'options', {
        get: function () {
          return new UTSJSONObject(pageVm.$basePage.options)
        },
      })
      uniPage.vm = pageVm
      uniPage.$vm = pageVm
      uniPage.getParentPage = () => {
        // @ts-expect-error
        const parentPage = uniPage.getParentPageByJS()
        return parentPage || null
      }

      uniPage.getPageStyle = (): UTSJSONObject => {
        // @ts-expect-error
        const pageStyle = uniPage.getPageStyleByJS()
        return new UTSJSONObject(pageStyle)
      }
      uniPage.$getPageStyle = (): UTSJSONObject => {
        return uniPage.getPageStyle()
      }

      uniPage.setPageStyle = (styles: UTSJSONObject) => {
        // @ts-expect-error
        uniPage.setPageStyleByJS(styles)
      }
      uniPage.$setPageStyle = (styles: UTSJSONObject) => {
        uniPage.setPageStyle(styles)
      }

      uniPage.getAndroidView = () => null
      uniPage.getIOSView = () => null
      uniPage.getHTMLElement = () => null

      if (getPage$BasePage(pageVm).openType !== OPEN_DIALOG_PAGE) {
        addCurrentPageWithInitScope(
          __pageId as number,
          pageVm,
          __pageInstance as Page.PageInstance['$page']
        )
      }
    } else {
      addCurrentPageWithInitScope(
        __pageId as number,
        pageVm,
        __pageInstance as Page.PageInstance['$page']
      )
    }
    if (!__X__) {
      onMounted(() => {
        nextTick(() => {
          // onShow被延迟，故onReady也同时延迟
          invokeHook(pageVm, ON_READY)
        })
        // TODO preloadSubPackages
      })
      onBeforeUnmount(() => {
        invokeHook(pageVm, ON_UNLOAD)
      })
    } else {
      onMounted(() => {
        const rootElement = pageVm.$el?._parent
        if (rootElement) {
          rootElement._page = pageVm.$page
        }
      })
      onBeforeUnmount(() => {
        const rootElement = pageVm.$el?._parent
        if (rootElement) {
          rootElement._page = null
        }
      })
    }
    if (oldSetup) {
      return oldSetup(props, ctx)
    }
  }
  return component
}

export function initScope(
  pageId: number,
  vm: ComponentPublicInstance,
  pageInstance: Page.PageInstance['$page']
) {
  if (!__X__) {
    const $getAppWebview = () => {
      return plus.webview.getWebviewById(pageId + '')
    }
    vm.$getAppWebview = $getAppWebview
    ;(vm.$ as any).ctx!.$scope = {
      $getAppWebview,
    }
  } else {
    Object.defineProperty(vm, '$viewToTempFilePath', {
      get() {
        return vm.$nativePage!.viewToTempFilePath.bind(vm.$nativePage!)
      },
    })
    Object.defineProperty(vm, '$getPageStyle', {
      get() {
        return vm.$nativePage!.getPageStyle.bind(vm.$nativePage!)
      },
    })
    Object.defineProperty(vm, '$setPageStyle', {
      get() {
        return vm.$nativePage!.setPageStyle.bind(vm.$nativePage!)
      },
    })
  }
  vm.getOpenerEventChannel = () => {
    if (!pageInstance.eventChannel) {
      pageInstance.eventChannel = new EventChannel(pageId)
    }
    return pageInstance.eventChannel as EventChannel
  }
  return vm
}

function addCurrentPageWithInitScope(
  pageId: number,
  pageVm: ComponentPublicInstance,
  pageInstance: Page.PageInstance['$page']
) {
  addCurrentPage(initScope(pageId, pageVm, pageInstance))
}
