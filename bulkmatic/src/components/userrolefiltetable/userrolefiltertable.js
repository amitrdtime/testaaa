import React, { useState, useEffect, useContext } from 'react';
import searchFilter from "../../assets/images/search_filter.svg";
import searchButton from "../../assets/images/Search-Button.svg";
import RoleService from '../../services/roleService';
import UserService from '../../services/userService';
import Spinner from "react-bootstrap/Spinner";
import config from "../../Config.json"

import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";

const Userrolefiltertable = (props) => {
    const { user, accessDisabled, userInfo } = props
    const [allRole, setallRole] = useState([]);
    const [allActiveRole, setActiveallRole] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [btnSearchText, setBtnSearch] = useState('');
    const [userRadioCheck, setUserCheck] = useState([]);
    const [userData, setuserData] = useState({});
    const [isDataLoaded, setisDataLoaded] = useState(false)
    const [isDisabled, setIsDisabled] = useState(null)
    useEffect(async () => {
        const roleService = new RoleService();
        const allrole = await roleService.filterRoles(btnSearchText);
        setallRole(allrole)
    }, [btnSearchText]);
    useEffect(async () => {
        if (Object.keys(user).length > 0) {
            setuserData(user)
            const roleService = new RoleService();
            const allrole = await roleService.getAllRole();
            const activerole = allrole.filter(actv => actv.isActive === true);
            setActiveallRole(activerole);
            //setallRole(allrole);
            setisDataLoaded(true)
        }
        
    }, [Object.keys(user).length]);

    const captureChangeData = function (evt) {
        setBtnSearch(evt.target.value);
    }
    // const searchUserRole = function () {
    //     setBtnSearch(searchText);

    // }
    const searchUserRole = async () => {
        const roleService = new RoleService();
        try {
            const allrole = await roleService.getAllRole(btnSearchText);
            if (allrole.length > 0) {
                setallRole(allrole)
            }
        }
        catch (error) {
            NotificationManager.error(error, "Error");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchUserRole()
        }
    }

    const handleChangeRole = (event) => {

        
        const roleId = event.target.id.split("_")[1];
        setUserCheck(roleId);
    }

    const updateUserData = async (event) => {

        
        const userService = new UserService()
        userData.roles = [userRadioCheck];
        const updateuserResponse = await userService.updateUser(userData);
        

        if (updateuserResponse) {
            setuserData(updateuserResponse)
            NotificationManager.success("Assigned role updated successfully", "Success");
        }
    }
   

    useEffect(()=>{
        if(userInfo?.Email == config.adminUsers){
            setIsDisabled(false)
        } else if(userInfo?.Email != config.adminUsers){
            if(user?.Email == config.adminUsers){
                setIsDisabled(true)
            } else if(user?.Email != config.adminUsers){
                 setIsDisabled(false)
            }
        }

    },[userInfo,user,config])
     
    return (
        <>
            
            <div className="col-xl-4">
                <div className="card card_shadow">
                    <div className="card-body special_card_padding">
                        <div className="access_header">
                            <h2 className="header-title">Roles</h2>
                            <button 
                                type="button" 
                                className="btn_blue_sm btn-blue ml_10 access_save" 
                                onClick={(e) => updateUserData(e)} 
                                disabled={accessDisabled ? true : false} 
                                style={{background : accessDisabled ? "#dddddd": ""}}
                            >
                                    SAVE
                            </button>
                        </div>
                        
                        <div className="table-responsive Assigned_Roles_scroll">
                            <table className="table table-striped mb-0">
                                {
                                isDataLoaded ?
                                    <tbody>
                                        <tr>
                                            <th className="w-81" scope="row">Role Name</th>
                                            <td></td>
                                        </tr>
                                            <>
                                                {allActiveRole.map((item, i) => (
                                                    <tr key={i}>
                                                        <th id={item.roleId} scope="row" key={i}>{item.roleName}</th>
                                                        <td>

                                                            <div className="round" onChange={handleChangeRole}>
                                                                {accessDisabled ? 
                                                                <>
                                                                    <input 
                                                                        name="roleradio" 
                                                                        id={"role_" + item.roleId} 
                                                                        type="radio" 
                                                                        defaultChecked={userData.roles.find(it => (it.roleId === item.roleId)) !== undefined} 
                                                                        disabled={true}
                                                                        style={{ cursor: "not-allowed" }}
                                                                    />
                                                                    <label name="roleradio"/>
                                                                </>
                                                                : 
                                                                <>
                                                                    <input 
                                                                        name="roleradio" 
                                                                        id={"role_" + item.roleId} 
                                                                        type="radio" 
                                                                        defaultChecked={userData.roles.find(it => (it.roleId === item.roleId)) !== undefined} 
                                                                        disabled={isDisabled}
                                                                        style={{ border: isDisabled ? "1px solid #dddddd" : "" }}
                                                                    />
                                                                    <label name="roleradio" htmlFor={"role_" + item.roleId}/>
                                                                </>
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                </tbody>
                                    : <div className="loader_wrapper">
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                }
                            </table>
                            <NotificationContainer />
                        </div>


                    </div>

                </div>

            </div>

        </>
    )
}

export default Userrolefiltertable
