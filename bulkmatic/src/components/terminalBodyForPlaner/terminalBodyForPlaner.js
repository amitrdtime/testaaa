import React, { useState, useEffect } from "react";
import SearchFilter from "../../assets/images/search_filter.svg";
import Search from "../../assets/images/Search-Button.svg";
import Addicon from "../../assets/images/add_icon.svg";
import PlannerService from "../../services/plannerService.";
import TerminalTrailerList from "../terminalTrailerList";
import UserService from "../../services/userService";
import Spinner from "react-bootstrap/Spinner";
import { Tooltip } from "@material-ui/core";

const TerminalBodyForPlaner = (props) => {
  const { terminal } = props;
  const [allPlanners, setallPlanners] = useState([]);
  const [searchData, setSearchData] = useState("");
  console.log("allPlanners",allPlanners)

  useEffect(() => {
    const userService = new UserService();
    userService
      .getPlannersByTerminal(terminal.id.toString(), searchData)
      .then(function (users) {
        
        setallPlanners(users);
        props.parentCallBackForPlanners(users);
      });
  }, [searchData]);

  const SearchPlanners = (e) => {
    setSearchData(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      SearchPlannersByButton();
    }
  };
  const SearchPlannersByButton = async (e) => {
    const userService = new UserService();
    userService
      .getPlannersByTerminal(terminal.id.toString(), searchData)
      .then(function (users) {
        
        setallPlanners(users);
        props.parentCallBackForPlanners(users);
      })
      .catch(function (err) {
        
      });
  };

  return (
    <div className="col-xl-6">
      <div className="card card_shadow">
        <div className="card-body special_card_padding">
          <h2 className="header-title">Planners</h2>
          <div className="search_area">
            <div className="search_left">
              {/* <img src={SearchFilter} className="search_filter_icon" /> */}
            </div>
            {/* <div className="search_middle">
                            <input type="text" placeholder="Search Planners" 
                            id="plannersByTerminalId"
                           className="special_searchbox" onChange={SearchPlanners} />
                        </div> */}
            <div className="search_middle">
              <input
                type="text"
                placeholder="Search Planners"
                id="plannersByTerminalId"
                className="special_searchbox"
                onChange={SearchPlanners}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="search_right">
              <img
                src={Search}
                onClick={SearchPlannersByButton}
                className="search_button_icon"
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped mb-0 table_scroll">
              <thead className="other_table_header">
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  {/* <th>Phone</th>
                  <th>E-mail</th> */}
                  <th></th>
                  <th></th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              {allPlanners !== null ? (
                allPlanners.length ? (
                  <tbody>
                    {allPlanners.map((planner, index) => (
                      <tr id={index}>
                        <td>{planner.userName}</td>
                        <td>{planner.roles[0]?.roleName}</td>
                        {/* <td>{planner.Phone}</td>
                        <td>{planner.Email}</td> */}
                        
                        <td></td>
                        <td></td>
                        <td className="text-center">
                          <div className="profile_top_right">
                          <Tooltip title={planner.isAdministrator ? "Active" : "In-active"}>
                          <div
                          className={
                            planner.isAdministrator ? "online_sign" : "offline_sign"
                          }
                        ></div>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <div className="loader_wrapper">
                      <Spinner animation="border" variant="primary" />
                    </div>
                )
              ) : (
                ""
              )}
              {/* <tbody>
                            

                                <tr>
                                    <th className="w-50"></th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="table_checkbox_allignment"> <div className="round">
                                        <input type="checkbox" id="checkbox4" />
                                        <label for="checkbox4"></label>
                                    </div></td>
                                </tr>
                                <tr>
                                    <th className="w-50"></th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="table_checkbox_allignment"> <div className="round">
                                        <input type="checkbox" id="checkbox4" />
                                        <label for="checkbox4"></label>
                                    </div></td>
                                </tr>
                                <tr>
                                    <th className="w-50"></th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="table_checkbox_allignment"> <div className="round">
                                        <input type="checkbox" id="checkbox4" />
                                        <label for="checkbox4"></label>
                                    </div></td>
                                </tr>
                                <tr>
                                    <th className="w-50"></th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="table_checkbox_allignment"> <div className="round">
                                        <input type="checkbox" id="checkbox4" />
                                        <label for="checkbox4"></label>
                                    </div></td>
                                </tr>
                                <tr>
                                    <th className="w-50"></th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="table_checkbox_allignment"> <div className="round">
                                        <input type="checkbox" id="checkbox4" />
                                        <label for="checkbox4"></label>
                                    </div></td>
                                </tr>

                            </tbody> */}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalBodyForPlaner;
