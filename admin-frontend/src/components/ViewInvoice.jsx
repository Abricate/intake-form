import React from 'react';
import _ from 'lodash';

import { InvoiceTemplate, InvoiceLineItem } from './CreateInvoice';
import * as api from '../api';

class ViewInvoice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      invoice: undefined
    };
  }
  
  fetchInvoice() {
    const identifier = this.props.match.params.invoiceIdentifier;
    api.getInvoice(identifier).then( invoice => {
      this.setState({ invoice });
    });
  }
  
  componentDidMount() {
    this.fetchInvoice();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.match.params.invoiceIdentifier != this.props.match.params.invoiceIdentifier) {
      this.fetchInvoice();
    }
  }

  render() {
    if(!this.state.invoice) {
      return <div><h3>Loading...</h3></div>;
    }

    const total = _.sum(
      this.state.invoice.lineItems.map(item => item.unitPrice * item.quantity)
    );
    
    return (
      <InvoiceTemplate
        editable={false}
        identifier={this.props.match.params.invoiceIdentifier}
        total={total}
        shipping={{value: this.state.invoice.shippingCost, str: this.state.invoice.shippingCost.toString()}}
        date={this.state.invoice.date}
        customerAddress={this.state.invoice.shippingAddress}>

        {_.flatMap(this.state.invoice.lineItems, item => (
          InvoiceLineItem({
            editable: false,
            filename: item.props.filename,
            note: item.props.comments,
            orderIdentifier: item.props.orderIdentifier,
            material: `${item.props.materialThickness} ${item.props.material}`,
            quantity: item.quantity,
            unitPrice: {value: item.unitPrice, str: item.unitPrice.toString()}
          })
        ))}
      </InvoiceTemplate>
    );
  }
}

export default ViewInvoice;
