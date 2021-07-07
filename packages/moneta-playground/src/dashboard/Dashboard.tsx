import React from "react";
import Scrollbars from "react-custom-scrollbars";

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
    <>
      <h1>Dashboard</h1>
      <CreateApp wId={wId} />
      <Scrollbars style={{ height: "calc(100vh - 200px)" }}>
        <AppList apps={folder.apps} />
      </Scrollbars>
    </>
  );
};

export default Dashboard;
