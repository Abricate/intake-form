import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


import { Provider } from 'react-redux'
import { Container, Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../style/style.css';

import AbricateLogo from '../images/abricate-logo.png';

import store from './store';
import './App.css';

import Step1 from './components/form/Step1';
import Step2 from './components/form/Step2';
import Checkout from './components/form/Checkout';

import Success from './components/Success';

const footerStyle = {
  marginTop: '100px',
  width: '100%',
  height: '420px',
  border: '0'
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Navbar color="faded" light toggleable>
              <NavbarBrand href="/"><img src={AbricateLogo} /></NavbarBrand>

              <Collapse isOpen={true} navbar>
                <h2 className="mr-auto">Job Request</h2>
                <Nav navbar>
                  <NavItem>
                    <NavLink href="/step1">Step 1</NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Navbar>
            <Container>            
              <Route exact path="/" component={Step1} />
              <Route path="/step2" component={Step2} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/success" component={Success} />
            </Container>

            <Container fluid>
              <iframe style={footerStyle} src="http://abricateproduction.businesscatalyst.com/footer.html" />
            </Container>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
