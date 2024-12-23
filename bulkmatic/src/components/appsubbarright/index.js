import '../../assets/css/icons.min.css'
import '../../assets/css/app.min.css'
import list_icon from '../../assets/images/List_icon.svg'
import planning from '../../assets/images/planning blck.svg'
import notification from '../../assets/images/notification.svg'
import setting from '../../assets/images/setting.svg'
import chat from '../../assets/images/chat.svg'
import user_main from '../../assets/images/user_main.svg';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from "react-router";
import { ContextData } from "../../components/appsession";

function AppBar() {
  const [userData, setuserData] = useContext(ContextData);
  const history = useHistory();
  const [pageName, setpageName] = useState("")
  const [disabledUsers, setDisabledUsers] = useState(true)
  const [disabledPlanningProfile, setDisabledPlanningProfile] = useState(true)
  const [disabledRoles, setDisabledRoles] = useState(true)
  const [disabledTerminals, setDisabledTerminals] = useState(true)
  const [disabledDrivers, setDisabledDrivers] = useState(true)
  const [disabledTractors, setDisabledTractors] = useState(true)
  const [disabledTrailers, setDisabledTrailers] = useState(true)
  const [disabledLocations, setDisabledLocations] = useState(true)
  const [disabledCommodityGrs, setDisabledCommodityGrs] = useState(true)
  const [disabledLoadUnload, setDisabledLoadUnload] = useState(true)

  useEffect(() => {
    userData && userData?.roles && userData.roles[0]?.permissionAccess.map(el => {
      const check = el.isEdit == true || el.isView == true;
      const permission = el.permission;
      if (permission == "Users" && check) {
        setDisabledUsers(false);
      }
      // if( "PlanningProfile" ){
      //   setDisabledPlanningProfile(false);
      // } 
      if (permission == "Roles" && check) {
        setDisabledRoles(false)
      }
      if (permission == "Terminals" && check) {
        setDisabledTerminals(false)
      }
      if (permission == "Drivers" && check) {
        setDisabledDrivers(false)
      }
      if (permission == "Trailers" && check) {
        setDisabledTrailers(false)
      }
      if (permission == "Tractors" && check) {
        setDisabledTractors(false)
      }
      if (permission == "Commodity Groups" && check) {
        setDisabledCommodityGrs(false)
      }
      if (permission == "Loading/Unloading Durations" && check) {
        setDisabledLoadUnload(false)
      }
      if (permission == "Locations" && check) {
        setDisabledLocations(false)
      }
    })
  }, [userData])
  const goToUser = () => {
    history.push("/users")
  }
  const goToPlanningProfile = () => {
    history.push("/planningProfile")
  }
  const goToTerminal = () => {
    history.push("/terminals")
  }
  const goToRole = () => {
    history.push("/roles")
  }
  const goDrivers = () => {
    history.push("/drivers")
  }
  const goToTractors = () => {
    history.push("/tractors")
  }
  const goToTrailers = () => {
    history.push("/trailers")
  }
  const goToLocation = () => {
    history.push("/locations")
  }
  const goToCommodityGroup = () => {
    history.push("/commoditygroup")
  }
  const goToloadunloaddurations = () => {
    history.push("/loadunloaddurations")
  }
  useEffect(() => {
    let url = window.location.pathname
    setpageName(url)
  }, [])

  return (
    <div className="sidebar-main-menu">
      <div className="h-100">
        <div className="twocolumn-menu-item d-block">
          <div className="title-box">
            <h5 className="menu-title">Settings</h5>
            <ul className="nav flex-column">
              {disabledUsers == false &&
                <li className="nav-item cp">
                  <a className={pageName === "/users" ? "nav-link active" : "nav-link"} onClick={(e) => goToUser(e)}>
                    Users
                  </a>
                </li>
              }
              {disabledRoles == false &&
                <li className="nav-item cp">
                  <a className={pageName === "/planningProfile" ? "nav-link active" : "nav-link"} onClick={(e) => goToPlanningProfile(e)}>
                    Planning Profile
                  </a>
                </li>
              }
              {disabledRoles == false && <li className="nav-item cp">
                <a className={pageName === "/roles" ? "nav-link active" : "nav-link"} onClick={(e) => goToRole(e)}>
                  Roles and Permissions
                </a>
              </li>}
              {disabledTerminals == false &&
                <li className="nav-item cp">
                  <a className={pageName === "/terminals" ? "nav-link active" : "nav-link"} onClick={(e) => goToTerminal(e)}>
                    Terminals
                  </a>
                </li>
              }
              {disabledDrivers == false &&
                <li className="nav-item cp">
                  <a className={pageName === "/drivers" ? "nav-link active" : "nav-link"} onClick={(e) => goDrivers(e)}>
                    Drivers
                  </a>
                </li>
              }
              {disabledTractors == false &&
                <li className="nav-item cp">
                  <a className={pageName === "/tractors" ? "nav-link active" : "nav-link"} onClick={(e) => goToTractors(e)}>
                    Tractors
                  </a>
                </li>
              }
              {disabledTrailers == false &&

                <li className="nav-item cp">
                  <a className={pageName === "/trailers" ? "nav-link active" : "nav-link"} onClick={(e) => goToTrailers(e)}>
                    Trailers
                  </a>
                </li>
              }
              {disabledLocations == false &&

                <li className="nav-item cp">
                  <a className={pageName === "/locations" ? "nav-link active" : "nav-link"} onClick={(e) => goToLocation(e)}>
                    Locations
                  </a>
                </li>
              }
              {disabledCommodityGrs == false &&

                <li className="nav-item cp">
                  <a className={pageName === "/commoditygroup" ? "nav-link active" : "nav-link"} onClick={(e) => goToCommodityGroup(e)}>
                    Commodity Groups
                  </a>
                </li>
              }
              {disabledLoadUnload == false &&

                <li className="nav-item cp">
                  <a className={pageName === "/loadunloaddurations" ? "nav-link active" : "nav-link"} onClick={(e) => goToloadunloaddurations(e)}>
                    Loading/ Unloading Durations{" "}
                  </a>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppBar;
