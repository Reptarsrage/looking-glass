import React from 'react';
import Enzyme from 'enzyme';
import { createMount } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router';

import About from '../../app/containers/About';

describe('<About />', () => {
  let mount;
  let history;

  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    mount = createMount();
    history = createMemoryHistory();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  it('should should display header', () => {
    const component = mount(
      <Router history={history}>
        <Route path="/" component={About} />
      </Router>
    );

    const header = component.find('h1');
    expect(header.text()).toMatch(/^About$/);
  });
});
