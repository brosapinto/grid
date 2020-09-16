import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import Hierarchy from "./Hierarchy";
import Page from "./Page";
import useApp from "./useApp";
import Viewport from "./Viewport";

type EditorProps = RouteComponentProps<{ wId: string; appId: string }>;

const Editor: React.FC<EditorProps> = ({ match }) => {
  const { wId, appId } = match.params;
  const { data, error, loading } = useApp(wId, appId);

  if (error) return <h2>Oops, something went wrong!</h2>;
  if (loading || !data) return <p>Loading...</p>;

  return (
    <div className="editor">
      <nav>
        <header>
          <h1>{data.app.name}</h1>
        </header>
        <Hierarchy
          wId={wId}
          appId={data.app.id}
          hierarchy={data.app.hierarchy}
        />
      </nav>
      <Viewport>
        <Switch>
          <Route path="/:wId/editor/:appId/:groupId" component={Page} />
        </Switch>
      </Viewport>
    </div>
  );
};

export default Editor;
