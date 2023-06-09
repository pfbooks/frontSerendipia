import React, { useState, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import AdminBar from "./components/AdminBar/AdminBar";
import Home from "./components/Home/Home";
import Detail from "./components/Detail/Detail";
import Register from "./components/Form/Register";
import LoginForm from "./components/Login/LoginForm";
import Profile from "./components/Profile/Profile";
import Chart from "./components/Chart/Chart";
import NotFound from "./components/NotFound/NotFound";
import Success from "./components/Payment/Success";
import BooksTable from "./components/BooksTable/BooksTable";
import About from "./components/AboutUs/About";
import UsersTable from "./components/UsersTable/UsersTable";
import OrdersTable from "./components/OrdersTable/OrdersTable";
import { useSelector } from "react-redux";
import ReviewForm from "./components/Reviews/ReviewForm";
import ShopList from "./components/ShopList/ShopList";
import { useLocation } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "https://pfbooks-back-production.up.railway.app";

function PrivateRoute({ component: Component, admin, ...rest }) {
  const userLocalStorage = JSON.parse(localStorage.getItem("user"));

  return (
    <Route
      {...rest}
      render={(props) =>
        admin || userLocalStorage ? (
          <Component {...props} />
        ) : (
          <Redirect to="/not-found" />
        )
      }
    />
  );
}

function App() {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const userLocalStorage = JSON.parse(localStorage.getItem("user"));

  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (user || userLocalStorage) {
      const isAdmin = user?.adminRole || userLocalStorage?.adminRole;
      setAdmin(isAdmin);
    } else {
      setAdmin(false);
    }
  }, [user, userLocalStorage]);

  return (
    <div>
      <NavBar />
      {admin &&
        (location.pathname.includes("profile") ||
          location.pathname.includes("/users") ||
          location.pathname.includes("/books") ||
          location.pathname.includes("/orders")) && <AdminBar />}
      <Switch>
        <PrivateRoute path="/users" component={UsersTable} admin={admin} />
        <PrivateRoute path="/books" component={BooksTable} admin={admin} />
        <PrivateRoute path="/orders" component={OrdersTable} admin={admin} />
        <Route exact path="/" component={Home} />
        <Route path="/shop/:userId" component={ShopList} />
        <Route path="/detail/:id" component={Detail} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={LoginForm} />
        <Route path="/profile" component={Profile} />
        <Route path="/chart" component={Chart} />
        <Route path="/success" component={Success} />
        <Route path="/about" component={About} />
        <Route path="/addReview/:bookId" component={ReviewForm} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;