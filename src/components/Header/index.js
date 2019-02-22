import React, {Component} from 'react'
import { Row, Col } from 'antd'
import './index.less'
import axios from './../../axios'
const moment = require('moment')
export default class Header extends Component {
  constructor(props){
    super(props)
    this.state = {
      userName: '',
      sysTime: ''
    }
  }
  componentDidMount() {
    this.setState({
      userName: 'CHARLES'
    })
    setInterval(() => {
      const sysTime = moment().format('YYYY-MM-DD HH:mm:ss')
      this.setState({ sysTime })
    }, 1000)
    this.getWeatherAPIData()
  }
  getWeatherAPIData() {
    let city = '深圳'
    axios.jsonp({
      url: `http://api.map.baidu.com/telematics/v3/weather?location=${encodeURIComponent(city)}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    }).then((res) => {
      console.log(res)
    })
  }
  render() {
    return (
      <div className="header">
        <Row  className="header-top">
          <Col span={24}>
            <span>欢迎，{this.state.userName}</span>
            <a href="../">退出</a>
          </Col>
        </Row>
        <Row  className="breadcrumb">
          <Col span={3} className="breadcrumb-title">
            首页
          </Col>
          <Col span={21} className="weather">
            <span className="date">{this.state.sysTime}</span>
            <span className="weather-detail">晴转多云</span>
          </Col>
        </Row>
      </div>
    )
  }
}