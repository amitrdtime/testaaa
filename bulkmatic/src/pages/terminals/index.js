import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import TerminalHeader from "../../components/termnalHeader/terminalHeader";
import TerminalLocationTable from "../../components/teminalLocationTable/terminalLocationTable";
import React, { useState, useEffect, useContext, useCallback } from "react";
import TerminalByIdHeader from "../../components/terminalByIdHeader/terminalByIdHeader";
import TerminalBodyForHeader from "../../components/terminalBodyForDetail/terminalBodyForDetail";
import TerminalBodyForContracts from "../../components/terminalBodyForPlaner/terminalBodyForContracts";
import TerminalBodyForPlaner from "../../components/terminalBodyForPlaner/terminalBodyForPlaner";
import TerminalBodyForUser from "../../components/terminalBodyForUser/terminalBodyForUser";

import AppFilterService from "../../services/appFilterService";
import TerminalService from "../../services/terminalService";
import TerminalDriverList from "../../components/terminalDriverList";
import TerminalTractorList from "../../components/terminalTractorList";
import TerminalTrailerList from "../../components/terminalTrailerList";
import { ContextData } from "../../components/appsession";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useHistory } from "react-router-dom";
import {DateTime} from "luxon";

function Terminals() {
  
  const history = useHistory();
  const [userData, setuserData] = useContext(ContextData);
  const [headerTabName, setheaderTabName] = useState("details");
  const [terminalClicked, setterminalClicked] = useState(false);
  const [allTerminal, setallTerminal] = useState([]);
  const [terminalById, setterminalById] = useState({});
  const [filterData, setfilterData] = useState("");
  const [totalCount, setTerminalCount] = useState(0);
  const [allTractor, setallTractor] = useState([]);
  const [allDriver, setallDriver] = useState([]);
  const [allTrailer, setallTrailer] = useState([]);
  const [isDataLoaded, setisDataLoaded] = useState(false);
  const [allContacts, setallContacts] = useState([]);
  const [allPlanners, setallPlanners] = useState([]);
  const [filterDropDown, setFilterDropDown] = useState([]);
  const [terminalsOptions, setTerminalsOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [zipOptions, setZipOptions] = useState([]);
  const [regionOptions, setregionOptions] = useState([]);
  const [allUser, setallUser] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [allregionterminal, setallregionterminal] = useState([]);
  const [terminallistData, setterminallistData] = useState([]);

  const isAccess = () => {
    const permission = userData?.roles[0]?.permissionAccess.map(permit => {
      if(permit?.permission == "Terminals" && permit?.isEdit == false){
          setIsDisabled(true)
      }
          
    });
  }
  const handelcallbackFromTerminalHeader = (childdata) => {
    setheaderTabName(childdata);
  };
  const handelcallback = (childdata, terminal) => {
    setterminalById(terminal);
    setterminalClicked(childdata);
  };

  const handelcallbackFromHeader = (childdata) => {
    setterminalClicked(childdata);
    setheaderTabName("details");

  };

  // const getalldatabyids = useCallback(async () => {
  //   const terminalService = new TerminalService();
  //   const userTerminalIds = await userData.terminals;

  //   let d = await terminalService.getTerminalByIds(userTerminalIds);
  //   setallTerminal(d);
  // }, [userData.terminals]);

  useEffect(async () => {
    const userTerminalIds = await userData.terminals;
    if (userTerminalIds?.length > 0) {
      const terminalService = new TerminalService();
      terminalService.getTerminalByIds(userTerminalIds).then((res) => {
        setTerminalsOptions(res);
        setallTerminal(res);
        setterminallistData(res);

      });
    }
    isAccess()
  }, [userData.terminals]);

  const handelcallbackFromTrailer = (childData) => {
    console.log("childData",childData)
    if(childData.length > 0){
      const tempallTerminal = [...terminallistData];
      const tempArray = [];
      tempallTerminal?.map((el) => {
        if (childData.indexOf(el.code) > -1) {
          tempArray.push(el);
        }
      });
    
      setallTerminal(tempArray);
    }else{
    

      setallTerminal(terminallistData);
    }
  }

  const praentCallBackformTerminal = (data) => {
    setallTractor(data);
  };
  const parentCallBackForTerminal = (data) => {
    setallDriver(data);
  };

  // const parentCallBackForTerminal = (data,s) => {

  //   if(data== true)

  //   {
  //     history.push({

  //     pathname: '/drivers',

  //     state: {  isDriverclicked : true,driver : s.driver_id}

  // });

  //   }

  //   setallDriver(data);

  // };

  const parentCallBackFromTerminalBodyForUser = (data) => {
    setallUser(data);
  };
  const parentCallBackFromTerminal = (data) => {
    setallTrailer(data);
  };
  const parentCallBackForContacts = (data) => {
    setallContacts(data);
  };
  const parentCallBackForPlanners = (data) => {
    setallPlanners(data);
  };
  const convertDateTime = (epoch_date)=>{
    return (
      <td>
        {DateTime.fromMillis(parseInt(epoch_date * 1000)).toFormat("MM-dd-yyyy, hh:mm").toString()}
      </td>
    )
  }

  return (
    <div id="wrapper">
      <Header
        userclicked={terminalClicked}
        parentcallback={handelcallbackFromHeader}
      ></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {!terminalClicked ? (
              <>
                <TerminalHeader
                  allTerminal={allTerminal}
                  totalCount={totalCount}
                  regionOptions={regionOptions}
                  terminalsOptions={terminalsOptions}              
                  handelcallbackFromTrailer={handelcallbackFromTrailer}
                />
                <TerminalLocationTable
                  parentcallback={handelcallback}
                  isDataLoadedParent={isDataLoaded}
                  allTerminal={allTerminal}
                 
                />
              </>
            ) : (
              <>
                <TerminalByIdHeader
                  terminal={terminalById}
                  parentcallback={handelcallbackFromTerminalHeader}
                  allTractor={allTractor}
                  allDriver={allDriver}
                  allUser={allUser}
                  allTrailer={allTrailer}
                  allContacts={allContacts}
                  allPlanners={allPlanners}
                />
                {headerTabName === "details" ? (
                  <> 
                    <TerminalBodyForUser
                      terminal={terminalById}
                      parentCallBackFromTerminalBodyForUser={
                        parentCallBackFromTerminalBodyForUser
                      }
                    />
                    <TerminalBodyForHeader 
                      terminal={terminalById}
                      parentCallBackForContacts={parentCallBackForContacts}
                      accessDisabled={isDisabled}
                    />
                   
                  </>
                ) : headerTabName === "Planners" ? (
                  <div className="row special_row_flex">
                  </div>
                ) : headerTabName === "Users" ? (
                  <TerminalBodyForUser
                    terminal={terminalById}
                    parentCallBackFromTerminalBodyForUser={
                      parentCallBackFromTerminalBodyForUser
                    }
                  />
                ) : headerTabName === "Drivers" ? (
                  <TerminalDriverList
                    terminalById={terminalById}
                    allDriver={allDriver}
                    parentCallBackForTerminal={parentCallBackForTerminal}
                    parentcallback={handelcallback}
                  />
                ) : headerTabName === "Trailers" ? (
                  <TerminalTrailerList
                    terminalById={terminalById}
                    allTrailer={allTrailer}
                    parentCallBackFromTerminal={parentCallBackFromTerminal}
                    parentcallback={handelcallback}
                  />
                ) : headerTabName === "Tractors" ? (
                  <TerminalTractorList
                    terminalById={terminalById}
                    allTractor={allTractor}
                    praentCallBackformTerminal={praentCallBackformTerminal}
                    parentcallback={handelcallback}
                    convertDateTime={convertDateTime}
                  />
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terminals;
