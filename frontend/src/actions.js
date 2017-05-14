export const SET_CONTACT_INFO = 'SET_CONTACT_INFO';
export function setContactInfo({ field, value }) {
  return {
    type: SET_CONTACT_INFO,
    field,
    value
  };
}

export const SET_JOB_REQUEST = 'SET_JOB_REQUEST';
export function setJobRequest({ field, value }) {
  return {
    type: SET_JOB_REQUEST,
    field,
    value
  };
}

export const JOB_REQUEST_SUBMITTED = 'JOB_REQUEST_SUBMITTED';
export function jobRequestSubmitted() {
  return {
    type: JOB_REQUEST_SUBMITTED
  };
}

export const SET_JOB_REQUEST_FILE_UPLOAD_PENDING = 'SET_JOB_REQUEST_FILE_UPLOAD_PENDING';
export function setJobRequestFileUploadPending() {
  return {
    type: SET_JOB_REQUEST_FILE_UPLOAD_PENDING
  };
}

export const CLEAR_JOB_REQUEST_FILE_UPLOAD_PENDING = 'CLEAR_JOB_REQUEST_FILE_UPLOAD_PENDING';
export function clearJobRequestFileUploadPending() {
  return {
    type: CLEAR_JOB_REQUEST_FILE_UPLOAD_PENDING
  };
}

export const REMOVE_FILE_FROM_JOB_REQUEST = 'REMOVE_FILE_FROM_JOB_REQUEST';
export function removeFileFromJobRequest(file) {
  return {
    type: REMOVE_FILE_FROM_JOB_REQUEST,
    file
  };
}

export const ADD_FILES_TO_JOB_REQUEST = 'ADD_FILES_TO_JOB_REQUEST';
export function addFilesToJobRequest(files) {
  return {
    type: ADD_FILES_TO_JOB_REQUEST,
    files
  };
}

export const ADD_TO_CART = 'ADD_TO_CART';
export function addToCart(jobRequest) {
  return {
    type: ADD_TO_CART,
    jobRequest
  };
}
