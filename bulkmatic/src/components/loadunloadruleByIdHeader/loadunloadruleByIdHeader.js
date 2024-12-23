import React, { useState, useEffect } from "react";
import User from "../../assets/images/users/user-2.jpg";
import { Tooltip } from "@material-ui/core";

function LoadunloadruleByIdHeader(props) {
  const cg = props;
  const allLocation = props;
  

  const searchInputHandler = (e) => {
    setsearchData(e.target.value);
  };

  const searchHandler = (e) => {
    props.parentCallBackForLocationFilter(filterData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  const [tabSelected, settabSelected] = useState({
    default: true,
    location: false,
    commoditygroup: false,
    commodity: false,
  });

  const tabClickHandler = (e, tabname) => {
    if (tabname === "default") {
      settabSelected({
        default: true,
        location: false,
        commoditygroup: false,
        commodity: false,
      });
    }
    if (tabname === "location") {
      settabSelected({
        default: false,
        location: true,
        commoditygroup: false,
        commodity: false,
      });
    }
    if (tabname === "commoditygroup") {
      settabSelected({
        default: false,
        location: false,
        commoditygroup: true,
        commodity: false,
      });
    }
    if (tabname === "commodity") {
      settabSelected({
        default: false,
        location: false,
        commoditygroup: false,
        commodity: true,
      });
    }

    props.parentcallback(tabname);
  };

  return (
    <div className="row df mt_30">
      <div className="tabs">
        <input
          type="radio"
          name="tabs"
          id="tab2"
          defaultChecked={tabSelected.default}
          onClick={(e) => tabClickHandler(e, "default")}
        />
        <label for="tab2">Default</label>
        <div className="tab">
          <div className="profile_bottom">
            <div>
              <div className="profile_bottom_drescription">
                <p className="profile_bottom_drescription_heading">
                  Default items
                </p>
              </div>
              <div
                className="input-group"
                style={{
                  width: "150%",
                }}
              >
                <input
                  type="search"
                  className="form-control place_back"
                  placeholder="Search Default..."
                  id="top-search"
                  style={{ zIndex: "1" }}
                  onChange={(e) => searchInputHandler(e)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="btn input-group-text search_btn"
                  type="submit"
                  onClick={(e) => searchHandler(e)}
                >
                  <i
                    className="fa fa-search f_color_white"
                    aria-hidden="true"
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <input
          type="radio"
          name="tabs"
          id="tab3"
          checked={tabSelected.location}
          onClick={(e) => tabClickHandler(e, "location")}
        />
        <label for="tab3">By Location</label>
        <div className="tab">
          <div className="profile_top" style={{ "padding-left": "0" }}>
            <div className="profile_top_left">
              <div>
                <p className="profile_top_left_text">{cg.commoditygroup}</p>
                <p className="profile_bottom_left_text"></p>
              </div>
            </div>
            <div className="profile_top_right">
            </div>
          </div>
          <div className="profile_bottom">
            <div className="profile_bottom_drescription">
              <p className="profile_bottom_drescription_heading">
                Load/ Unload Time
              </p>
              <p className="profile_bottom__heading_drescription">
                <span>Default Load : 120 Minutes</span>
                <span></span>
              </p>
              <p className="profile_bottom__heading_drescription">
                <span>Default Unload: 120 Minutes</span>
                <span></span>
              </p>
            </div>
          
            <div className="profile_top_right">
              <div className="online_sign"></div>
            </div>
            </div>
          </div> */}
      </div>
    </div>
  );
}

export default LoadunloadruleByIdHeader;
