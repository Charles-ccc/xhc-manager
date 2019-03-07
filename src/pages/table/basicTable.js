import React, {Component} from 'react';
import { Card, Table, Modal, Button, message } from 'antd';
import axios from './../../axios/index'
import Utils from './../../utils/util';
export default class BasicTable extends Component {

	state = {
		dataSource: [],
		dataSource2: [],
		selectedRowKeys: []
	}

	params = {
		page: 1
	}

	componentDidMount() {
		const data = [
			{
				id: '0',
				userName: 'Charles',
				sex: 1,
				state: '1',
				interest: '2',
				birthday: '2019-03-06',
				address: '深圳市龙华区民治街道碧水龙庭',
				time: '09:00'
			},
			{
				id: '1',
				userName: 'Tom',
				sex: 1,
				state: '2',
				interest: '6',
				birthday: '2019-03-06',
				address: '深圳市龙华区民治街道碧水龙庭',
				time: '09:00'
			},
			{
				id: '2',
				userName: 'Lily',
				sex: 2,
				state: '3',
				interest: '8',
				birthday: '2019-03-06',
				address: '深圳市龙华区民治街道碧水龙庭',
				time: '09:00'
			}
		]
		data.map((item, index) => {
			item.key = index;
		})
		this.setState({
			dataSource: data
		})
		this.request();
	}

	// 动态获取mock数据
	request = () => {
		let _this = this;
		axios.ajax({
			url: '/table/list',
			data: {
				params: {
					page: this.params.page
				},
				// isShowLoading: false // 控制不显示loading效果
			}
		}).then((res) => {
			if (res.code === 0) {
				const list = res.result.list
				list.map((item, index) => {
					item.key = index
				})
				this.setState({
					dataSource2: list,
					selectedRowKeys: [],
					selectedRows: null,
					pagination: Utils.pagination(res, (current) => {
						_this.params.page = current;
						this.request();
					})
				})
			}
		})
	}

	onRowClick = (record, index) => {
		const selectKey = [index];
		console.log("selectKey",selectKey)
		Modal.info({
			title: '信息',
			content: `用户名：${record.userName}，用户状态：${record.state}，用户爱好：${record.interest}`
		})
		this.setState({
			selectedRowKeys: selectKey,  // 当前选中行
			selectedItem: record
		})
	}

	// 多选执行删除动作
	handleDelete = (() => {
		let rows = this.state.selectedRows;
		let ids = [];
		rows.map((item) => {
			ids.push(item.id)
		})
		Modal.confirm({
			title: '删除提示',
			content: `您确定要删除这些数据吗？${ids.join(',')}`,
			onOk: () => {
				message.success('删除成功');
				this.request();
			}
		})
	})

	render() {
		const columns = [
			{
				title: 'id', // 表头
				key: 'id',
				dataIndex: 'id' // 字段
			},
			{
				title: '用户名',
				key: 'userName',
				dataIndex: 'userName'
			},
			{
				title: '性别',
				key: 'sex',
				dataIndex: 'sex',
				render(sex) {
					return sex === 1 ? '男' : '女'
				}
			},
			{
				title: '状态',
				key: 'state',
				dataIndex: 'state',
				render(state) {
					let config = {
						'1': '瓦片捡拾者',
						'2': '前端搬砖工',
						'3': '蓝凌FE',
						'4': '深入学习中',
						'5': '未来创业者'
					}
					return config[state];
				}
			},
			{
				title: '爱好',
				key: 'interest',
				dataIndex: 'interest',
				render(abc) {
					let config = {
						'1': '游泳',
						'2': '打篮球',
						'3': '踢足球',
						'4': '跑步',
						'5': '爬山',
						'6': '骑行',
						'7': '桌球',
						'8': '泡妞'
					}
					return config[abc];
				}
			},
			{
				title: '生日',
				key: 'birthday',
				dataIndex: 'birthday'
			},
			{
				title: '地址',
				key: 'address',
				dataIndex: 'address'
			},
			{
				title: '早起时间',
				key: 'time',
				dataIndex: 'time'
			}
		]
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			type: 'radio',
			selectedRowKeys
		}
		const rowCheckSelection = {
			type: 'checkbox',
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
					selectedRowKeys,
					selectedRows
				})
			}
		}
		return (
			<div>
				<Card title="基础表格">
					<Table
						bordered
						columns={columns}
						dataSource={this.state.dataSource}
						pagination={false}
					/>
				</Card>
				<Card title="动态数据渲染表格-Mock" style={{ margin: '10px 0' }}>
					<Table
						bordered
						columns={columns}
						dataSource={this.state.dataSource2}
						pagination={false}
						rowKey={record => record.id}
					/>
				</Card>
				<Card title="Mock-单选" style={{ margin: '10px 0' }}>
					<Table
						bordered
						rowSelection={rowSelection}  // 判断单选还是多选
						onRow={(record, index) => {  // 控制行事件
							return {
								onClick: () => {
									this.onRowClick(record, index);
								}
							};
						}}
						columns={columns}
						dataSource={this.state.dataSource2}
						pagination={false}
					/>
				</Card>
				<Card title="Mock-多选" style={{ margin: '10px 0' }}>
					<div style={{ marginBottom: 10 }}>
						<Button onClick={this.handleDelete}>删除</Button>
					</div>
					<Table
						bordered
						rowSelection={rowCheckSelection}
						columns={columns}
						dataSource={this.state.dataSource2}
						pagination={false}
					/>
				</Card>
				<Card title="Mock-表格分页" style={{ margin: '10px 0' }}>
					<Table
						bordered
						columns={columns}
						dataSource={this.state.dataSource2}
						pagination={this.state.pagination}
					/>
				</Card>
			</div>
		);
	}
}