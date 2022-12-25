import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import useModuleStore from '../store/modules';

function useModule() {
  const { moduleId } = useParams();
  invariant(moduleId, 'Module ID is required');

  const module = useModuleStore((state) => state.modulesById[moduleId]);
  invariant(module, 'Module not found');

  return module;
}

export default useModule;
