import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NotFound from '../../app/containers/NotFound';

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const component = shallow(<NotFound />);
  return {
    header: component.find('h1')
  };
}

describe('About container', () => {
  it('should should display header', () => {
    const { header } = setup();
    expect(header.text()).toMatch(/^Not Found$/);
  });
});
