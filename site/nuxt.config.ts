import { resolve } from 'path'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'


const moduleExclude = (match) => {
  const m = (id) => id.indexOf(match) > -1
  return {
    name: `exclude-${match}`,
    resolveId(id) {
      if (m(id)) return id
    },
    load(id) {
      if (m(id)) return `export default {}`
    }
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxthq/ui'],
  devtools: { enabled: true },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [],
      script: []
    }
  },
  ui: {
    global: true,
    icons: 'all'
  },

  vite: {
    cacheDir: resolve(__dirname, '.vite'),
    plugins: [
      moduleExclude('text-encoding'),
      wasm(),
      topLevelAwait(),
      moduleExclude('node-fetch')
    ],

    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
              buffer: true
          }),
          NodeModulesPolyfillPlugin()
      ]
      }
      // exclude: ['@meshsdk/core'],
    },
    build: {
      rollupOptions: {
        plugins: [
          rollupNodePolyFill()
        ]
      }
    },
    server: {
    	hmr: {
    		protocol: "ws",
    	},
    },
  }
})
