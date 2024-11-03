import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { zhHans, en, ja, ko } from 'vuetify/locale'
import { createPinia } from 'pinia'

/**
 * 创建 Vue 应用实例
 */
const app = createApp(App)

/**
 * 定义自定义警告处理器，过滤并打印特定类型的警告信息
 */
app.config.warnHandler = function (msg, _vm, trace) {
    const ignoredWarningKey = 'Vuetify: Translation key'

    // 忽略包含特定关键词的警告
    if (msg.includes(ignoredWarningKey)) {
        return
    }

    // 打印其他警告信息
    console.warn(`[Vue warn]: ${msg}${trace}`)
}

/**
 * 使用路由、pinia 和 Vuetify 插件配置应用
 */
app.use(router)
    .use(createPinia())
    .use(
        createVuetify({
            blueprint: md3,
            locale: {
                locale: 'zhHans', // 默认语言设置为简体中文
                fallback: 'en', // 备选语言为英文
                messages: {
                    // 支持的语言包
                    zhHans,
                    en,
                    ja,
                    ko,
                },
            },
            theme: {
                defaultTheme: 'light', // 默认主题为亮色
            },
        })
    )

/**
 * 挂载应用到指定 DOM 节点
 */
app.mount('#app')
