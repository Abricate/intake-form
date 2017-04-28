import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;

import { reduce } from '../src/util';

describe('util', function() {
  it('should reduce single element stream', function() {
    const result = reduce({
      entries: [1,2,3],
      next: null
    })( (acc, x) => acc + x, 0);

    return expect(result).to.eventually.equal(1+2+3);
  });

  it('should reduce multiple element stream', function() {
    const result = reduce({
      entries: [1,2,3],
      next: () => Promise.resolve({
        entries: [4,5],
        next: null
      })
    })( (acc, x) => acc + x, 0);
    
    return expect(result).to.eventually.equal(1+2+3+4+5)
  });
});
