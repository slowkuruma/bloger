import React, { useState, useCallback, UseEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Users from "./user/pages/Users";
import NewBlog from "./blogs/pages/NewBlog";
import UserBlogs from "./blogs/pages/UserBlogs";
import UpdateBlog from "./blogs/pages/UpdateBlog";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { login } from "../controllers/users-contollers";

const App = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    localStorage.setItem(
      "userdata",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);



  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData && storedData.token && new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Swtich>

        <Route path="/" exact>
          <Users />
        </Route>

        <Ruote path="/:userId/blogs" exact>
          <UserBlogs />
        </Ruote>

        <Route path="/blogs/new" exact>
          <NewBlog />
        </Route>

        <Route path="/blogs/:blogid">
          <UpdateBlog />
        </Route>

        <Redirect to="/" />
      </Swtich>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};


export default App;
