import { expect } from './helper';
import { diff, reduce } from '../src/util';

describe('util', function() {
  describe('reduce', function() {
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

  describe('diff', function() {
    it('should only include changed items', function() {
      expect(
        diff({a: 1, b: '2', c: 3.0}, {a: 1, b: '1', c: 3})
      ).to.deep.equal({b: '1'});
    });
    it('should perform deep equality check', function() {
      expect(
        diff({a: 1, b: {k1: '2'}, c: 3.0}, {a: 1, b: {k1: '2'}, c: 3.0})
      ).to.deep.equal({});
    });
    it('should not include deleted items', function() {
      expect(
        diff({a: 1}, {b: 1})
      ).to.deep.equal({b: 1});
    });
  });
});
