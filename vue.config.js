'use strict'
require('babel-polyfill')
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve(dir) {
	return path.join(__dirname, dir)
}

const name = defaultSettings.title || '' // page title
const port = process.env.port || process.env.npm_config_port || 8086 // dev port
module.exports = {
	transpileDependencies: [
		[/node_modules[/\\\\](element-ui|vuex|)[/\\\\]/], 'axios', 'echarts', 'vuex'
	],
	// transpileDependencies: [
	//     /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]src/,
	//     /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]package/, 'vuex', 'axios', 'echarts'
	// ],
	publicPath: '/',
	outputDir: 'dist',
	assetsDir: 'static',
	// lintOnSave: process.env.NODE_ENV === 'development', // false:取消ESLint 校验
	lintOnSave: false, // false:取消ESLint 校验
	productionSourceMap: false,
	devServer: {
		port: port,
		open: true,
		overlay: {
			warnings: false,
			errors: false
		},
		// before: require('./mock/mock-server.js')
		// proxy: {
		//     "/api": {
		//       target: "192.168.0.31:8080/",
		//       ws: true,
		//       changeOrigin: true,
		//       pathRewrite: {
		//         "^/api": ""
		//       }
		//     }
		// }
	},
	configureWebpack: config => {
		config.name = name
		// config.resolve = {
		//     alias: {
		//         '@': resolve('src')
		//     }
		// }

		// { from: path.join(__dirname, 'config/serviceConfig.js'), to: path.join(__dirname, 'unpackage/dist', process.env.NODE_ENV === 'production' ? 'build/h5' : 'dev/h5') },
		if (process.env.NODE_ENV === 'production') {
			// 将serviceConfig.js 复制到根目录。目的是为了把serviceConfig.js里面的config变量挂载到全局里
			config.plugins.push(
				new CopyWebpackPlugin([{
					from: path.join(__dirname, 'src/config/serviceConfig.js'),
					to: path.join(__dirname, '/dist')
				}])
			)
		}
	},
	// configureWebpack: {
	// // provide the app's title in webpack's name field, so that
	// // it can be accessed in index.html to inject the correct title.
	//     name: name,
	//     resolve: {
	//         alias: {
	//             '@': resolve('src')
	//         }
	//     }
	//     // plugins: [new CopyWebpackPlugin([
	//     //     { from: path.join(__dirname, 'config/serviceConfig.js'), toType: 'file' }
	//     // ])]
	// },
	css: {
		loaderOptions: {
			sass: {
				implementation: require('sass'), // This line must in sass option
			},
		},
	},
	chainWebpack(config) {
		config.entry.app = ['babel-polyfill', './src/main.js']
		config.resolve.alias.set('@', resolve('src'))
		config.plugins.delete('preload') // TODO: need test
		config.plugins.delete('prefetch') // TODO: need test
		if (process.env.NODE_ENV === 'production') {
			// externals 属性添加 config 此项配置使  import config from '@/config/config.js'; 在生产环境的时候不会打包到代码里面
			config.set('externals', { '@/config': 'serviceConfig' })
		}

		// set svg-sprite-loader
		config.module
			.rule('svg')
			.exclude.add(resolve('src/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()

		// set preserveWhitespace
		config.module
			.rule('vue')
			.use('vue-loader')
			.loader('vue-loader')
			.tap(options => {
				options.compilerOptions.preserveWhitespace = true
				return options
			})
			.end()

		config
			// https://webpack.js.org/configuration/devtool/#development
			.when(process.env.NODE_ENV === 'development',
				config => config.devtool('cheap-source-map')
			)

		config
			.when(process.env.NODE_ENV !== 'development',
				config => {
					config
						.plugin('ScriptExtHtmlWebpackPlugin')
						.after('html')
						.use('script-ext-html-webpack-plugin', [{
							// `runtime` must same as runtimeChunk name. default is `runtime`
							inline: /runtime\..*\.js$/
						}])
						.end()
					config
						.optimization.splitChunks({
							chunks: 'all',
							cacheGroups: {
								libs: {
									name: 'chunk-libs',
									test: /[\\/]node_modules[\\/]/,
									priority: 10,
									chunks: 'initial' // only package third parties that are initially dependent
								},
								elementUI: {
									name: 'chunk-elementUI', // split elementUI into a single package
									priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
									test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
								},
								commons: {
									name: 'chunk-commons',
									test: resolve('src/components'), // can customize your rules
									minChunks: 3, //  minimum common number
									priority: 5,
									reuseExistingChunk: true
								}
							}
						})
					config.optimization.runtimeChunk('single')
				}
			)
	}
}