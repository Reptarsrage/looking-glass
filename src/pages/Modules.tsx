import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { fetchModules } from '../api';
import useModuleStore from '../store/modules';

function Modules() {
  const setModules = useModuleStore((state) => state.setModules);

  // Fetch all sections at once
  // TODO: Placeholder data
  const { data, isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: fetchModules,
    onSuccess: (modules) => {
      setModules(modules);
    },
  });

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  // TODO: Add error
  // TODO: Add no results

  return (
    <ul>
      {data.map((module) => (
        <li key={module.id} className="border-b-2">
          <Link
            to={`/module/${module.id}`}
            className="flex p-2 gap-2 items-center cursor-pointer transition duration-150 hover:bg-slate-50 active:bg-slate-200"
          >
            <div className="rounded-full h-9 w-9 bg-slate-600 overflow-hidden flex">
              <img src={module.icon} alt={module.id} />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-semibold">{module.name}</span>
              <span>{module.description}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Modules;
