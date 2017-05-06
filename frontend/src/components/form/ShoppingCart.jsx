import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import _ from 'lodash';

import { Card, CardBlock, CardHeader, CardTitle, CardSubtitle, ListGroup, ListGroupItem } from 'reactstrap';

const DefinitionList = ({ data }) => {
  const keys = _.keys(data).map( key => (
    <dt>{key}</dt>
  ));
  const values = _.values(data).map( value => (
    Array.isArray(value) ? value.join(', ') : value
  )).map( value => (
    <dd>{value}</dd>
  ));

  return (
    <dl>{_.flatten(_.zip(keys, values))}</dl>
  );
}

const ShoppingCart = ({ cart }) => (
  <Card style={{position: 'sticky', top: '10px'}}>
    <CardHeader>Order Summary</CardHeader>
    <div className="list-group list-group-flush">
      {cart.map( (item, idx) => {
        const props = {...item.props, files: _.map(item.files, 'originalName')};
        
        return (
          <div key={idx} className="list-group-item">
            <DefinitionList data={props} />
          </div>
        );
      })}
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

