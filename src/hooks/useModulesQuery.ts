import { useRef } from 'react';
import { useQuery } from 'react-query';

import { fetchModules } from '../api';
import { generatePlaceholderModule } from '../placeholderData';
import useModuleStore from '../store/modules';
import { Module } from '../types';

function useModulesQuery() {
  const setModules = useModuleStore((state) => state.setModules);

  // React query
  // This needs to be a ref so that react query doesn't cause unnecessary re-renders
  const placeholderDataRef = useRef<Module[]>([...Array(10)].map(generatePlaceholderModule));

  return useQuery({
    queryKey: ['modules'],
    placeholderData: placeholderDataRef.current,
    queryFn: fetchModules,
    onSuccess: (modules) => {
      setModules(modules);
    },
  });
}

export default useModulesQuery;
