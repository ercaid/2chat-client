<template>
	<view class="content">
		<view class="top">
			<image src="../../static/images/back.png" @click="back"></image>
			房间：{{ room }}
			<view class="right">当前在线人数：{{ count }}</view>
		</view>
		<view class="main">
			<scroll-view scroll-y="true" :scroll-into-view="scroll" :scroll-with-animation="true">
				<view class="msg-li" v-for="(item, index) in msgLi" :key="index" :id="'msg' + index">
					<!-- 左边的消息 -->
					<view class="msg-li-l" v-if="item.state == 1">
						<view class="avatar avatar-l" v-html="item.svgCode"></view>
						<view class="content-l">
							<view class="msg msg-l">{{ item.msg }}</view>
							<view class="name">{{ item.name }} {{ item.time | dataFormat }}</view>
						</view>
					</view>
					<!-- 右边的消息 -->
					<view class="msg-li-r" v-else-if="item.state == 0">
						<view class="content-r">
							<view class="msg msg-r">{{ item.msg }}</view>
							<view class="name">{{ item.time | dataFormat }}</view>
						</view>
						<view class="avatar avatar-r" v-html="svgCode"></view>
					</view>
					<!-- 加入消息 -->
					<view class="msg-join" v-else-if="item.state == 2">{{ item.name }}加入了房间</view>
					<!-- 离开消息 -->
					<view class="msg-join" v-else>{{ item.name }}离开了房间</view>
				</view>
			</scroll-view>
		</view>
		<view class="bottom">
			<input type="text" v-model="msg" />
			<image src="../../static/images/send.png" class="submit" @click="send"></image>
		</view>
	</view>
</template>

<script>
	import utils from '../../common/js/utils.js'
	export default {
		data() {
			return {
				msgLi: [],
				msg: '',
				room: '',
				name: '',
				svgCode: '',
				scroll: '',
				count: 0,
			}
		},
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			this.name = option.name
			this.room = option.room
			this.svgCode = option.svgCode
			this.receive()
			this.joinRoom()
		},
		onUnload() {
			// 发送退出房间的消息
			this.socket.emit('leave-room', this.room, this.name)
		},
		methods: {
			// 发送消息
			send() {
				// 如果消息不为空
				if (this.msg) {
					let msgS = {
						name: this.name,
						msg: this.msg,
						svgCode: this.svgCode,
						time: new Date(),
						state: 0
					}
					this.socket.emit('send-msg', this.room, msgS)
					this.msgLi.push(msgS)
					this.msg = ''
					this.getScroll()
				}
			},
			// 接收消息
			receive() {
				this.socket.on('receive-msg', msg => {
					if (msg.state == 2 || msg.state == 3) { // 加入房间或退出房间（2加入，3退出）
						this.count = msg.count // 获取房间人数
						this.msgLi.push(msg)
					} else {
						let msgR = {
							name: msg.name,
							msg: msg.msg,
							svgCode: msg.svgCode,
							time: new Date(),
							state: 1,
						}
						this.msgLi.push(msgR)
					}
					this.getScroll()
				})
			},
			// 加入房间
			joinRoom() {
				this.socket.emit('join-room', this.room, this.name)
			},
			// 返回
			back() {
				uni.redirectTo({
					url: '../signin/signin'
				})
			},
			// 滚动到底部
			getScroll() {
				this.$nextTick(function() {
					this.scroll = 'msg' + (this.msgLi.length - 1)
				})
			}
		},
		filters: {
			dataFormat(val) {
				return utils.dateTime(val)
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.content {
		height: 100%;

		.top {
			z-index: 1000;
			position: fixed;
			background: rgba(255, 255, 255, 0.96);
			width: 100%;
			text-align: center;

			height: 50px;
			font-size: 16px;
			color: #191D23;
			line-height: 50px;

			image {
				position: absolute;
				top: 0;
				left: 0;
				padding-top: 16px;
				padding-left: 20px;
				width: 18px;
				height: 18px;
			}

			.right {
				position: absolute;
				top: 0;
				right: 12px;
				font-size: 12px;
			}
		}

		.main {
			height: 100%;

			scroll-view {
				height: 100%;
				box-sizing: border-box;
				padding-top: 50px;

				.msg-li {
					margin-top: 20px;

					.msg-join {
						text-align: center;
						font-size: 12px;
						color: rgba(25, 29, 35, 0.5042886734008789);
						line-height: 17px;
						height: 17px;
					}

					.avatar {
						width: 40px;
						height: 40px;

						image {
							width: 40px;
							height: 40px;
							border-radius: 50%;
						}
					}

					.msg {
						// 自动换行
						word-wrap: break-word;
						padding: 10px;
						font-size: 14px;
						line-height: 20px;
						max-width: 180px;
					}

					.name {
						padding-top: 4px;
						height: 12px;
						font-size: 12px;
						color: rgba(25, 29, 35, 0.5042886734008789);
						line-height: 12px;
					}
				}

				.msg-li-l {
					display: flex;
					align-items: flex-end;
					justify-content: flex-start;

					.avatar-l {
						margin-left: 24px;
					}

					.content-l {
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						margin-left: 10px;
					}

					.msg-l {
						background: #F3F3F3;
						color: #191D23;
						border-radius: 12px 12px 12px 0px;
					}
				}

				.msg-li-r {
					display: flex;
					align-items: flex-end;
					justify-content: flex-end;

					.avatar-r {
						margin-right: 24px;
					}

					.content-r {
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						margin-right: 10px;
					}

					.msg-r {
						color: #FFF;
						background: #191D23;
						border-radius: 12px 12px 0px 12px;
					}
				}

				.msg-li:first-child {
					margin-top: 0;
				}

				.msg-li:last-child {
					padding-bottom: 90px;
				}
			}
		}

		.bottom {
			z-index: 1000;
			position: fixed;
			bottom: 0;
			width: 100%;
			padding: 10px 25px 25px;
			box-sizing: border-box;
			background: rgba(255, 255, 255, 0.96);

			input {
				font-size: 14px;
				color: #191D23;
				height: 44px;
				line-height: 44px;
				padding-left: 12px;
				padding-right: 40px;
				background: #F2F2F2;
				border-radius: 12px 12px 12px 12px;
			}

			.submit {
				position: absolute;
				top: 22.5px;
				right: 37px;
				width: 19px;
				height: 19px;
			}
		}
	}
</style>
