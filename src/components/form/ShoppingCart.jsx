import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash';

import { Card, CardBlock, CardHeader, CardTitle, CardSubtitle, ListGroup, ListGroupItem } from 'reactstrap';

const ShoppingCart = ({ cart }) => (
  <Card style={{position: 'sticky', top: '10px'}}>
    <CardHeader>Order Summary</CardHeader>
    <div className="list-group list-group-flush">
      {cart.map( (item, idx) => (
        <div key={idx} className="list-group-item">
          {_.map(item, (value, fieldName) => (
            <span key={fieldName}><strong>{fieldName}</strong>: {value.toString()} <br/></span>
          ))}
        </div>
      ))}
    </div>
    <CardBlock>
      <Link className="w-100 btn btn-primary" role="button" to="/checkout">Checkout</Link>
    </CardBlock>
  </Card>
);

function mapStateToProps(state) {
  return {
    cart: state.cart
  };
}

export default connect(mapStateToProps)(ShoppingCart);

