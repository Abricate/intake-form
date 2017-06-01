import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Prompt,
  Link,
  withRouter
} from 'react-router-dom';
import { connect, Provider } from 'react-redux';
import { Container, Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../style/style.css';

import AbricateLogo from '../images/abricate-logo.png';

import store from './store';

import Step1 from './components/form/Step1';
import Step2 from './components/form/Step2';
import Checkout from './components/form/Checkout';
import Success from './components/Success';

import Footer from './components/Footer';

const footerStyle = {
  marginTop: '100px',
  width: '100%',
  height: '420px',
  border: '0'
}

window.onbeforeunload = function(e) {
  const state = store.getState();
  if(!state.jobRequest.empty || state.cart.length !== 0) {
//    e.returnValue = "Are you sure you want to leave? You haven't submitted your job request yet.";
//    return e.returnValue;
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Container>
              <Navbar toggleable>
                <NavbarBrand href="/"><img src={AbricateLogo} /></NavbarBrand>

                <Collapse isOpen={true} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink href="http://abricate.com/index.html">Fabricate</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink active href="/job-request">Job Request</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="http://abricate.com/team.html">Team</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="http://abricate.com/abricate.html">Abricate</NavLink>
                    </NavItem>
                  </Nav>
                </Collapse>
              </Navbar>
            </Container>
            <Container fluid>
              <div className="breadcrumb-bar">
              </div>
            </Container>
            <Container>
              <Route exact path="/" component={Step1} />
              <Route path="/step2" component={Step2} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/success" component={Success} />
            </Container>
            <div className="footer">
              <Container>
                <Footer />
              </Container>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
