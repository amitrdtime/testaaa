import { useEffect, useState, useContext } from "react";
import UserService from "../../services/userService";

import Userfiltertable from "../../components/userfiltertable/userfiltertable";
import UserAccessProfile from "../../components/userAccessProfile/userAccessProfile";

import { ContextData } from "../../components/appsession";
import TerminalService from "../../services/terminalService";
import AppFilterService from "../../services/appFilterService";
import { NotificationManager } from "react-notifications";

import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const Planningtab = () => {
  const [planningdata, setplanningdata] = useContext(ContextData);
  const [isUserClicked, setisUserClicked] = useState(false);
  const [userplanningTabclicked, setuserplanningTabclicked] = useState(true);
  const [allUserTerminals, setallUserTerminals] = useState([]);
  const [selectedTerminalOptions, setSelectedTerminalOptions] = useState([]);
  const [allterminalOptions, setTerminalOptions] = useState([]);
  const [driver, setDriver] = useState([]);
  const [trailer, setTrailer] = useState([]);
  const [filterType, setFilterType] = useState({});
console.log("trailer",trailer)
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
  useEffect(async()=>{
    const terminalService = new TerminalService();
    const userTerminalIds =  planningdata.terminals;
    try{
      let planningterminals = await terminalService.getTerminalByIds(userTerminalIds);
      setallUserTerminals(planningterminals)
    }
    catch(err){
          
    }
  },[planningdata.terminals])

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
console.log("trailer",trailer)
  const handelcallbackFromUserHeader = (childdata) => {
    if (childdata === "planningProfile") {
        setuserplanningTabclicked(true);
        setisUserClicked(childdata)
    } else {
        setuserplanningTabclicked(false);
    }
  };
  useEffect( () => {
    if(planningdata) {
    setSelectedTerminalOptions([])
      getDriverDetails()
      getTrailerDetails()
    }
  }, [planningdata]);
  useEffect(() => {
    parentCallBackForTerminalFilterDriver(filterDataTerminal);
    parentCallBackForTerminalFilterTrailer(filterDataTerminal)
  }, [selectedTerminalOptions]);

  const parentCallBackForTerminalFilterDriver = async (filterDataTerminal) => {
    
    const userService = new UserService();
    if(filterDataTerminal.terminalId.length){
      const data = await userService.getAssignedDrivers(planningdata.userId,filterDataTerminal.terminalId);
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

  useEffect(async()=>{
    const terminalService = new TerminalService();
    const userTerminalIds =  planningdata.terminals;
    try{
      let planningterminals = await terminalService.getTerminalByIds(userTerminalIds);
      setallUserTerminals(planningterminals)
    }
    catch(err){
          
    }
  },[planningdata.terminals])

  const getDriverDetails=async()=>{
    const userService = new UserService();
    // 
    const userTerminalIds = planningdata.terminals;
    const data = await userService.getAssignedDrivers(planningdata.userId, userTerminalIds);
    setDriver(data);
  }
  const getTrailerDetails=async()=>{
    const userService = new UserService();
    const userTerminalIds =   planningdata.terminals;
    
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
    if (planningdata) {
      const userService = new UserService();
      v = await userService.getUser(planningdata);
      setuser(v);
    }
  }, [planningdata]);

  useEffect(() => {
    setuserplanningTabclicked(true);
  }, [isUserClicked]);
  
  
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

  return (
    <div className="row special_row_flex ml_0">

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
      {userplanningTabclicked ? (
        <>
       
       <Userfiltertable
        
           parentHandler={refreshUserFilterTable}
           type={"Drivers"}
           user={planningdata}
           dataObject={driver}
         />
         <Userfiltertable
        
           parentHandler={refreshUserFilterTable}
           type={"Trailers"}
           user={planningdata}
           dataObject={trailer}
         />
         
        </>
        
       
      ) : (
        <>
        
       
        </>
      )}
    </div>
  );
};

export default Planningtab;
