<template>
    <div class="ls-map d-flex flex-column" :class="customClass" :style="customStyle">
        <div slot="top" class="flex-start mb-10">
            <el-input
                id="map__input"
                v-model="searchAddress"
                placeholder="输入关键字选取地点"
                clearable
                class="flex-1"
                @clear="clear"
                @keydown.enter="handleSubmit()"
            />
            <el-button v-if="showBtn" icon="el-icon-check" type="primary" class="ml-15" @click="handleSubmit()">确 定</el-button>
        </div>
        <div class="w-100 flex-1 flex-center" style="min-height: 0">
            <div id="map__container" class="flex-1 h-100" tabindex="0" />
            <div id="map__result" class="h-100" />
        </div>
    </div>
</template>

<script>
import MapLoader from './amap.js'
export default {
    name: 'LsMap',
    props: {
        value: {
            type: Array,
            default: () => []
        },
        inputAddress: {
            type: String,
            default: ''
        },
        customClass: {
            type: Array,
            default: () => []
        },
        customStyle: {
            type: Object,
            default: () => ({
                width: '700px',
                height: '500px'
            })
        },
        showBtn: {
            type: Boolean,
            default: true
        },
        //是否使用搜索
        useSearch: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            searchAddress: '',
            poi: {},

            hasOper: false //是否在获取当前定位时进行了操作
        }
    },
    watch: {
        poi: {
            handler(val) {
                // console.log('poi Watch--', JSON.parse(JSON.stringify(val)))
                let arr = []
                if (JSON.stringify(val) !== '{}') {
                    this.searchAddress = val.formattedAddress
                    const { longitude, latitude, formattedAddress } = val
                    arr = [longitude, latitude, formattedAddress]
                } else {
                    this.searchAddress = ''
                    arr = []
                }
                this.$emit('input', arr)
            },
            deep: true
        },
        inputAddress: {
            handler(nAddr) {
                this.searchAddress = nAddr
            },
            immediate: true
        }
    },
    created() {
        if (this.value.length) {
            this.poi = {
                longitude: this.value[0],
                latitude: this.value[1],
                formattedAddress: this.value[2]
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        // 初始化地图
        init() {
            // https://lbs.amap.com/api/javascript-api/reference/map
            MapLoader().then(
                (AMap) => {
                    // console.log('地图加载成功');
                    this.map = new AMap.Map('map__container', {
                        zoom: 12,
                        resizeEnable: true,
                        // 自动定位到所在城市并显示
                        center: (() => {
                            if (this.poi && this.poi.longitude && this.poi.latitude) {
                                return [this.poi.longitude, this.poi.latitude]
                            }
                        })()
                    })

                    // 地图点击事件
                    this.map.on('click', (e) => {
                        // console.log('点击地图获取到的定位：', e);
                        this.hasOper = true

                        const lnglat = e.lnglat
                        // 经度
                        const lng = lnglat.lng
                        // 纬度
                        const lat = lnglat.lat

                        this.getAddress(lng, lat)
                    })

                    this.initPoiPicker()

                    this.initPlugins()
                },
                (e) => {
                    console.log('地图加载失败', e)
                }
            )
        },

        // 初始化点选择器
        initPoiPicker() {
            // https://developer.amap.com/api/amap-ui/reference-amap-ui/other/poipicker
            if (!window.AMapUI) {
                // console.log('initPoiPicker失败--')
                return
            }

            const that = this

            // 加载PoiPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            window.AMapUI.loadUI(['misc/PoiPicker'], (PoiPicker) => {
                // 初始化poiPicker
                const poiPicker = new PoiPicker({
                    input: 'map__input'
                    // 这里其实跟插件[AMap.Autocomplete]重叠了，并不生效
                    // autocompleteOptions: {
                    // 	input: 'map__input',
                    // },
                    // https://developer.amap.com/api/javascript-api/reference/search/#m_AMap.PlaceSearch
                    // 这里其实跟插件[AMap.PlaceSearch]重叠了，并不生效
                    // placeSearchOptions: {
                    // 	map: this.map,
                    // 	// pageSize: 3,
                    // 	panel: 'map__result'
                    // },
                    // 这个只有调用了[poiPicker.searchByKeyword]才会到这个searchResultsContainer内
                    // searchResultsContainer: 'map__result',
                    // suggestContainer: 'map__result'
                })

                //监听poi选中信息
                poiPicker.on('poiPicked', function (poiResult) {
                    that.hasOper = true

                    //用户选中的poi点信息

                    // 信息来源，search代表搜索服务，suggest代表输入提示
                    let source = poiResult.source,
                        poi = poiResult.item

                    // console.log('PoiResult--', JSON.parse(JSON.stringify(poiResult)))

                    // poiPicker.searchByKeyword(key: String);	//搜索
                    // poiPicker.clearSearchResults();		//清除搜索结果
                    // suggest(keyword:String);		//搜索建议
                    // .clearSuggest();		//清除建议

                    if (source != 'search') {
                        that.handleSubmit(poi.name, false)
                    }
                })

                // 非响应式挂载
                this.poiPicker = poiPicker
            })
        },

        // 初始化插件
        initPlugins() {
            const that = this

            window.AMap.plugin(['AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.Geocoder', 'AMap.Geolocation'], function () {
                // 这里不需要实例化了 否则会跟poiPicker有两个搜索提示的显示区
                // https://developer.amap.com/api/javascript-api/reference/search/#m_AMap.Autocomplete
                // const autoPlugin = new window.AMap.Autocomplete({
                // 	input: "map__input"
                // });

                // 这个跟poiPicker冲突了 不会触发
                // autoPlugin.on('select', function(ev) {
                // 	console.log('autoSelect--', ev)
                // })
                // that.autoPlugin = autoPlugin;

                // https://developer.amap.com/api/javascript-api/reference/search/#m_AMap.PlaceSearch
                const mapSearchPlugin = new window.AMap.PlaceSearch({
                    map: that.map,
                    // extensions: 'all',
                    pageSize: 3,

                    panel: 'map__result'
                    // showCover: false,
                    // autoFitView: true,

                    // renderStyle: 'default',
                })
                // 所有搜索统一走mapSearchPlugin 因此map__result的选中事件不会由poiPicker捕获
                mapSearchPlugin.on('selectChanged', (ev) => {
                    // console.log('高德地图搜索结果右边栏点击 mapSearchEv--', ev)
                    const poiResult = ev.selected.data
                    that.poi = {
                        longitude: poiResult.location.lng,
                        latitude: poiResult.location.lat,
                        formattedAddress: poiResult.pname + poiResult.cityname + poiResult.adname + poiResult.address
                    }
                    if (that.marker) {
                        that.map.remove(that.marker)
                        that.marker = null
                    }
                })

                // mapSearchPlugin.search(keyword:String,callback:function(status:String,result:info/SearchResult));	//搜索
                // mapSearchPlugin.clear();		//清除搜索

                that.mapSearchPlugin = mapSearchPlugin

                // https://developer.amap.com/api/javascript-api/reference/lnglat-to-address#m_AMap.Geocoder
                that.geocoderPlugin = new window.AMap.Geocoder({
                    // extensions: 'all'
                })

                // .getLocation(address:String, callback:function(status:String,result:info/GeocodeResult));	//搜索
                // .getAddress(location:LngLat|Array.<LngLat>, callback:function(status:String,result:info/ReGeocodeResult));	//经纬度反查地址

                // https://developer.amap.com/api/javascript-api/reference/location#m_AMap.Geolocation
                let geolocationPlugin = new window.AMap.Geolocation({
                    // 是否使用高精度定位，默认：true
                    enableHighAccuracy: true,
                    // 设置定位超时时间，默认：无穷大
                    timeout: 10000,
                    // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                    buttonOffset: new window.AMap.Pixel(10, 20),
                    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    zoomToAccuracy: true,
                    //  定位按钮的排放位置,  RB表示右下 /* LT LB RT RB */
                    buttonPosition: 'RB'
                })
                // 注意,下面的function就算改为()=>,里面的this指向还是不对的,一定要用that
                geolocationPlugin.getCurrentPosition(function (status, result) {
                    let position = null
                    if (status == 'complete') {
                        // result是具体的定位信息
                        // let { lng, lat } = result.position;
                        position = result.position
                        // console.log('location',result);//打开弹框时，默认取得的定位
                        // that._set_location(result)//给vuex里的location赋值(放入定位详细位置信息)
                    } else {
                        // 定位出错
                        console.log('InputMap定位出错-error：', result)
                    }

                    if (that.hasOper) return

                    if (that.poi && that.poi.longitude && that.poi.latitude) {
                        // 初始化时有值 则作回显
                        that.getAddress(that.poi.longitude, that.poi.latitude)
                    } else if (position) {
                        // 否则判断 初始定位
                        that.getAddress(position.lng, position.lat)
                    }
                })
            })
        },

        // 根据经纬度反查地址信息
        getAddress(lng, lat) {
            if (!this.geocoderPlugin) return

            const that = this

            this.geocoderPlugin.getAddress([lng, lat], (status, result) => {
                // console.log('经纬度查询---', status, result)
                if (status === 'complete' && result.info === 'OK') {
                    const regeocode = result.regeocode

                    that.poi = {
                        longitude: lng,
                        latitude: lat,
                        formattedAddress: result.regeocode.formattedAddress
                    }

                    that.clearSearch()
                    that.clearMarker()

                    let content = `<div><img class="amap-marker-img" src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">
                            <span class="input-map-marker">${regeocode.formattedAddress}</span></div>`
                    that.marker = new window.AMap.Marker({
                        content: content, // 自定义点标记覆盖物内容
                        position: [lng, lat],
                        title: regeocode.formattedAddress,
                        zIndex: 13
                    })
                    that.map.add(that.marker)
                }

                // 如果key值错误(只有1.3版本有效,2.0版本不能输出错误信息)
                if (status == 'error' && result == 'INVALID_USER_KEY') {
                    that.$message.error('无效的高德地图密钥(key)')
                }
            })
        },

        clearSearch() {
            this.mapSearchPlugin && this.mapSearchPlugin.clear()
        },

        clearMarker() {
            if (this.marker) {
                this.map.remove(this.marker)
                this.marker = null
            }
        },

        clear() {
            this.poi = {}

            this.clearSearch()
            this.clearMarker()
        },

        handleSubmit(searchVal) {
            this.hasOper = true

            const that = this
            if (this.mapSearchPlugin && this.useSearch) {
                // console.log('搜索词---', searchVal, this.searchAddress)
                this.mapSearchPlugin.search(searchVal || this.searchAddress, (status, result) => {
                    if (status == 'complete' && result.poiList.pois.length) {
                        // console.log('搜索结果------------------', result)
                        const {
                            location: { lat, lng },
                            pname,
                            cityname,
                            adname,
                            address,
                            name
                        } = result.poiList.pois[0]

                        that.poi = {
                            longitude: lng,
                            latitude: lat,
                            formattedAddress: pname + cityname + adname + address
                        }

                        this.clearMarker()

                        let content = `<div><img class="amap-marker-img" src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">
							<span class="input-map-marker">${name}</span></div>`
                        that.marker = new window.AMap.Marker({
                            content: content, // 自定义点标记覆盖物内容
                            position: [lng, lat],
                            title: name,
                            zIndex: 13
                            // offset: new AMap.Pixel(-110, -10)
                        })
                        that.map.add(that.marker)
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.ls-map {
    ::v-deep .amap-marker-img {
        width: 25px !important;
        height: 34px !important;
    }
    ::v-deep .input-map-marker {
        position: absolute !important;
        top: -25px !important;
        // right: -118px !important;
        left: 0 !important;
        transform: translateX(-50%);
        color: #fff !important;
        padding: 4px 10px !important;
        -webkit-box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
        box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
        white-space: nowrap;
        font-size: 12px;
        background-color: #25a5f7 !important;
        border-radius: 3px;
    }

    ::v-deep .el-dialog__headerbtn {
        z-index: 999;
    }

    // 右边的搜索结果map__result
    ::v-deep .amap_lib_placeSearch {
        height: 100% !important;
        max-width: 300px !important;
        display: flex !important;
        flex-direction: column !important;
        .amap_lib_placeSearch_list {
            flex: 1 !important;
            overflow-y: auto !important;
        }
    }
}
</style>
