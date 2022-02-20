import App from './App'
import io from './common/js/socket.io.js'
import Vue from 'vue'

Vue.config.productionTip = false

const ip = 'localhost'
// const ip = '101.43.147.106'

Vue.prototype.socket = io(`http://${ip}:3000`)

App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
