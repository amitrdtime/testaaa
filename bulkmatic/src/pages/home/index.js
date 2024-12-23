import Header from "../../components/header";
import AppBar from "../../components/appbar";
import LandingContent from "../../components/landingcontent";
import Table from "../../components/landingcontenttable/userlistTable";
import React, { useState, useEffect, useContext, useCallback } from "react";
import Userprofileheader from "../../components/userprofileheader/userprofileheader";
import Userfiltertable from "../../components/userfiltertable/userfiltertable";
import UserAccessProfile from "../../components/userAccessProfile/userAccessProfile";
import Userrolefiltertable from "../../components/userrolefiltetable/userrolefiltertable";
import UserPlanningFiltertable from "../../components/userplanningprofileseclector/userplanningprofileselector";
import UserService from "../../services/userService";
import DriverService from "../../services/driverService";
import TerminalServie from "../../services/terminalService";
import TrailerService from "../../services/trailerService";
import { callMsGraph } from "../../appSession";
import TerminalService from "../../services/terminalService";
import { ContextData } from "../../components/appsession";
import RoleService from "../../services/roleService";
import { NotificationManager } from "react-notifications";
import AppFilterService from "../../services/appFilterService";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

function Home() {
  const [userData, setuserData] = useContext(ContextData);
  const [isUserClicked, setisUserClicked] = useState(false);
  const [userProfileTabclicked, setuserProfileTabclicked] = useState(true);
  const [userid, setuserid] = useState("");
  const [user, setuser] = useState({});  
  const [driver, setDriver] = useState([]);
  const [terminal, setTerminal] = useState({});
  const [trailer, setTrailer] = useState({});
  const [allUser, setallUser] = useState([]);
  const [allUserData, setallUserData] = useState([]);
  const [filterData, setfilterData] = useState({});
  const [filterType, setFilterType] = useState({});

  const [rolesOptions, setrolesOptions] = useState([]);
  const [isUserTerminalsLoaded, setIsUserTerminalsLoaded] = useState(true);
  const [allUserTerminals, setallUserTerminals] = useState([]);
  const [selectedTerminalOptions, setSelectedTerminalOptions] = useState([]);
  const [allterminalOptions, setTerminalOptions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false)

  const [regionsOptions, setRegionsOptions] = useState([])
  const [terminalsOptions, setTerminalsOptions] = useState([]);
  const [newTerminalsOptions, setNewTerminalsOptions] = useState([])
  
  const isAccess = () => {
    const permission = userData?.roles[0]?.permissionAccess.map(permit => {
      if(permit?.permission == "Users" && permit?.isEdit == false){
          setIsDisabled(true)
      }
          
    });
  }
  const handelcallback = (childdata, userid) => {
    setuserid(userid);
    setisUserClicked(childdata);
  };
  
  const handelcallbackFromHeader = (childdata) => {
    setisUserClicked(childdata);
    setuser({});
    setuserid("");
  };

  const handelcallbackFromUserHeader = (childdata, user) => {
    setuser(user);
    if (childdata === "profile") {
      setuserProfileTabclicked(true);
    } else {
      setuserProfileTabclicked(false);
    }
  };
  const parentCallBackForUserFilter = (filterData) => {
    if(filterData.length > 0) {
      let tempArray = [];
      allUserData.map(user => {
        user.terminal_id.map(el => {
          if(filterData.indexOf(el) > -1){
            tempArray.push(user)
          }
        })
      })
      setallUser([...new Set(tempArray)])
    } else {
      setallUser(allUserData)
    }
  };



  useEffect(() => {
    let allterminal = [];
    for (let i = 0; i < allUserTerminals.length; i++) {
      let obj = {
        label: `${allUserTerminals[i].code} - ${allUserTerminals[i].name?.split(" ")[0]}` ,
        value: allUserTerminals[i].id,
      };
      allterminal.push(obj);
    }
    setTerminalOptions(allterminal);
  }, [allUserTerminals.length]);
  
  function getterminalDropdownButtonLabel({ placeholderButtonLabel }) {
    let label = "";
    for (let i = 0; i < selectedTerminalOptions.length; i++) {
      label = label + selectedTerminalOptions[i].label + ", ";
      if (label.length > 6) {
        label = label.substring(0, 6) + "...";
        break;
      }
    }
    return `${placeholderButtonLabel}: ${label}`;
  }

  function onChangeforTerminal(option) {
    setSelectedTerminalOptions(option);
  }

  const filterDataTerminal = {
    terminalId: selectedTerminalOptions.map((o) => o.value),
  };

  useEffect(() => {
    parentCallBackForTerminalFilterDriver(filterDataTerminal);
    parentCallBackForTerminalFilterTrailer(filterDataTerminal)
  }, [selectedTerminalOptions]);

  const parentCallBackForTerminalFilterDriver = async (filterDataTerminal) => {
    
    const userService = new UserService();
    if(filterDataTerminal.terminalId.length){
      const data = await userService.getAssignedDrivers(userid.userId,filterDataTerminal.terminalId);
      setDriver(data);
    }
    else{
      getDriverDetails()
    }
    
  };

  const parentCallBackForTerminalFilterTrailer = async (filterDataTerminal) => {
    const userService = new UserService();
    
    if(filterDataTerminal.terminalId.length){
      const data = await userService.filterTrailerByTerminalID(filterDataTerminal.terminalId);
      setTrailer(data);
    }
    else{
      getTrailerDetails()
    }
   
  };
  useEffect(() => {
    const appFilter = new AppFilterService().getAppFilter();
    if (appFilter) {
      setTerminalsOptions(appFilter?.terminals);
    }
  }, []);

  useEffect(async () => {
    const roleService = new RoleService();
    const allrole = await roleService.getAllRole();
    setrolesOptions(allrole);
  }, []);

 
  useEffect(async()=>{
    const terminalService = new TerminalService();
    const userTerminalIds =  userid.terminals;
    try{
      let planningterminals = await terminalService.getTerminalByIds(userTerminalIds);
      setallUserTerminals(planningterminals)
    }
    catch(err){
          
    }
  },[userid.terminals])

  useEffect( () => {
    if(userid) {
      setSelectedTerminalOptions([])
      getDriverDetails()
      getTrailerDetails()
      isAccess()
    }
  }, [userid]);

  const getDriverDetails=async()=>{
    const userService = new UserService();
    
    const userTerminalIds =   userid.terminals;
    const data = await userService.getAssignedDrivers(userid.userId, userTerminalIds);
    
    setDriver(data);
  }
  const getTrailerDetails=async()=>{
    const userService = new UserService();
    const userTerminalIds =   userid.terminals;
    
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
    
    const usrObject = new AppFilterService().getUserFilter();
    if (filterType.action === "Search") {
      if (filterType.type === "Drivers") {
      
        const driverService = new DriverService();
        
        const filterData = {
          search: filterType.filterText,
          isactive: true,
        };
        // const drivers = await driverService.searchDrivers(filterData); // Pass the text to be searched
    
        if(filterType.filterText){
         let  drivers = driver.filter((e)=>e.driver_id.toString().includes(filterType.filterText.toString()) || e.first_name.toLowerCase().includes(filterType.filterText.toLowerCase()) ||e.terminals.id.toString().includes(filterType.filterText.toString())||e.terminals.name.toLowerCase().includes(filterType.filterText.toLowerCase())) 
           setDriver(drivers);
           
          }
        else{
          getDriverDetails()
        }
       
       
        // 
        // 
        
      }
      if (filterType.type === "Trailers") {
        const trailerService = new TrailerService();
        
        const filterObj = {
          filterText: filterType.filterText,
          dbids: usrObject.terminals.length
            ? usrObject.terminals.map((it) => it.id)
            : [],
          cgs: usrObject.cgs.length ? usrObject.cgs.map((it) => it.code) : [],
        };
        const trailers = await trailerService.searchTrailers(filterObj); // Pass the text to be searched
        
        setTrailer(trailers);
      }
      if (filterType.type === "Terminals") {
        const terminalService = new TerminalService();
        
        if (filterType.filterText) {
          const terminals = await terminalService.filterTerminalByIdsText(
            user.terminals,
            filterType.filterText
          ); // Pass the text to be searched
          
          setTerminal(terminals);
        } else {
          const terminals = await terminalService.getAllTerminals(); // Pass the text to be searched
          
          setTerminal(terminals);
        }
      }
    } else if (filterType.action === "Update") {
      

      if (filterType.type === "Drivers") {
        const currentDriversInUser = []; //user.drivers;
        const selectedDrivers = filterType.checkedData.filter(
          (item) => item.type === "Drivers"
        );
        const allTogether = [
          ...new Set([...currentDriversInUser, ...selectedDrivers]),
        ];
        const updatedDriverToBeSaved = [
          ...new Set(allTogether.map((item) => item.id)),
        ];

        user.drivers = updatedDriverToBeSaved;
        
        setDriver([...driver]);

        const userService = new UserService();
        await userService.updateUser(user);
        setuser(user);

        if (user) {
          setuser(user);
          NotificationManager.success(
            "Assigned Drivers updated successfully",
            "Success"
          );
        }
      }
      if (filterType.type === "Trailers") {
        const currentTrailersInUser = []; //user.trailers;
        const selectedTrailers = filterType.checkedData.filter(
          (item) => item.type === "Trailers"
        );
        const allTogether = [
          ...new Set([...currentTrailersInUser, ...selectedTrailers]),
        ];
        const updatedTrailerToBeSaved = [
          ...new Set(allTogether.map((item) => item.id)),
        ];

        user.trailers = updatedTrailerToBeSaved;

        const userService = new UserService();
        await userService.updateUser(user);
        setTrailer([...trailer]);
        if (user) {
          setuser(user);
          NotificationManager.success(
            "Assigned Trailers updated successfully",
            "Success"
          );
        }
      }
      if (filterType.type === "Terminals") {
        const currentTerminalsInUser = []; //user.terminals;
        const selectedTerminals = filterType.checkedData.filter(
          (item) => item.type === "Terminals"
        );
        const allTogether = [
          ...new Set([...currentTerminalsInUser, ...selectedTerminals]),
        ];
        const updatedTerminalToBeSaved = [
          ...new Set(allTogether.map((item) => item.id)),
        ];

        user.terminals = updatedTerminalToBeSaved;

        const userService = new UserService();
        await userService.updateUser(user);
        setTerminal([...terminal]);
        setuser(user);
      }
    }
  }, [filterType]);

  useEffect(async () => {
    let v = {};
    if (userid.userId) {
      
      const userService = new UserService();
      v = await userService.getUser(userid.userId);
      setuser(v);
    }

    //const driverService = new DriverService();
    //const drivers = await driverService.getAllActiveDrivers();
    const terminalService = new TerminalServie();
    const terminals = await terminalService.getAllTerminals(user.terminals);

    setTerminal(terminals);
    const trailerService = new TrailerService();

    const usrObject = new AppFilterService().getUserFilter();

    const filterObj = {
      filterText: "",
      dbids: usrObject.terminals.length
        ? usrObject.terminals.map((it) => it.id)
        : [],
      cgs: usrObject.cgs.length ? usrObject.cgs.map((it) => it.code) : [],
    };
  }, [userid]);

  useEffect(async () => {
    const userService = new UserService();
    const v = await userService.getAllUsers();

    setallUser(v);
    setallUserData(v);
  }, []);

  useEffect(async () => {
    const userService = new UserService();
    const v = await userService.getAllUsers();
    setallUser(v);
  }, [isUserClicked]);

  useEffect(() => {
    setuserProfileTabclicked(true);
  }, [isUserClicked]);

  useEffect(async() => {
   const terminalService = new TerminalService()
   let terminal_id = userData.terminals
   const res = await terminalService.getAllTerminals()
   setNewTerminalsOptions(res)
   let unique = [...new Set(res.map((t) => t.region))];

   setRegionsOptions(unique)
  },[userData.terminals])


  return (
    <>
      <div id="wrapper">
        <Header
          userclicked={isUserClicked}
          parentcallback={handelcallbackFromHeader}
        ></Header>
        <AppBar></AppBar>
        <div className="content-page">
          <div className="content">
            <div className="container-fluid">
              {!isUserClicked ? (
                <>
                  <LandingContent
                    allUser={allUser}
                    parentCallBackForUserFilter={parentCallBackForUserFilter}
                    terminalsOptions={terminalsOptions}
                    rolesOptions={rolesOptions}
                    regionsOptions={regionsOptions}
                    newTerminalsOptions={newTerminalsOptions}
                  />
                  <Table parentcallback={handelcallback} allUser={allUser} />
                </>
              ) : (
                <>
                  <Userprofileheader
                    parentcallback={handelcallbackFromUserHeader}
                    parentCallBackForTerminalFilterDriver={
                      parentCallBackForTerminalFilterDriver
                    }
                    parentCallBackForTerminalFilterTrailer={
                      parentCallBackForTerminalFilterTrailer
                    }
                    allUserTerminals={allUserTerminals}
                    isUserTerminalsLoaded={isUserTerminalsLoaded}
                    accessDisabled={isDisabled}
                    user={userid}
                  />
                  <div className="row special_row_flex">
                    {userProfileTabclicked ? (
                      <>
                        <Userrolefiltertable user={userid} accessDisabled={isDisabled} userInfo={userData}/>
                        <UserPlanningFiltertable user={userid} accessDisabled={isDisabled} userInfo={userData} updateUser={setuserData}/>
                        <UserAccessProfile user={userid} accessDisabled={isDisabled}/>
                      </>
                    ) : (
                      <>
                 <div className="planning_dropdown">
                 <div className="multiselect terminal_drop_fixed planning_dropdown_box">
                  <div className="dropdownadjust">
                    { <ReactMultiSelectCheckboxes
                      options={[...allterminalOptions]}
                      placeholderButtonLabel="Terminals"
                      getDropdownButtonLabel={getterminalDropdownButtonLabel}
                      value={selectedTerminalOptions}
                      onChange={onChangeforTerminal}
                      setState={setSelectedTerminalOptions}
                    /> }
                  </div>
                  </div>
                  </div>
                  <div className="divclear"></div>
                        <Userfiltertable
                          parentHandler={refreshUserFilterTable}
                          type={"Drivers"}
                          user={userid}
                          dataObject={driver}
                          accessDisabled={isDisabled}
                        />
                        <Userfiltertable
                          parentHandler={refreshUserFilterTable}
                          type={"Trailers"}
                          user={userid}
                          dataObject={trailer}
                          allterminalOptions={allterminalOptions}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
