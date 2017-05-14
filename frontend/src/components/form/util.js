import _ from 'lodash';
import scrollToElement from 'scroll-to-element';

export function scrollToFirstFormElementWithError(errors) {
  const { element } = _.chain(errors)
                       .map((error, field) => {
                         const element = document.getElementById(field);
                         return { element, top: element.getBoundingClientRect().top };
                       })
                       .minBy('top')
                       .value();
  if(element && element.parentElement) {
    scrollToElement(element.parentElement);
  }
}
