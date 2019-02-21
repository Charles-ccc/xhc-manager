import React, {Component} from 'react'
import { Row, Col } from 'antd'
import Header from './components/Header'
import Footer from './components/Footer'

export default class Admin extends Component {

  render() {
    return (
      <Row>
        <Col span="3">
          left
        </Col>
        <Col span="21">
          <Header>
            Header
          </Header>
          <Row>contant</Row>
          <Footer>
            footer
          </Footer>
        </Col>
      </Row>
    )
  }
}