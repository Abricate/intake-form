import React from 'react';
import { withRouter } from 'react-router-dom';
import { matchPath } from 'react-router'
import { Container, Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import AbricateLogo from '../../images/abricate-logo.png';

import Footer from '../components/Footer';

function isInvoice({ pathname }) {
  return matchPath(pathname, { path: '/invoice' }) != null;
}

const AbricateApp = ({ showNavBar, showFooter, children }) => (
  <div>
    <Container>
      <Navbar toggleable>
        <NavbarBrand href="http://www.abricate.com/"><img src={AbricateLogo} /></NavbarBrand>

        { showNavBar ? (
            <Collapse isOpen={true} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="http://abricate.com/index.html">Fabricate</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink active href="/">Job Request</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="http://abricate.com/team.html">Team</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="http://abricate.com/abricate.html">Abricate</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          ) : null }
      </Navbar>
    </Container>
    { showNavBar ? (
        <Container fluid>
          <div className="breadcrumb-bar">
          </div>
        </Container>
      ) : null }
    { children }
    { showFooter ? (
      <div className="footer">
        <Container>
          <Footer />
        </Container>
      </div>
    ) : null }
  </div>
);

export default withRouter( ({ location, ...props }) => {
  const showNavBar = !isInvoice(location);
  const showFooter = !isInvoice(location);
  
  return <AbricateApp showNavBar={showNavBar} showFooter={showFooter} {...props} />;
})
