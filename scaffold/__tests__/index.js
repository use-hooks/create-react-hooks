// import '@babel/polyfill';
// import React from 'react';
// import { render } from 'react-testing-library';

import hooks from '../src/index';

it('should be a function', () => {
  expect(hooks).toEqual(expect.any(Function));
});