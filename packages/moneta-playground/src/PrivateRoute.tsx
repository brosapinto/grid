import React, { useCallback } from "react";
import {
  Route,
  Redirect,
  useHistory,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";
import client from "./client";

const TOKEN_KEY = "authToken";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const history = useHistory();

  const logOut = useCallback(() => {
    client.stop();
    client.resetStore();
    sessionStorage.removeItem(TOKEN_KEY);
    history.push("/");
  }, [history]);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (sessionStorage.getItem(TOKEN_KEY)) {
          return (
            <>
              <button onClick={logOut}>Sign Out</button>
              <Component {...props} />
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
