import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Container, Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';
import '../style/style.css';

import AbricateLogo from '../images/abricate-logo.png';

import store from './store';

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
            <Container>
              <Navbar toggleable>
                <NavbarBrand href="/"><img src={AbricateLogo} /></NavbarBrand>

                <Collapse isOpen={true} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink active href="/job-request">Job Request</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="http://abricate.com/index.html">Fabricate</NavLink>
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

            <Container fluid>
              <iframe style={footerStyle} src="http://www.abricate.com/footer.html" />
            </Container>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
