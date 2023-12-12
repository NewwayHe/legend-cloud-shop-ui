module.exports = {
    presets: [
        ['@vue/app', { 'useBuiltIns': 'entry' }]
    ],
	"plugins": [
		"@babel/plugin-proposal-optional-chaining",//引入npm install @babel/plugin-proposal-optional-chaining，这个的作用是让res?.data这样的写法?.不报错
	]
}
