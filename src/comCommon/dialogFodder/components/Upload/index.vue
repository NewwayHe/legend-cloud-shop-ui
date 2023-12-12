<template>
	<div class="d-inline-block py-5 w-100">
		<div class="lsUpload w-100 overflow-y py-10" style="max-height: 351px">
			<div class="w-100 h-100">
				<div class="flex-start flex-wrap w-100">
					<template v-if="uploadType == 'zip'">
						<el-upload
							ref="upload"
							:disabled="disabled"
							name="file"
							:show-file-list="true"
							:on-error="handleAvatarError"
							:before-upload="beforeAvatarUpload"
							action
							:data="typeDiff.data"
							:accept="typeDiff.accept"
							:http-request="httpRequest"
							:on-exceed="handleExceed"
							:limit="limit"
							multiple
							:on-remove="onRemove"
						>
							<template slot="trigger">
								<el-button size="small" type="primary">选取文件</el-button>
							</template>
						</el-upload>
					</template>
					<template v-else>
						<el-upload
							v-show="multiple ? tempUrl.length < limit : true"
							ref="upload"
							:disabled="disabled"
							:headers="headers"
							name="file"
							:multiple="multiple"
							:show-file-list="false"
							:on-success="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload"
							:action="typeDiff.action"
							:data="typeDiff.data"
							:accept="typeDiff.accept"
							:on-error="handleAvatarError"
							class="position-relative hover-border mx-5"
							:limit="limit"
							:file-list="fileList"
							:on-exceed="limitTip"
						>
							<div :class="{ lsUpload__box: !isHiddenImg && (!button || (!multiple && tempUrl)) }" :style="uploadStyle">
								<ls-image
									v-if="!isHiddenImg && !multiple && tempUrl"
									:isPreview="false"
									class="lsUpload__img w-100 h-100"
									mode="contain"
									:src="tempUrl"
									:os-options="{ w: '100', h: '100' }"
									style="border-radius: 6px; width: 100%; height: 100%"
								/>
								<el-button v-else-if="isHiddenImg && tempUrl" type="primary" size="small">
									<div class="font-14">
										已选择
										<i class="el-icon-upload el-icon--right" />
									</div>
								</el-button>
								<template v-else>
									<el-button v-if="button" type="primary" size="small">
										<div class="font-14">
											上传
											<i class="el-icon-upload el-icon--right" />
										</div>
									</el-button>
									<i v-else class="el-icon-plus uploader-icon" />
								</template>
							</div>
							<i
								v-if="deleteAble && tempUrl && tempUrl.length"
								class="d-none el-icon-error font-24 position-absolute cursor-pointer bg-white rounded-circle"
								style="top: -12px; right: -12px"
								@click.stop="del"
							/>
						</el-upload>
						<!-- 图片/视频展示区 -->
						<template v-if="uploadType == 'pic'">
							<div v-for="(item, index) in tempUrl" :key="index + 1" class="lsUpload__imgWarp flex-center" :style="uploadStyle">
								<ls-image mode="contain" :src="item" :os-options="{ w: '100', h: '100' }" style="border-radius: 6px; width: 100%; height: 100%" />
								<i class="lsUpload__imgClose el-icon-error" @click="delImg(index)" />
							</div>
						</template>
						<template v-else>
							<div v-for="(videoSrc, index) in tempUrl" :key="videoSrc" class="lsUpload__imgWarp flex-center" :style="uploadStyle">
								<video :src="$photoServer + videoSrc" class="w-100 h-100" style="border-radius: 6px;" @click.stop="previewVideo($photoServer + videoSrc)"></video>
								<i class="lsUpload__imgClose el-icon-error" @click="delImg(index)" />
							</div>
						</template>
					</template>
				</div>
			</div>
		</div>

		<!-- 视频放大预览 -->
		<div v-if="isPreviewVideo" class="el-image-viewer__wrapper" style="z-index: 3333;">
			<div class="el-image-viewer__mask" style="opacity: .2;"></div>
			<span class="el-image-viewer__btn el-image-viewer__close d-flex font-0" @click.stop="isPreviewVideo = false"><i class="el-icon-circle-close"></i></span>
			<div class="el-image-viewer__canvas"><video :src="previewVideoSrc" controls autoplay style="width: 80vw; height: 80vh;"></video></div>
		</div>
	</div>
</template>

<script>
import { getToken } from '@/utils/auth';
export default {
	components: { },
	props: {
		value: {
			type: [String, Array]
		},
		uploadType: {
			//上传类型 [pic,video,zip]
			type: String,
			default: 'pic'
		},
		button: {
			// 是否按钮显示
			type: Boolean,
			default: false
		},
		isHiddenImg: {
			// 是否显示图片
			type: Boolean,
			default: false
		},
		deleteAble: {
			// 是否支持删除(当该值为true时，鼠标；移动到图片上时，会出现删除按钮)
			type: Boolean,
			default: false
		},
		limit: {
			// 限制多少张
			type: Number,
			default: 15
		},
		onSuccess: {
			type: Function,
			default: function() {}
		},
		onError: {
			type: Function,
			default: function() {}
		},
		uploadStyle: {
			type: [String, Object],
			default: ''
		},
		disabled: {
			type: [Boolean, Object],
			default: false
		},
		isWatchTempUrl: {
			type: Boolean,
			default: true
		},
		floderId: {
			type: [Number, String],
			required: true
		},
		posterConf: {
			//上传视频时 绑定封面图 使用 暂时限定为同一个页面 [attachmentId分外部和内部 内部用于清除自身 外部用于绑定]
			type: Object,
			default: () => ({
				useAttachment: false, //标识 接口使用绑定关系
				attachmentId: 0 //绑定ID 外部传入
			})
		}
	},
	data() {
		return {
			loadingFlag: null,
			tempUrl: typeof this.value === 'object' ? [] : '',
			headers: { Authorization: 'Bearer ' + getToken() },

			isPreviewVideo: false, //预览视频
			previewVideoSrc: '', //预览视频地址

			fileList: [] //当前已上传的文件列表[如果不做清除 选满限制张数后，删除一张，再上传都会提示已超限制]
		};
	},
	computed: {
		multiple() {
			if (this.value) {
				return typeof this.value === 'object';
			} else {
				return false;
			}
		},
		// 根据上传类型 来划分不同的请求数据
		typeDiff({ uploadType }) {
			let picObj = { accept: '.jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, .PBG, .GIF, .BMP' };
			if (this.posterConf.useAttachment) {
				Object.assign(picObj, {
					action: this.$config.server + '/basic/s/file/uploadFileVideoNew',
					data: { uploadType: true, fileFolderId: this.floderId, attachmentId: this.posterConf.attachmentId }
				});
			} else {
				Object.assign(picObj, {
					action: this.$config.server + '/basic/s/file/uploadNew',
					data: { fileSource: 'A', fileFolderId: this.floderId }
				});
			}
			const typeObj = {
				pic: {
					...picObj
				},
				video: {
					action: this.$config.server + '/basic/s/file/uploadFileVideoNew',
					data: { uploadType: false, fileFolderId: this.floderId, attachmentId: this.posterConf.attachmentId }, //uploadType false代表视频 true代表图片
					// accept: '.wmv, .asf, .asx, .rm, .rmvb, .MPEG, .mp4, .3gp, .mov, .m4v, .avi, .dat, .mkv, .flv, .vob'
					accept: '.mp4, .webm, .ogg'
				},
				zip: {
					action: '#', // this.$config.server + '/basic/s/file/uploadFileVideoNew',
					data: {}, //{ 'uploadType': false, 'fileFolderId': this.floderId, 'attachmentId': this.posterConf.attachmentId },   //uploadType false代表视频 true代表图片
					accept: '.zip, .rar'
				}
			};
			return typeObj[uploadType];
		}
	},
	watch: {
		tempUrl(newVal) {
			if (this.isWatchTempUrl && this.multiple) {
				if (newVal && newVal.length > this.limit) {
					newVal.length = this.limit;
				}
			}
			this.$emit('input', newVal);
		},
		value: {
			immediate: true,
			handler(newVal) {
				this.tempUrl = newVal;
			}
		}
	},
	mounted() {},
	methods: {
		handleAvatarSuccess(res, file, fileList) {
			if (res.code === 1) {
				if (this.multiple) {
					this.tempUrl.push(res.data.url);
				} else {
					this.tempUrl = res.data.url;
				}
				res.typeNull = `${this.uploadType}Null`; //标识 当前有数据 [视频上传使用]
				this.fileList = fileList;
				this.onSuccess(res, file, fileList);
				this.$emit('success', res, file, fileList);
			} else {
				this.$message.error(res.msg);
			}
			this.loadingFlag.close();
		},
		beforeAvatarUpload(file) {
			this.loadingFlag = this.$loading({ text: '正在上传' });
			let isLimit = false;
			if (this.uploadType == 'pic') {
				isLimit = file.size / 1024 / 1024 < 5;
				if (!isLimit) {
					this.loadingFlag.close();
					this.$message.error('上传图片大小不能超过 5MB!');
				}
			} else if (this.uploadType == 'zip') {
				this.loadingFlag.close();
				isLimit = true;
			} else {
				//视频
				isLimit = file.size / 1024 / 1024 < 30;
				if (!isLimit) {
					this.loadingFlag.close();
					this.$message.error('上传视频大小不能超过 30MB!');
				}
			}
			return isLimit;
		},
		handleAvatarError(err, file, fileList) {
			this.loadingFlag.close();
			if (err.status == 400) {
				let error = err.message ? JSON.parse(err.message) : { msg: '上传出错' };
				this.$message.error(error.msg);
			} else {
				this.$message.error('上传出错');
			}
			this.onError(err, file, fileList);
		},
		delImg(index) {
			this.$confirm('确认删除该数据吗?', '提示', {
				type: 'warning'
			}).then(() => {
				this.tempUrl.splice(index, 1);
				this.fileList.splice(index, 1); //这里的顺序不一定会与tempURL对应上 但是只要保证数量对就可以了
				if (this.posterConf.useAttachment) {
					//告知外部 视频/封面图都清空了 则要将外部存在attachmentId做清空
					this.$emit('delCb', `${this.uploadType}Null`);
				}
			});
		},

		del() {
			if (this.posterConf.useAttachment) {
				//告知外部 视频/封面图都清空了 则要将外部存在attachmentId做清空
				this.$emit('delCb', `${this.uploadType}Null`);
			}
			this.$emit('input', typeof this.value === 'object' ? [] : '');
		},

		// 限制选择上传图片数量
		limitTip(files, fileList) {
			if (this.tempUrl.length + files.length > this.limit) {
				this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + this.tempUrl.length} 个文件`);
				return;
			}
		},
		// 用于清空图片列表，图片上传完成后的清空只是对model清空，upload组件的filelist没有清空，连续上传会触发上传限制函数
		clearFiles() {
			if (this.$refs.upload) {
				this.$refs.upload.clearFiles();
			}
		},

		// 放大预览视频
		previewVideo(src) {
			console.log('放大--', src);
			this.isPreviewVideo = true;
			this.previewVideoSrc = src;
		},

		// 重写文件上传方法,覆盖原有的上传方法，将上传的文件依次添加到fileList数组中
		httpRequest(option) {
			this.fileList.push(option);
			this.$emit('input', this.fileList);
		},
		onRemove(e){
			this.fileList = this.fileList.filter((item)=>{ return item.file.uid!=e.raw.uid })
			this.$emit('input', this.fileList);
		},

		// 文件数量过多时提醒
		handleExceed() {
			this.$message({ type: 'info', message: `最多支持${this.limit}个附件上传` });
		}
	}
};
</script>

<style lang="scss" scoped>
.box {
	width: 100px;
	position: relative;
	background-color: red;
	&::before {
		content: '';
		padding-top: 100%;
		box-sizing: border-box;
		display: block;
		width: 0;
	}
}
.pox {
	position: absolute;

	height: 100%;

	width: 100%;

	left: 0;

	top: 0;

	border: 1px solid red;

	box-sizing: border-box;
}
@import '~@/styles/mixin.scss';
@keyframes shake {
	/* 水平抖动，核心代码 */
	10%,
	90% {
		transform: translate3d(calc(50% + 0.4px), calc(-50% + 0.4px), 0) rotate(4deg);
	}
	20%,
	80% {
		transform: translate3d(calc(50% - 0.4px), calc(-50% - 0.4px), 0) rotate(-4deg);
	}
	30%,
	70% {
		transform: translate3d(calc(50%), calc(-50% - 0.6px), 0) rotate(0deg);
	}
	40%,
	60% {
		transform: translate3d(calc(50% + 0.4px), calc(-50% + 0.4px), 0) rotate(4deg);
	}
	50% {
		transform: translate3d(calc(50% - 0.4px), calc(-50% - 0.1px), 0) rotate(-4deg);
	}
}
.lsUpload {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	top: -10px;
	line-height: 1 !important;
	.draggable {
		span {
			display: flex;
			flex-wrap: wrap;
		}
	}
	&__imgWarp {
		position: relative;
		width: 100px;
		height: 100px;
		margin: 0 5px 0 !important;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		.lsUpload__imgClose {
			display: none;
			visibility: hidden;
		}
		&:hover {
			.lsUpload__imgClose {
				display: block;
				visibility: visible;
			}
		}
	}
	&__imgClose {
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(50%, -50%);
		color: rgba($color: #000000, $alpha: 0.4);
		font-size: 22px;
		display: none;
	}
	//上传外框
	.lsUpload__box {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		&:hover {
			border-color: #409eff;
		}
		&::before {
			content: '';
			padding-top: 100%;
			box-sizing: border-box;
			display: block;
			width: 0;
		}
	}
	//上传组件内图片
	.uploader-img {
		width: 100%;
		height: 100%;
		display: block;
	}
	//上传组件内 +
	.uploader-icon {
		color: #c0c4d6;
		font-size: 18px;
	}
}
</style>
<style lang="scss" scoped>
$--color-primary: #007bff;
.lsUpload {
	&::-webkit-scrollbar {
		width: 6px;
		border-radius: 4px;
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(144, 147, 153, 0.3);
		border-radius: 4px;
		&:hover {
			background: rgba(144, 147, 153, 0.5);
		}
	}
}
.d-none {
	color: #999999;
	&:hover {
		color: #666666;
	}
}
.lsUpload__imgWarp ::v-deep {
	.el-icon-error:hover {
		color: $--color-primary;
	}
}
</style>
