import React from "react";

import CreateApp from "./CreateApp";
import AppList from "./AppList";
import { RouteComponentProps } from "react-router-dom";
import useWorkspace from "./useWorkspace";

type DashboardProps = RouteComponentProps<{ wId: string }>;

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { wId } = props.match.params;
  const { data, loading, error } = useWorkspace(wId);

  if (error) return <h2 data-testid="error">Oops, something went wrong!</h2>;
  if (loading || !data) return <p>Loading...</p>;

  const [folder] = data.workspace.folders ?? [{ apps: [] }];

  return (
    <div>
      <h1>Dashboard</h1>
      <CreateApp wId={wId} />
      <AppList apps={folder.apps} />
    </div>
  );
};

export default Dashboard;
