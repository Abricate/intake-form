import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink as ReactRouterNavLink } from 'react-router-dom';
import {Prompt, withRouter } from 'react-router';
import moment from 'moment';
import {Button, Form, FormText,Nav, NavItem, ButtonGroup, Table, Row, Col, Input, InputGroup, InputGroupAddon, NavLink, FormGroup, Label } from 'reactstrap';
import phonenumber, { PhoneNumberFormat } from 'google-libphonenumber';
import _ from 'lodash';

import AbricateLogo from '../abricate-logo.png';
import * as api from '../api';
import { fmtNumber, fmtDollars, parseDollars } from '../util';

const phoneUtil = phonenumber.PhoneNumberUtil.getInstance();

const Editable = (StaticComponent, EditableComponent) => ({ editable, ...props }) => {
  const C = editable ? EditableComponent : StaticComponent;

  return <C {...props} />;
}

const StaticAddress = ({ name, address1, address2, city, state, zipcode, phone }) => {
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

const EditableAddress = ({ name, address1, address2, city, state, zipcode, phone, set }) => {
  return (
    <Form>
      <FormGroup>
        <Input type="text" name="name" id="name" value={name} onChange={set('name')} />
        <FormText color="muted">Customer Name</FormText>
      </FormGroup>

      <FormGroup>
        <Input type="text" value={address1} onChange={set('address1')} />
        <Input type="text" value={address2} onChange={set('address2')}/>
        <FormText color="muted">Street Address</FormText>
      </FormGroup>
      
      <FormGroup>
        <Input type="text" value={city} onChange={set('city')}/>
        <FormText color="muted">City</FormText>
        <Input type="text" value={state} onChange={set('state')} />
        <FormText color="muted">State</FormText>
        <Input type="text" value={zipcode} onChange={set('zipcode')} />
        <FormText color="muted">Zipcode</FormText>
      </FormGroup>

      <FormGroup>
        <Input type="text" value={phone} onChange={set('phone')} />
        <FormText color="muted">Phone Number</FormText>
      </FormGroup>
    </Form>
  );  
}

const Address = Editable(StaticAddress, EditableAddress);

export const InvoiceTemplate = ({
  identifier = '',
  customerAddress = {},
  date,
  shipping = {},
  total,

  setCustomerAddressField,
  setShipping,
  
  editable,

  children
}) => (
  <div className="mt-3">
    <Row>
      <Col xs="6">
        <h1>Invoice</h1>
        <Address name="Abricate, Inc." address1="12345 Foobar Lane" city="San Francisco" state="CA" zipcode="94117" phone="800-555-1234" />
        <Address editable={editable} set={setCustomerAddressField} {...customerAddress}  />
      </Col>
      <Col xs="6">
        <div className="text-right">
          <img alt="Abricate" width="300" src={AbricateLogo} />
        </div>
        <Table bordered className="mt-5">
          <tbody>
            <tr>
              <th>Invoice #</th>
              <td>{identifier}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{date}</td>
            </tr>
            <tr>
              <th>Amount Due</th>
              <td>{fmtDollars(total)}</td>
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
          <th className={editable ? null : 'text-right'}>Unit Price</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {children}
        <tr>
          <td></td><td></td><td></td><td></td>
          <th>Shipping</th>
          <td style={editable ? null : MoneyStyle}>
            {editable ? (
               <InputGroup>
                 <InputGroupAddon>$</InputGroupAddon>
                 <Input style={{width: '50px'}} value={shipping.str} onChange={setShipping} />
               </InputGroup>
            ) : (
               fmtDollars(shipping.value)
            )}
          </td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td>
          <th className="table-inverse">Total</th>
          <td style={MoneyStyle} className="table-inverse">{fmtDollars(total)}</td>
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

const MoneyStyle = {
  textAlign: 'right',
  fontFamily: 'monospace'
};

export const InvoiceLineItem = ({ filename, note, orderIdentifier, material, quantity, unitPrice = {}, setPrice, setNote, editable = true }) => {
  let result = [];
  
  const row = (
    <tr>
      <td>{filename}</td>
      <td>{orderIdentifier}</td>
      <td>{material}</td>
      <td>{quantity}</td>
      <td style={editable ? null : MoneyStyle}>
        {editable ? (
           <InputGroup>
             <InputGroupAddon>$</InputGroupAddon>
             <Input style={{width: '50px'}} value={unitPrice.str} onChange={setPrice} />
           </InputGroup>
        ) : (
           fmtDollars(unitPrice.value)
        )}
      </td>
      <td style={MoneyStyle}>{unitPrice.value != null ? fmtDollars(unitPrice.value * quantity) : null}</td>
    </tr>
  );
  result.push(row);

  if(editable) {
    const noteRow = (
      <tr>
        <td className="border-0" colSpan="6"><div className="small ml-3"><Input type="textarea" value={note} onChange={setNote} /></div></td>
      </tr>
    );
    result.push(noteRow);
  } else if(note != null) {
    const noteRow = (
      <tr>
        <td className="border-0" colSpan="6"><footer className="small ml-3">{note}</footer></td>
      </tr>
    );
    result.push(noteRow);
  }
  
  return result;
}

class CreateInvoice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: {},
      prices: {},
      comments: {},
      customerAddress: {},
      shipping: undefined
    };

    this.setPrice = this.setPrice.bind(this);
    this.setComment = this.setComment.bind(this);
    this.setCustomerAddressField = this.setCustomerAddressField.bind(this);
    this.setShipping = this.setShipping.bind(this);
    this.createInvoice = this.createInvoice.bind(this);
  }
  
  componentDidMount() {
    const jobIds = this.props.match.params.jobIds.split(',');
    api.getJobsWithIds(jobIds).then( jobs => {
      const jobsById = _.keyBy(jobs, 'id');
      
      this.setState({ jobs: jobsById });
    });
  }

  setPrice(jobId) {
    return event => {
      const str = event.target.value;
      const value = parseDollars(str);
      
      this.setState((prevState, props) => {
        return {prices: {...prevState.prices, [jobId]: { str, value }}};
      });
    };
  }

  setComment(jobId) {
    return event => {
      const comment = event.target.value;
      
      this.setState((prevState, props) => {
        return {comments: {...prevState.comments, [jobId]: comment}};
      });
    };
  }

  setCustomerAddressField(fieldName) {
    return event => {
      const value = event.target.value;
      
      this.setState((prevState, props) => {
        return {customerAddress: {...prevState.customerAddress, [fieldName]: value}};
      });
    };
  }

  setShipping(event) {
    const str = event.target.value;
    const value = parseDollars(str);

    this.setState({ shipping: { str, value } });
  }

  /**
   * POST /admin/invoices
   *   {
   *     shippingAddress <json>,
   *     billingAddress <json>,
   *     shippingCost <decimal>,
   *     lineItems: <array of LineItems>
   *   }
   *   
   *   LineItem:
   *   {
   *     props: <json>,
   *     quantity: <integer>,
   *     unitPrice: <decimal>
   *   }
   */

  
  createInvoice() {
    const shippingAddress = this.contactInfo();
    const billingAddress = this.contactInfo();
    const shippingCost = (this.state.shipping && this.state.shipping.value) || 0;

    const lineItems = _.mapValues(this.state.jobs, job => {
      const unitPrice = this.unitPrice(job);
      
      return {
        quantity: job.quantity,
        unitPrice: (unitPrice && unitPrice.value) || 0,
        shippingCost,
        props: {
          filename: 'foo',
          comments: this.state.comments[job.id] || job.comments,
          orderIdentifier: job.orderIdentifier,
          material: job.material,
          materialThickness: job.materialThickness,
        }
      }
    });
    
    api.createInvoice({ shippingAddress, billingAddress, shippingCost, lineItems }).then( ({ identifier }) => {
      this.setState({ invoiceCreated: true }, () => {
        this.props.history.push(`/invoicing/by-id/${identifier}`, {flash: {message: 'Invoice successfully created!'}});
      });
    });
  }
  
  jobs() {
    return this.props.match.params.jobIds.split(',').map( jobId => this.state.jobs[jobId] ).filter(job => job != null);
  }

  prices() {
    const unchangedPrices = _.mapValues(
      this.state.jobs,
      (value, key) => ({ value: value.unitPrice, str: fmtNumber(value.unitPrice) })
    );

    
    return {
      ...unchangedPrices,
      ...this.state.prices
    };
  }

  contactInfo() {
    let contactInfo = {};
    const [ job ] = this.jobs();
    if(job) {
      contactInfo = job.contactInfo;
    }
    contactInfo = {...contactInfo, ...this.state.customerAddress};
    return contactInfo;
  }

  unitPrice(job) {
    if(this.state.prices[job.id] != null) {
      return this.state.prices[job.id];
    }

    if(job.unitPrice != null) {
      return { value: job.unitPrice, str: job.unitPrice.toString() };
    }

    return undefined;
  }    
    
  render() {
    if(_.isEmpty(this.state.jobs)) return null;
      
    const jobs = this.jobs();
    const subtotal = _.sum(_.map(this.prices(), ({ value }, jobId) => value ? (value * this.state.jobs[jobId].quantity) : 0));
    const shipping = this.state.shipping;
    const total = subtotal + (shipping != undefined ? shipping.value : 0);
    const date = moment().format('LL');

    const userHasMadeChanges = !(
      _.isEmpty(this.state.prices) &&
      _.isEmpty(this.state.comments) &&
      _.isEmpty(this.state.customerAddress) &&
      this.state.shipping == undefined
    );
    const isBlocking = userHasMadeChanges && !this.state.invoiceCreated;
      
    const editable = !this.props.match.params.isPreview;

    return (
      <div>
        <Prompt
          when={isBlocking}
          message={location => {
              if(!location.pathname.startsWith('/invoicing/create/')) {
                return "Your invoice isn't saved. Discard changes?";
              }
          }}
        />

        <Nav tabs>
          <NavItem>
            <NavLink exact
                     tag={ReactRouterNavLink}
                     to={`/invoicing/create/${this.props.match.params.jobIds}`}>
              Edit
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink exact
                     tag={ReactRouterNavLink}
                     to={this.props.match.params.isPreview ? this.props.match.url : `${this.props.match.url}/preview`}>
              Preview
            </NavLink>
          </NavItem>
          <Button onClick={this.createInvoice} className="ml-auto" color="primary">Create</Button>
        </Nav>


        <InvoiceTemplate
          editable={editable}
          total={total}
          shipping={shipping}
          setShipping={this.setShipping}
          date={date}
          customerAddress={this.contactInfo()}
          setCustomerAddressField={this.setCustomerAddressField}>
          
          {_.flatMap(jobs, job => (
            InvoiceLineItem({
              editable,
              filename: 'foo',
              note: this.state.comments[job.id] || job.comments,
              orderIdentifier: job.orderIdentifier,
              material: `${job.materialThickness} ${job.material}`,
              quantity: job.quantity,
              unitPrice: this.unitPrice(job),
              setPrice: this.setPrice(job.id),
              setNote: this.setComment(job.id)
            })
          ))}
          
        </InvoiceTemplate>        
      </div>
    );
  }  
}

export default withRouter(CreateInvoice);

