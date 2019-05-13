import React from 'react';
import Enzyme from 'enzyme';
import { createMount } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';

import NotFound from '../../app/containers/NotFound';

describe('<NotFound />', () => {
  let mount;

  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  it('should should display header', () => {
    const component = mount(<NotFound />);
    const header = component.find('h1');
    expect(header.text()).toMatch(/^Not Found$/);
  });
});
