import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone';
import request from 'superagent';
import _ from 'lodash';
import { FaSpinner, FaTimesCircle } from 'react-icons/lib/fa';

import {
  addFilesToJobRequest,
  removeFileFromJobRequest,
} from '../../actions';

// TODO: use and credit https://www.iconfinder.com/iconsets/document-file for icons
const style = {
  base: { width: '100%', border: '3px dashed #666', padding: '30px', height: '200px', textAlign: 'center' },
  active: { backgroundColor: '#e8e8e8' },
  uploading: { backgroundColor: '#ccc' }
};

class Uploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: []
    };
    
    this.onDrop = this.onDrop.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }
  
  setErrorOnFiles(error, files) {
    this.setState( (prevState, props) => {
      return { files: prevState.files.map(file =>
        files.includes(file) ? {...file, pending: false, error} : file
      )};
    });
  }

  addPendingFiles(filenames) {
    const files = filenames.map(originalName => ({ originalName, pending: true }));

    this.setState( (prevState, props) => {
      return { files: prevState.files.concat(files) };
    });

    return files;
  }

  removePendingFiles(pendingFiles) {
    this.setState( (prevState, props) => {
      return { files: _.without(prevState.files, ...pendingFiles) };
    });
  }
  
  onDrop(acceptedFiles, rejectedFiles) {
    const {
      endpoint,
      addFilesToJobRequest
    } = this.props;
    
    try {
      const req = request.post(endpoint);
      acceptedFiles.forEach(file => {
        req.attach('files', file);
      });

      const pendingFiles = this.addPendingFiles(_.map(acceptedFiles, 'name'));
      
      req.end( (error, res) => {
        if(error) {
          console.error(error);
          this.setErrorOnFiles(error, pendingFiles);
        } else {
          this.removePendingFiles(pendingFiles);

          if(res.body.files) {
            const files = _.map(res.body.files, (filename, originalName) => (
              { filename, originalName }
            ));
            
            addFilesToJobRequest(files);
          }
        }
      });
    } catch (e) {
      console.error(e);
      this.setState({error: true, exception: e});
    }
  }

  removeFile(file) { return e => {
    this.props.removeFileFromJobRequest(file);
    e.preventDefault();
    e.stopPropagation();
  }}
  
  render() {
    const noFilesText = (
      <div>
        <p>Drop your file(s) here.</p>
        <p>Allowed file extensions: dxf, dwg, svg, ai.</p>
        <p>Max file size: 100MB.</p>
      </div>
    );

    const allFiles = this.props.files.map(file => ({file, uploaded: true})).concat(this.state.files);

    const pendingFiles = this.state.files.map((file, idx) => (
      <div key={idx}>
        {file.originalName}
        {file.error ? <span className="alert alert-danger">{file.error.toString()}</span> : <FaSpinner className="icon-spin" />}
      </div>
    ));

    const uploadedFiles = this.props.files.map((file, idx) => (
      <div key={idx}>
        {file.originalName}
        <a href="#" onClick={this.removeFile(file)} rel="button"><FaTimesCircle color='red' /></a>
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
              <div>{uploadedFiles}{pendingFiles}</div>
            )
          }
        </Dropzone>
      </div>
    );
  }
}

export default connect(
  state => ({
    files: state.jobRequest.files,
    pendingFiles: state.jobRequest.pendingFiles
  }),
  {
    addFilesToJobRequest,
    removeFileFromJobRequest,
  }
)(Uploader);
