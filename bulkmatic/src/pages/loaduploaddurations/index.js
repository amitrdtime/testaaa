import Header from "../../components/header";
import AppBar from "../../components/appbar";
import React, { useState, useEffect } from "react";
import LUTRuleService from "../../services/loadunloadruleService";
import LoadUnloadruleByIdHeader from "../../components/loadunloadruleByIdHeader/loadunloadruleByIdHeader";
import { NotificationManager } from "react-notifications";
import LoadUnloadDurationsByLocation from "../../components/Loadunloaddurationsbylocation/LoadUnloadDurationsByLocation";
import LoadUnloadDurationsByCommodityGroups from "../../components/loadunloaddurationsbycommoditygroups/LoadUnloadDurationsByCommodityGroups";
import LoadUnloadDurationsByCommodity from "../../components/loadunloaddurationsbycommodity/LoadUnloadDurationsByCommodity";
import Loadunloaddurationsdefault from "../../components/loadunloaddurationsdefault/Loadunloaddurationsdefault";
import LocationService from "../../services/locationService";
import "bootstrap/dist/css/bootstrap.min.css";

function LoadUnloadDurations() {
  // const [allLoadUnloadTimes, setallLoadUnloadTimes] = useState([]);
  // const [loadUnloadTimesCount, setloadUnloadTimesCount] = useState("");
  const [lutClicked, setlutClicked] = useState(false);
  const [lutById, setlutById] = useState({});
  const [headerTabName, setheaderTabName] = useState("default");
  // const [commodityDropdown, setCommodityDropdown] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [tablelist, setTablelist] = useState([]);
  const [isDataloaded, setIsDataLoaded] = useState(false);

  const [allLocation, setallLocation] = useState([]);

  useEffect(() => {
    const locationService = new LocationService();
    locationService
      .getAllLocations()
      .then(function (locations) {
        setallLocation(locations);
      })
      .catch(function (err) {
        NotificationManager.error(err, "Error");
      });
  }, []);

  const handelcallbackFromHeader = (childdata) => {
    
    setlutClicked(childdata);
    setheaderTabName("default");
  };

  // const parentCallBackForLUTFilter = async (filterData) => {
  //   const lutService = new LUTRuleService();
  //   lutService
  //     .filterLUTRules(filterData)
  //     .then(function (rules) {
  //       setallLoadUnloadTimes(rules);
  //       setloadUnloadTimesCount(rules.length);
  //     })
  //     .catch(function (err) {
  //       NotificationManager.error(err, "Error");
  //     });
  // };

  const handelcallbackFromLUTHeader = (childdata) => {
    setheaderTabName(childdata);
  };

  // const handelcallback = (childdata, commoditygroup) => {
  //   setlutById(commoditygroup);
  //   setlutClicked(childdata);
  // };

  useEffect(async () => {
    const lutService = new LUTRuleService();
    lutService
      .getAllLUTRules()
      .then(function (rules) {
        setallLoadUnloadTimes(rules);
        setCommodityDropdown(rules);
        setloadUnloadTimesCount(rules.length);
      })
      .catch(function (err) {
        NotificationManager.error(err, "Error");
      });
  }, []);

  // const parentCallBackForShipperLoadTimes = (data) => {
  //   setCommodities(data);
  // };
  
 const parentCallBackForDuration = (data) => {
    setTablelist(data);
  }

  const getDefaultLutRules = async () => {
    const DefaultLutRules = new LUTRuleService();
    const data = await DefaultLutRules.getDefaultLutRules();
    setTablelist(data);
    setIsDataLoaded(true);
  };

  useEffect(() => {
    getDefaultLutRules();
  }, []);

  return (
    <div id="wrapper">
      <Header
        userclicked={lutClicked}
        parentcallback={handelcallbackFromHeader}
      ></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {!lutClicked ? (
              <>
                <LoadUnloadruleByIdHeader
                  cg={lutById}
                  allLocation={allLocation}
                  parentcallback={handelcallbackFromLUTHeader}
                  commodities={commodities}
                />
                {headerTabName === "default" ? (
                  <Loadunloaddurationsdefault
                    tablelist={tablelist}
                    isDataloaded={isDataloaded}
                    setTablelist={setTablelist}
                    parentCallBackForDuration={parentCallBackForDuration}
                  />
                ) : headerTabName === "location" ? (
                  <LoadUnloadDurationsByLocation allLocation={allLocation} />
                ) : headerTabName === "commoditygroup" ? (
                  <LoadUnloadDurationsByCommodityGroups />
                ) : headerTabName === "commodity" ? (
                  <LoadUnloadDurationsByCommodity />
                ) : (
                  ""
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadUnloadDurations;
