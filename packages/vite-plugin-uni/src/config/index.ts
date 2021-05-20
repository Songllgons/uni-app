import path from 'path'
import { Plugin, UserConfig } from 'vite'

import { normalizePath, parseManifestJsonOnce } from '@dcloudio/uni-cli-shared'

import { VitePluginUniResolvedOptions } from '..'
import { createCss } from './css'
import { createResolve } from './resolve'
import { createServer } from './server'
import { createBuild } from './build'
import { createOptimizeDeps } from './optimizeDeps'
import { createDefine } from './define'

import {
  initPluginViteLegacyOptions,
  initPluginVueJsxOptions,
  initPluginVueOptions,
} from '../vue'

function normalizeRoot(config: UserConfig) {
  return normalizePath(config.root ? path.resolve(config.root) : process.cwd())
}

function normalizeInputDir(config: UserConfig) {
  return process.env.UNI_INPUT_DIR || path.resolve(normalizeRoot(config), 'src')
}
export function createConfig(
  options: VitePluginUniResolvedOptions
): Plugin['config'] {
  return (config, env) => {
    options.command = env.command
    options.platform = (process.env.UNI_PLATFORM as UniApp.PLATFORM) || 'h5'
    options.inputDir = normalizeInputDir(config)
    let base = config.base
    if (!base) {
      const { h5 } = parseManifestJsonOnce(options.inputDir)
      base = (h5 && h5.router && h5.router.base) || ''
    }
    if (!base) {
      base = '/'
    }
    options.base = base!
    options.vueOptions = initPluginVueOptions(options)
    options.vueJsxOptions = initPluginVueJsxOptions(options)
    options.viteLegacyOptions = initPluginViteLegacyOptions(options)

    const define = createDefine(options, config, env)

    return {
      base,
      publicDir: config.publicDir || false,
      define,
      resolve: createResolve(options, config),
      optimizeDeps: createOptimizeDeps(options),
      server: createServer(options),
      build: createBuild(options),
      css: createCss(options),
    }
  }
}
