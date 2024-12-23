import { useEffect, useState, useContext } from "react";
import UserService from "../../services/userService";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import ProfileHeader from "../Profile/profileheader";
import Userfiltertable from "../../components/userfiltertable/userfiltertable";
import UserAccessProfile from "../../components/userAccessProfile/userAccessProfile";
import Userrolefiltertable from "../../components/userrolefiltetable/userrolefiltertable";
import { ContextData } from "../../components/appsession";

const Profile = () => {
  const [profileData, setprofileData] = useContext(ContextData);
  const [isUserClicked, setisUserClicked] = useState(false);
  const [userProfileTabclicked, setuserProfileTabclicked] = useState(true);

  const [driver, setDriver] = useState([]);
  const [trailer, setTrailer] = useState({});

  const handelcallbackFromUserHeader = (childdata) => {
    if (childdata === "profile") {
      setuserProfileTabclicked(true);
    } else {
      setuserProfileTabclicked(false);
    }
  };
  useEffect( () => {
    if(profileData) {
      getDriverDetails()
      getTrailerDetails()
    }
  }, [profileData]);

  const getDriverDetails=async()=>{
    const userService = new UserService();
    // 
    const userTerminalIds = profileData.terminals;
    const data = await userService.getAssignedDrivers(profileData.userId, userTerminalIds);
    setDriver(data);
  }
  const getTrailerDetails=async()=>{
    const userService = new UserService();
    const userTerminalIds =   profileData.terminals;
    
    const data = await userService.filterTrailerByTerminalID(userTerminalIds);
    setTrailer(data);
  }
  
  const refreshUserFilterTable = (
    type,
    searchData,
    action,
    currentSelection
  ) => {
    setFilterType({
      type: type,
      action: action,
      filterText: searchData,
      checkedData: currentSelection,
    });
  };

  useEffect(async () => {
    let v = {};
    if (profileData) {
      const userService = new UserService();
      v = await userService.getUser(profileData);
      setuser(v);
    }
  }, [profileData]);

  useEffect(() => {
    setuserProfileTabclicked(true);
  }, [isUserClicked]);
  
  
  return (
    <div id="wrapper">
      <Header></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            <>
              <ProfileHeader                
                parentcallback={handelcallbackFromUserHeader}
                user={profileData} 
              />
              <div className="row special_row_flex">
                {userProfileTabclicked ? (
                  <>
                    <Userrolefiltertable user={profileData} />
                    <UserAccessProfile user={profileData} />
                  </>
                ) : (
                  <>
                    <Userfiltertable
                      parentHandler={refreshUserFilterTable}
                      type={"Drivers"}
                      user={profileData}
                      dataObject={driver}
                    />
                    <Userfiltertable
                      parentHandler={refreshUserFilterTable}
                      type={"Trailers"}
                      user={profileData}
                      dataObject={trailer}
                    />
                  </>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
