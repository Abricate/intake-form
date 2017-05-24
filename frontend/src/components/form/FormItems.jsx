import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
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

function mkOptions(items) {
  return ['', ...items].map(item => (
    <option key={item}>{item}</option>
  ));
}

export class FormItems extends React.Component {
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

function childrenFormItems(reactChildren) {
  const children = React.Children.toArray(reactChildren) || [];
  
  // if any of the children of the group have errors
  return _.flatMap(children, child => (
    child.type === FormItem ? child : childrenFormItems(child.props.children)
  ));
} 

class FormItemContainer extends React.Component {
  getChildContext() {
    return {
      formGroup: false
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

FormItemContainer.childContextTypes = {
  formGroup: PropTypes.bool.isRequired
}

export const FormItemGroup = ({ children }, { values, validationErrors, setValue }) => {
  const childNames = childrenFormItems(children).map(formItem => formItem.props.name);

  // if any of the children of the group have errors
  const hasErrors = !_.isEmpty(_.intersection(Object.keys(validationErrors), childNames));

  return (
    <FormGroup color={hasErrors ? "danger" : null}>
      <FormItemContainer formGroup={false}>
        {children}
      </FormItemContainer>
    </FormGroup>
  );
};

export const FormItem = ({ children, label, sublabel, name, type, options, ...rest }, { values, validationErrors, setValue, formGroup = true }) => {
  const labelForError = label || sublabel;
  const errorText = validationErrors[name] ? (validationErrors[name] !== true ? validationErrors[name] : `${labelForError} is required`) : null;

  const labelElem = (
    <div>
      <Label for={name} className="form-control-label">{label}</Label>
      <Input type={type} name={name} id={name} state={validationErrors[name] ? 'danger' : null} onChange={setValue} value={values[name] || ''} {...rest}>
        {options !== undefined ? mkOptions(options) : null}
      </Input>
      {errorText ? <FormFeedback>{errorText}</FormFeedback> : (sublabel ? <FormText color="muted">{sublabel}</FormText> : null)}
      {children}
    </div>
  );

  if(formGroup) {
    return (
      <FormGroup color={validationErrors[name] ? "danger" : null}>
        {labelElem}
      </FormGroup>
    );
  } else {
    return labelElem;
  }
};

FormItems.childContextTypes = {
  values: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  setValue: PropTypes.func
};

FormItemGroup.contextTypes = {
  values: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  setValue: PropTypes.func
};

FormItem.contextTypes = {
  values: PropTypes.object.isRequired,
  validationErrors: PropTypes.object.isRequired,
  setValue: PropTypes.func,
  formGroup: PropTypes.bool
};  

