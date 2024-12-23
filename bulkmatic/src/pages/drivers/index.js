import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import DriverHeader from "../../components/driverHeader/driverHeader";
import DriverTable from "../../components/driverTable/driverTable";
import React, { useState, useEffect, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import DriverByIdHeader from "../../components/driverByIdHeader/driverByIdHeader";
import DriverBodyForDetails from "../../components/driverBodyForDetails/driverBodyForDetails";
import DriverService from "../../services/driverService";
import DriverBodyForPreference from "../../components/driverBodyForPreference/driverBodyForPreference";
import DriverBodyForCertification from "../../components/driverBodyForCertification/driverBodyForCertification";
import DriverBodyForSchedule from "../../components/driverBodyForSchedule/driverBodyForSchedule";
import DriverBodyForScheduleModal from "../../components/driverBodyForScheduleModal/driverBodyForScheduleModal";

import TerminalService from "../../services/terminalService";
import { ContextData } from "../../components/appsession";

function Drivers(props) {
  const { id } = useParams();
  const [userData, setuserData] = useContext(ContextData);
  const [allDrivers, setallDriver] = useState([]);
  const [driverEx, setDriverEx] = useState([]);
  const [driverClicked, setdriverClicked] = useState(props.location?.state?.isDriverclicked?props.location.state.isDriverclicked : false);
  const [driverById, setdriverById] = useState({});
  const [headerTabName, setheaderTabName] = useState("details");
  const [allDriversDropdown, setAllDriversDropdown] = useState([]);
  const [terminalsOptions, setTerminalsOptions] = useState([]);
  const [regionOptions, setregionOptions] = useState([]);
  const [driverlistData, setdriverlistData] = useState([]);
  const [alloverrideSchedule, setalloverrideSchedule] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const history = useHistory();

  const handelcallbackFromHeader = (childdata) => {
    setdriverClicked(childdata);
    setheaderTabName("details");
  };


  const handelcallback = (childdata, driver) => {
    setdriverById(driver);
    setdriverClicked(childdata);
  };

  const handelcallbackFromLocationHeader = (childdata) => {
    setheaderTabName(childdata);
  };

  useEffect(async () => {
    console.log({userData});
    setIsLoading(true);
    const planning_terminal_ids = await userData.planning_terminal_ids;
    if (planning_terminal_ids?.length > 0) {
      const terminalService = new TerminalService();
      let terminalinformationlist = await terminalService.getTerminalByTerminalIds(
        planning_terminal_ids
      );

      let filterData = {
        terminalId: planning_terminal_ids,
      };
      setTerminalsOptions(terminalinformationlist);

      const driverService = new DriverService();
      driverService
        .getAllDrivers(filterData)
        .then(function (driversList) {
          setallDriver(driversList);
          setdriverlistData(driversList);
          setIsLoading(false);
        })
        .catch(function (err) {
        //  NotificationManager.error(err, "Error");
        });
    }
  }, [userData]);

  const parentCallBackForTerminalFilterDriver = (childData) => {
    if (childData.length > 0) {
      const tempallDrivers = [...driverlistData];
      const tempArray = [];
      tempallDrivers.map((el) => {
        if (childData.indexOf(el.terminal.terminal_id) > -1) {
          tempArray.push(el);
        }
      });
      setallDriver(tempArray);
    } else {
      setallDriver(driverlistData);
    }
  };

  useEffect(() => {
    const driverService = new DriverService();
    if (id !== undefined) {
      const d = driverService
        .getDriver(id)
        .then(function (tractor) {
          // settractorById(tractor);
          handelcallback(true, tractor);
        })
        .catch(function (err) {
          NotificationManager.error(err, "Error");
        });
    }
  }, [id]);
  
  useEffect(() => {
    if(props.location?.state?.isDriverclicked)

    {
      const filterDriver = allDrivers.filter((e)=>e.driver_id === props.location?.state?.driver)
      console.log('filterDriver',filterDriver[0])
      if(filterDriver[0])
      {
        setdriverById(filterDriver[0])
      }
    }
  
   
  }, [allDrivers.length > 0])
  console.log("allDrivers==>>",allDrivers)

const parencallbackoverrideschedule=(data)=>{
  setalloverrideSchedule(data)

}
  return (
    <div id="wrapper">
      <Header
        userclicked={driverClicked}
        parentcallback={handelcallbackFromHeader}
      ></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {!driverClicked ? (
              <>
                <DriverHeader
                  allDriversDropdown={allDriversDropdown}
                  allDrivers={allDrivers}
                  regionOptions={regionOptions}
                  terminalsOptions={terminalsOptions}
                  parentCallBackForTerminalFilterDriver={
                    parentCallBackForTerminalFilterDriver
                  }
                />
                <DriverTable
                  allDrivers={allDrivers}
                  isLoading = {isLoading}
                  driverEx={driverEx}
                  parentcallback={handelcallback}
                />
              </>
            ) : (
              <>
                <DriverByIdHeader
                  driverById={driverById}
                  parentcallback={handelcallbackFromLocationHeader}
                />
               
                {headerTabName === "details" ? (
                  <DriverBodyForDetails driver={driverById} />
                ) : headerTabName === "certifications" ? (
                  <DriverBodyForCertification driver={driverById} />
                ) : headerTabName === "preference" ? (
                  <DriverBodyForPreference driver={driverById} />
                ) : headerTabName === "shedule" ? (
                  <DriverBodyForSchedule driver={driverById} />
                ) : (
                  <DriverBodyForScheduleModal driver={driverById}
                  parencallbackoverrideschedule={parencallbackoverrideschedule}
                  />
                )}
              </>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Drivers;
