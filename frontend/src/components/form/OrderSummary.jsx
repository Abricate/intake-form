import React from 'react';
import { connect } from 'react-redux'
import _ from 'lodash';

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

const DefinitionList = ({ data }) => {
  const dataKeys = _.keys(data).filter(key => !key.startsWith('_'));
  const additionalKeys = _.difference(dataKeys, keyOrder);
  const keys = _.intersection(keyOrder, dataKeys).concat(additionalKeys);

  return (
    <ul className="order-summary">
      {keys.map( key => (
        <li key={key}><span className="key">{snakeCaseToSpaceSeparated(key)}</span>: <span className="value">{data[key]}</span></li>
      ))}
    </ul>
  );
}

const OrderSummary = ({ cart }) => (
  <div className="mb-3 list-group list-group-flush">
    {cart.length > 0 ? (
      cart.map( (item, idx) => {
        const props = {...item.props, files: _.map(item.files, 'originalName')};
        
        return (
          <div key={idx} className="list-group-item">
            <DefinitionList data={props} />
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

export default connect(mapStateToProps)(OrderSummary);
