import path from 'path'

import react from '@vitejs/plugin-react-swc'
import million from 'million/compiler'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/

export default ({ mode }) => {
  const isProduction = mode === 'production'
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    base: isProduction ? env.VITE_APP_BASE_URL : '/',
    build: {
      // publicPath: '/',
      sourcemap: false,
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          },
          assetFileNames: assetInfo => {
            let extType = assetInfo.name.split('.').at(1)
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img'
              return `assets/${extType}/[name][extname]`
            }
            return `assets/${extType}/build-[hash][extname]`
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js'
        }
      }
    },

    plugins: [million.vite({ auto: true, mute: true }), react()],
    server: {
      port: 3000,
      hmr: {
        host: 'localhost',
        overlay: true
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@theme': path.resolve(__dirname, './src', 'theme')
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      css: true,
      setupFiles: ['./src/test/setup.js']
    }
  })
}
