import { useQuery } from "../../hooks";
import Header from "../../components/header";
import React, { useState, useEffect, useContext, useCallback } from "react";
import TrailerspageHeader from "../../components/TrailerspageHeader/TrailerspageHeader";
import { Navbar } from "react-bootstrap";
import "./header.css";
import "../../assets/css/icons.min.css";
import LeftArrow from "../../assets/images/left-arrow.svg";
import { useMsal, useAccount } from "@azure/msal-react";
import { Link } from "react-router-dom";
import TrailersTab from "../../components/TrailersTab/TrailersTab";

const TrailersPage = (props) => {
  const { userclicked, parentcallback } = props;
  const { instance, accounts } = useMsal();

  const arrowClickHandler = (e) => {
    parentcallback(false);
  };

  const handelcallbackFromHeader = (childdata) => {
    setorderClicked(childdata);
  };

  const query = useQuery();
  

  return (
    <div id="wrapper">
      <Navbar expand="lg" variant="light" bg="light" className="navbar-custom">
        <div className="container-fluid">
          <div className="logo_logout_wrapper">
            <div className="logo-box df">
              <img
                className={
                  userclicked ? "back_icon" : "back_icon hide_left_icon"
                }
                onClick={(e) => arrowClickHandler(e)}
              />
              <p className="logo_font">
                <Link to="/planner">BULKMATIC TRANSPORT</Link>
              </p>
            </div>
            <div className="signoutsection">
              <button
                type="button"
                onClick={() => instance.logout()}
                className="btn_signout"
              >
                <i class="fa fa-sign-out log_out_icon"></i>Log Out
              </button>
            </div>
          </div>

          <div className="clearfix"></div>
        </div>
      </Navbar>
     <TrailerspageHeader />
     
      <div className="row adjustrow1">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body ">
              <div className="table-responsive">
              <TrailersTab/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailersPage;
