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


  runtimeConfig: {
		public: {
			DISCOUNT_POLICY_IDS: ["5f812c655ee02b2bfe2ad8d31cab5edd4b66c09149905fd23d768f5e"],
		},
		
    // TODO: Need new project IDs for mainnet and preprod
		blockfrost: {
			mainnet: {
				PROJECT_ID: process.env.BLOCKFROST_MAINNET_PROJECT_ID,
				BASE_URL: "https://cardano-mainnet.blockfrost.io/api/v0",
			},
			preprod: {
				PROJECT_ID: process.env.BLOCKFROST_PREPROD_PROJECT_ID,
				BASE_URL: "https://cardano-preprod.blockfrost.io/api/v0",
			}
		},
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
  },

  nitro: {
    preset: 'digital-ocean'
  }
})
