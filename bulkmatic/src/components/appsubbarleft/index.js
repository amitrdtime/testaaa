import '../../assets/css/icons.min.css'
import '../../assets/css/app.min.css'
import list_icon from '../../assets/images/List_icon.svg'
import planning from '../../assets/images/planning blck.svg'
import notification from '../../assets/images/notification.svg'
import setting from '../../assets/images/setting.svg'
import chat from '../../assets/images/chat.svg'
import tankwash from "../../assets/images/tankwash_img.png"
import user_main from '../../assets/images/user_main.svg'
import React, { useState, useEffect, useContext, useRef } from "react";
import { ContextData } from "../../components/appsession";
import { useHistory } from "react-router";

function AppBar(props) {
  const [userData, setuserData] = useContext(ContextData);
  const { unreadCount }= props;
  const [yardCheckEnabled, setyardCheckEnabled] = useState(false)
  const [planningCheckEnabled, setplanningCheckEnabled] = useState(false)
  const [tankwashEnabled, settankwashEnabled] = useState(false)
  const history = useHistory();
  const [itemSelected, setitemSelected] = useState("")

  const goToYardCheck = () => {
    history.push("/yardcheck")
  }
  const goToPlannerBoard = () => {
    history.push("/planner");
  }
  const goToSetting = () => {
    history.push("/");
  }
  const goToAlerts = () => {
    history.push("/alerts")
  }
  const goToProfile = () => {
    history.push("/profile")
  }
  
  const goToTankWash = () => {
		history.push("/tankwash")
	}


  

  useEffect(() => {
    try {
      if (userData?.roles.length > 0) {
        let permissionList = userData?.roles[0].permissionAccess
        permissionList.forEach(permission => {
          if (permission.permission === "Yard Check") {
            if (permission.isView === true || permission.isEdit === true) {
              setyardCheckEnabled(true)
            }
          }
          if (permission.permission === "Tank Wash") {
            if (permission.isView === true || permission.isEdit === true) {
              settankwashEnabled(true)
            }
          }
          if (permission.permission === "Planning") {
            if (permission.isView === true || permission.isEdit === true) {
              setplanningCheckEnabled(true)
            }
          }
        })

      }
    }
    catch (err) {

    }

    setitemSelected(window.location.pathname)
  }, [userData])

  return (
    <div className="sidebar-icon-menu h-100" data-simplebar="">
      <nav className="nav flex-column">
        <div>
          {planningCheckEnabled ? (
            <a className={`nav-link cp ${itemSelected === "/planner" ? "svgactive" : ""}`} title="Planning Board">
              <img
                src={list_icon}
                className="svg_icon_size"
                onClick={() => goToPlannerBoard()}
              />
            </a>
          ) : (
            <></>
          )}

          {yardCheckEnabled ? (<a className={`nav-link cp ${itemSelected === "/yardcheck" ? "svgactive" : ""}`} title="Yard Check">
            <img
              src={planning}
              className="svg_icon_size"
              onClick={() => goToYardCheck()}
            />
          </a>) : (
            <></>
          )}
         
         {
            tankwashEnabled?(
              <a className={`nav-link cp ${itemSelected === "/tankwash" ? "svgactive" : ""}`} title="Tank Wash">
              <img
                src={tankwash}
                className="svg_icon_size"
                onClick={() => goToTankWash()}
              />
            </a>
            ):(
             ""
            )
           }
        </div>

        <div className="mt_100 side_bottom">
          <a className="nav-link" href="#dashboard" title="Dashboard">
            <img src={chat} className="svg_icon_size" />
          </a>
          <a className={`nav-link pr cp ${itemSelected === "/alerts" ? "svgactive" : ""}`} title="Alerts">
          <span class="badge alertsbadge badge-pill badge-danger">{unreadCount}</span>
            <img
              src={notification}
              className="svg_icon_size"
              onClick={() => goToAlerts()}
            />
          </a>
          <a className={`nav-link cp ${itemSelected === "/" ? "svgactive" : ""}`} title="Settings">
            <img
              src={setting}
              className="svg_icon_size"
              onClick={() => goToSetting()}
            />
          </a>
          <a className={`nav-link cp ${itemSelected === "/profile" ? "svgactive" : ""}`} title="Profile">
            <img
              src={user_main}
              className="svg_icon_size"
              onClick={goToProfile}
            />
          </a>
        </div>
      </nav>
    </div>
  );
}

export default AppBar;
