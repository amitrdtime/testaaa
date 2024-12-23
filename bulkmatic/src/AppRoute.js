import React, { Component, createContext, useEffect, useState } from "react";
import { Switch } from "react-router";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CommodityGroup from "./pages/commoditygroup";
import Drivers from "./pages/drivers";
import Home from "./pages/home";
import Profile from "./pages/Profile";
import PlanningProfile from "./pages/planningprofile";
import LoadUnloadDurations from "./pages/loaduploaddurations";
import Locations from "./pages/locations";
import Planner from "./pages/planner/planner";
import Roles from "./pages/roles";
import Terminals from "./pages/terminals";
import Tractors from "./pages/tractors";
import Trailers from "./pages/trailers";
import Users from "./pages/users";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import yardCheck from "./pages/yardCheck/yardCheck";
import TrailersPage from "./pages/TrailersPage/TrailersPage";
import alerts from "./pages/alerts/alert";
import tankWash from "./pages/tankWash/tankWash";


// import { useMsal, useAccount } from "@azure/msal-react";
// import { loginRequest } from "../src/authConfig";
// import { callMsGraph } from './appSession'
// import AppNoSession from "./pages/appsession";

const AppRoute = () => {
  return (
    <Router basename="/">
      <Switch>
        <Route exact={true} path="/" component={Home} />{" "}
        {/* Defaule Route - it will land to home page. */}
        <Route exact={true} path={"/users"} component={Home} />
        <Route
          path="/users/:id"
          render={({ match }) => <Home id={match.params.id} />}
        />
        <Route exact={true} path="/planningprofile" component={PlanningProfile} />
        <Route
          path="/planningprofile/:id"
          render={({ match }) => <PlanningProfile id={match.params.id} />}
        />
        <Route exact={true} path="/roles" component={Roles} />
        <Route
          path="/roles/:id"
          render={({ match }) => <Roles id={match.params.id} />}
        />
        <Route exact={true} path="/terminals" component={Terminals} />
        <Route
          path="/terminals/:id"
          render={({ match }) => <Terminals id={match.params.id} />}
        />
        <Route exact={true} path="/drivers" component={Drivers} />
        <Route
          path="/drivers/:id"
          render={({ match }) => <Drivers id={match.params.id} />}
        />
        <Route exact={true} path="/tractors" component={Tractors} />
        <Route
          path="/tractors/:id"
          render={({ match }) => <Tractors id={match.params.id} />}
        />
        <Route exact={true} path="/trailers" component={Trailers} />
        <Route
          path="/trailers/:id"
          render={({ match }) => <Trailers id={match.params.id} />}
        />
        <Route exact={true} path="/locations" component={Locations} />
        <Route
          path="/locations/:id"
          render={({ match }) => <Locations id={match.params.id} />}
        />
        <Route exact={true} path="/commoditygroup" component={CommodityGroup} />
        <Route
          path="/commoditygroup/:id"
          render={({ match }) => <CommodityGroup id={match.params.id} />}
        />
        <Route
          exact={true}
          path="/loadunloaddurations"
          component={LoadUnloadDurations}
        />
        <Route exact={true} path="/yardcheck" component={yardCheck} />
        <Route exact={true} path="/tankwash" component={tankWash} />
        <Route exact={true} path="/planner" component={Planner} />
        <Route
          path="/planner/:id"
          render={({ match }) => <Planner id={match.params.id} />}
        />
        <Route exact={true} path="/profile" component={Profile} />
        <Route exact={true} path="/alerts" component={alerts} />
        <Route
          exact={true}
          path="/orders"
          render={(props) => {
            return <OrdersPage {...props} />;
          }}
          
        />
         <Route
          exact={true}
          path="/TrailersPage"
          render={(props) => {
            return <TrailersPage {...props} />;
          }}
          
        />
      </Switch>
    </Router>
  );
};

export default AppRoute;
