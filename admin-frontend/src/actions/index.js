export const SET_USER = 'SET_USER';
export function setUser(user) {
  return {
    type: SET_USER,
    user
  };
}

export const ADD_JOBS_TO_INVOICE = 'ADD_JOBS_TO_INVOICE';
export function addJobsToInvoice(jobIds) {
  return {
    type: ADD_JOBS_TO_INVOICE,
    jobIds
  };
}
