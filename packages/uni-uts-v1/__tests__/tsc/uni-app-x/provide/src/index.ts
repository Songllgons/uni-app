import { defineComponent } from 'vue'
defineComponent({
  provide() {
    return {
      msg: 'hello',
    }
  },
})