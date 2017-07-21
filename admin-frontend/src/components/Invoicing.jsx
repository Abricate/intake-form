import React, { Component } from 'react';

class Invoicing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: []
    };
  }
  
  componentDidMount() {
    fetch('/admin/jobs/ready-to-invoice', {credentials: 'include'})
      .then( response => response.json() )
      .then( result => {
        this.setState({
          jobs: result.jobs
        });
      });
  }
  
  render() {
    return (
      <div>
        {this.state.jobs.map( job =>
          <pre>{JSON.stringify(job)}</pre>
         )}
      </div>
    );
  }
}

export default Invoicing;

