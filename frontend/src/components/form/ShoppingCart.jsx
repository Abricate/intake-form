import React from 'react';
import { Link } from 'react-router-dom'

import { Card, CardBlock, CardHeader } from 'reactstrap';

import OrderSummary from './OrderSummary';

export default () => (
  <Card style={{position: 'sticky', top: '10px'}}>
    <CardHeader>Order Summary</CardHeader>
    <OrderSummary />
    <CardBlock>
      <Link className="w-100 btn btn-primary" role="button" to="/checkout">Checkout</Link>
    </CardBlock>
  </Card>
);
