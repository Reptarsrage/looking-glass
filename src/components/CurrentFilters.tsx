import React from 'react';
import { useLocation } from 'react-router-dom';

import useAppParams from '../hooks/useAppParams';
import { Filter } from '../types';

export default function CurrentFilters() {
  const [appParams, setAppParams] = useAppParams();
  const location = useLocation();
  const stateFilters: Filter[] = location.state?.filters ?? []; // Filter details are stored in state

  function onClick(id: string) {
    const filters = appParams.filters.filter((filterId) => filterId !== id);
    setAppParams(
      {
        // Keep all other params, remove the filter
        filters,
      },
      {
        // Make sure we keep parity with the state
        state: {
          filters: stateFilters.filter((filter) => filter.id !== id),
        },
      }
    );
  }

  return (
    <div className="flex">
      {stateFilters.map((filter) => (
        <div key={filter.id} className="flex space-x-2 justify-center mx-1">
          <div>
            <button
              type="button"
              role="link"
              onClick={() => onClick(filter.id)}
              className="inline-block pl-6 pr-3 pt-2.5 pb-2 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex align-center"
            >
              {filter.name}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="ml-3"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
