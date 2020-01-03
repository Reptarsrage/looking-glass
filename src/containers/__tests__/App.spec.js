import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import App from '../App';

const mockStore = configureMockStore();

describe('<App />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      message: 'sample text',
    });
  });

  it('should render', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(wrapper.find(App).length).toBe(1);
  });
});
