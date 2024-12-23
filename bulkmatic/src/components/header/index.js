import { Container, Navbar } from "react-bootstrap";
import './header.css';
import '../../assets/css/icons.min.css';
import LeftArrow from "../../assets/images/left-arrow.svg"
import { useMsal, useAccount } from "@azure/msal-react";
import React, { useState, useEffect } from 'react';



function Header(props) {
    const { userclicked, parentcallback } = props
    const { instance, accounts } = useMsal();
    const [hamburgerMenuToggle, sethamburgerMenuToggle] = useState(false)
    const arrowClickHandler = (e) => {
        parentcallback(false)

    }
    const hamburgerMenuClick=(e)=>{
 
        sethamburgerMenuToggle(!hamburgerMenuToggle) 
        props.sethamburgerMenuToggle(!hamburgerMenuToggle)
    }

    return (
        <Navbar expand="lg" variant="light" bg="light" className="navbar-custom">
            <div className="container-fluid">
                <div className="logo_logout_wrapper">
                    <i class="fa fa-bars yard_ham" aria-hidden="true" onClick={(e)=>hamburgerMenuClick(e) }></i>
                    <div className="logo-box df">
                        <img src={LeftArrow} className={userclicked ? "back_icon" : "back_icon hide_left_icon"} onClick={(e) => arrowClickHandler(e)} />
                        <p className="logo_font">BULKMATIC TRANSPORT</p>
                    </div>
                    <div className="signoutsection">
                        <button type="button" onClick={() => instance.logout()} className="btn_signout"><i className="fa fa-sign-out log_out_icon"></i>Log Out</button>
                    </div>
                </div>

                <div className="clearfix"></div>
            </div>
        </Navbar>
    );
}

export default Header;