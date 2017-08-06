export async function getJobsWithIds(jobIds) {
  const { jobs } =
    await fetch('/admin/jobs/by-id/' + jobIds.join(','), {credentials: 'include'})
      .then( response => response.json() );

  return jobs;
}
