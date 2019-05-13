import React from 'react';
import * as sinon from 'sinon';
import Enzyme from 'enzyme';
import { createMount } from '@material-ui/core/test-utils';
import Adapter from 'enzyme-adapter-react-16';

import About from '../../app/containers/About';

describe('<About />', () => {
  let mount;

  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() });
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  it('should should display header', () => {
    const component = mount(<About history={{ goBack: sinon.stub() }} />);
    const header = component.find('h1');
    expect(header.text()).toMatch(/^About$/);
  });
});
