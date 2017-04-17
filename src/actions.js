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
