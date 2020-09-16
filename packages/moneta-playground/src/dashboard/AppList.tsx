import React, { useMemo, useState } from "react";

import AppItem from "./AppItem";
import ToggleSort from "./ToggleSort";

export enum SortOrder {
  ASC = "ASC",
  DSC = "DSC",
}

const AppList: React.FC<{ apps: App[] }> = (props) => {
  const [order, setOrder] = useState<SortOrder>(SortOrder.DSC);
  const apps = useMemo(() => {
    const direction = order === "ASC" ? -1 : 1;

    return props.apps
      .slice()
      .sort((a, b) => (b.modifiedAt - a.modifiedAt) * direction);
  }, [order, props.apps]);

  if (apps.length === 0) {
    return <p data-testid="empty">You have no apps!</p>;
  }

  return (
    <table data-testid="apps">
      <thead>
        <tr>
          <th>
            <ToggleSort order={order} onSort={setOrder} />
          </th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {apps.map((app) => (
          <AppItem key={app.id} app={app} />
        ))}
      </tbody>
    </table>
  );
};

export default AppList;
