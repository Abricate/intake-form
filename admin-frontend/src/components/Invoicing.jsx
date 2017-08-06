import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Input, Table } from 'reactstrap';
import _ from 'lodash';

import { addJobsToInvoice } from '../actions';

class Invoicing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      selectedJobs: {}
    };

    this.toggleSelect = this.toggleSelect.bind(this);
    this.handleCreateInvoice = this.handleCreateInvoice.bind(this);
  }
  
  componentDidMount() {
    fetch('/admin/jobs/ready-for-invoice', {credentials: 'include'})
      .then( response => response.json() )
      .then( result => {
        this.setState({
          jobs: result.jobs
        });
      });
  }

  toggleSelect(jobId) {
    this.setState((prevState, props) => {
      const selected = !prevState.selectedJobs[jobId];

      if(selected) {
        return {selectedJobs: {...prevState.selectedJobs, [jobId]: true}};
      } else {
        return {selectedJobs: _.omit(prevState.selectedJobs, jobId)};
      }
    });
  }

  handleCreateInvoice() {
    const jobIds = this.state.jobs.map(job => job.id);

    this.props.addJobsToInvoice(jobIds);
    this.setState({selectedJobs: {}});
  }
  
  render() {
    return (
      <div>
        <Table striped>
          <thead>
            <tr>
              <th></th>
              <th>Created At</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Material</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {this.state.jobs.map( job =>
              <JobRow job={job} selected={this.state.selectedJobs[job.id]} toggleSelect={() => this.toggleSelect(job.id)} />
            )}
          </tbody>
        </Table>
        <Link to={`/invoicing/create/${_.keys(this.state.selectedJobs).join(',')}`} className="btn btn-primary" disabled={_.isEmpty(this.state.selectedJobs)}>Create invoice</Link>
      </div>
    );
  }
}

const Jobs = jobs => (
  null
);

const SelectedStyle = { cursor: 'pointer', backgroundColor: 'yellow' };
const NonSelectedStyle = { cursor: 'pointer' };

const JobRow = ({ job, selected, toggleSelect }) => (
  <tr style={selected ? SelectedStyle : NonSelectedStyle} onClick={toggleSelect}>
    <td><input type="checkbox" checked={selected} /></td>
    <td>{job.createdAt}</td>
    <td>{job.orderIdentifier}</td>
    <td>{job.contactInfo.name} &lt;{job.contactInfo.email}&gt;</td>
    <td>{job.materialThickness} {job.material}</td>
    <td>{job.quantity}</td>
  </tr>
);

export default connect(null, { addJobsToInvoice })(Invoicing);

