import type { BuildOptions } from "vite"
import { externalGlobalsObj } from "./external.ts"
// 环境判断
interface BuildConfigOptions {
  mode: string
}
export function buildConfig({ mode }: BuildConfigOptions): BuildOptions {
  const isProduction = mode === "production"

  return {
    outDir: "dist",
    cssCodeSplit: true,
    rollupOptions: {
      external: Object.keys(externalGlobalsObj),
      output: {
        entryFileNames: "assets/js/[name]-[hash].js",
        chunkFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: createAssetNaming(),
        manualChunks: createManualChunks(isProduction)
      }
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2048
  }
}
// 资产文件命名策略
function createAssetNaming() {
  return (assetInfo: { name?: string }) => {
    const ext = assetInfo.name?.split(".").pop()?.toLowerCase() || ""

    if (ext === "css") return "assets/css/[name]-[hash][extname]"

    const imgExts = new Set(["png", "jpg", "jpeg", "gif", "bmp", "webp", "avif", "svg", "icon", "svga"])
    if (imgExts.has(ext)) return "assets/img/[name]-[hash][extname]"

    const fonts = new Set(["woff", "woff2", "ttf", "otf"])
    if (fonts.has(ext)) return "assets/font/[name]-[hash][extname]"

    return "assets/other/[name]-[hash][extname]"
  }
}

// 分块策略配置
function createManualChunks(isProduction: boolean) {
  return {
    ...(!isProduction && {
      vue: ["vue", "vue-router", "pinia"],
      element: ["element-plus", "@element-plus/icons-vue"],
      vxe: ["vxe-table"],
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
