import React from 'react';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import NotFound from '../NotFound';

const mockStore = configureMockStore();

describe('<NotFound />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      message: 'sample text',
    });
  });

  it('should should display header', () => {
    const component = mount(
      <Provider store={store}>
        <NotFound />
      </Provider>
    );

    const header = component.find('h1');
    expect(header.text()).toMatch(/^Not Found$/);
  });
});
