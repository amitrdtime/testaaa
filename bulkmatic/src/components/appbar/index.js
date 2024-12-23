import '../../assets/css/bootstrap.min.css'
import '../../assets/css/app.min.css'
import '../../assets/css/responsive.css'
import AppSubBarLeft from '../appsubbarleft'
import AppSubBarRight from '../appsubbarright'
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router";

function AppBar(props) {
        
  const { unreadCount }= props;
  const history = useHistory();
  const [itemSelected, setitemSelected] = useState("");

  
  useEffect(() => {

    setitemSelected(window.location.pathname)

  }, [])
 
  
 
  return (
    <div className="left-side-menu">
      <div className="h-100">
        <div className="sidebar-content">
          {
            // props.hamburgerMenuClicked?
            // <AppSubBarLeft unreadCount={unreadCount}></AppSubBarLeft>
            // :""
            window.screen.availWidth> 768?
            <AppSubBarLeft unreadCount={unreadCount}></AppSubBarLeft>
            :
            props.hamburgerMenuClicked?
            <AppSubBarLeft unreadCount={unreadCount}></AppSubBarLeft>
            :""
          }
         
          {
            itemSelected === "/yardcheck" || itemSelected === "/planner" ?
              null :
              <AppSubBarRight></AppSubBarRight>

          }

          <div className="clearfix"></div>
        </div>
      </div>
    </div>
  );
}

export default AppBar;
