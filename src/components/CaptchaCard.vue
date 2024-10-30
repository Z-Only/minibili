<script setup lang="ts">
import { fetchCaptcha, Captcha } from '@/apis/login/captcha'
import {
    geetestGetTypePhp,
    geetestGetPhp,
    geetestAjaxPhp,
} from '@/apis/login/geetest'
import { GeetestGetData } from '@/apis/types/geetest'
import { getGeetestCallback, generateW, calculateKey } from '@/common/utils'
import { ShallowRef } from 'vue'
import { CaptchaCardData } from '@/common/types/emits'

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

    await refreshCaptcha()
}

/**
 * 初始化验证码数据
 */
const initializeCaptchaData = async () => {
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
        throw new Error('Static server or pic URL is undefined')
    }
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
    const y = event.clientY - rect.top - 30

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

// 重置数据
const resetCaptchaData = () => {
    captchaClicked.value = false
    points.value = []
}

// 关闭并重置数据
const closeCaptcha = () => {
    dialogOpend.value = false
    resetCaptchaData()
}

// 刷新验证码窗口
const refreshCaptcha = async () => {
    resetCaptchaData()

    await initializeCaptchaData()
    await initializeCaptchaCanvas()
}

// 验证验证码
const geetestVerify = async () => {
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
        '82253e788a7b95e9'
    )

    // TODO: 选择合适的时机关闭验证码弹窗
    closeCaptcha()

    // FIXME: geetest_1730304530450({"status": "success", "data": {"result": "fail", "msg": ["unknown exception"]}})
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

    emit('getCaptchaResult', {
        token: captcha.value?.token as string,
        challenge: captcha.value?.geetest?.challenge as string,
        validate: validate.result,
    })
}

const emit = defineEmits<{
    getCaptchaResult: [result: CaptchaCardData]
}>()

onMounted(async () => {})
</script>

<template>
    <v-btn @click="openDialog">验证码</v-btn>

    <v-dialog v-model="dialogOpend" width="auto" persistent>
        <v-card width="320" height="480">
            <v-container>
                请在下图依次点击：
                <div class="geetest_tip_img_container">
                    <img :src="captchaImgSrc" class="geetest_tip_img" />
                </div>
            </v-container>
            <div class="geetest_item">
                <!-- 默认长宽是 300 * 150，不能使用 css 修改，需要使用属性 -->
                <canvas
                    ref="captchaCanvas"
                    class="geetest_item_img"
                    width="306.55px"
                    height="342.195px"
                ></canvas>
            </div>
            <template v-slot:actions>
                <v-tooltip location="top" text="关闭验证">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            icon="mdi-close-circle-outline"
                            @click.prevent="closeCaptcha"
                        ></v-btn>
                    </template>
                </v-tooltip>
                <v-tooltip location="top" text="刷新验证">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            v-bind="props"
                            icon="mdi-refresh"
                            @click.prevent="refreshCaptcha"
                        ></v-btn>
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
/* TODO: 验证码图像样式 */
.geetest_tip_img_container {
    width: 116px;
    height: 40px;
    overflow: hidden;
}
.geetest_tip_img {
    width: 100%; /* 使图像充满容器的宽度 */
    height: auto; /* 保持图像的原始高宽比 */
    object-fit: none; /* 保持其原有的尺寸 */
    object-position: left 0px bottom 90px;
}
.geetest_item {
    height: 306.55px;
    margin: -40px 2.225px 40px 2.225px;
}
.geetest_item_img {
    object-fit: cover;
    object-position: left 0px top 35.645px;
}
</style>
