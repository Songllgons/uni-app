export function createApp() {
  const app = createSSRApp(defineComponent({}))
  app.config.globalProperties.globalStr = ''
}
export const __sfc__ = defineComponent({
  mounted() {
    // this.globalStr
  },
})
