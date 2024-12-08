<script setup lang="ts">
import QRCode from 'qrcode'
import {
    fetchQrcode,
    pollQrcode,
    ScanCode,
    PollQrcode,
} from '@/apis/login/qrcode'
import { CaptchaCardData } from '@/common/types/emits'

const router = useRouter()

// 二维码有效期（单位毫秒）
const EXPIRED_TIME_MS = 180_000
// 轮询间隔时间（单位毫秒）
const INTERVAL_TIME_MS = 1000

// 定义响应式数据
const expired = ref(false)
const qrUrl = ref('')
const qrcodeKey = ref('')
const statusMessage = ref('')

// 定义定时器相关变量
let refreshTimer: ReturnType<typeof setTimeout>
let pollingInterval: ReturnType<typeof setInterval>

/**
 * 刷新二维码
 */
const refreshQrCode = async () => {
    try {
        const qrcodeResponse = await fetchQrcode()
        const imageUrl = await QRCode.toDataURL(qrcodeResponse.url)

        // 更新状态信息
        expired.value = false
        qrcodeKey.value = qrcodeResponse.qrcode_key
        qrUrl.value = imageUrl

        // 清理旧的定时器
        clearTimeout(refreshTimer)
        clearInterval(pollingInterval)

        // 设置新的定时器
        refreshTimer = setTimeout(() => {
            expired.value = true
            qrcodeKey.value = ''
        }, EXPIRED_TIME_MS)

        pollingInterval = setInterval(async () => {
            const pollRes = await pollQrcode({ qrcode_key: qrcodeKey.value })
            // 处理轮询结果
            handlePollStatus(pollRes)
        }, INTERVAL_TIME_MS)
    } catch (error) {
        console.error('Failed to refresh QR code:', error)
    }
}

/**
 * 根据轮询结果更新状态消息
 * @param res - 轮询返回的结果对象
 */
function handlePollStatus(res: PollQrcode) {
    switch (res.code) {
        case ScanCode.NotScanned:
            break
        case ScanCode.QrCodeExpired:
            statusMessage.value = '二维码已失效，请点击刷新'
            clearInterval(pollingInterval)
            break
        case ScanCode.QrCodeScannedNotConfirmed:
            statusMessage.value = '扫描成功，请在手机上确认'
            break
        case ScanCode.Success:
            statusMessage.value = '登录成功'
            clearInterval(pollingInterval)
            toHome() // 成功后跳转到首页
            break
        default:
            break
    }
}

/**
 * 跳转到主页
 */
const toHome = () => {
    router.push({ name: 'Home' })
}

const tab = ref(1)

const required = (v: string) => {
    return !!v || 'Field is required'
}

const account = ref('')
const password = ref('')

const passwordShow = ref(false)

const passwordLogin = async () => {}

const phone = ref('')
const smsCode = ref('')

const smsLogin = async () => {}

const receiveCaptchaResult = (data: CaptchaCardData) => {
    console.log('receiveCaptchaResult: ', data)
}

onMounted(async () => {
    await refreshQrCode()
})

onBeforeUnmount(() => {
    clearTimeout(refreshTimer)
    clearInterval(pollingInterval)
})
</script>

<template>
    <v-row no-gutters>
        <v-col>
            <v-sheet class="ma-2 pa-2">
                <v-card
                    :image="qrUrl"
                    width="200"
                    height="200"
                    :variant="expired ? 'plain' : 'elevated'"
                    hover
                >
                    <template v-if="expired" v-slot:actions>
                        <v-btn
                            icon="mdi-refresh-circle"
                            size="x-large"
                            @click.prevent="refreshQrCode"
                        ></v-btn>
                    </template>
                    <v-card-text>
                        {{ statusMessage }}
                    </v-card-text>
                </v-card>
            </v-sheet>
        </v-col>
        <v-col>
            <v-sheet>
                <v-tabs
                    v-model="tab"
                    align-tabs="center"
                    color="deep-purple-accent-4"
                >
                    <v-tab :value="1">密码登录</v-tab>
                    <v-tab :value="2">短信登录</v-tab>
                </v-tabs>

                <v-tabs-window v-model="tab">
                    <v-tabs-window-item :value="1"
                        ><form @submit.prevent="passwordLogin">
                            <v-text-field
                                v-model="account"
                                label="账号"
                                placeholder="请输入账号"
                                :rules="[required]"
                                clearable
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                label="密码"
                                placeholder="请输入密码"
                                :rules="[required]"
                                :type="passwordShow ? 'text' : 'password'"
                                :append-icon="
                                    passwordShow ? 'mdi-eye' : 'mdi-eye-off'
                                "
                                @click:append="passwordShow = !passwordShow"
                                ><template v-slot:append>
                                    <v-btn variant="text"
                                        >忘记密码？</v-btn
                                    ></template
                                ></v-text-field
                            >
                            <captcha-card
                                @getCaptchaResult="receiveCaptchaResult"
                            />
                            <v-btn @click="passwordLogin">注册</v-btn
                            ><v-btn class="me-4" type="submit"> 登录 </v-btn>
                        </form>
                    </v-tabs-window-item>
                    <v-tabs-window-item :value="2"
                        ><form @submit.prevent="smsLogin">
                            <v-text-field
                                v-model="phone"
                                label="手机号"
                                placeholder="请输入手机号"
                                :rules="[required]"
                                clearable
                                ><template v-slot:append>
                                    <v-btn
                                        variant="text"
                                        :disabled="phone.length !== 11"
                                        >获取验证码</v-btn
                                    ></template
                                ></v-text-field
                            >
                            <v-text-field
                                v-model="smsCode"
                                label="验证码"
                                placeholder="请输入验证码"
                                :rules="[required]"
                            ></v-text-field>
                            <v-btn class="me-4" type="submit">
                                登录/注册
                            </v-btn>
                        </form></v-tabs-window-item
                    >
                </v-tabs-window>
            </v-sheet>
        </v-col>
    </v-row>
</template>
