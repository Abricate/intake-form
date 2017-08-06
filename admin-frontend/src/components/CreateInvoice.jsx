import React from 'react';
import { Table, Row, Col } from 'reactstrap';
import phonenumber, { PhoneNumberFormat } from 'google-libphonenumber';

import AbricateLogo from '../abricate-logo.png';
import { getJobsWithIds } from '../api';

const phoneUtil = phonenumber.PhoneNumberUtil.getInstance();

const Address = ({ name, address1, address2, city, state, zipcode, phone }) => {
  let phoneInternational = phone;
  let phoneNational = phone;

  if(phone != null) {
    try {
      const phoneParsed = phoneUtil.parse(phone, 'US');
      phoneNational = phoneUtil.format(phoneParsed, PhoneNumberFormat.NATIONAL);
      phoneInternational = phoneUtil.format(phoneParsed, PhoneNumberFormat.INTERNATIONAL);
    } catch(e) {
      // do nothing if phone number fails to parse
    }
  }
  
  return (
    <address>
      <strong>{name}</strong><br/>
      {address1}<br/>
      {address2 ? <span>{address2}<br/></span> : null}
      {city}, {state} {zipcode}<br/>
      {phoneNational ? <a href={`tel:${phoneInternational}`}>{phoneNational}</a> : null}
    </address>
  );
}

const InvoiceTemplate = ({ total, children }) => (
<div>
  <Row>
    <Col xs="6">
      <h1>Invoice</h1>
      <Address name="Abricate, Inc." address1="12345 Foobar Lane" city="San Francisco" state="CA" zipcode="94117" phone="800-555-1234" />
      <Address name="Jane Smith" address1="12345 Foobar Lane" city="San Francisco" state="CA" zipcode="94117" phone="800-555-1234" />
    </Col>
    <Col xs="6">
      <div className="text-right">
        <img alt="Abricate" width="300" src={AbricateLogo} />
      </div>
      <Table bordered className="mt-5">
        <tbody>
          <tr>
            <th>Invoice #</th>
            <td>12341</td>
          </tr>
          <tr>
            <th>Date</th>
            <td>August 1, 2017</td>
          </tr>
          <tr>
            <th>Amount Due</th>
            <td>$4,000.00</td>
          </tr>
        </tbody>
      </Table>
    </Col>
  </Row>
  <Table className="mt-5">
    <thead>
      <tr>
        <th>Filename</th>
        <th>Order Identifier</th>
        <th>Material</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {children}
      <tr>
        <td></td><td></td><td></td><td></td>
        <th className="table-inverse">Total</th>
        <td className="table-inverse">$4,000.00</td>
      </tr>
    </tbody>
  </Table>
  <Row>
    <Col xs={{size: 6, offset: 6}}>
      
      <Table>
        <tbody>
          <tr>
          </tr>
        </tbody>
      </Table>
    </Col>  
  </Row>
</div>
);

function fmtDollars(number) {
  return '$' + number.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2});
}

const InvoiceLineItem = ({ filename, orderIdentifier, material, quantity, unitPrice }) => (
  <tr>
    <td>{filename}</td>
    <td>{orderIdentifier}</td>
    <td>{material}</td>
    <td>{quantity}</td>
    <td>{fmtDollars(unitPrice)}</td>
    <td>{fmtDollars(unitPrice * quantity)}</td>
  </tr>
);  

class CreateInvoice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: []
    };
  }
  
  componentDidMount() {
    const jobIds = this.props.match.params.jobIds.split(',');
    getJobsWithIds(jobIds).then( jobs => {
      this.setState({ jobs });
    });
  }

  render() {
    return (
      <InvoiceTemplate total={4000}>
        {this.state.jobs.map( job => (
          <InvoiceLineItem filename={"foo"} orderIdentifier={job.orderIdentifier} material={`${job.materialThickness} ${job.material}`} quantity={job.quantity} unitPrice={40} />
        ))}
      </InvoiceTemplate>
    );
  }  
}

export default CreateInvoice;

