import Stat from './stat.js'
const stat = Stat.getInstance()
let isHide = false
const lifecycle = {
  onLaunch(options) {
    stat.report(options, this)
  },
  onReady() {
    stat.ready(this)
  },
  onLoad(options) {
    stat.load(options, this)
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      let oldShareAppMessage = this.$scope.onShareAppMessage
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false)
        return oldShareAppMessage.call(this, options)
      }
    }
  },
  onShow() {
    isHide = false
    stat.show(this)
  },
  onHide() {
    isHide = true
    stat.hide(this)
  },
  onUnload() {
    if (isHide) {
      isHide = false
      return
    }
    stat.hide(this)
  },
  onError(e) {
    stat.error(e)
  },
}

function main() {
  if (process.env.NODE_ENV === 'development') {
    uni.report = function (type, options) {}
  } else {
    uni.onAppLaunch((options) => {
      stat.report(options)
      // 小程序平台此时也无法获取getApp，统一在options中传递一个app mixin对象
      options.app.mixin(lifecycle)
      uni.report = function (type, options) {
        stat.sendEvent(type, options)
      }
    })
  }
}

main()
