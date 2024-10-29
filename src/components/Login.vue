<script setup lang="ts">
import QRCode from 'qrcode'
import { fetchQrcode, pollQrcode, ScanCode } from '@/apis/login/qrcode'

const expiredTimeMs = 1_000 //180_000

const expired = ref(false)

const qrUrl = ref('')

const qrcodeKey = ref('')

let timer: ReturnType<typeof setTimeout>

const intervalTimeMs = 1_000

let interval: ReturnType<typeof setInterval>

const statusMessage = ref('')

const refreshQrCode = async () => {
    const qrcode = await fetchQrcode()
    qrUrl.value = await QRCode.toDataURL(qrcode.url).then((url) => {
        expired.value = false
        qrcodeKey.value = qrcode.qrcode_key
        return url
    })

    if (timer !== undefined) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => {
        expired.value = true
        qrcodeKey.value = ''
    }, expiredTimeMs)

    if (interval !== undefined) {
        clearInterval(interval)
    }
    interval = setInterval(async () => {
        const res = await pollQrcode({ qrcode_key: qrcodeKey.value })
        switch (res.code) {
            case ScanCode.NotScanned:
                break
            case ScanCode.QrCodeExpired:
                statusMessage.value = '二维码失效 点击刷新'
                clearInterval(interval)
                break
            case ScanCode.QrCodeScannedNotConfirmed:
                statusMessage.value = '扫描成功 请在手机上确认'
                break
            case ScanCode.Success:
                statusMessage.value = '登录成功'
                clearInterval(interval)
                // TODO: 存储cookie
                toHome()
                break
            default:
                break
        }
    }, intervalTimeMs)
}

const toHome = async () => {
    useRouter().push({ name: 'Home' })
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

onMounted(async () => {
    await refreshQrCode()
})

onBeforeUnmount(() => {
    clearTimeout(timer)
    clearInterval(interval)
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
                <v-card>
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
                                <captcha-card />
                                <v-btn @click="passwordLogin">注册</v-btn
                                ><v-btn class="me-4" type="submit">
                                    登录
                                </v-btn>
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
                </v-card>
            </v-sheet>
        </v-col>
    </v-row>
</template>
