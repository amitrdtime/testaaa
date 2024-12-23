import React, { useState } from "react";
import ReactMultiselectCheckboxes from "react-multiselect-checkboxes/lib/ReactMultiselectCheckboxes";
import LocationService from "../../services/locationService";
const LocationHeader = (props) => {
  const { allLocation, setallLocation, locationData } = props;
  const [selectedLocation, setSelectedLocation] = useState([]);
  const optionArray = [
    { label: "Consignee", value: 0, name: "isConsignee" },
    { label: "Droplot", value: 1, name: "isDroplot" },
    { label: "Railyard", value: 2, name: "isRailyard" },
    { label: "Shipper", value: 3, name: "isShipper" },
    { label: "Shop", value: 4, name: "isShop" },
    { label: "Terminal", value: 5, name: "isTerminal" },
    { label: "Wash", value: 6, name: "isWash" },
  ];

  // const a = allLocation.filter((item) => item.isShipper);

  // 
  const getLocations = async () => {
    try {
      const locationService = new LocationService();
      const locations = await locationService.getAllLocations();
      
      setallLocation(locations);
    } catch (error) {
      NotificationManager.error(err, "Error");
    }
  };

  const onLocationChange = async (option) => {
    setSelectedLocation(option);
    const optionNames = option.map((item) => item.name);
    
    if (optionNames.length > 0) {
      let filteredArray = [];
      if (optionNames.includes("isConsignee")) {
        
        const data = locationData.filter((item) => item.isConsignee === true);
        
        filteredArray.push(...data);
      }
      if (optionNames.includes("isDroplot")) {
        const data = locationData.filter((item) => item.isDroplot === true);
        filteredArray.push(...data);
      }
      if (optionNames.includes("isRailyard")) {
        const data = locationData.filter((item) => item.isRailyard === true);
        filteredArray.push(...data);
      }
      if (optionNames.includes("isShipper")) {
        const data = locationData.filter((item) => item.isShipper === true);
        filteredArray.push(...data);
      }
      if (optionNames.includes("isShop")) {
        const data = locationData.filter((item) => item.isShop === true);
        filteredArray.push(...data);
      }
      if (optionNames.includes("isTerminal")) {
        
        const data = locationData.filter((item) => item.isTerminal === true);
        
        filteredArray.push(...data);
      }
      if (optionNames.includes("isWash")) {
        const data = locationData.filter((item) => item.isWash === true);
        filteredArray.push(...data);
      }
      
      setallLocation([...new Set(filteredArray)]);
    } else {
      getLocations();
    }
  };
  
  return (
    <div className="row df mt_30">
      <div className="col-xl-12">
        <div className="card special_bg card_shadow">
          <div className="card-body">
            <div className="row top_adjust">
              <div className="col-md-12">
                <h2 className="text-light">Locations</h2>
                <p className="user_sec_text">
                  Total: {allLocation?.length}
                </p>
                <div className="col-md-12">
                 
                  <p className="user_sec_text">Active: {allLocation?.filter(location => location.isActive).length}
                  &nbsp;&nbsp;
                  </p>
                </div>
                <ReactMultiselectCheckboxes
                  options={[...optionArray]}
                  placeholderButtonLabel="Location Type"
                  value={selectedLocation}
                  onChange={onLocationChange}
                  setState={setSelectedLocation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationHeader;
