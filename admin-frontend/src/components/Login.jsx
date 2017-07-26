import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

import config from '../config';

const Login = () => (
  <Jumbotron>
    <h1 className="display-3">Login</h1>
    <p className="lead">Click below to login with your Abricate Google account</p>
    <p className="lead">
      <a className="btn btn-primary" href={config.urls.loginViaGoogle}>
        Sign in with Google
      </a>
    </p>
  </Jumbotron>
)

export default Login;
