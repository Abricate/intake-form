import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import _ from 'lodash';
import queryString from 'query-string';

import { FormItem, FormItems, FormItemGroup } from './FormItems';
import { scrollToFirstFormElementWithError } from './util';

import Countries from '../../countries';
import { setContactInfo } from '../../actions';

function validate(values) {
  const requiredFields = [
    'name',
    'email',
    'phoneNumber',
    'address1',
    'zipcode',
    'country',
  ];

  return requiredFields.map( field => 
    !values[field] ? { field, error: true } : null
  ).filter( x => x != null);
}

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      showErrors: false
    };
    this.handleNext = this.handleNext.bind(this);
  }

  handleNext(e) {
    const { errors } = this.props;
    this.setState({showErrors: true});
    if(!_.isEmpty(errors)) {
      // cancel navigation if there are errors
      e.preventDefault();
      scrollToFirstFormElementWithError(errors);
    }
  }
  
  render() {
    const { location, values, errors, setValue } = this.props;

    const { showErrors } = queryString.parse(location.search);
    const validationErrors = this.state.showErrors || showErrors ? errors : {};
    
    return (
      <div>
        <h2 className="mr-auto">Job Request</h2>
        <Form>
          <FormItems values={values} validationErrors={validationErrors} setValue={setValue}>
            <FormItem label="Name" name="name" type="text" />
            <FormItem label="Email" name="email" type="email" />
            <FormItem label="Phone Number" name="phoneNumber" type="tel" placeholder="(415) 555-1234" />

            <FormItemGroup>
              <FormItem label="Address" sublabel="Street Address" name="address1" type="text" />
              <FormItem name="address2" type="text" sublabel="Line 2" />
              <Row>
                <Col>
                  <FormItem name="zipcode" sublabel="Postal / Zip Code" type="text" />
                </Col>
                <Col>
                  <FormItem name="country" sublabel="Country" type="select" options={Countries} />
                </Col>
              </Row>
            </FormItemGroup>
            <Link onClick={this.handleNext} to="/step2" className="w-100 btn btn-primary" role="button" >Next &raquo;</Link>
          </FormItems>
        </Form>
      </div>
    );
  }    
}

function mapStateToProps(state) {
  const values = state.contactInfo;
  
  return {
    values,
    errors: _.chain(validate(values)).map( ({ field, error }) => [field, error] ).fromPairs().value()
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setValue: event => dispatch(setContactInfo({field: event.target.name, value: event.target.value}))
  };
}

export const validator = state => ({
  isValid: validate(state.contactInfo).length === 0,
  link: '/?showErrors=true'
})

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
