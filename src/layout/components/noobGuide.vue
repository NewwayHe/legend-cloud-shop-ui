<template>
    <div class="modal w-100 h-100 position-absolute" style="z-index: 2001; background: rgba(0, 0, 0, 0.7)" :style="{ height: modleHeight + 'px' }">
        <!-- 关闭提示 -->
        <el-image
            class="position-fixed cursor-pointer"
            style="top: 140px; right: 85px"
            :src="require('@/assets/images/guide/exit_guide.png')"
            fit="fill"
            @click="exit"
        ></el-image>
        <!-- 提示文案 -->
        <el-image
            ref="tip"
            class="position-absolute"
            :style="tipPosition"
            :src="require('@/assets/images/guide/step_' + (getStepIndex + 1) + '_tip.png')"
            fit="fill"
        ></el-image>

        <div class="position-absolute flex-start" :style="btnPosition">
            <el-image
                v-if="getStepIndex != 0"
                class="mr-30 cursor-pointer"
                :src="require('@/assets/images/guide/previous_step.png')"
                fit="fill"
                @click.stop="previous"
            ></el-image>
            <el-image
                v-if="getStepIndex != steps.length - 1"
                class="cursor-pointer"
                :src="require('@/assets/images/guide/next_step.png')"
                fit="fill"
                @click.stop="next"
            ></el-image>
        </div>
    </div>
</template>

<script>
import domSearch from '@/utils/domSearch'
import { indexApi } from '@/api/Dashboard.js'
export default {
    name: 'Layout',
    components: {},
    data() {
        return {
            modleHeight: 1000,
            steps: [
                {
                    index: 1,
                    elId: 'guide-step1', //高亮DOM的ID
                    pagePath: '/dashboard', //高亮DOM所在的页面
                    tipPosition: 'left-top', //提示文案相对于高亮DOM的位置
                    btnOffsetTop: '121px', //
                    btnOffsetRight: '300px'
                },
                {
                    index: 2,
                    elId: 'guide-step2',
                    pagePath: '/ModuleSystem/orderSystem/logistics',
                    tipPosition: 'right-top',
                    btnOffsetTop: '140px',
                    btnOffsetRight: '280px'
                },
                {
                    index: 3,
                    elId: 'guide-step3',
                    pagePath: '/ModuleSystem/orderSystem/freightTemplate',
                    tipPosition: 'right-top',
                    btnOffsetTop: '140px',
                    btnOffsetRight: '280px'
                },
                {
                    index: 4,
                    elId: 'guide-step4',
                    pagePath: '/ModuleSystem/shopManage/ortherSet',
                    tipPosition: 'right-top',
                    btnOffsetTop: '140px',
                    btnOffsetRight: '150px'
                },
                {
                    index: 5,
                    elId: 'guide-step5',
                    pagePath: '/ModuleGoods/GoodsManage/goodList',
                    tipPosition: 'right-top',
                    btnOffsetTop: '140px',
                    btnOffsetRight: '280px'
                },
                {
                    index: 6,
                    elId: 'guide-step6',
                    pagePath: '/ModuleOperate/businessManage/order',
                    tipPosition: 'right-bottom',
                    btnOffsetTop: '200px',
                    btnOffsetRight: '280px'
                },
                {
                    index: 7,
                    elId: 'guide-step7',
                    pagePath: '/ModuleFinance/billList',
                    tipPosition: 'right-top',
                    btnOffsetTop: '200px',
                    btnOffsetRight: '280px'
                }
            ],
            tipPosition: {
                top: '-1000px'
            },
            btnPosition: {
                top: '-1000px'
            },
            count: 0,
            DOM_BackUp: {} //初始DOM元素备份,切换指引步骤时还原本组件DOM
        }
    },
    computed: {
        getStep() {
            return this.steps.find((v) => {
                return v.pagePath == this.$route.path
            })
        },
        getStepIndex() {
            return this.steps.findIndex((v) => {
                return v.pagePath == this.$route.path
            })
        }
    },
    watch: {
        $route: {
            handler(newVal) {
                if (this.getStep) {
                    this.initHandler()
                } else {
                    this.$router.push({ path: this.steps[0].pagePath })
                }
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {
        setTimeout(() => {
            this.modleHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.body.clientHeight,
                document.documentElement.clientHeight
            )
        }, 500)
    },
    updated() {
        console.log('updated')
        this.modleHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        )
    },
    methods: {
        test() {
            this.count++
        },
        initHandler() {
            setTimeout(() => {
                if (this.getStepIndex == 0) {
                    document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
                } else {
                    document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
                }
                domSearch('#guide-step' + (this.getStepIndex + 1), this.setElementToModal)
            }, 500)
        },
        //获取元素的绝对位置
        getPosition(el) {
            var offsetTop = el.offsetTop
            var offsetLeft = el.offsetLeft
            var offsetWidth = el.offsetWidth
            var offsetHeight = el.offsetHeight
            while ((el = el.offsetParent)) {
                offsetTop += el.offsetTop
                offsetLeft += el.offsetLeft
            }
            let obj = {
                absoluteTop: offsetTop,
                absoluteLeft: offsetLeft,
                offsetWidth: offsetWidth,
                offsetHeight: offsetHeight
            }
            obj.absoluteRight = this.$el.clientWidth - obj.offsetWidth - obj.absoluteLeft
            return obj
        },
        setElementToModal(el) {
            // el.style.zIndex=1999
            let modal = this.$el
            const position = this.getPosition(el) //获取高亮原属的位置及宽高
            let highLight = el.cloneNode(true)
            highLight.setAttribute('id', highLight.id + '-copy')
            let opacity = document.createElement('div') //创建一个DIV覆盖在高亮元素上阻止点击事件

            let arr = [highLight, opacity]
            // el.style.zIndex=9999
            for (let i = 0; i < arr.length; i++) {
                arr[i].style.zIndex = 2002 + i
                arr[i].style.position = 'absolute'
                arr[i].style.top = position.absoluteTop + 'px'
                if (this.getStep.tipPosition.indexOf('left') != -1) {
                    arr[i].style.right = position.absoluteRight + 'px'
                } else {
                    arr[i].style.position = 'fixed'
                    arr[i].style.left = position.absoluteLeft + 'px'
                }
                arr[i].style.width = position.offsetWidth + 'px'
                arr[i].style.height = position.offsetHeight + 'px'
                modal.appendChild(arr[i])
            }
            this.setTipPosition()
            this.setBtnPosition()
        },
        setTipPosition() {
            let step = this.getStep
            const position = this.getPosition(document.getElementById('guide-step' + step.index))
            if (step.tipPosition.indexOf('left') != -1) {
                //
                this.$set(this.tipPosition, 'right', this.$el.clientWidth - position.absoluteLeft + 10 + 'px')
            } else {
                this.$set(this.tipPosition, 'left', position.offsetWidth + position.absoluteLeft + 10 + 'px')
                this.$set(this.tipPosition, 'position', 'fixed')
            }

            if (step.tipPosition.indexOf('top') != -1) {
                // this.$set(this.tipPosition, 'top', (position.absoluteTop - position.offsetHeight/2) +'px')
                this.$set(this.tipPosition, 'top', position.absoluteTop - (this.$refs?.tip?.imageHeight || 0) + 'px')
            } else {
                this.$set(this.tipPosition, 'top', position.absoluteTop + position.offsetHeight + 'px')
            }
        },
        // 设置按按钮组的位置
        setBtnPosition() {
            let step = this.getStep
            const position = this.getPosition(document.getElementById('guide-step' + step.index))
            let style = {}
            if (step.tipPosition.indexOf('left') != -1) {
                //
                style.right = 'calc(' + this.tipPosition.right + ' + ' + step.btnOffsetRight + ')'
            } else {
                style.left = 'calc(' + this.tipPosition.left + ' + ' + step.btnOffsetRight + ')'
                style.position = 'fixed'
            }

            if (step.tipPosition.indexOf('top') != -1) {
                style.top = 'calc(' + this.tipPosition.top + ' + ' + step.btnOffsetTop + ')'
            } else {
                style.top = 'calc(' + this.tipPosition.top + ' + ' + step.btnOffsetTop + ')'
            }
            this.btnPosition = style
        },
        //上一步
        previous() {
            this.restore()
            this.$router.push({ path: this.steps[this.getStepIndex - 1].pagePath })
        },
        next() {
            this.restore()
            this.$router.push({ path: this.steps[this.getStepIndex + 1].pagePath })
        },
        exit() {
            indexApi.newBier({ shopNewBieStatus: 1, shopId: this.$store.state.user.shopInfo.id }).then((res) => {})
            document.getElementsByTagName('body')[0].style.overflowY = 'initial'
            this.$store.dispatch('app/setGuide', false)
            window.localStorage.setItem('guide', false)
        },
        restore() {
            console.log('restoring')
            this.$emit('refresh') //通过改变组件key还原
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-card__header {
    padding: 14px 20px;
    font-weight: 600;
    font-size: 18px;
    color: #333;
    line-height: 25px;
}
.w-20 {
    width: 20%;
}
</style>
