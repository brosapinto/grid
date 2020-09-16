import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { post } from "./request";

function Login() {
  const [token, setToken] = useState(() => sessionStorage.getItem("authToken"));

  if (token) {
    return <Redirect from="/login" to="/dashboard" />;
  }

  const signIn = (evt) => {
    evt.preventDefault();
    const email = evt.target.email.value;
    const password = evt.target.password.value;

    post("/login", { email, password })
      .then(({ session }) => {
        console.log("session", session);
        sessionStorage.setItem("authToken", session);
        setToken(session);
      })
      .catch((err) => sessionStorage.removeItem("authToken"));
  };

  return (
    <form onSubmit={signIn}>
      <p>
        <label htmlFor="email">Email: </label>
        <input id="email" />
      </p>
      <p>
        <label htmlFor="password">Password: </label>
        <input id="password" type="password" />
      </p>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default Login;
