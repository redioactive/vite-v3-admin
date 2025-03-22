/// <reference types="vitest/config" />

import { resolve } from "node:path"
import { defineConfig, loadEnv } from "vite"
import { externalGlobalsObj } from "./vite_config/external.ts"
import { createPlugins } from "./vite_config/plugins.ts"

// Configuring Vite: https://cn.vite.dev/config
export default defineConfig(({ mode }) => {
  const { VITE_PUBLIC_PATH } = loadEnv(mode, process.cwd(), "") as ImportMetaEnv
  const isProduction = mode === "production"
  return {
    // 开发或打包构建时用到的公共基础路径
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        // @ 符号指向 src 目录
        "@": resolve(__dirname, "src"),
        // @@ 符号指向 src/common 通用目录
        "@@": resolve(__dirname, "src/common")
      }
    },
    // 开发环境服务器配置
    server: {
      // 是否监听所有地址
      host: true,
      // 端口号
      port: 3333,
      // 端口被占用时，是否直接退出
      strictPort: false,
      // 是否自动打开浏览器
      open: true,
      // 反向代理
      proxy: {
        "/api/v1": {
          target: "https://apifoxmock.com/m1/2930465-2145633-default",
          // 是否为 WebSocket
          ws: false,
          // 是否允许跨域
          changeOrigin: true
        }
      },
      // 是否允许跨域
      cors: true,
      // 预热常用文件，提高初始页面加载速度
      warmup: {
        clientFiles: [
          "./src/layouts/**/*.*",
          "./src/pinia/**/*.*",
          "./src/router/**/*.*"
        ]
      }
    },
    // 构建配置
    build: {
      outDir: "dist",
      cssCodeSplit: true,
      // 自定义底层的 Rollup 打包配置
      rollupOptions: {
        external: Object.keys(externalGlobalsObj),
        output: {
          entryFileNames: "static/js/[name]-[hash].js",
          chunkFileNames: "static/js/[name]-[hash].js",
          assetFileNames(assetInfo) {
            // 初始化
            const ext = assetInfo.name?.split(".").pop()?.toLowerCase() || ""
            if (!ext) return "static/[name]-[hash][extname]"

            // 处理 css
            if (ext === "css") {
              return "static/css/[name]-[hash][extname]"
            }

            // 处理图片
            const imgExts = new Set(["png", "jpg", "jpeg", "gif", "bmp", "webp", "avif", "svg", "icon", "svga"])
            if (imgExts.has(ext)) {
              return "static/img/[name]-[hash][extname]"
            }

            // 处理字体
            const typeFace = new Set(["woff", "woff2", "ttf", "otf"])
            if (typeFace.has(ext)) {
              return "static/font/[name]-[hash][extname]"
            }

            // 默认导出格式
            return "static/other/[name]-[hash][extname]"
          },
          /**
           * @name 分块策略
           * @description 1. 注意这些包名(vue、element、vxe)必须存在，否则打包会报错
           * @description 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            // 只有开发环境才包含这些块
            ...(!isProduction && {
              vue: ["vue", "vue-router", "pinia"],
              element: ["element-plus", "@element-plus/icons-vue"],
              vxe: ["vxe-table"],
              // 第三方库
              vendorUtils: ["axios", "dayjs", "js-cookie", "mitt", "normalize.css", "nprogress", "screenfull"]
            }),
            views: [
              "/src/pages/dashboard/index.vue",
              "/src/pages/demo/element-plus/index.vue",
              "/src/pages/demo/level2/index.vue",
              "/src/pages/demo/unocss/index.vue",
              "/src/pages/demo/vxe-table/index.vue"
            ]
          }
        }
      },
      // 单个 chunk 文件的大小超过 2048kB 时发出警告
      chunkSizeWarningLimit: 2048
    },
    // 混淆器
    esbuild:
      mode === "development"
        ? undefined
        : {
          // 打包构建时移除 console.log
            pure: ["console.log"],
            // 打包构建时移除 debugger
            drop: ["debugger"],
            // 打包构建时移除所有注释
            legalComments: "none"
          },
    // 插件配置
    plugins: createPlugins(isProduction),
    // Configuring Vitest: https://cn.vitest.dev/config
    test: {
      include: ["tests/**/*.test.{ts,js}"],
      environment: "happy-dom",
      server: {
        deps: {
          inline: ["element-plus"]
        }
      }
    }
  }
})
