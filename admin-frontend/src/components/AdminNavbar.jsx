import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as ReactRouterNavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

import AbricateLogo from '../abricate-logo.png';
import config from '../config';

class AdminNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { open: true };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState, props) => ({ open: !prevState.open }));
  }

  render() {
    return (
      <Navbar color="faded" className="mb-4" light toggleable>
        <NavbarToggler right onClick={this.toggle} />
        <NavbarBrand href="/"><img width="200" src={AbricateLogo} /></NavbarBrand>
        <Collapse isOpen={this.state.open} navbar>
          {this.props.isLoggedIn ? ([
            (
              <Nav navbar>
                <NavItem>
                  <NavLink tag={ReactRouterNavLink} activeClassName="active" to="/orders/">Orders</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={ReactRouterNavLink} activeClassName="active" to="/invoicing/">Invoicing</NavLink>
                </NavItem>
              </Nav>
            ),
            (
              <span className="ml-auto navbar-text">
                logged in as {this.props.email} <a className="btn btn-secondary" href={config.urls.logout}>sign out</a>
              </span>
            )
          ]) : (
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={ReactRouterNavLink} activeClassName="active" to="/login">Login</NavLink>
              </NavItem>
            </Nav>
          )}
        </Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    email: state.user.email,
    isLoggedIn: state.user.isLoggedIn
  };
}

export default withRouter(connect(mapStateToProps)(AdminNavbar));
