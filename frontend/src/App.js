import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Prompt,
  Link,
  withRouter
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Container, Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../style/style.css';

import store from './store';
import { isProduction } from './util';

import AbricateApp from './templates/AbricateApp';

import ScrollToTop from './components/ScrollToTop';

import Step1 from './components/form/Step1';
import Step2 from './components/form/Step2';
import Checkout from './components/form/Checkout';
import Success from './components/Success';

import Invoice from './components/Invoice';
import InvoicePayment from './components/InvoicePayment';

window.onbeforeunload = function(e) {
  const state = store.getState();
  if(!state.jobRequest.empty || state.cart.length !== 0 && isProduction()) {
    e.returnValue = "Are you sure you want to leave? You haven't submitted your job request yet.";
    return e.returnValue;
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <ScrollToTop>
            <AbricateApp>
              <Container>
                <Switch>
                  {/* job request creation routes */}
                  <Route exact path="/" component={Step1} />
                  <Route path="/step2" component={Step2} />
                  <Route path="/checkout" component={Checkout} />
                  <Route path="/success" component={Success} />

                  {/* view invoice routes */}
                  <Route exact path="/invoice/:id" component={Invoice} />
                  <Route path="/invoice/:id/payment" component={InvoicePayment} />
                </Switch>
              </Container>
            </AbricateApp>
          </ScrollToTop>
        </Router>
      </Provider>
    );
  }
}

export default App;
