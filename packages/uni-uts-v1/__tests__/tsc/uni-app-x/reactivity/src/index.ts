import {
  defineComponent,
  reactive,
  readonly,
  ref,
  shallowReactive,
  shallowReadonly,
  toRaw,
} from 'vue'
defineComponent({
  setup() {
    const obj = {} as UTSJSONObject

    const refObj = ref(obj)
    // @ts-expect-error
    const checkToRawRef = toRaw<UTSJSONObject>(refObj) === obj

    const reactiveObj = reactive(obj)
    const checkToRawReactive = toRaw<UTSJSONObject>(reactiveObj) === obj

    const readonlyObj = readonly(obj)
    const checkToRawReadonly = toRaw<UTSJSONObject>(readonlyObj) === obj

    const shallowReactiveObj = shallowReactive(obj)
    const checkToRawShallowReactive =
      toRaw<UTSJSONObject>(shallowReactiveObj) === obj

    const shallowReadonlyObj = shallowReadonly(obj)
    const checkToRawShallowReadonly =
      toRaw<UTSJSONObject>(shallowReadonlyObj) === obj
  },
})