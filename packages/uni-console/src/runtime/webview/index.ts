import { rewriteConsole, setSendConsole } from '../console'
import { sendErrorMessages, setSendError } from '../error'

let isInit = false
function initUniWebviewRuntimeService() {
  if (isInit) return
  isInit = true
  const channel = `[web-view]${
    // @ts-expect-error
    window.__UNI_PAGE_ROUTE__ ? `[${window.__UNI_PAGE_ROUTE__}]` : ''
  }`
  rewriteConsole()
  setSendConsole(
    (data: string) => {
      sendToService(data)
    },
    {
      channel,
    }
  )
  setSendError(
    (data: string) => {
      sendToService(data)
    },
    {
      channel,
    }
  )
  // 监听同步错误
  window.addEventListener('error', (event) => {
    sendErrorMessages([event.error])
  })
  // 监听Promise未处理的异步错误
  window.addEventListener('unhandledrejection', (event) => {
    sendErrorMessages([event])
  })
}

function sendToService(data: string) {
  // 发送数据到 service 层
  const serviceMessage = {
    type: 'WEB_INVOKE_APPSERVICE',
    args: {
      data: {
        name: 'console',
        arg: data,
      },
    },
  }
  // @ts-expect-error
  if (window.__uniapp_x_postMessageToService) {
    // @ts-expect-error
    return window.__uniapp_x_postMessageToService(serviceMessage)
  } else {
    // @ts-expect-error
    return window.__uniapp_x_.postMessageToService(
      JSON.stringify(serviceMessage)
    )
  }
}

initUniWebviewRuntimeService()
