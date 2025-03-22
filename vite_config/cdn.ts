export const cdn = {
  js: [
    // Vue 3 生产构建 (必需第一个加载)
    "https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js",

    // Vue 生态工具 (按依赖顺序加载)
    "https://cdn.jsdelivr.net/npm/vue-demi@0.14.10/dist/vue-demi.global.prod.js",
    "https://cdn.jsdelivr.net/npm/@vue/composition-api@1.8.5/dist/composition-api.global.prod.js",

    // 路由管理
    "https://cdn.jsdelivr.net/npm/vue-router@4.5.0/dist/vue-router.global.prod.js",

    // 状态管理
    "https://cdn.jsdelivr.net/npm/pinia@3.0.0/dist/pinia.iife.prod.js",

    // HTTP 客户端
    "https://cdn.jsdelivr.net/npm/axios@1.8.0/dist/axios.min.js",

    // vxe-table 强依赖的库
    "https://cdn.jsdelivr.net/npm/vxe-pc-ui@4.4.21/lib/index.umd.min.js",
    "https://cdn.jsdelivr.net/npm/xe-utils@3.7.4/dist/xe-utils.umd.min.js",

    // UI 组件库
    "https://cdn.jsdelivr.net/npm/element-plus@2.9.5/dist/index.full.min.js",
    "https://cdn.jsdelivr.net/npm/@element-plus/icons-vue@2.3.1/dist/index.iife.min.js",
    "https://cdn.jsdelivr.net/npm/vxe-table@4.6.25/lib/index.umd.min.js",

    // 第三方库
    "https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js",
    "https://cdn.jsdelivr.net/npm/mitt@3.0.1/dist/mitt.umd.min.js",
    "https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js",
    "https://cdn.jsdelivr.net/npm/screenfull@6.0.2/index.min.js",
    // 生产环境下直接使用 lodash-es的 cdn 会导致页面加载不出来 所以这里采用 UMD 的形式加载lodash
    "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
  ],
  css: [
    // ElementPlus 生产环境 CSS (包含所有组件样式)
    "https://cdn.jsdelivr.net/npm/element-plus@2.9.5/dist/index.min.css",

    // VxeTable 核心样式
    "https://cdn.jsdelivr.net/npm/vxe-table@4.6.25/lib/style.min.css",
    "https://cdn.jsdelivr.net/npm/vxe-pc-ui@4.4.21/lib/style.min.css",

    // 第三方库
    "https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css",
    "https://cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.css"
  ]
}
