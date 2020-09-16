import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import isEqual from "lodash/isEqual";

import Input from "../shared/Input";
import ConfirmDelete from "../shared/ConfirmDelete";
import { dateFormat } from "../shared/utils";
import useDeleteApps from "./useDeleteApp";
import useUpdateApp from "./useUpdateApp";

const AppItem: React.FC<{ app: App }> = ({ app }) => {
  const [editing, setEditing] = useState(false);
  const [updateApp] = useUpdateApp();
  const [deleteApp, { loading: deleting }] = useDeleteApps(app.workspaceId);

  const handleRename = useCallback(
    (name) => {
      setEditing(false);
      updateApp({
        variables: { app: { workspaceId: app.workspaceId, id: app.id, name } },
      });
    },
    [updateApp, app.workspaceId, app.id]
  );

  const handleDelete = useCallback(
    () => deleteApp({ variables: { wId: app.workspaceId, ids: [app.id] } }),
    [deleteApp, app.workspaceId, app.id]
  );

  return (
    <tr>
      <td>
        <h3>
          {!editing && <Link to={`editor/${app.id}`}>{app.name}</Link>}
          {editing && (
            <Input
              defaultValue={app.name}
              onChange={handleRename}
              onBlur={() => setEditing(false)}
            />
          )}
        </h3>
      </td>
      <td>
        <small>Modified on the {dateFormat(app.modifiedAt)}</small>
      </td>
      <td>
        <button onClick={() => setEditing(true)} disabled={editing}>
          Rename
        </button>
        {!deleting && <ConfirmDelete onDelete={handleDelete} />}
        {deleting && <p>Deleting...</p>}
      </td>
    </tr>
  );
};

export default React.memo(AppItem, isEqual);
