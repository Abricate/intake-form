import React from 'react';
import { Link } from 'react-router-dom'

import _ from 'lodash';
import { Alert, Button } from 'reactstrap';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import request from 'superagent';

import OrderSummary from './OrderSummary';
import { jobRequestSubmitted } from '../../actions';

import * as Step1 from './Step1';

class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);

    this.state = {};
  }
  
  submit() {
    const errorPage = this.props.invalidStep();
    if(errorPage) {
      this.props.history.push(errorPage)
    } else {
      this.setState({ submitting: true });

      request
        .post('/jobs')
        .send(_.pick(this.props, ['cart', 'contactInfo']))
        .set('Accept', 'application/json')
        .set('x-csrf-token', window.__CSRF_TOKEN__)
        .end((error, res) => {
          if(error) {
            this.setState({ error, submitting: false });
          } else {
            this.props.jobRequestSubmitted();
            this.props.history.push('/success');
          }
        });
    }
    
    return true;
  }

  render() {
    const {
      cart,

      history,
    } = this.props;
    
    
    return (
      <div>
        <h2>Checkout</h2>
        <h3>Order Summary</h3>
        <OrderSummary />
        {this.state.error ? <Alert color="danger">{this.state.error.message || this.state.error.toString()}</Alert> : null}
        <p><Link className="btn btn-secondary" role="button" to="/step2">Add Another Part</Link></p>
        <p><Button disabled={this.state.submitting} onClick={this.submit} color="primary">Submit Job Request</Button></p>
      </div>
    );
  }
}

const invalidStep = state => () => {
  const invalidStep = [Step1.validator(state)].find(x => !x.isValid);

  return invalidStep && invalidStep.link;
};

function mapStateToProps(state) {
  return {
    cart: state.cart,
    contactInfo: state.contactInfo,
    invalidStep: invalidStep(state)
  };
}

export default withRouter(connect(mapStateToProps, { jobRequestSubmitted })(Checkout));
