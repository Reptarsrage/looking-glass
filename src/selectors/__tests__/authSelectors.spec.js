import { initialState, initialAuthState } from '../../reducers/authReducer';
import { initialState as initialStateForModule, initialModuleState } from '../../reducers/moduleReducer';
import { authByModuleIdSelector, authUrlSelector, requiresAuthSelector } from '../authSelectors';

describe('Auth Selectors', () => {
  describe('authByModuleIdSelector', () => {
    it('should return auth state for module', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const state = { auth: { ...initialState } };
      const props = { moduleId };
      state.auth.allIds.push(moduleId);
      state.auth.byId[moduleId] = initialAuthState;

      // act
      const selected = authByModuleIdSelector(state, props);

      // assert
      expect(selected).toEqual(initialAuthState);
    });
  });

  describe('authUrlSelector', () => {
    it('should return auth url for module', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const state = { auth: { ...initialState }, module: { ...initialStateForModule } };
      const props = { moduleId };
      state.auth.allIds.push(moduleId);
      state.auth.byId[moduleId] = { ...initialAuthState };
      state.module.allIds.push(moduleId);
      state.module.byId[moduleId] = { ...initialModuleState, authType: 'oauth', id: moduleId };

      // act
      const selected = authUrlSelector(state, props);

      // assert
      expect(selected).toEqual(`/oauth/${moduleId}`);
    });

    it('should return null if not set', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const state = { auth: { ...initialState }, module: { ...initialStateForModule } };
      const props = { moduleId };
      state.auth.allIds.push(moduleId);
      state.auth.byId[moduleId] = { ...initialAuthState };
      state.module.allIds.push(moduleId);
      state.module.byId[moduleId] = { ...initialModuleState, id: moduleId };

      // act
      const selected = authUrlSelector(state, props);

      // assert
      expect(selected).toEqual(null);
    });
  });

  describe('requiresAuthSelector', () => {
    it('should return true for authed module', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const state = { auth: { ...initialState }, module: { ...initialStateForModule } };
      const props = { moduleId };
      state.auth.allIds.push(moduleId);
      state.auth.byId[moduleId] = { ...initialAuthState };
      state.module.allIds.push(moduleId);
      state.module.byId[moduleId] = { ...initialModuleState, authType: 'oauth', id: moduleId };

      // act
      const selected = requiresAuthSelector(state, props);

      // assert
      expect(selected).toEqual(true);
    });

    it('should return false for non-authed module', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const state = { auth: { ...initialState }, module: { ...initialStateForModule } };
      const props = { moduleId };
      state.auth.allIds.push(moduleId);
      state.auth.byId[moduleId] = { ...initialAuthState };
      state.module.allIds.push(moduleId);
      state.module.byId[moduleId] = { ...initialModuleState, id: moduleId };

      // act
      const selected = requiresAuthSelector(state, props);

      // assert
      expect(selected).toEqual(false);
    });
  });
});
