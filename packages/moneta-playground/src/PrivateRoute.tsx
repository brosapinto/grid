import React, { useCallback } from "react";
import {
  Route,
  Redirect,
  useHistory,
  RouteProps,
  RouteComponentProps,
  Link,
} from "react-router-dom";
import client from "./client";

const TOKEN_KEY = "authToken";

const Header: React.FC = () => {
  const history = useHistory();
  const logOut = useCallback(() => {
    client.stop();
    client.resetStore();
    sessionStorage.removeItem(TOKEN_KEY);
    history.push("/");
  }, [history]);

  return (
    <header className="app-header">
      <h1>
        <Link to="/">Rows!</Link>
      </h1>
      <button onClick={logOut}>Sign Out</button>
    </header>
  );
};

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (sessionStorage.getItem(TOKEN_KEY)) {
          return (
            <>
              <Header />
              <main className="main-section">
                <Component {...props} />
              </main>
            </>
          );
        }

        return (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
