import path from 'path'
import type { Plugin, ResolvedConfig } from 'vite'
import {
  APP_CONFIG_SERVICE,
  defineUniPagesJsonPlugin,
  getLocaleFiles,
  normalizeAppConfigService,
  normalizeAppNVuePagesJson,
  normalizePagesJson,
  normalizePath,
  parseManifestJsonOnce,
} from '@dcloudio/uni-cli-shared'

interface NVuePages {
  [filename: string]: {
    disableScroll?: boolean
    scrollIndicator?: 'none'
  }
}

export const nvuePagesCache = new Map<ResolvedConfig, NVuePages>()
// 在 @vue/compiler-sfc@3.2.47 执行前重写 @vue/compiler-dom compile 方法
const nvuePages: NVuePages = {}

export function parseNVuePageOptions(filename: string) {
  return nvuePages[filename]
}

export function uniPagesJsonPlugin({
  renderer,
  appService,
}: {
  renderer?: 'native'
  appService: boolean
}): Plugin {
  return defineUniPagesJsonPlugin((opts) => {
    return {
      name: 'uni:app-nvue-pages-json',
      enforce: 'pre',
      configResolved(config) {
        nvuePagesCache.set(config, nvuePages)
      },
      transform(code, id) {
        if (!opts.filter(id)) {
          return
        }
        this.addWatchFile(path.resolve(process.env.UNI_INPUT_DIR, 'pages.json'))
        getLocaleFiles(
          path.resolve(process.env.UNI_INPUT_DIR, 'locale')
        ).forEach((filepath) => {
          this.addWatchFile(filepath)
        })
        const pagesJson = normalizePagesJson(code, process.env.UNI_PLATFORM)
        Object.keys(nvuePages).forEach((name) => {
          delete nvuePages[name]
        })
        pagesJson.pages.forEach((page) => {
          if (page.style.isNVue) {
            const filename = normalizePath(
              path.resolve(process.env.UNI_INPUT_DIR, page.path + '.nvue')
            )
            nvuePages[filename] = {
              disableScroll: page.style.disableScroll,
              scrollIndicator: page.style.scrollIndicator,
            }
            // fix: question/164673
            // this.addWatchFile(filename)
          }
        })
        if (renderer === 'native' && appService) {
          this.emitFile({
            fileName: APP_CONFIG_SERVICE,
            type: 'asset',
            source: normalizeAppConfigService(
              pagesJson,
              parseManifestJsonOnce(process.env.UNI_INPUT_DIR)
            ),
          })
          return {
            code: '',
            map: { mappings: '' },
          }
        }
        return {
          code: normalizeAppNVuePagesJson(pagesJson),
          map: { mappings: '' },
        }
      },
    }
  })
}
