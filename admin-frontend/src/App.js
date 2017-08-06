import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import './App.css';

import AdminNavbar from './components/AdminNavbar';
import CreateInvoice from './components/CreateInvoice';
import Invoicing from './components/Invoicing';
import Login from './components/Login';

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

          <Container>
            <Route exact path="/login" component={Login} />
            <Route exact path="/invoicing" component={Invoicing} />
            <Route exact path="/invoicing/create/:jobIds" component={CreateInvoice} />
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
