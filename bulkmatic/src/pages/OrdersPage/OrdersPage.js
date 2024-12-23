import { useQuery } from "../../hooks";
import Header from "../../components/header";
import React from "react";
import OrderHeader from "../../components/orderHeader/orderHeader";

import { Navbar } from "react-bootstrap";
import { useMsal } from "@azure/msal-react";
import { Link } from "react-router-dom";
import OrdersTab from "../../components/ordersTab/ordersTab";
import "./header.css";
import "../../assets/css/icons.min.css";

const OrdersPage = (props) => {
  const { userclicked, parentcallback } = props;
  const { instance } = useMsal();
  const query = useQuery();
  const orderDate = query.get("date");
  const arrowClickHandler = (e) => {
    parentcallback(false);
  };

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

      <OrderHeader />
      <div className="row adjustrow1">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body ">
              <div className="table-responsive">
                <OrdersTab orderDate={orderDate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
