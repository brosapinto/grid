import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { createTree } from "../shared/tree-node";

interface HierarchyProps {
  wId: string;
  appId: string;
  hierarchy: Hierarchy[];
}

const Hierarchy: React.FC<HierarchyProps> = (props) => {
  const { wId, appId, hierarchy } = props;
  const tree = useMemo(() => createTree(hierarchy), [hierarchy]);

  return (
    <ul>
      {tree.map(({ data: group, children }) => {
        const url = `/${wId}/editor/${appId}/${group.id}`;

        return (
          <li key={group.id}>
            <details open>
              <summary>
                <NavLink to={url}>{group.name}</NavLink>
              </summary>
              <ul>
                {children.map(({ data: view }) => (
                  <li key={view.id}>
                    <NavLink to={`${url}#${view.id}`}>{view.name}</NavLink>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        );
      })}
    </ul>
  );
};

export default React.memo(Hierarchy);
