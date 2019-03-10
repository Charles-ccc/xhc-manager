import React, { Component } from 'react';
import { Card, Button, Form, Input, Select, Tree, Transfer, Modal } from 'antd'
import axios from '../../axios/index'
import ETable from '../../components/ETable/index'
import menuConfig from '../../config/menuConfig'
import Utils from '../../utils/util'
import './../../styles/common.less'

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

export default class City extends Component {
  state = {
    dataSource: [],
    selectedRowKeys: '',
    isRoleVisible: false,
    selectedItem: {},
    menuInfo: []
  }
  componentDidMount() {
    axios.requestList(this, '/role/list', {}, true)
  }
  handleRole = () => {
    this.setState({
      isRoleVisible: true
    })
  }
  // 角色提交
  handleRoleSubmit = () => {
    let data = this.roleForm.props.form.getFieldsValue();
    axios.ajax({
      url: 'role/create',
      data: {
        params: {
          ...data
        }
      }
    }).then((res) => {
      console.log(res)
      if (res.code === 0) {
        this.setState({
          isRoleVisible: false
        })
        this.roleForm.props.form.resetFields()
        axios.requestList(this, '/role/list', {}, true)
      }
    })
  }
  // 权限设置
  handlePermission = () => {
    const selectedItem = this.state.selectedItem
    if (Object.keys(selectedItem).length <= 0) {
      Modal.info({
        title: '信息',
        content: '请选择一个角色'
      })
      return
    }
    this.setState({
      isPermVisible: true,
      detailInfo: selectedItem,
      menuInfo: selectedItem.menus
    })
  }

  // 提交权限
  handlePermEditSubmit = () => {
    let data = this.roleForm.props.form.getFieldsValue()
    data.menus.push(this.state.menuInfo)
    data.role_id = this.state.selectedItem.id
    axios.ajax({
      url: '/permission/edit',
      data: {
        params: {
          data
        }
      }
    }).then((res) => {
      if (res) {
        this.setState({
          isPermVisible: false
        })
        axios.requestList(this, '/role/list', {}, true)
      }
    })
  }

  // 用户授权
  handleUserAuth = () => {
    const selectedItem = this.state.selectedItem
    if (Object.keys(selectedItem).length <= 0) {
      Modal.info({
        title: '信息',
        content: '请选择一个角色'
      })
      return
    }
    this.getRoleUserList(selectedItem.id)
    this.setState({
      isUserVisible: true,
      isAuthClosed: false,
      detailInfo: selectedItem
    })
  }
  getRoleUserList = (id) => {
    axios.ajax({
      url: '/role/user_list',
      data: {
        params: {
          id
        }
      }
    }).then((res) => {
      if(res) {
        this.getAuthUserList(res.result)
      }
    })
  }
  // 筛选目标用户
  getAuthUserList = (dataSource) => {
    const mockData = []
    const targetKeys = []
    if (dataSource && dataSource.length > 0) {
      for(let i=0; i < dataSource.length; i++) {
        const data = {
          key: dataSource[i].user_id,
          title: dataSource[i].user_name,
          status: dataSource[i].status
        }
        if(data.status === 1) {
          targetKeys.push(data.key)
        }
        mockData.push(data)
      }
    }
    this.setState({
      mockData,
      targetKeys
    })
  }
  render() {
    const columns = [
      {
        title: '角色ID',
        dataIndex: 'id'
      }, {
        title: '角色名称',
        dataIndex: 'role_name'
      }, {
        title: '创建时间',
        dataIndex: 'create_time',
        render: Utils.formateDate
      }, {
        title: '使用状态',
        dataIndex: 'status',
        render(status) {
          if (status == 1) {
            return "启用"
          } else {
            return "停用"
          }
        }
      }, {
        title: '授权时间',
        dataIndex: 'authorize_time',
        render: Utils.formateDate
      }, {
        title: '授权人',
        dataIndex: 'authorize_user_name'
      }
    ];
    return (
      <div>
        <Card>
          <Button type="primary" onClick={this.handleRole}>创建角色</Button>
          <Button type="primary" style={{ marginLeft: 10, marginRight: 10 }} onClick={this.handlePermission}>设置权限</Button>
          <Button type="primary" onClick={this.handleUserAuth}>用户授权</Button>
        </Card>
        <div className="content-wrap">
          <ETable
            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
            selectedRowKeys={this.state.selectedRowKeys}
            dataSource={this.state.list}
            columns={columns}
          />
        </div>
        <Modal
          title="创建角色"
          visible={this.state.isRoleVisible}
          onOk={this.handleRoleSubmit}
          onCancel={() => {
            this.roleForm.props.form.resetFields();
            this.setState({
              isRoleVisible: false
            })
          }}
        >
          <RoleForm wrappedComponentRef={(inst) => this.roleForm = inst} />
        </Modal>
        <Modal
          title="权限设置"
          visible={this.state.isPermVisible}
          width={600}
          onOk={this.handlePermEditSubmit}
          onCancel={() => {
            this.setState({
              isPermVisible: false
            })
          }}>
          <PermEditForm
            wrappedComponentRef={(inst) => this.roleForm = inst}
            detailInfo={this.state.detailInfo}
            menuInfo={this.state.menuInfo || []}
            patchMenuInfo={(checkedKeys) => {
              this.setState({
                menuInfo: checkedKeys
              });
            }}
          />
        </Modal>
        <Modal
          title="用户授权"
          visible={this.state.isUserVisible}
          width={600}
          onOk={this.handleUSerSubmit}
          onCancel={() => {
            this.setState({
              isUserVisible: false
            })
          }}>
            <RoleAuthForm
              wrappedComponentRef={(inst) => this.userAuthForm = inst}
              detailInfo={this.state.detailInfo}
              targetKeys={this.state.targetKeys}
              mockData={this.state.mockData}
            />
          </Modal>
      </div>
    )
  }
}

// 角色创建
class RoleForm extends Component {

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    };
    return (
      <Form layout="horizontal">
        <FormItem label="角色名称" {...formItemLayout}>
          {
            getFieldDecorator('role_name', {
              initialValue: ''
            })(
              <Input type="text" placeholder="请输入角色名称" />
            )
          }
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
          {
            getFieldDecorator('state', {
              initialValue: 1
            })(
              <Select>
                <Option value={1}>开启</Option>
                <Option value={0}>关闭</Option>
              </Select>
            )}
        </FormItem>
      </Form>
    );
  }
}
RoleForm = Form.create({})(RoleForm)

// 设置权限
class PermEditForm extends Component {
  state = {}
  // 设置选中的节点，通过父组件方法再传递回来
  onCheck = (checkedKeys) => {
    this.props.patchMenuInfo(checkedKeys);
  };
  renderTreeNodes = (menuConfig) => {
    return menuConfig.map(item => {
      // 实现递归，有子节点就继续遍历
      if (item.children) {
        return <TreeNode title={item.title} key={item.key} className="op-role-tree">
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      } else {
        return <TreeNode title={item.title} key={item.key} className="op-role-tree" />
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const detail_info = this.props.detailInfo;
    const menuInfo = this.props.menuInfo;
    return (
      <Form layout="horizontal">
        <FormItem label="角色名称：" {...formItemLayout}>
          <Input disabled placeholder={detail_info.role_name} />
        </FormItem>
        <FormItem label="状态：" {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: '1'
          })(
            <Select style={{ width: 80 }} placeholder="启用" >
              <Option value="1">启用</Option>
              <Option value="0">停用</Option>
            </Select>
          )}
        </FormItem>
        <Tree
          checkable
          defaultExpandAll
          onCheck={(checkedKeys) => this.onCheck(checkedKeys)}
          checkedKeys={menuInfo || []}
        >
          <TreeNode title="平台权限" key="platform_all">
            {this.renderTreeNodes(menuConfig)}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}

PermEditForm = Form.create({})(PermEditForm)

// 用户授权
class RoleAuthForm extends Component {
  state = {}
  filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 }
    };
    const detail_info = this.props.detailInfo;
    const menuInfo = this.props.menuInfo;
    return (
      <Form layout="horizontal">
        <FormItem label="角色名称：" {...formItemLayout}>
          <Input disabled placeholder={detail_info.role_name} />
        </FormItem>
        <Transfer
          dataSource={this.props.mockData}
          titles={['待选用户', '已选用户']}
          showSearch
          filterOption={this.filterOption}
          targetKeys={this.props.targetKeys}
          render={item=>item.title}
        />
      </Form>
    )
  }
}

RoleAuthForm = Form.create({})(RoleAuthForm)