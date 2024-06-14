import path from 'path'
import fs from 'fs-extra'
import type { UTSBundleOptions } from '@dcloudio/uts'
import { getUTSCompiler } from './utils'
import type { CompileResult } from '.'

interface ArkTSCompilerOptions {
  isX?: boolean
}
export async function compileArkTS(
  pluginDir: string,
  _: ArkTSCompilerOptions
): Promise<CompileResult | void> {
  if (!process.env.UNI_APP_HARMONY_PROJECT_PATH) {
    console.error('manifest.json -> app-harmony -> projectPath is required')
    process.exit(0)
  }
  const filename = resolveAppHarmonyIndexFile(pluginDir)
  if (!filename) {
    return
  }

  const { bundle, UTSTarget } = getUTSCompiler()
  const pluginId = path.basename(pluginDir)
  const inputDir = process.env.UNI_INPUT_DIR
  const projectPath = process.env.UNI_APP_HARMONY_PROJECT_PATH
  const outputUniModuleDir = resolveAppHarmonyUniModuleDir(
    projectPath,
    pluginId
  )
  const buildOptions: UTSBundleOptions = {
    hbxVersion: process.env.HX_Version || process.env.UNI_COMPILER_VERSION,
    input: {
      root: inputDir,
      filename,
      paths: {},
      externals: [],
      parseOptions: {
        tsx: true,
        noEarlyErrors: true,
        allowComplexUnionType: true,
        allowTsLitType: true,
      },
    },
    output: {
      outDir: outputUniModuleDir,
      outFilename: 'utssdk/app-harmony/index.ets',
      package: '',
      imports: [],
      sourceMap: false,
      extname: '.ets',
      logFilename: false,
      isPlugin: true,
      transform: {},
      treeshake: {
        noSideEffects: true,
      },
    },
  }
  const result = await bundle(UTSTarget.ARKTS, buildOptions)
  const deps: string[] = [filename]
  if (process.env.NODE_ENV === 'development') {
    if (result.deps) {
      deps.push(...result.deps)
    }
  }
  return {
    code: requireUTSPluginCode(pluginId),
    deps,
    encrypt: true,
    dir: outputUniModuleDir,
    inject_apis: [],
    scoped_slots: [],
  }
}

function requireUTSPluginCode(pluginId: string) {
  return `export default uni.requireUTSPlugin('uni_modules/${pluginId}')`
}

function resolveAppHarmonyIndexFile(pluginDir: string) {
  let indexFile = path.resolve(pluginDir, 'utssdk/app-harmony/index.uts')
  if (fs.existsSync(indexFile)) {
    return indexFile
  }
  indexFile = path.resolve(pluginDir, 'utssdk/index.uts')
  if (fs.existsSync(indexFile)) {
    return indexFile
  }
}

export function resolveAppHarmonyUniModulesRootDir(projectPath: string) {
  return path.resolve(projectPath, 'entry/src/main/ets/uni_modules')
}

function resolveAppHarmonyUniModuleDir(projectPath: string, pluginId: string) {
  return path.resolve(resolveAppHarmonyUniModulesRootDir(projectPath), pluginId)
}