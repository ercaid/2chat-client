<template>
	<view class="content">
		<view class="title">欢迎使用 2chat !</view>
		<view class="avatar" v-html="svgCode" @click="randomAvatar"></view>
		<view class="input">
			<input type="text" v-model="name" placeholder="取个名字吧" maxlength="6" />
		</view>
		<view class="input">
			<input type="text" v-model="room" placeholder="创建或加入房间" maxlength="6" />
		</view>

		<view class="bottom">
			<view class="tip" v-if="tip">名字或房间号不能为空</view>
			<view class="btn" @click="send">进入</view>
		</view>
	</view>
</template>

<script>
	import multiavatar from '../../common/@multiavatar/multiavatar/dist/esm/index.js'
	export default {
		data() {
			return {
				svgCode: '',
				name: '',
				room: '',
				tip: false
			};
		},
		onLoad() {
			this.initAvatar()
		},
		methods: {
			// 初始随机头像
			initAvatar() {
				let e = 18
				let str = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"
				let l = str.length
				let avatarId = ''
				let count = 0
				for (let i = 0; i < e; i++) {
					avatarId += str.charAt(Math.floor(Math.random() * l));
				}
				this.svgCode = multiavatar(avatarId)
			},
			// 获取随机头像
			randomAvatar() {
				this.svgCode = ''
				let e = 18
				let str = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"
				let l = str.length
				let avatarId = ''
				let count = 0
				let change = setInterval(() => {
					avatarId += str.charAt(Math.floor(Math.random() * l));
					this.svgCode = multiavatar(avatarId)
					count++
					if (count > 17) {
						window.clearInterval(change)
					}
				}, 10)
			},
			// 进入聊天室
			send() {
				if (this.name && this.room) {
					this.tip = false
					uni.redirectTo({
						url: `../index/index?name=${this.name}&room=${this.room}&svgCode=${this.svgCode}`
					})
				} else {
					this.tip = true
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		align-items: center;

		.title {
			height: 25px;
			padding-top: 102px;
			font-size: 18px;
			color: #191D23;
			line-height: 25px;
			font-weight: 700;
		}

		.avatar {
			padding-top: 58px;
			width: 72px;
			height: 72px;
		}

		.input {
			margin-top: 27px;
			width: 240px;
			height: 48px;
			background: #F1F1F1;
			border-radius: 12px 12px 12px 12px;
		}

		.bottom {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			position: relative;

			.tip {
				position: absolute;
				color: rgba(255, 93, 91, 1);
				font-size: 16px;
			}

			.btn {
				margin-top: 98px;
				width: 100px;
				height: 50px;
				line-height: 50px;
				text-align: center;
				background: #191D23;
				color: white;
				border-radius: 12px;
			}
		}

		input {
			text-align: center;
			height: 48px;
			height: 48px;
			font-size: 18px;
			color: #191D23;
			padding: 0 16px;
		}

	}
</style>
