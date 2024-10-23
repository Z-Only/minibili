<script setup lang="ts">
import QRCode from 'qrcode'
import { fetchQrcode, QrCode } from '@/apis/login/qrcode'

const expiredTimeMs = 180_000

const expired = ref(false)

const qrUrl = ref('')

let timer: ReturnType<typeof setTimeout>

const refreshQrCode = async () => {
    const qrcode: QrCode = await fetchQrcode()
    qrUrl.value = await QRCode.toDataURL(qrcode.url).then((url) => {
        expired.value = false
        return url
    })

    if (timer !== undefined) {
        clearTimeout(timer)
    } else {
        timer = setTimeout(() => {
            expired.value = true
        }, expiredTimeMs)
    }
}

onMounted(async () => {
    await refreshQrCode()
})

onBeforeUnmount(() => {
    clearTimeout(timer)
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
        >
            <template v-if="expired" v-slot:actions>
                <v-btn
                    icon="mdi-refresh-circle"
                    size="x-large"
                    @click.prevent="refreshQrCode"
                ></v-btn>
            </template>
        </v-card>
    </div>
</template>
