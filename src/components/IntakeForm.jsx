import React from 'react'
import { connect } from 'react-redux'
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import Countries from '../countries';
import { setContactInfo } from '../actions';

const IntakeForm = ({ values, setValue }) => {
  return (
    <div>
      <h1>Job Request</h1>
      <Form>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" onChange={setValue} value={values['name'] || ''} placeholder="" />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" onChange={setValue} value={values['email'] || ''} placeholder="" />
        </FormGroup>
        <FormGroup>
          <Label for="phoneNumber">Phone Number</Label>
          <Input type="tel" name="phoneNumber" id="phoneNumber" onChange={setValue} value={values['phoneNumber'] || ''} placeholder="(415) 555-1234" />
        </FormGroup>
        <FormGroup>
          <Label>Address</Label>
          <Input type="text" name="streetAddress" id="streetAddress_line1" onChange={setValue} value={values['streetAddress_line1'] || ''} placeholder="" />
          <FormText color="muted">Street Address</FormText>
          <Input type="text" name="streetAddress" id="streetAddress_line2" onChange={setValue} value={values['streetAddress_line2'] || ''}  placeholder="" />
          <FormText color="muted">Line 2</FormText>
          <Row>
            <Col>
              <Input type="text" name="postalCode" id="postalCode" onChange={setValue} value={values['postalCode'] || ''} placeholder="" />
              <FormText color="muted">Postal / Zip Code</FormText>
            </Col>
            <Col>
              <FormGroup>
                <Input type="select" name="country" id="country" onChange={setValue} value={values['country'] || ''}>
                  {Countries.map(country => (
                    <option key={country}>{country}</option>
                  ))}
                </Input>
              </FormGroup>
              <FormText color="muted">Country</FormText>
            </Col>
          </Row>
        </FormGroup>
        <Button className="w-100" color="primary">Next</Button>
      </Form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    values: state.contactInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setValue: event => dispatch(setContactInfo({field: event.target.name, value: event.target.value}))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntakeForm);
