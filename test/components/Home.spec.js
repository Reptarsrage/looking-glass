import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Home from '../../app/components/Home';

Enzyme.configure({ adapter: new Adapter() });

function setup() {
  const component = shallow(<Home />);
  return {
    header: component.find('h1')
  };
}

describe('Counter component', () => {
  it('should should display count', () => {
    const { header } = setup();
    expect(header.text()).toMatch(/^Home$/);
  });
});
