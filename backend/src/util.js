export const promisify = fn => (...args) => new Promise( (resolve, reject) => {
  fn(...args, (err, result) => {
    if(err) {
      reject(err);
    } else {
      resolve(result);
    }
  })
})

export function reduce(stream) { return (callback, initialValue = null) => {
  const result = stream.entries.reduce(callback, initialValue);

  if(stream.next) {
    return stream.next().then(s => reduce(s)(callback, result))
  } else {
    return Promise.resolve(result)
  }
}}

