import React from 'react';
import { Alert } from 'reactstrap';
import { withRouter } from 'react-router';

const Flash = ({ location: { state } }) => (
  state && state.flash ? (
    <Alert color={state.flash.color || 'success'}>{state.flash.message}</Alert>
  ) : null
);

export default withRouter(Flash);

