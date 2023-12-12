<template>
    <div :class="['tinymce-container', { 'fullscreen': fullscreen }]">
        <vue-tinymce
            v-model="content" 
            :setting="setting"
            :setup="setupCb"
            @change="valChange"
            :disabled="disabled"
        />
        <div class="editor-custom-btn-container">
            <!-- <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" /> -->
            <imgCenter :disabled="disabled" :limit="15" :isShowSelected="false" button mult in-rich-text @input="imageSuccessCBK"></imgCenter>
        </div>
    </div>
</template>

<script>
// https://github.com/lpreterite/vue-tinymce 文档链接

export default {
    props: {
        value: String,
        width: {
            type: [Number,String],
            default: '100%'
        },
        height: {
            type: [Number,String],
            default: 350
        },
        toolbar: {
            type: [Array,String],
            default: () => ([
                'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
                'hr bullist numlist link image media charmap preview anchor pagebreak insertdatetime table emoticons forecolor backcolor fullscreen'
            ])
        },
        menubar: {
            type: String,
            default: 'file edit insert view format table'
        },
        plugins: {
            type: String,
            default: 'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace  tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
        },
        disabled:{
            Boolean,
            default:false,
        }
    },
    computed: {
        content: {
            get() {
                return this.value
            },
            set(nV) {
                // this.$emit("update:value", nV)
                this.$emit("input", nV)
            }
        },
        setting({ width, height, toolbar, menubar, plugins }) {
            return {
                width,
                height,
                toolbar,
                menubar,
                plugins,
                content_style: "p { margin: 0; }",
                // toolbar_drawer: "sliding",
                // quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
                // plugins: "link image media table lists fullscreen quickbars",
                language: 'zh_CN', //本地化设置
                language_url: "/static/tinyNew/tinymce/langs/zh_CN.js", //使用language_url会相对灵活

                // image配置
                image_description: false,

                // media配置
                media_alt_source: false,    // 是否启用 替换地址 设置
                // media_dimensions: false,    // 是否启用 宽高设置
                // media_live_embeds: false,    // 是否启用 上传视频后用图片占位还是视频占位
                video_template_callback: this.videoCallback
            }
        }
    },
    watch: {
        // value(nV, oV) {
        //     console.log('改变监听--',nV, oV)
        // }
    },
    data(){
        return {
            // content: '<h1 style="text-align: center;">长恨歌</h1><p style="text-align: center;">汉皇重色思倾国，御宇多年求不得。<br />杨家有女初长成，养在深闺人未识。<br />天生丽质难自弃，一朝选在君王侧。<br />回眸一笑百媚生，六宫粉黛无颜色。<br />春寒赐浴华清池，温泉水滑洗凝脂。<br />侍儿扶起娇无力，始是新承恩泽时。<br />云鬓花颜金步摇，芙蓉帐暖度春宵。<br />春宵苦短日高起，从此君王不早朝。<br />承欢侍宴无闲暇，春从春游夜专夜。<br />后宫佳丽三千人，三千宠爱在一身。<br />金屋妆成娇侍夜，玉楼宴罢醉和春。<br />姊妹弟兄皆列土，可怜光彩生门户。<br />遂令天下父母心，不重生男重生女。<br />骊宫高处入青云，仙乐风飘处处闻。<br />缓歌慢舞凝丝竹，尽日君王看不足。<br />渔阳鼙鼓动地来，惊破霓裳羽衣曲。</p><p style="text-align: center;">九重城阙烟尘生，千乘万骑西南行。<br />翠华摇摇行复止，西出都门百余里。<br />六军不发无奈何，宛转蛾眉马前死。<br />花钿委地无人收，翠翘金雀玉搔头。<br />君王掩面救不得，回看血泪相和流。<br />黄埃散漫风萧索，云栈萦纡登剑阁。<br />峨嵋山下少人行，旌旗无光日色薄。<br />蜀江水碧蜀山青，圣主朝朝暮暮情。<br />行宫见月伤心色，夜雨闻铃肠断声。<br />天旋日转回龙驭，到此踌躇不能去。<br />马嵬坡下泥土中，不见玉颜空死处。<br />君臣相顾尽沾衣，东望都门信马归。<br />归来池苑皆依旧，太液芙蓉未央柳。<br />芙蓉如面柳如眉，对此如何不泪垂。<br />春风桃李花开夜，秋雨梧桐叶落时。<br />西宫南苑多秋草，落叶满阶红不扫。<br />梨园弟子白发新，椒房阿监青娥老。<br />夕殿萤飞思悄然，孤灯挑尽未成眠。<br />迟迟钟鼓初长夜，耿耿星河欲曙天。<br />鸳鸯瓦冷霜华重，翡翠衾寒谁与共。<br />悠悠生死别经年，魂魄不曾来入梦。</p><p style="text-align: center;">临邛道士鸿都客，能以精诚致魂魄。<br />为感君王辗转思，遂教方士殷勤觅。<br />排空驭气奔如电，升天入地求之遍。<br />上穷碧落下黄泉，两处茫茫皆不见。<br />忽闻海上有仙山，山在虚无缥缈间。<br />楼阁玲珑五云起，其中绰约多仙子。<br />中有一人字太真，雪肤花貌参差是。<br />金阙西厢叩玉扃，转教小玉报双成。<br />闻道汉家天子使，九华帐里梦魂惊。<br />揽衣推枕起徘徊，珠箔银屏迤逦开。<br />云鬓半偏新睡觉，花冠不整下堂来。</p><p style="text-align: center;">风吹仙袂飘飖举，犹似霓裳羽衣舞。<br />玉容寂寞泪阑干，梨花一枝春带雨。<br />含情凝睇谢君王，一别音容两渺茫。<br />昭阳殿里恩爱绝，蓬莱宫中日月长。<br />回头下望人寰处，不见长安见尘雾。<br />惟将旧物表深情，钿合金钗寄将去。<br />钗留一股合一扇，钗擘黄金合分钿。<br />但令心似金钿坚，天上人间会相见。</p><p style="text-align: center;">临别殷勤重寄词，词中有誓两心知。<br />七月七日长生殿，夜半无人私语时。<br />在天愿作比翼鸟，在地愿为连理枝。<br />天长地久有时尽，此恨绵绵无绝期。</p>',
            fullscreen: false,
        }
    },
    methods: {
        setupCb(editor) {
            // console.log('cb--', editor)
            const that = this;
            editor.on('FullscreenStateChanged', (e) => {
                that.fullscreen = e.state
            })
        },
        valChange(val) {        //输入改变
            // console.log('改变了--', val)
            this.$emit('change',val)
        },
        videoCallback(data) {   //这个只影响到了外面的 非富文本里的 富文本里的不能自动播放   controls="controls" autoplay="autoplay"
            const { width, height, source, sourcemime, poster, altsource, altsourcemime } = data
            return `<video width="${width}" height="${height}" poster="${poster}" controls autoplay muted
                    style="max-width: 100%; background-color: #000; vertical-align: bottom;"
                >
                    <source src="${source}" type="${sourcemime}"/>
                    ${altsource ? `<source src="${altsource}" type="${altsourcemime}"/>`: ''}
                </video>
            `
        },
        // 区分 视频Or图片 true为视频 false为图片
        diffPicOrVideo(ext) {
            const videoExt = ['.wmv', '.asf', '.asx', '.rm', '.rmvb', '.MPEG', '.mp4', '.3gp', '.mov', '.m4v', '.avi', '.dat', '.mkv', '.flv', '.vob', '.webm', '.ogg'];
            return videoExt.includes(ext.toLowerCase())
        },
        // 上传图片/视频
        imageSuccessCBK(arr) {
            console.log('arr--', arr)
            const that = this;
            let picStr = ""
            arr.forEach(src => {
                let picExt = src.split('.').slice(-1)
                if(this.diffPicOrVideo(`.${picExt}`)) {
                    picStr += `<video src="${that.$photoServer + src}" data-mce-src="${that.$photoServer + src}" controls autoplay muted width="300" height="150" style="max-width: 100%; background-color: #000; vertical-align: bottom;"></video>`
                }else {
                    picStr += `<img src="${that.$photoServer + src}" data-mce-src="${that.$photoServer + src}" style="max-width: 100%; vertical-align: bottom;"/>`
                }
            });
            that.content += picStr
        }
    }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
    position: relative;
    line-height: normal;
}

.tinymce-container >>> .mce-fullscreen {
    z-index: 10000;
}

.editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    z-index: 8;
}
.fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
}
</style>