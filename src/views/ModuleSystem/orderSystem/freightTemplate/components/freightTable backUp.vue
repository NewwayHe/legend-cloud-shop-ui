<template>
	<div class="customTable__warp">
		<table class="customTable__header">
			<thead class="bg__grap">
				<tr>
					<th>序号</th>
					<th>运费模板名称</th>
					<th>类型</th>
					<th>计费类型</th>

					<template v-if="transQueryType == 1">
						<th colspan="2">配送至</th>
						<th>首重/体积/件</th>
						<th>运费</th>
						<th>续重/体积/件</th>
						<th>运费</th>
					</template>
					<template v-if="transQueryType == 2">
						<th colspan="2">配送至</th>
						<th>固定运费</th>
					</template>
					<template v-if="transQueryType == 3">
						<th colspan="2">配送至</th>
					</template>

					<th>操作</th>
				</tr>
			</thead>
		</table>

		<table v-for="(item, indexs) in tableList" :key="item.id" class="freightTable__table">
			<tr>
				<td style="padding: 12px" width="48">{{ indexs + 1 }}</td>
				<td>{{ item.transName }}</td>
				<td>自定义</td>
				<td>
					<template v-if="item.freeFlag">
						<span>包邮</span>
					</template>
					<template v-else>
						<span v-if="item.transType == 1">按件数</span>
						<span v-if="item.transType == 2">按重量</span>
						<span v-if="item.transType == 3">按体积</span>
						<span v-if="item.transType == 4">固定运费</span>
					</template>
				</td>

				<td v-if="transQueryType == 1" colspan="6">
					<table class="freightTable__inTable border__table">
						<tr v-for="(transItem, transIndex) in item.transFeeDTOList" :key="transIndex">
							<td colspan="2">{{ transItem.area || '-' }}</td>
							<td>{{ transItem.firstNum || '-' }}</td>
							<td>{{ transItem.firstPrice || '-' }}</td>
							<td>{{ transItem.addNum || '-' }}</td>
							<td>{{ transItem.addPrice || '-' }}</td>
						</tr>
					</table>
				</td>
				<td v-if="transQueryType == 2" colspan="3">
					<table class="freightTable__inTable">
						<tr v-for="(transItem, transIndex) in item.transConstFeeDTOList" :key="transIndex">
							<td colspan="2">{{ transItem.area || '-' }}</td>
							<td>{{ transItem.constantPrice || '-' }}</td>
						</tr>
					</table>
				</td>
				<td v-if="transQueryType == 3" colspan="2">
					<table class="freightTable__inTable">
						<tr>
							<td colspan="2">{{ item.area || '-' }}</td>
						</tr>
					</table>
				</td>
				<td>
					<span class="table__action">
						<el-link :underline="false" type="primary" @click="toAddFreight(item)">修改</el-link>
						<el-link :underline="false" type="primary" @click.stop="delFreight(item)">删除</el-link>
					</span>
				</td>
			</tr>
		</table>
	</div>
</template>
<script>
export default {
	props: {
		tableList: {
			type: [Array, Object],
			required: true
		},
		transQueryType: {
			type: [String, Number],
			default: 1
		}
	},
	data() {
		return {
			form: {},
			currentOrder: {} // 当前订单
		}
	},
	computed: {},
	watch: {},
	mounted() {},
	methods: {
		toAddFreight(row) {
			this.$router.push({ name: 'freightAdd', query: { id: row.id || '' } })
		},
		delFreight(item) {
			console.log(this.$parent)
			this.$emit('delTrans', item)
		}
	}
}
</script>
<style lang="scss" scoped>
.freightTable__inTable.border__table {
	tr {
		border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1) !important;
		&:last-child {
			border-bottom: none !important;
		}
	}
}

.freightTable {
	&__table {
		border-collapse: collapse;
		border-spacing: 0;
		width: 100%;
		table-layout: fixed;
		text-align: left;
	}
	&__inTable {
		border-collapse: collapse;
		border-spacing: 0;
		width: 100%;
		table-layout: fixed;
		text-align: left;
		td {
			padding-top: 0 !important;
			&:first-child {
				width: auto !important;
				padding-left: 0 !important;
			}
		}
		tr {
			border: none !important;
		}
		th,
		td {
			padding: 0px;
			&:first-child {
				width: 50px;
				text-align: center;
				padding: 0 10px;
			}
		}
	}
	&__warp {
		width: 100%;
		overflow-x: auto;

		th,
		td {
			overflow: hidden;
			text-overflow: ellipsis;
			color: #333;
			text-align: left;
			min-height: 48px;
			line-height: 26px;
			font-size: 12px;
			&:first-child {
				width: 50px;
				text-align: center;
				padding: 0 10px;
			}
		}
		th {
			border: none;
			background-color: #f5f7fa;
		}
		tr {
			border-bottom: 1px solid #ebeef5;
			&:hover {
				background-color: #f5f7fa;
			}
		}
	}
	&__header {
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
		white-space: nowrap;
		width: 100%;
		table-layout: fixed;
		th {
			&:first-child {
				width: 100px;
				padding: 0 10px !important;
			}
		}
	}
}
</style>
