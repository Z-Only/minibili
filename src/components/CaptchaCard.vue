<script setup lang="ts">
import { fetchCaptcha, Captcha } from '@/apis/login/captcha'
import {
    geetestGetTypePhp,
    geetestGetPhp,
    geetestAjaxPhp,
} from '@/apis/login/geetest'
import { GeetestGetData } from '@/apis/types/geetest'
import {
    getGeetestCallback,
    generateW,
    calculateKey,
    genRandomRt,
} from '@/common/utils'
import { ShallowRef } from 'vue'

const captcha: ShallowRef<Captcha | null> = shallowRef(null)

const captchaClicked = ref(false)

const geetestGet: ShallowRef<GeetestGetData | null> = shallowRef(null)

const captchaImgSrc = ref('')

const points = ref<{ x: number; y: number }[]>([])

// 控制对话框是否打开的状态
const dialogOpend = ref(false)

const captchaCanvasReference =
    useTemplateRef<HTMLCanvasElement>('captchaCanvas')

/**
 * 打开对话框并初始化验证码画布
 */
const openDialog = async () => {
    dialogOpend.value = true
    captchaClicked.value = false
    points.value = []

    // 1. 获取验证码
    captcha.value = await fetchCaptcha()
    // 2.geetest gettype
    await geetestGetTypePhp({
        gt: captcha.value?.geetest?.gt,
        callback: getGeetestCallback(),
    })
    // 3. 请求验证码类型
    const geetestAjax = await geetestAjaxPhp({
        gt: captcha.value?.geetest?.gt,
        challenge: captcha.value?.geetest?.challenge,
        lang: 'zh-cn',
        pt: 0,
        client_type: 'web',
        w: '',
        callback: getGeetestCallback(),
    })
    // 4. 请求验证码的图片信息
    geetestGet.value = await geetestGetPhp({
        is_next: 'true',
        type: geetestAjax.result,
        gt: captcha.value?.geetest?.gt,
        challenge: captcha.value?.geetest?.challenge,
        lang: 'zh-cn',
        https: 'false',
        protocol: 'https://',
        offline: 'false',
        product: 'embed',
        api_server: 'api.geetest.com',
        isPC: 'true',
        autoReset: 'true',
        width: '100%25',
        callback: getGeetestCallback(),
    })
    // 5. 处理图片信息
    const imageServer = geetestGet.value?.image_servers[0]
    if (imageServer && geetestGet.value?.pic) {
        captchaImgSrc.value = new URL(
            geetestGet.value.pic,
            `https://${imageServer}`
        ).toString()
    } else {
        console.error('Static server or pic URL is undefined')
        return
    }

    await initializeCaptchaCanvas()
}

/**
 * 初始化验证码画布
 */
const initializeCaptchaCanvas = async () => {
    await nextTick()

    const context = captchaCanvasReference.value?.getContext('2d')

    if (!context) {
        console.error('Failed to get canvas context.')
        return
    }

    drawCaptcha(captchaCanvasReference.value as HTMLCanvasElement, context)
}

/**
 * 在给定的上下文中绘制验证码
 * @param context - CanvasRenderingContext2D 对象
 */
const drawCaptcha = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
) => {
    // 加载图像并绘制到 canvas
    const img = new Image()
    img.src = captchaImgSrc.value
    img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    img.onerror = () => {
        console.error('Failed to load image.')
    }

    // 处理鼠标点击事件
    canvas.addEventListener('click', (event) => {
        handleClick(canvas, context, event)
    })
}

// 处理鼠标点击事件
const handleClick = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    event: MouseEvent
) => {
    captchaClicked.value = true

    const points: { x: number; y: number }[] = []

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    points.push({ x, y })

    // 在点击位置绘制红点
    context.fillStyle = 'red'
    context.beginPath()
    context.arc(x, y, 5, 0, Math.PI * 2)
    context.fill()

    // 在点击位置显示坐标
    context.fillStyle = 'black'
    context.fillText(`(${x}, ${y})`, x + 10, y)
}

// 验证验证码
const geetestVerify = async () => {
    dialogOpend.value = false

    // 移除点击事件监听器
    captchaCanvasReference.value?.removeEventListener('click', (event) =>
        handleClick(
            captchaCanvasReference.value as HTMLCanvasElement,
            captchaCanvasReference.value?.getContext(
                '2d'
            ) as CanvasRenderingContext2D,
            event
        )
    )

    // 解密 w
    const w = generateW(
        calculateKey(points.value),
        captcha.value?.geetest?.gt as string,
        captcha.value?.geetest?.challenge as string,
        geetestGet.value?.c as number[],
        geetestGet.value?.s as string,
        genRandomRt().toString()
    )

    // 发送验证请求
    const validate = await geetestAjaxPhp({
        gt: captcha.value?.geetest?.gt,
        challenge: captcha.value?.geetest?.challenge,
        lang: 'zh-cn',
        pt: 0,
        client_type: 'web',
        w,
        callback: getGeetestCallback(),
    })

    console.log('validate result: ', validate)
}

onMounted(async () => {})
</script>

<template>
    <v-btn @click="openDialog">验证码</v-btn>

    <v-dialog v-model="dialogOpend" width="auto" persistent>
        <v-card width="320" height="410" style="padding: 2%">
            请在下图依次点击：<v-image
                class="geetest_tip_img"
                :src="captchaImgSrc"
            ></v-image>
            <div class="geetest_item">
                <canvas ref="captchaCanvas" class="geetest_item_img"></canvas>
            </div>
            <template v-slot:actions>
                <v-tooltip location="top" text="关闭验证">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            icon="mdi-close-circle-outline"
                        ></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip location="top" text="刷新验证">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon="mdi-refresh"></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip location="top" text="帮助反馈">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            icon="mdi-information-outline"
                        ></v-btn>
                    </template>
                </v-tooltip>
                <v-spacer />
                <v-btn
                    class="ms-auto"
                    text="确认"
                    @click="geetestVerify"
                    :disabled="!captchaClicked"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.geetest_item {
    width: 95.8%;
}
.geetest_tip_img {
    display: block;
    width: 116px;
    height: 40px;
    right: -116px;
    top: -10px;
}
.geetest_item_img {
    right: 0px;
    top: 0px;
    width: 100%;
    height: 112%;
}
</style>
