import React, { Component, Children } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
} from 'reactstrap';
import { withRouter } from 'react-router'

import 'react-datetime/css/react-datetime.css';

import Datetime from 'react-datetime';

import ShoppingCart from './ShoppingCart';
import Uploader from './Uploader';

import {
  addToCart,
  setJobRequest,
  setJobRequestError,
} from '../../actions';

const Material = [
  'Acrylic',
  'Delrin',
  'Coroplast',
  'Polycarbonate',
  'Abs',
  'Silicon rubber',
  'Mylar',
  'Birch Plywood',
  'Walnut Plywood',
  'Bamboo Ply',
  'Aluminum 5052',
  'Aluminum 6061',
  'Aluminum 6063',
  'Aluminum 7075',
  'Cold rolled Steel 1083',
  'Hot rolled Steel',
  'Stainless Steel 304',
  'Fabric',
  'Silk',
  'Cotton',
  'Felt',
  'Ripstop nylon',
  'Leather',
  'Fiber glass',
  'Carbon fiber',
  'Paper',
  'Cardboard',
  'Pressboard',
  'Melamine',
  'Cork',
  'Corian',
  'MDF',
  'Depron Foam',
  'Magnetic sheet',
  'Teflon',
  'Special Order from Supplier Catalog',
  'Multiple material customer specified.'
];

const MaterialThickness = [
  '1/16"',
  '1/8"',
  '3/16"',
  '1/4"',
  '3/8"',
  '1/2"'
];

const SheetMetalGage = [
  '30',
  '28',
  '26',
  '24',
  '22',
  '20',
  '18',
  '16',
  '14',
  '12',
  '10'
];

const Area = [
  '1ft x 1 ft',
  '1ft x 2ft',
  '2ft x 2ft',
  '2ft x 4ft',
  '4ft x 4ft',
  '4ft x 8ft',
  'Other'
];

const Color = [
  'Clear',
  'Black',
  'White',
  'Red',
  'Yellow',
  'Orange',
  'Green',
  'Blue'
];

const Tolerance = [
  '2-6mm',
  '1-2mm',
  '1mm-500μm',
  '500μm-200μm',
  '200-100μm'
];

function mkOptions(items) {
  return ['', ...items].map(item => (
    <option key={item}>{item}</option>
  ));
}

class FormItems extends React.Component {
  getChildContext() {
    return {
      values: this.props.values,
      validationErrors: this.props.validationErrors,
      setValue: this.props.setValue,
    };
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

FormItems.childContextTypes = {
  values: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  setValue: PropTypes.func
}

const FormItem = ({ children, label, name, type, options }, { values, validationErrors, setValue }) => {
  return (<FormGroup color={validationErrors[name] ? "danger" : null}>
    <Label for={name} className="form-control-label">{label}</Label>
    <Input type={type} name={name} id={name} state={validationErrors[name] ? 'danger' : null} onChange={setValue} value={values[name] || ''}>
      {options !== undefined ? mkOptions(options) : null}
    </Input>
    {children}
  </FormGroup>);
};

FormItem.contextTypes = {
  values: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  setValue: PropTypes.func
};  

const Step2Form = ({ jobRequest, setValue, setValueRaw, addToCart, history }) => {
  const values = jobRequest.props;
  
  const decr = field => () => {
    const value = parseInt(values['quantity']) - 1;
    setValueRaw('quantity', value < 1 ? 1 : value)
  };

  const incr = field => () => {
    setValueRaw('quantity', parseInt(values['quantity']) + 1)
  };

  return (
    <div>
      <h2 className="mr-auto">Job Request</h2>
      <Form>
        <FormItems values={values} validationErrors={jobRequest.validationErrors} setValue={setValue}>
          <FormItem label="Material" name="material" type="select" options={Material}>
            <FormText color="muted">Please choose a material.</FormText>
          </FormItem>
        
          <FormItem label="Material Thickness" name="materialThickness" type="select" options={MaterialThickness} />
          <FormItem label="Sheet Metal Gage" name="sheetMetalGage" type="select" options={SheetMetalGage} />
          <FormItem label="Area (Length and Width)" name="area" type="select" options={Area} />
          <FormItem label="Color" name="color" type="select" options={Color} />

          <FormGroup>
            <Label for="">Upload Your File(s)</Label>
            <Uploader endpoint="/uploads" />
            <FormText color="muted">Please check your file before uploading. Use mm scale. All art work in the .dxf file will be quoted and cut. Remove all art/lines you don't want to cut including: dimensions, annotations, boarders, and hashes in the middle of circles. Check that all cutting lines are in one layer and all etching artwork is in a separate layer.</FormText>
          </FormGroup>


          <FormItem label="Tolerance" name="tolerance" type="select" options={Tolerance} />


          <FormItem label="Job comments" name="comments" type="textarea">
            <FormText color="muted">Please include any special treatments or special notes about materials.</FormText>
          </FormItem>
    
          <FormGroup>
            <Label for="quantity">Quantity / How many do you need?</Label>

            <InputGroup className="small">
              <InputGroupAddon className="clickable" onClick={decr('quantity')}>-</InputGroupAddon>
              <Input type="text" name="quantity" id="quantity" onChange={setValue} value={values['quantity'] || ''} />
              <InputGroupAddon className="clickable" onClick={incr('quantity')}>+</InputGroupAddon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label for="quantity">What date do you need your parts back by?</Label>
            <Datetime onChange={moment => setValueRaw('dueDate', moment.format('YYYY-MM-DD'))} name="dueDate" value={values['dueDate'] || ''} timeFormat={false} />
          </FormGroup>

          <Button onClick={() => { addToCart(jobRequest); history.push('#order-summary'); }} className="w-100" color="primary">Add to Cart</Button>
        </FormItems>
      </Form>
    </div>
  );
};

function validate(jobRequest) {
  return [{ field: 'comments', error: "fpp bar baz" }];
}

function validateAndDispatch(jobRequest, dispatch) {
  const errors = validate(jobRequest);
  errors.forEach( error => dispatch(setJobRequestError(error)) );
  return errors;
}

function mapStateToProps(state) {
  return {
    jobRequest: state.jobRequest
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setValue: event => dispatch(setJobRequest({field: event.target.name, value: event.target.value})),
    setValueRaw: (field, value) => dispatch(setJobRequest({field, value})),
    addToCart: jobRequest => {
      const errors = validateAndDispatch(jobRequest, dispatch);
      if(errors.length == 0) {
        dispatch(addToCart(jobRequest))
      }
    }
  };
}

Step2Form.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const ConnectedStep2Form = withRouter(connect(mapStateToProps, mapDispatchToProps)(Step2Form));

const Step2 = ({ hasItemsInCart }) => (
  <Row>
    <Col xs="12" md={hasItemsInCart ? 9 : 12}>
      <ConnectedStep2Form />
    </Col>
    {hasItemsInCart ? (
      <Col md="3">
        <ShoppingCart />
      </Col>
    ) : null}
  </Row>
);

export default connect(state => ({ hasItemsInCart: state.cart.length > 0 }))(Step2);
