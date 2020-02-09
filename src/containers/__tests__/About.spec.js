import React from 'react';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import About from '../About';

const mockStore = configureMockStore();

describe('<About />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      message: 'sample text',
    });
  });

  it('should should display header', () => {
    const component = mount(
      <Provider store={store}>
        <About />
      </Provider>
    );

    const header = component.find('h1');
    expect(header.text()).toMatch(/^About$/);
  });
});
