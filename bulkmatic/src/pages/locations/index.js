import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import LocationHeader from "../../components/locationHeader/locationHeader";
import LocationTable from "../../components/locationTable/locationTable";
import React, { useState, useEffect, useContext } from "react";
import LocationService from "../../services/locationService";
import LocationByIdHeader from "../../components/locationByIdHeader/locationByIdHeader";
import LocationBodyForDetails from "../../components/locationBodyForDetails/locationBodyForDetails";
import BannedDriverForLocation from "../../components/bannedDriverForLocation/bannedDriverForLocation";
import LoadTimesForLocation from "../../components/loadTimesForLocation/loadTimesForLocation";
import LocationDedicatedTrailersBody from "../../components/locationDedicatedTrailersBody/locationDedicatedTrailersBody";
import LocationShipperPoolBody from "../../components/locationShipperPollBody/locationShipperPollBody";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import TerminalService from "../../services/terminalService";
import AppFilterService from "../../services/appFilterService";
import { ContextData } from "../../components/appsession";
import { DateTime } from "luxon";

function Locations() {
  const [userData, setuserData] = useContext(ContextData);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [locationData, setLocationData] = useState([]);
  const [allLocation, setallLocation] = useState([]);
  const [locationCount, setlocationCount] = useState("");
  const [locationClicked, setlocationClicked] = useState(false);
  const [locationById, setlocationById] = useState({});
  const [allDedicatedTrailers, setallDedicatedTrailers] = useState([]);
  const [allShipperPool, setallShipperPool] = useState([]);
  const [allShipper, setallShipper] = useState([]);
  const [allBanned, setallBanned] = useState([]);
  const [terminalsOptions, setTerminalsOptions] = useState([]);

  const [headerTabName, setheaderTabName] = useState("details");
  const [regionOptions, setregionOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [isSelected, setIsSelected] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false)

  const isAccess = () => {
    const permission = userData?.roles[0]?.permissionAccess.map(permit => {
      if(permit?.permission == "Locations" && permit?.isEdit == false){
          setIsDisabled(true)
      }
          
    });
  }
  const handelcallbackFromHeader = (childdata) => {
    
    setlocationClicked(childdata);
    setheaderTabName("details");
  };
  const parentCallBackForLocationFilter = async (filterData) => {
    const locationService = new LocationService();
    const locations = await locationService.filterLocation(filterData);
    
    setallLocation(locations);
  };
  const handelcallback = (childdata, terminal) => {
    setlocationById(terminal);
    setlocationClicked(childdata);
  };
  const handelcallbackFromLocationHeader = (childdata) => {
    setheaderTabName(childdata);
  };

  useEffect(() => {
    const locationService = new LocationService();
    locationService
      .getAllLocations()
      .then(function (locations) {
        
        setallLocation(locations);
        setlocationCount(locations.length);
        setLocationData(locations);
        setIsLocationLoaded(true);
        isAccess();
      })
      .catch(function (err) {
        NotificationManager.error(err, "Error");
      });
  }, []);

  useEffect(() => {
    const getAllTerminal = new TerminalService();
    getAllTerminal.getAllTerminals().then((res) => {
      setTerminalsOptions(res);
    });
  }, []);

  useEffect(() => {
    const appFilter = new AppFilterService().getAppFilter();
    setStateOptions(appFilter.state);
    setregionOptions(appFilter.region);
  }, []);

  const parentCallBackFromLocationBodyForDedicatedTrailer = (data) => {
    setallDedicatedTrailers(data);
  };
  const parentCallBackFromShipperPoll = (data) => {
    setallShipperPool(data);
  };
  const parentCallBackForBanned = (data) => {
    setallBanned(data);
  };

  const parentCallBackForShipperLoadTimes = (data) => {
    setallShipper(data);
  };

  const convertDateTime = (epoch_date) => {
    return DateTime.fromMillis(parseInt(epoch_date *1000)).toFormat("MM-dd-yyyy").toString()
  };

  return (
    <div id="wrapper">
      <Header
        userclicked={locationClicked}
        parentcallback={handelcallbackFromHeader}
      ></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {!locationClicked ? (
              <>
                <LocationHeader
                  locationCount={locationCount}
                  terminalsOptions={terminalsOptions}
                  allLocation={allLocation}
                  setallLocation={setallLocation}
                  locationData={locationData}
                  regionOptions={regionOptions}
                  stateOptions={stateOptions}
                  parentCallBackForLocationFilter={
                    parentCallBackForLocationFilter
                  }
                />
                <LocationTable
                  allLocation={allLocation}
                  parentcallback={handelcallback}
                  isLocationLoaded={isLocationLoaded}
                />
              </>
            ) : (
              <>
                <LocationByIdHeader
                  locationById={locationById}
                  parentcallback={handelcallbackFromLocationHeader}
                  allDedicatedTrailers={allDedicatedTrailers}
                  allShipperPool={allShipperPool}
                  allBanned={allBanned}
                  allShipper={allShipper}
                />
                {headerTabName === "details" ? (
                  <LocationBodyForDetails location={locationById}
                  locationById={locationById}
                  parentCallBackForBanned={parentCallBackForBanned}
                  accessDisabled={isDisabled}
                  isShipperOrConsignee={{
                    shipper: true,
                    consignee: false,
                  }}
                  />
                ) : headerTabName === "shipper" ? (
                  <div className="row special_row_flex">
                    {/* <BannedDriverForLocation
                      locationById={locationById}
                      parentCallBackForBanned={parentCallBackForBanned}
                      isShipperOrConsignee={{
                        shipper: true,
                        consignee: false,
                      }}
                    /> */}
                    <LoadTimesForLocation
                      locationById={locationById}
                      allShipper={allShipper}
                      accessDisabled={isDisabled}
                      parentCallBackForShipperLoadTimes={
                        parentCallBackForShipperLoadTimes
                      }
                      isShipperOrConsignee={{
                        shipper: true,
                        consignee: false,
                      }}
                    />
                  </div>
                ) : headerTabName === "dedicatedTrailers" ? (
                  <LocationDedicatedTrailersBody
                    locationById={locationById}
                    parentCallBackFromLocationBodyForDedicatedTrailer={
                      parentCallBackFromLocationBodyForDedicatedTrailer
                    }
                    accessDisabled={isDisabled}
                    convertDateTime={convertDateTime}
                  />
                ) : headerTabName === "shipperPool" ? (
                  <LocationShipperPoolBody
                    locationById={locationById}
                    parentCallBackFromShipperPoll={
                      parentCallBackFromShipperPoll
                    }
                    accessDisabled={isDisabled}
                    convertDateTime={convertDateTime}
                  />
                ) : headerTabName === "consigee" ? (
                  <div className="row special_row_flex">
                    {/* <BannedDriverForLocation
                      locationById={locationById}
                      isShipperOrConsignee={{
                        shipper: false,
                        consignee: true,
                      }}
                    /> */}
                    <LoadTimesForLocation
                      locationById={locationById}
                      parentCallBackForShipperLoadTimes={
                        parentCallBackForShipperLoadTimes
                      }
                      accessDisabled={isDisabled}
                      isShipperOrConsignee={{
                        shipper: false,
                        consignee: true,
                      }}
                    />
                  </div>
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

export default Locations;
