import { initialState, initialModuleState } from '../../reducers/moduleReducer';
import { modulesSelector, moduleByIdSelector } from '../moduleSelectors';

describe('Module Selectors', () => {
  describe('modulesSelector', () => {
    it('should return modules', () => {
      // arrange
      const allIds = [...Array(3).keys()].map((id) => id.toString());
      const state = { module: { ...initialState, allIds } };
      allIds.forEach((id) => {
        state.module.byId[id] = { ...initialModuleState, id };
      });

      // act
      const selected = modulesSelector(state);

      // assert
      expect(selected).toEqual(allIds);
    });

    it('should return empty', () => {
      // arrange
      const state = { module: initialState };

      // act
      const selected = modulesSelector(state);

      // assert
      expect(selected).toHaveLength(0);
    });
  });

  describe('moduleByIdSelector', () => {
    it('should return module', () => {
      // arrange
      const allIds = [...Array(3).keys()].map((id) => id.toString());
      const state = { module: { ...initialState, allIds } };
      const props = { moduleId: allIds[1] };
      allIds.forEach((id) => {
        state.module.byId[id] = { ...initialModuleState, id };
      });

      // act
      const selected = moduleByIdSelector(state, props);

      // assert
      expect(selected.id).toEqual('1');
    });

    it('should return initial module state', () => {
      // arrange
      const state = { module: initialState };
      const props = { moduleId: 'FAKE MODULE ID' };

      // act
      const selected = moduleByIdSelector(state, props);

      // assert
      expect(selected).toEqual(initialModuleState);
    });
  });
});
