import type { ModuleInfo, TransformPluginContext } from "rollup"
import type { PluginOption } from "vite"
import path from "node:path"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import externalGlobals from "rollup-plugin-external-globals"
import { visualizer } from "rollup-plugin-visualizer"
import UnoCSS from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import SvgComponent from "unplugin-svg-component/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { createHtmlPlugin } from "vite-plugin-html"
import svgLoader from "vite-svg-loader"
import { cdn } from "./cdn.ts"
import { externalGlobalsObj } from "./external.ts"

// 环境判断
const isProduction = process.env.NODE_ENV === "production"

// 插件上下文类型
type TransformContext = TransformPluginContext & {
  getModuleInfo: (id: string) => ModuleInfo | null
}

// 计算基准路径
function getBaseDir() {
  if (isProduction) {
    // 生产环境
    return path.resolve(__dirname, "..")
  }
  //  开发环境
  return process.cwd()
}

function resolvePath(relativePath: string) {
  return path.resolve(getBaseDir(), relativePath)
}
export function createPlugins(isProduction: boolean): PluginOption[] {
  return [
    vue(),
    // 支持 JSX、TSX 语法
    vueJsx(),
    // 支持将 SVG 文件导入为 Vue 组件
    svgLoader({
      defaultImport: "url",
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                // @see https://github.com/svg/svgo/issues/1128
                removeViewBox: false
              }
            }
          }
        ]
      }
    }),
    // 自动生成 SvgIcon 组件和 SVG 雪碧图
    SvgComponent({
      // iconDir: [resolve(__dirname, "src/common/assets/icons")],
      // preserveColor: resolve(__dirname, "src/common/assets/icons/preserve-color"),
      // dts: true,
      // dtsDir: resolve(__dirname, "src/auto")
      iconDir: [resolvePath("src/common/assets/icons")],
      preserveColor: resolvePath("src/common/assets/icons/preserve-color"),
      dts: true,
      dtsDir: resolvePath("types/auto")
    }),
    // 原子化 CSS
    UnoCSS(),
    // 自动按需导入 API
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "types/auto/auto-imports.d.ts",
      resolvers: isProduction
        ? []
        : [ElementPlusResolver()],
      ignore: isProduction ? ["vue", "element-plus", "@element-plus/icons-vue"] : []
    }),
    // 自动按需导入组件
    Components({
      dts: "types/auto/components.d.ts",
      resolvers: isProduction
        ? []
        : [ElementPlusResolver()]
    }),
    createHtmlPlugin({
      inject: {
        data: {
          cdnCss: isProduction ? cdn.css : [],
          cdnJs: isProduction ? cdn.js : []
        }
      }
    }),
    {
      ...externalGlobals(externalGlobalsObj),
      enforce: "post",
      apply: "build"
    },
    // 配置 lodash-es 的打包环境cdn
    {
      name: "lodash-es-cdn-loader",
      transformIndexHtml(html) {
        return isProduction
          ? html.replace(
              "</head>",
              `<script type="module">
              import * as _ from "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js"
              window._ = _
            </script>
            </head>`
            )
          : html
      }
    },
    // // 异步资源标记插件
    // {
    //   name: "mark-async-resource",
    //   transform(
    //     this: TransformContext,
    //     code: string,
    //     id: string
    //   ) {
    //     if (id.endsWith(".css")) {
    //       const moduleInfo = this.getModuleInfo(id)
    //       const dynamicCount = moduleInfo?.dynamicImporters?.length || 0
    //
    //       return {
    //         code,
    //         meta: {
    //           _asyncResource: dynamicCount > 0
    //         }
    //       }
    //     }
    //   }
    // },
    // 分析构建工具
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      emitFile: true,
      filename: "stats.html"
    })
  ]
}
