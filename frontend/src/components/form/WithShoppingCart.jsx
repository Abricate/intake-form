import React from 'react';
import { Col, Row } from 'reactstrap';

const WithShoppingCart = WrappedComponent => props => (
  <Row>
    <Col md="10">
      <WrappedComponent {...props} />
    </Col>
    <Col md="2">
      Foobar
    </Col>
  </Row>
);

export default WithShoppingCart;
