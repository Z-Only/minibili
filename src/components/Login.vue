<script setup lang="ts">
import QRCode from 'qrcode'
import { fetchQrcode, pollQrcode, ScanCode } from '@/apis/login/qrcode'

const expiredTimeMs = 180_000

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
        console.log('interval', res)
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

onMounted(async () => {
    await refreshQrCode()
})

onBeforeUnmount(() => {
    clearTimeout(timer)
    clearInterval(interval)
})
</script>

<template>
    <div>
        <h1>Login</h1>
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
    </div>
</template>
