import { type ExtractPropTypes, ref } from 'vue'
import { defineBuiltInComponent } from '@dcloudio/uni-components'
import Embed from '../embed'

type Mode = 'selector' | 'multiSelector' | 'time' | 'date'
type Field = 'year' | 'month' | 'day'
const mode: Record<string, Mode> = {
  SELECTOR: 'selector',
  MULTISELECTOR: 'multiSelector',
  TIME: 'time',
  DATE: 'date',
  // 暂不支持城市选择
  // REGION: 'region'
}
const fields: Record<string, Field> = {
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day',
}

function getDefaultStartValue(props: any) {
  if ((props as Props).mode === mode.TIME) {
    return '00:00'
  }
  if ((props as Props).mode === mode.DATE) {
    const year = new Date().getFullYear() - 100
    switch ((props as Props).fields) {
      case fields.YEAR:
        return year
      case fields.MONTH:
        return year + '-01'
      default:
        return year + '-01-01'
    }
  }
  return ''
}
function getDefaultEndValue(props: any) {
  if ((props as Props).mode === mode.TIME) {
    return '23:59'
  }
  if ((props as Props).mode === mode.DATE) {
    const year = new Date().getFullYear() + 100
    switch ((props as Props).fields) {
      case fields.YEAR:
        return year
      case fields.MONTH:
        return year + '-12'
      default:
        return year + '-12-31'
    }
  }
  return ''
}

const props = {
  name: {
    type: String,
    default: '',
  },
  range: {
    type: Array,
    default() {
      return []
    },
  },
  rangeKey: {
    type: String,
    default: '',
  },
  value: {
    type: [Number, String, Array],
    default: 0,
  },
  mode: {
    type: String,
    default: mode.SELECTOR,
    validator(val: string) {
      return Object.values(mode).indexOf(val as Mode) >= 0
    },
  },
  fields: {
    type: String,
    default: '',
  },
  start: {
    type: String,
    default: getDefaultStartValue,
  },
  end: {
    type: String,
    default: getDefaultEndValue,
  },
  disabled: {
    type: [Boolean, String],
    default: false,
  },
}
type Props = ExtractPropTypes<typeof props>

export default /*#__PURE__*/ defineBuiltInComponent({
  name: 'Picker',
  props,
  emits: ['change', 'cancel', 'columnchange'],
  setup(props, { emit }) {
    const embedRef = ref<InstanceType<typeof Embed> | null>(null)
    function onClick() {
      // @ts-expect-error
      embedRef.value!.click()
    }
    function onCancel(event: CustomEvent<any>) {
      console.log('TODO onCancel:', event)
    }
    return () => (
      <uni-picker>
        <Embed
          ref={embedRef}
          tag="picker"
          options={props}
          onCancel={onCancel}
        />
        <div onClick={onClick} class="uni-picker-slot"></div>
      </uni-picker>
    )
  },
})
