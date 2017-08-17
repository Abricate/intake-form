import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Container } from 'reactstrap';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './App.css';

import AdminNavbar from './components/AdminNavbar';
import CreateInvoice from './components/CreateInvoice';
import ViewInvoice from './components/ViewInvoice';
import Invoicing from './components/Invoicing';
import Login from './components/Login';

import Flash from './components/Flash';

import { setUser } from './actions';

class App extends Component {
  componentDidMount() {
    if(!this.props.isLoggedIn) {
      fetch('/user/whoami', {credentials: 'include'})
        .then( response => response.json() )
        .then( result => {
          if(result.user) {
            this.props.setUser(result.user);
          }
        });
    }
  }
  
  render() {
    return (
      <Router basename="/admin">
        <div>
          <AdminNavbar />
          <Flash />
          <Container>
            <Route exact path="/login" component={Login} />
            <Route exact path="/invoicing" component={Invoicing} />
            <Route path="/invoicing/create/:jobIds/:isPreview?" component={CreateInvoice} />
            <Route path="/invoicing/by-id/:invoiceIdentifier" component={ViewInvoice} />
          </Container>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.user.isLoggedIn
  };
}

export default connect(mapStateToProps, { setUser })(App);
