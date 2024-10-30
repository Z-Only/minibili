import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import { zhHans, en, ja, ko } from 'vuetify/locale'

const app = createApp(App)

// 自定义警告处理程序
app.config.warnHandler = (msg, _vm, trace) => {
    // 过滤掉包含特定关键字的警告
    if (msg.includes('Vuetify: Translation key')) {
        return
    }
    // 打印其他警告
    console.warn(`[Vue warn]: ${msg}${trace}`)
}

app.use(router)
    .use(
        createVuetify({
            blueprint: md3,
            locale: {
                locale: 'zhHans',
                fallback: 'en',
                messages: { zhHans, en, ja, ko },
            },
            theme: {
                defaultTheme: 'light',
            },
        })
    )
    .mount('#app')
