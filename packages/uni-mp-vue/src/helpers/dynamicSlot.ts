import { isString } from '@vue/shared'
import { dynamicSlotName } from '@dcloudio/uni-shared'
/**
 * quickapp-webview 不能使用 default 作为插槽名称，故统一转换 default 为 d
 * @param names
 * @returns
 */
export function dynamicSlot(names: string | string[]) {
  if (isString(names)) {
    return dynamicSlotName(names)
  }
  return names.map((name) => dynamicSlotName(name))
}
