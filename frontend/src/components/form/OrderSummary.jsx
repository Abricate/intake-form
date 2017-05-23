import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux'
import _ from 'lodash';
import { FaTrash } from 'react-icons/lib/fa';

import { removeFromCart } from '../../actions';

const keyOrder = [
  'files',
  'quantity',
  'material',
  'materialThickness',
  'sheetMetalGage',
  'area',
  'color',
  'tolerance',
  'comments',
  'dueDate'
];

function snakeCaseToSpaceSeparated(str) {
  return str.replace(/([a-z])([A-Z])/g, (match, c1, c2) => `${c1} ${c2}`.toLowerCase() );
}

const DefinitionList = ({ data, onRemove }) => {
  const dataKeys = _.keys(data).filter(key => !key.startsWith('_'));
  const additionalKeys = _.difference(dataKeys, keyOrder);
  const keys = _.intersection(keyOrder, dataKeys).concat(additionalKeys);

  return (
    <ul className="order-summary">
      {keys.map( key => (
         <li key={key}><span className="key">{snakeCaseToSpaceSeparated(key)}</span>: <span className="value">{data[key]}</span></li>
       ))}
      <li><Button onClick={onRemove} color="danger"><FaTrash /></Button></li>
    </ul>
  );
}

const OrderSummary = ({ cart, removeFromCart }) => (
  <div className="mb-3 list-group list-group-flush">
    {cart.length > 0 ? (
       cart.map( (item, idx) => {
         const props = {...item.props, files: _.map(item.files, 'originalName')};
         
         return (
           <div key={idx} className="list-group-item">
             <DefinitionList onRemove={() => removeFromCart(idx)} data={props} />
           </div>
         );
       })
     ) : (
       <div className="list-group-item">
         <p className="lead">Your cart is empty.</p>
       </div>
     )}
  </div>
);


function mapStateToProps(state) {
  return {
    cart: state.cart
  };
}

export default connect(mapStateToProps, { removeFromCart })(OrderSummary);
