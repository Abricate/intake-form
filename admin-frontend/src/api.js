export async function getJobsWithIds(jobIds) {
  const { jobs } =
    await fetch('/admin/jobs/by-id/' + jobIds.join(','), {credentials: 'include'})
      .then( response => response.json() );

  return jobs;
}

export async function createInvoice(invoice) {
  return await fetch('/admin/invoices', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(invoice),
    credentials: 'include'
  }).then( response => response.json() );
}

export async function getInvoice(identifier) {
  return await fetch('/admin/invoices/by-id/' + identifier, {
    credentials: 'include'
  }).then( response => response.json() );
}
