import { initialState as galleryInitialState, initialGalleryState } from '../../reducers/galleryReducer';
import { initialState, initialSortState } from '../../reducers/sortReducer';
import { initialState as moduleInitialState, initialModuleState } from '../../reducers/moduleReducer';
import { valuesSelector, valueByIdSelector, moduleValuesSelector, defaultSortValueSelector } from '../sortSelectors';

describe('Sort Selectors', () => {
  describe('valuesSelector', () => {
    it('should return sort values', () => {
      // arrange
      const allIds = ['1', '2', '3'];
      const state = { sort: { ...initialState, allIds } };

      // act
      const selected = valuesSelector(state);

      // assert
      expect(selected).toEqual(allIds);
    });

    it('should default to initialState', () => {
      expect(valuesSelector({})).toEqual(initialState.allIds);
    });
  });

  describe('valueByIdSelector', () => {
    it('should return sort value', () => {
      // arrange
      const valueId = 'EXPECTED VALUE ID';
      const moduleId = 'EXPECTED MODULE ID';
      const searchGalleryId = ' EXPECTED SEARCH GALLERY ID';
      const state = {
        gallery: {
          ...galleryInitialState,
          allIds: [searchGalleryId],
          byId: {
            [searchGalleryId]: {
              ...initialGalleryState,
              searchQuery: null,
              id: searchGalleryId,
            },
          },
        },
        sort: {
          ...initialState,
          allIds: [valueId],
          byId: {
            [valueId]: {
              ...initialSortState,
              id: valueId,
            },
          },
        },
        module: {
          ...moduleInitialState,
          allIds: [moduleId],
          byId: {
            [moduleId]: {
              ...initialModuleState,
              searchGalleryId,
            },
          },
        },
      };

      // act
      const selected = valueByIdSelector(state, { valueId, moduleId });

      // assert
      expect(selected.id).toEqual(valueId);
    });

    it('should return nested sort values when not searching', () => {
      // arrange
      const valueId = 'EXPECTED VALUE ID';
      const moduleId = 'EXPECTED MODULE ID';
      const searchGalleryId = ' EXPECTED SEARCH GALLERY ID';
      const nestedValues = [...Array(3).keys()].map(id => (id + 33).toString());
      const state = {
        gallery: {
          ...galleryInitialState,
          allIds: [searchGalleryId],
          byId: {
            [searchGalleryId]: {
              ...initialGalleryState,
              searchQuery: null,
              id: searchGalleryId,
            },
          },
        },

        sort: {
          ...initialState,
          allIds: [...nestedValues, valueId],
          byId: nestedValues.reduce(
            (byId, id) => {
              byId[id] = { ...initialSortState, id, exclusiveToSearch: id !== nestedValues[0] };
              return byId;
            },
            {
              [valueId]: {
                ...initialSortState,
                values: nestedValues,
                id: valueId,
              },
            }
          ),
        },
        module: {
          ...moduleInitialState,
          allIds: [moduleId],
          byId: {
            [moduleId]: {
              ...initialModuleState,
              searchGalleryId,
            },
          },
        },
      };

      // act
      const selected = valueByIdSelector(state, { valueId, moduleId });

      // assert
      expect(selected.id).toEqual(valueId);
      expect(selected.values).toEqual([nestedValues[0]]);
    });

    it('should return different nested sort values when searching', () => {
      // arrange
      const valueId = 'EXPECTED VALUE ID';
      const moduleId = 'EXPECTED MODULE ID';
      const searchGalleryId = ' EXPECTED SEARCH GALLERY ID';
      const nestedValues = [...Array(3).keys()].map(id => (id + 33).toString());
      const state = {
        gallery: {
          ...galleryInitialState,
          allIds: [searchGalleryId],
          byId: {
            [searchGalleryId]: {
              ...initialGalleryState,
              searchQuery: 'SOME SEARCH QUERY',
              id: searchGalleryId,
            },
          },
        },

        sort: {
          ...initialState,
          allIds: [...nestedValues, valueId],
          byId: nestedValues.reduce(
            (byId, id) => {
              byId[id] = { ...initialSortState, id, availableInSearch: id === nestedValues[0] };
              return byId;
            },
            {
              [valueId]: {
                ...initialSortState,
                values: nestedValues,
                availableInSearch: true,
                id: valueId,
              },
            }
          ),
        },
        module: {
          ...moduleInitialState,
          allIds: [moduleId],
          byId: {
            [moduleId]: {
              ...initialModuleState,
              searchGalleryId,
            },
          },
        },
      };

      // act
      const selected = valueByIdSelector(state, { valueId, moduleId });

      // assert
      expect(selected.id).toEqual(valueId);
      expect(selected.values).toEqual([nestedValues[0]]);
    });

    it('should default to initialState', () => {
      expect(valueByIdSelector({}, { valueId: 'NOT EXPECTED' })).toEqual(initialSortState);
    });
  });

  describe('moduleValuesSelector', () => {
    it('should return sort values', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const sortBy = [...Array(3).keys()].map(id => (id + 33).toString());
      const state = {
        sort: {
          ...initialState,
          allIds: [...sortBy],
          byId: sortBy.reduce((byId, id) => {
            byId[id] = { ...initialSortState, id };
            return byId;
          }, {}),
        },
        module: {
          ...moduleInitialState,
          allIds: [moduleId],
          byId: {
            [moduleId]: {
              ...initialModuleState,
              sortBy,
            },
          },
        },
      };

      // act
      const selected = moduleValuesSelector(state, { moduleId });

      // assert
      expect(selected).toEqual(sortBy);
    });

    it('should return different sort values when searching', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const searchGalleryId = ' EXPECTED SEARCH GALLERY ID';
      const sortBy = [...Array(3).keys()].map(id => (id + 33).toString());
      const state = {
        gallery: {
          ...galleryInitialState,
          allIds: [searchGalleryId],
          byId: {
            [searchGalleryId]: {
              ...initialGalleryState,
              searchQuery: 'SOME SEARCH QUERY',
              id: searchGalleryId,
            },
          },
        },

        sort: {
          ...initialState,
          allIds: [...sortBy],
          byId: sortBy.reduce((byId, id) => {
            byId[id] = { ...initialSortState, id, availableInSearch: id === sortBy[0] };
            return byId;
          }, {}),
        },
        module: {
          ...moduleInitialState,
          allIds: [moduleId],
          byId: {
            [moduleId]: {
              ...initialModuleState,
              sortBy,
              searchGalleryId,
            },
          },
        },
      };

      // act
      const selected = moduleValuesSelector(state, { moduleId });

      // assert
      expect(selected).toEqual([sortBy[0]]);
    });
  });

  describe('defaultSortValueSelector', () => {
    it('should return default sort value', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const sortBy = [...Array(3).keys()].map(id => (id + 33).toString());
      const state = {
        sort: {
          ...initialState,
          allIds: [...sortBy],
          byId: sortBy.reduce((byId, id) => {
            byId[id] = { ...initialSortState, id, default: id === sortBy[0] };
            return byId;
          }, {}),
        },
        module: {
          ...moduleInitialState,
          allIds: [moduleId],
          byId: {
            [moduleId]: {
              ...initialModuleState,
              sortBy,
            },
          },
        },
      };

      // act
      const selected = defaultSortValueSelector(state, { moduleId });

      // assert
      expect(selected).toEqual(sortBy[0]);
    });

    it('should return different default sort value when searching', () => {
      // arrange
      const moduleId = 'EXPECTED MODULE ID';
      const searchGalleryId = ' EXPECTED SEARCH GALLERY ID';
      const sortBy = [...Array(6).keys()].map(id => (id + 33).toString());
      const state = {
        gallery: {
          ...galleryInitialState,
          allIds: [searchGalleryId],
          byId: {
            [searchGalleryId]: {
              ...initialGalleryState,
              searchQuery: 'SOME SEARCH QUERY',
              id: searchGalleryId,
            },
          },
        },

        sort: {
          ...initialState,
          allIds: [...sortBy],
          byId: sortBy.reduce((byId, id) => {
            byId[id] = {
              ...initialSortState,
              id,
              availableInSearch: id <= sortBy[2],
              default: id === sortBy[0] || id === sortBy[3],
            };
            return byId;
          }, {}),
        },
        module: {
          ...moduleInitialState,
          allIds: [moduleId],
          byId: {
            [moduleId]: {
              ...initialModuleState,
              sortBy,
              searchGalleryId,
            },
          },
        },
      };

      // act
      const selected = defaultSortValueSelector(state, { moduleId });

      // assert
      expect(selected).toEqual(sortBy[0]);
    });
  });
});
