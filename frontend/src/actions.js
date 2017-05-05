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

export const ADD_FILES_TO_JOB_REQUEST = 'ADD_FILES_TO_JOB_REQUEST';
export function addFilesToJobRequest(files) {
  return {
    type: ADD_FILES_TO_JOB_REQUEST,
    files
  };
}

export const ADD_PENDING_FILES_TO_JOB_REQUEST = 'ADD_PENDING_FILES_TO_JOB_REQUEST';
export function addPendingFilesToJobRequest(files) {
  return {
    type: ADD_PENDING_FILES_TO_JOB_REQUEST,
    files
  };
}

export const REMOVE_PENDING_FILES_FROM_JOB_REQUEST = 'REMOVE_PENDING_FILES_FROM_JOB_REQUEST';
export function removePendingFilesFromJobRequest(files) {
  return {
    type: REMOVE_PENDING_FILES_FROM_JOB_REQUEST,
    files
  };
}

export const REMOVE_FILE_FROM_JOB_REQUEST = 'REMOVE_FILE_FROM_JOB_REQUEST';
export function removeFileFromJobRequest(file) {
  return {
    type: REMOVE_FILE_FROM_JOB_REQUEST,
    file
  };
}

export const MODIFY_FILE_IN_JOB_REQUEST = 'MODIFY_FILE_IN_JOB_REQUEST';
export function modifyFileInJobRequest(file) {
  return {
    type: MODIFY_FILE_IN_JOB_REQUEST,
    file
  };
}

export const ADD_TO_CART = 'ADD_TO_CART';
export function addToCart(jobRequest) {
  return {
    type: ADD_TO_CART,
    jobRequest
  };
}
