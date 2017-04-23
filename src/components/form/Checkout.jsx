import React from 'react';

import _ from 'lodash';
import { Alert, Button } from 'reactstrap';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import request from 'superagent';


class Checkout extends React.Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);

    this.state = {};
  }
  
  submit() {
    this.setState({ submitting: true });
    request
      .post('/jobs')
      .send(_.pick(this.props, ['cart', 'contactInfo']))
      .set('Accept', 'application/json')
      .end((error, res) => {
        if(error) {
          this.setState({ error, submitting: false });
        } else {
          this.props.history.push('/success');
        }
      });
    
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
        <div className="list-group">
          {cart.map( (item, idx) => (
            <div key={idx} className="list-group-item">
              {_.map(item, (value, fieldName) => (
                <span key={fieldName}><strong>{fieldName}</strong>: {value.toString()} <br/></span>
              ))}
            </div>
          ))}
      </div>
        {this.state.error ? <Alert color="danger">{this.state.error.message || this.state.error.toString()}</Alert> : null}
        <Button disabled={this.state.submitting} onClick={this.submit} color="primary">Submit Job Request</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cart: state.cart,
    contactInfo: state.contactInfo
  };
}

export default withRouter(connect(mapStateToProps)(Checkout));
