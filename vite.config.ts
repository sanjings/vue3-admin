/// <reference types="vitest" />

import { type ConfigEnv, type UserConfigExport, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import VueDevTools from 'vite-plugin-vue-devtools';
import viteCompression from 'vite-plugin-compression';
import { resolve } from 'node:path';
import { name, version, engines, dependencies, devDependencies } from './package.json';

const pathResolve = (dir: string) => resolve(__dirname, dir);

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(mode, process.cwd()) as ImportMetaEnv;
  const { VITE_PUBLIC_PATH } = viteEnv;
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': pathResolve('./src'),
        types: pathResolve('./types')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "./src/styles/mixin.scss" as *;
          `
        }
      }
    },
    server: {
      host: '0.0.0.0', // 设置 host
      port: 12345, // 端口号
      hmr: true, // 热更新
      open: false, // 是否自动打开浏览器
      cors: true, // 跨域设置允许
      strictPort: false, // 端口被占用时，是否直接退出
      // 接口代理
      proxy: {
        '/omc-api': {
          target: 'https://test-oil.zjcw.cn',
          changeOrigin: true,
          ws: true
          // rewrite: path => path.replace(/^\/admin-api/, '')
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 1024, // 单个 chunk 文件的大小超过 1024KB 时发出警告
      assetsInlineLimit: 4096, // 小于4kb base64转码
      reportCompressedSize: false, // 禁用 gzip 压缩大小报告
      assetsDir: 'static', // 打包后静态资源目录
      sourcemap: false, // 构建后是否生成 source map 文件
      rollupOptions: {
        output: {
          /**
           * 分块策略
           * 1. 注意这些包名必须存在，否则打包会报错
           * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            element: ['element-plus', '@element-plus/icons-vue']
          }
        }
      }
    },
    esbuild:
      mode === 'development'
        ? undefined
        : {
            /** 打包时移除 console.log */
            pure: ['console.log'],
            /** 打包时移除 debugger */
            drop: ['debugger'],
            /** 打包时移除所有注释 */
            legalComments: 'none'
          },
    plugins: [
      VueDevTools(),
      vue(),
      vueJsx(),
      AutoImport({
        imports: ['vue', 'vue-router', 'vue-i18n'], // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          }),
          IconsResolver({
            prefix: 'Icon'
          })
        ],
        eslintrc: {
          enabled: false, // 是否自动生成 eslint 规则，建议生成之后设置 false
          filepath: './.eslintrc-auto-import.json', // 指定自动导入函数 eslint 规则的文件
          globalsPropValue: true
        },
        vueTemplate: true,
        // dts: false,
        dts: 'types/auto-imports.d.ts'
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          }),
          IconsResolver({
            enabledCollections: ['ep']
          })
        ],
        dirs: ['src/components', 'src/**/components'],
        // dts: false,
        dts: 'types/components.d.ts'
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true
      }),
      /** SVG */
      createSvgIconsPlugin({
        iconDirs: [pathResolve('./src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      viteCompression({
        threshold: 10240 // 大于10kb的文件gzip压缩
      })
    ],
    test: {
      include: ['tests/**/*.test.ts'],
      environment: 'jsdom'
    },
    define: {
      __APP_INFO__: { name, version, engines, dependencies, devDependencies, buildTime: Date.now() }
    }
  };
};
