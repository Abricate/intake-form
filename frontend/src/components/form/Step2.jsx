import React from 'react'
import { Link } from 'react-router-dom'
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
import _ from 'lodash';

import 'react-datetime/css/react-datetime.css';

import Datetime from 'react-datetime';

import ShoppingCart from './ShoppingCart';
import Uploader from './Uploader';
import { FormItem, FormItems } from './FormItems';

import { scrollToFirstFormElementWithError } from './util';

import {
  addToCart,
  setJobRequest,
  setJobRequestError,
} from '../../actions';

import * as MaterialsConfig from '../../data/materials';

const MaterialCategories = _.map(MaterialsConfig.Materials, 'label');

function validate(jobRequest) {
  const selectedMaterialCategory = MaterialsConfig.MaterialsByLabel[jobRequest['_materialCategory']];
  const requiredFields = [
    '_materialCategory',
    'quantity',
    'dueDate',
    'material'
  ];

  const missingProps = requiredFields.map( field => 
    !jobRequest.props[field] ? { field, error: `${field} is required` } : null
  ).filter( x => x != null);

  const missingFiles = (jobRequest.files.length === 0) ? [{ field: 'files', error: 'Please upload your part file'}] : [];

  return _.flatten([
    missingProps,
    missingFiles
  ]);
}

class Step2Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrors: false
    };
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  handleAddToCart() {
    const { addToCart, errors, jobRequest } = this.props;

    if(!_.isEmpty(errors)) {
      scrollToFirstFormElementWithError(errors);
    }
    
    this.setState({showErrors: true});
    addToCart(jobRequest);
  }
  
  render() {
    const { jobRequest, setValue, setValueRaw, addToCart, history, errors } = this.props;
    console.log(errors);
    const decr = field => () => {
      const value = parseInt(values[field]) - 1;
      setValueRaw(field, value < 1 ? 1 : value)
    };

    const incr = field => () => {
      setValueRaw(field, parseInt(values[field]) + 1)
    };

    const values = jobRequest.props;
    
    const dueDateChanged = moment => {
      let dueDate = moment;
      if(moment.format != undefined) {
        dueDate = dueDate.format('YYYY-MM-DD');
      }
      setValueRaw('dueDate', dueDate);
    };

    const selectedMaterialCategory = MaterialsConfig.MaterialsByLabel[values['_materialCategory']];
    const validationErrors = this.state.showErrors ? errors : {};
    
    return (
      <div>
        <h2 className="mr-auto">Job Request</h2>
        <Form>
          <FormItems values={values} validationErrors={validationErrors} setValue={setValue}>
            <FormItem label="Material Category" name="_materialCategory" type="select" options={MaterialCategories}>
              <FormText color="muted">Please choose a material category.</FormText>
            </FormItem>
            {selectedMaterialCategory ? (
              <div>
                <FormItem label="Material" name="material" type="select" options={selectedMaterialCategory.types}>
                  <FormText color="muted">Please choose a material.</FormText>
                </FormItem>

                <FormItem label="Material Thickness" name="materialThickness" type="select" options={selectedMaterialCategory.thicknesses} />
                <FormItem label="Area (Length and Width)" name="area" type="select" options={MaterialsConfig.Area} />
                {selectedMaterialCategory.colors ? (
                  <FormItem label="Color" name="color" type="select" options={selectedMaterialCategory.colors} />
                ) : null}

                <FormGroup color={validationErrors['files'] ? 'danger' : null}>
                  <Label className="form-control-label">Upload Your File(s)</Label>
                  <div id="files" style={{padding: 0}}className="form-control file-uploader">
                    <Uploader endpoint="/uploads" />
                  </div>
                  {validationErrors['files'] && validationErrors['files'] !== true ? <FormFeedback>{validationErrors['files']}</FormFeedback> : null}
                  <FormText color="muted">Please check your file before uploading. Use mm scale. All art work in the .dxf file will be quoted and cut. Remove all art/lines you don't want to cut including: dimensions, annotations, boarders, and hashes in the middle of circles. Check that all cutting lines are in one layer and all etching artwork is in a separate layer.</FormText>
                </FormGroup>

                <FormItem label="Tolerance" name="tolerance" type="select" options={MaterialsConfig.Tolerance} />

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
                  <Datetime onChange={dueDateChanged} name="dueDate" value={values['dueDate'] || ''} timeFormat={false} />
                </FormGroup>

                <Row>
                  <Col>
                    <Link to="/" className="btn btn-secondary w-100" color="secondary">&laquo; Edit Contact Info</Link>
                  </Col>
                  <Col>
                    <Button onClick={this.handleAddToCart} className="w-100" color="primary">Add to Cart &raquo;</Button>
                  </Col>
                </Row>
              </div>
            ) : null}
          </FormItems>
        </Form>
      </div>
    );
  }
}

function validateAndDispatch(jobRequest, dispatch) {
  const errors = validate(jobRequest);
  if(errors.length > 0) {
    errors.forEach( error => dispatch(setJobRequestError(error)) );
  }
  return errors;
}

function mapStateToProps(state) {
  const jobRequest = state.jobRequest;
  return {
    jobRequest,
    errors: _.chain(validate(jobRequest)).map( ({ field, error }) => [field, error] ).fromPairs().value()
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { history } = ownProps;
  
  return {
    setValue: event => dispatch(setJobRequest({field: event.target.name, value: event.target.value})),
    setValueRaw: (field, value) => dispatch(setJobRequest({field, value})),
    addToCart: jobRequest => {
      const errors = validate(jobRequest);
      if(errors.length == 0) {
        dispatch(addToCart(jobRequest));
        history.push('/checkout');
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
      <Col md="3" className="shopping-cart-sidebar">
        <ShoppingCart />
      </Col>
    ) : null}
  </Row>
);

export default connect(state => ({ hasItemsInCart: state.cart.length > 0 }))(Step2);
