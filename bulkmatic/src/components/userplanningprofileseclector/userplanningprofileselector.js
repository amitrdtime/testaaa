import React, { useState, useEffect, useContext } from 'react';
import searchFilter from "../../assets/images/search_filter.svg";
import searchButton from "../../assets/images/Search-Button.svg";
import RoleService from '../../services/roleService';
import UserService from '../../services/userService';
import ProgressBar from "react-bootstrap/ProgressBar";
import { ContextData } from "../../components/appsession";
import config from "../../Config.json"
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Spinner from "react-bootstrap/Spinner";

const UserPlanningFiltertable = (props) => {
  // const [userData, setuserData] = useContext(ContextData);
  const { user, accessDisabled, userInfo, updateUser } = props
  const [allRole, setallRole] = useState([]);
  const [allActiveRole, setActiveallRole] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [btnSearchText, setBtnSearch] = useState('');
  const [userRadioCheck, setUserCheck] = useState([]);
  const [userData, setuserData] = useState({});
  const [isDataLoaded, setisDataLoaded] = useState(false)
  const [isDisabled, setIsDisabled] = useState(null)
  const [planningProfile, setPlanningProfile] = useState([]);
  const [planningprofileId, setplanningprofileId] = useState();
//   const [checked, setChecked] = useState(false);
//   const [userId, setuserId] = useState(user.userId);
  useEffect(async () => {
    const roleService = new RoleService();
    const allrole = await roleService.filterRoles(btnSearchText);
    setallRole(allrole)
  }, [btnSearchText]);
  useEffect(async () => {
    if (Object.keys(user).length > 0) {
      setuserData(user)
    //   setuserId(user.userId)
      const roleService = new RoleService();
      const allrole = await roleService.getAllRole();
      const activerole = allrole.filter(actv => actv.isActive === true);
      setActiveallRole(activerole);
      //setallRole(allrole);
      setisDataLoaded(true)
      const allPlannerProfiles = new UserService();
      allPlannerProfiles.getAllPlanningProfiles().then(res => setPlanningProfile(res));
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

const handlePlanningProfileChange = (e,item) => { 
    let ids = []
    ids = [...userRadioCheck]
    if( e.target.checked ) {
        ids.push(item.id)
        setUserCheck(ids);
} else{
    const updated = ids.filter(el=>el != item.id);
    setUserCheck(updated);
}
   
}
  useEffect( async() => {

    const userService = new UserService();
    let id = await userService.getPlanningProfileById(user.userId);
    let ids = [...new Set(id.map(planningId => planningId.planningprofile_id))];

    setUserCheck(ids)
    setplanningprofileId(ids);
    // Add planning profile IDs to user context
    let planningProfile = await this.getPlanningProfileById(user.userId)
    let planning_terminal_ids = [...new Set(planningProfile.map(elem=>elem.userPlanningprofile.terminal_id))]

    updateUser({...userInfo, planning_profile_ids: [...new Set(ids)], planning_terminal_ids: planning_terminal_ids})
  },[]);

  const updateUserData = async (event, id) => { /** @audit-ok Save function call */
    setisDataLoaded(false)
    const userService = new UserService()
    userData.roles = [userRadioCheck];
    const obj = {
      user_id: user.userId,
      planningprofiles: userRadioCheck
    }
    
    const updateuserResponse = await userService.updatePlanningProfileUsers(obj);
    if (updateuserResponse) {
      await userService.getAllPlanningProfiles();
      setuserData(updateuserResponse)

      // Add planning profile IDs to user context
      let planningProfile = await userService.getPlanningProfileById(user.userId)
      let planning_terminal_ids = [...new Set(planningProfile.map(elem=>elem.userPlanningprofile.terminal_id))]
      updateUser({...userInfo, planning_profile_ids: [...new Set(userRadioCheck)], planning_terminal_ids: planning_terminal_ids});
      console.log(userInfo)

      setisDataLoaded(true)
      // setUserCheck([])
      NotificationManager.success("Assigned planning Profile updated", "Success");
    } else {
        await userService.getAllPlanningProfiles();
      NotificationManager.error("Assigned planning Profile not updated", "error");
      // setUserCheck([])
    }
  }
  useEffect(() => {
    if (userInfo?.Email == config.adminUsers) {
      setIsDisabled(false)
    } else if (userInfo?.Email != config.adminUsers) {
      if (user?.Email == config.adminUsers) {
        setIsDisabled(true)
      } else if (user?.Email != config.adminUsers) {
        setIsDisabled(false)
      }
    }

  }, [userInfo, user, config])

  return (
      <div className="col-xl-88">
        <div className="card card_shadow">
          <div className="card-body special_card_padding">
            <div className="access_header">
              <h2 className="header-title">Planning Profiles</h2>
              <button
                type="button"
                className="btn_blue_sm btn-blue ml_10 access_save"
                onClick={(e) => updateUserData(e, userData.userId)}
                disabled={accessDisabled ? true : false}
                style={{ background: accessDisabled ? "#dddddd" : "" }}
              >
                SAVE
              </button>
            </div>

            <div className="table-responsive Assigned_Roles_scroll">
                {
                  isDataLoaded ?
                    <table className="table table-striped mb-0">
                    <tbody>
                      <tr>
                        <th className="w-81" scope="row">Planning Profile Name</th>
                        <td></td>
                      </tr>
                      <>
                        {planningProfile && planningProfile.length > 0 && planningProfile.map((item, i) => (
                          <tr key={i}>
                            <th id={item.id} scope="row" key={i}>{item.name}</th>
                            <td>

                              <div className="square" onChange={(e)=>handlePlanningProfileChange(e,item)}>
                                <>
                                  <input
                                    name="roleradio"
                                    id={item.id}
                                    type="checkbox"
                                    defaultChecked={userRadioCheck && userRadioCheck.includes(item.id)}
                                    disabled={accessDisabled ? true : false}
                                    style={{ border: accessDisabled ? "1px solid #dddddd" : "" }}
                                  />
                                  <label name="ppcheckbox" />
                                </>

                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    </tbody>
                </table>
                    : 
                    (<div>
                      <ProgressBar animated now={100} />
                    </div>)
                }
                
            </div>
          </div>
        </div>
      </div>
  )
}

export default UserPlanningFiltertable
