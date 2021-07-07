import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import client, { ApolloProvider } from "./client";

import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import useUser from "./shared/useUser";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Editor = lazy(() => import("./editor/Editor"));

const DefaultWorkspace: React.FC = () => {
  const { data, loading, error } = useUser();

  if (error) return <h2>Oops, something went wrong!</h2>;
  if (loading || !data) return <p>Loading...</p>;

  const [defaultWorkspace] = data.user.workspaces;
  return <Redirect to={`/${defaultWorkspace.id}/dashboard`} />;
};

const NoMatch: React.FC = () => {
  return (
    <div>
      <h1>404</h1>
      <a href="/">Go home</a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path="/" exact component={Login} />
            <PrivateRoute path="/dashboard" component={DefaultWorkspace} />
            <PrivateRoute path="/:wId/dashboard" component={Dashboard} />
            <PrivateRoute path="/:wId/editor/:appId" component={Editor} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </Suspense>
      </Router>
    </ApolloProvider>
  );
};

export default App;
