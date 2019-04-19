import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import About from '../../app/containers/About';

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const component = shallow(<About />);
  return {
    header: component.find('h1')
  };
}

describe('About container', () => {
  it('should should display header', () => {
    const { header } = setup();
    expect(header.text()).toMatch(/^About$/);
  });
});
