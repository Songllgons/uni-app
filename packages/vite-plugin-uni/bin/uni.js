#!/usr/bin/env node
const { performance } = require('perf_hooks')
global.__vite_start_time = performance.now()
const debugIndex = process.argv.findIndex((arg) => /^(?:-d|--debug)$/.test(arg))
const filterIndex = process.argv.findIndex((arg) =>
  /^(?:-f|--filter)$/.test(arg)
)
if (debugIndex > 0) {
  let value = process.argv[debugIndex + 1]
  if (!value || value.startsWith('-')) {
    value = 'vite:*,uni:*'
  }
  process.env.DEBUG = value

  if (filterIndex > 0) {
    const filter = process.argv[filterIndex + 1]
    if (filter && !filter.startsWith('-')) {
      process.env.VITE_DEBUG_FILTER = filter
    }
  }
}
// uni-cli-shared 引入了 @vue/compiler-core，需要提前设置NODE_ENV，才能保证 @vue/compiler-core 加载的是对应环境的代码
if (
  process.argv[2] === 'build' &&
  !process.argv.some((arg) => /^(?:-w|--watch)$/.test(arg))
) {
  process.env.NODE_ENV = 'production'
}

function initDebug() {
  if (!process.env.DEBUG && process.env.UNI_INPUT_DIR) {
    const fs = require('fs')
    const path = require('path')
    const debugFile = path.resolve(process.env.UNI_INPUT_DIR, 'DEBUG')
    if (fs.existsSync(debugFile)) {
      process.env.DEBUG = fs.readFileSync(debugFile, 'utf8')
    }
  }
  if (process.env.DEBUG) {
    const debug = require('debug')
    const mod = require('module')
    const { PerformanceObserver } = require('perf_hooks')

    const debugRequire = debug('uni:require')

    // Monkey patch the require function
    mod.Module.prototype.require = performance.timerify(
      mod.Module.prototype.require
    )
    require = performance.timerify(require)

    // Activate the observer
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.sort((a, b) => b.duration - a.duration).filter(e => e.duration > 20).forEach((entry) => {
        debugRequire(entry[0], entry.duration)
      })
      obs.disconnect()
    })
    obs.observe({
      entryTypes: ['function'],
      buffered: true,
    })
  }
}
initDebug()
require('../dist/cli/index.js')
