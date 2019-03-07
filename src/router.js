import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom'
import App from './App'
import Login from './pages/login'
import Admin from './admin'
import Buttons from './pages/ui/buttons'
import NoMatch from './pages/nomatch'
import Modals from './pages/ui/modals'
import Loadings from './pages/ui/loadings'
import Notice from './pages/ui/notice'
import Messages from './pages/ui/messages'
import Tabs from './pages/ui/tabs'
import Gallery from './pages/ui/gallery'
import Carousel from './pages/ui/carousel'
import FormLogin from './pages/form/login'
import FormRegister from './pages/form/register'
import BasicTable from './pages/table/basicTable'
import HighTable from './pages/table/highTable'
import City from './pages/city'

export default class IRouter extends Component {
  render() {
    return (
      <HashRouter>
        <App>
          <Route path="/login" component={Login} />
          <Route path="/admin" render={() => 
            <Admin>
              <Switch>
                <Route path="/admin/ui/buttons" component={Buttons} />
                <Route path="/admin/ui/modals" component={Modals} />
                <Route path="/admin/ui/loadings" component={Loadings} />
                <Route path="/admin/ui/notification" component={Notice} />
                <Route path="/admin/ui/messages" component={Messages} />
                <Route path="/admin/ui/tabs" component={Tabs} />
                <Route path="/admin/ui/gallery" component={Gallery} />
                <Route path="/admin/ui/carousel" component={Carousel} />
                <Route path="/admin/form/login" component={FormLogin} />
                <Route path="/admin/form/register" component={FormRegister} />
                <Route path="/admin/table/basic" component={BasicTable} />
                <Route path="/admin/table/high" component={HighTable} />
                <Route path="/admin/city" component={City} />
                <Route component={NoMatch} />
              </Switch>
            </Admin>
          } />
          <Route path="/order/login" component={Login} />
        </App>
      </HashRouter>
    )
  }
}