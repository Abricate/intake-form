import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
} from 'reactstrap';
import { withRouter } from 'react-router'
import request from 'superagent';
import _ from 'lodash';

import 'react-datetime/css/react-datetime.css';
import { FaSpinner, FaTimesCircle } from 'react-icons/lib/fa';

import Datetime from 'react-datetime';
import Dropzone from 'react-dropzone';

import ShoppingCart from './ShoppingCart';

import {
  addFilesToJobRequest,
  addPendingFilesToJobRequest,
  addToCart,
  removeFileFromJobRequest,
  removePendingFilesFromJobRequest,
  setJobRequest,
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

// TODO: use and credit https://www.iconfinder.com/iconsets/document-file for icons
const style = {
  base: { width: '100%', border: '3px dashed #666', padding: '30px', height: '200px', textAlign: 'center' },
  active: { backgroundColor: '#e8e8e8' },
  uploading: { backgroundColor: '#ccc' }
};

const DropzoneUploader = connect(
  state => ({
    files: state.jobRequest.files,
    pendingFiles: state.jobRequest.pendingFiles
  }),
  {
    addFilesToJobRequest,
    addPendingFilesToJobRequest,
    removeFileFromJobRequest,
    removePendingFilesFromJobRequest,
  }
)(React.createClass({
  getInitialState() {
    return {
      errorFiles: []
    };
  },
  onDrop(acceptedFiles, rejectedFiles) {
    try {
      const req = request.post('/uploads');
      acceptedFiles.forEach(file => {
        req.attach('files', file);
      });
      console.log(acceptedFiles);
      const pendingFiles = acceptedFiles.map(file => ({ originalName: file.name }));
      this.props.addPendingFilesToJobRequest(pendingFiles);
      req.end( (error, res) => {
        this.props.removePendingFilesFromJobRequest(pendingFiles);
        if(error) {
          this.setState( (prevState, props) => {
            const errorFiles = pendingFiles.map( file => ({...file, error}) );
            return { errorFiles: prevState.errorFiles.concat(errorFiles) };
          });
        } else {
          if(res.body.files) {
            const files = _.map(res.body.files, (filename, originalName) => (
              { filename, originalName }
            ));
            
            this.props.addFilesToJobRequest(files);
          }
        }
      });
    } catch (e) {
      console.error(e);
      this.setState({error: true, exception: e});
    }
  },

  removeFile(file) { return e => {
    this.props.removeFileFromJobRequest(file);
    e.preventDefault();
    e.stopPropagation();
  }},
    
  render() {
    const { files, pendingFiles } = this.props;
    const { errorFiles } = this.state;

    const noFilesText = (
      <div>
        <p>Drop your file(s) here.</p>
        <p>Allowed file extensions: dxf, dwg, svg, ai.</p>
        <p>Max file size: 100MB.</p>
      </div>
    );

    const allFiles = _.flatten([
      files.map(file => ({file, uploaded: true})),
      pendingFiles.map(file => ({file, pending: true})),
      errorFiles.map(file => ({ file }))
    ]);

    const filenames = allFiles.map(({file, ...props}, idx) => (
      <div key={idx}>
        {file.originalName}
        {props.uploaded ? <a href="#" onClick={this.removeFile(file)} rel="button"><FaTimesCircle color='red' /></a> : null}
        {props.pending ? <FaSpinner className="icon-spin" /> : null}
        {props.error ? <span className="alert alert-danger">{props.error.toString()}</span> : null}
      </div>
    ));
          
    return (
      <div>
      <Dropzone
        disablePreview={true}
        activeStyle={style.active}
        style={style.base}
        onDrop={this.onDrop}>
        {
          allFiles.length == 0 ? (
            noFilesText
          ) : (
            filenames
          )
        }
      </Dropzone>
        </div>
    );
  }
}));


function mkOptions(items) {
  return ['', ...items].map(item => (
    <option key={item}>{item}</option>
  ));
}

const Step2Form = ({ values, setValue, setValueRaw, addToCart, history }) => {
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
        <FormGroup>
          <Label for="material">Material</Label>
          <Input type="select" name="material" id="material" onChange={setValue} value={values['material'] || ''}>
            {mkOptions(Material)}
          </Input>          
          <FormText color="muted">Please choose a material.</FormText>
        </FormGroup>
        <FormGroup>
          <Label for="materialThickness">Material Thickness</Label>
          <Input type="select" name="materialThickness" id="materialThickness" onChange={setValue} value={values['materialThickness'] || ''}>
            {mkOptions(MaterialThickness)}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="sheetMetalGage">Sheet Metal Gage</Label>
          <Input type="select" name="sheetMetalGage" id="sheetMetalGage" onChange={setValue} value={values['sheetMetalGage'] || ''}>
            {mkOptions(SheetMetalGage)}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="area">Area (Length and Width)</Label>
          <Input type="select" name="area" id="area" onChange={setValue} value={values['area'] || ''}>
            {mkOptions(Area)}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="color">Color</Label>
          <Input type="select" name="color" id="color" onChange={setValue} value={values['color'] || ''}>
            {mkOptions(Color)}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="">Upload Your File(s)</Label>
          <DropzoneUploader />
          <FormText color="muted">Please check your file before uploading. Use mm scale. All art work in the .dxf file will be quoted and cut. Remove all art/lines you don't want to cut including: dimensions, annotations, boarders, and hashes in the middle of circles. Check that all cutting lines are in one layer and all etching artwork is in a separate layer.</FormText>
        </FormGroup>

        {/*
            <FormGroup>
            <Label>Material Special Ordered from Supplier (please check MSDS that material is safe for laser cutting)</Label>
            <table>
            <thead>
            <tr>
            <th>Catalog Name</th>
            <th>Catalog Link</th>
            <th>Product Name</th>
            <th>Catalog Product ID Number</th>
            <th>Dimensions</th>
            <th>Price</th>
            <th>Quantity</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>
            <Input type="text" name="catalogName" id="catalogName" onChange={setValue} value={values['catalogName'] || ''} />
            </td>
            <td>
            <Input type="text" name="catalogLink" id="catalogLink" onChange={setValue} value={values['catalogLink'] || ''} />
            </td>
            <td>
            <Input type="text" name="productName" id="productName" onChange={setValue} value={values['productName'] || ''} />
            </td>
            <td>
            <Input type="text" name="catalogProductId" id="catalogProductId" onChange={setValue} value={values['catalogProductId'] || ''} />
            </td>
            <td>
            <Input type="text" name="dimensions" id="dimensions" onChange={setValue} value={values['dimensions'] || ''} />
            </td>
            <td>
            <Input type="text" name="price" id="price" onChange={setValue} value={values['price'] || ''} />
            </td>
            <td>
            <Input type="text" name="quantity" id="quantity" onChange={setValue} value={values['quantity'] || ''} />
            </td>
            </tr>
            </tbody>
            </table>
            </FormGroup>
          */}

        <FormGroup>
          <Label for="tolerance">Tolerance</Label>
          <Input type="select" name="tolerance" id="tolerance" onChange={setValue} value={values['tolerance'] || ''}>
            {mkOptions(Tolerance)}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="comments">Job comments</Label>
          <Input type="textarea" name="comments" id="comments" />
          <FormText color="muted">Please include any special treatments or special notes about materials.</FormText>
        </FormGroup>

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

        
        <Button onClick={() => { addToCart(values); history.push('#order-summary'); }} className="w-100" color="primary">Add to Cart</Button>
      </Form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    values: state.jobRequest.props
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setValue: event => dispatch(setJobRequest({field: event.target.name, value: event.target.value})),
    setValueRaw: (field, value) => dispatch(setJobRequest({field, value})),
    addToCart: jobRequest => dispatch(addToCart(jobRequest))
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
