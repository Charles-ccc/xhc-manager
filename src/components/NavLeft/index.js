import React, {Component} from 'react'
import { Menu } from 'antd'
import MenuConfig from './../../config/menuConfig'
import './index.less'
const SubMenu = Menu.SubMenu

export default class NavLeft extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuTreeNode: []
    }
  }
  componentDidMount() {
    const menuTreeNode = this.renderMenu(MenuConfig)
    this.setState({
      menuTreeNode
    })
  }
  // 菜单渲染
  renderMenu = (data) => {
    // 递归 生成菜单
    return data.map((item) => {
      if(item.children) {
        return (
          <SubMenu title={item.title} key={item.key}>
            {this.renderMenu(item.children)}
          </SubMenu>
        )
      }
      return <Menu.Item key={item.key}>{item.title}</Menu.Item>
    })
  }
  render() {
    return (
      <div>
        <div className="logo">
          <img src="/assets/logo-ofo.svg" alt="logo"/>
          <h1>XHC-Manager</h1>
        </div>
        <Menu mode="vertical" theme="dark">
           {this.state.menuTreeNode}
        </Menu>
      </div>
    )
  }
}