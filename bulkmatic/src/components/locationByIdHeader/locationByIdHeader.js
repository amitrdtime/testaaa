import React, { useState } from "react";
import LocationHeaderInfo from "./locationHeaderinfo";

function LocationByIdHeader(props) {
  const { locationById } = props;

  const [tabSelected, settabSelected] = useState({
    details: true,
    contacts: false,
    shipper: false,
    dedicatedTrailers: false,
    shipperPool: false,
    consigee: false,
  });

  const tabClickHandler = (e, tabname) => {
    if (tabname === "details") {
      settabSelected({
        details: true,
        contacts: false,
        shipper: false,
        dedicatedTrailers: false,
        shipperPool: false,
        consigee: false,
      });
    }
    if (tabname === "contacts") {
      settabSelected({
        details: false,
        contacts: true,
        shipper: false,
        dedicatedTrailers: false,
        shipperPool: false,
        consigee: false,
      });
    }
    if (tabname === "shipper") {
      settabSelected({
        details: false,
        contacts: false,
        shipper: true,
        dedicatedTrailers: false,
        shipperPool: false,
        consigee: false,
      });
    }
    if (tabname === "dedicatedTrailers") {
      settabSelected({
        details: false,
        contacts: false,
        shipper: false,
        dedicatedTrailers: true,
        shipperPool: false,
        consigee: false,
      });
    }
    if (tabname === "shipperPool") {
      settabSelected({
        details: false,
        contacts: false,
        shipper: false,
        dedicatedTrailers: false,
        shipperPool: true,
        consigee: false,
      });
    }
    if (tabname === "consigee") {
      settabSelected({
        details: false,
        contacts: false,
        shipper: false,
        dedicatedTrailers: false,
        shipperPool: false,
        consigee: true,
      });
    }
    props.parentcallback(tabname);
  };

  console.log("locationById", locationById);

  return (
    <div className="row df mt_30">
      <div className="tabs">
        <input
          type="radio"
          name="tabs"
          id="tabone"
          defaultChecked={tabSelected.details}
          onClick={(e) => tabClickHandler(e, "details")}
        />
        <label htmlFor="tabone">Details</label>
        <LocationHeaderInfo locationById={locationById} />
        {locationById?.isShipper ? (
          <>
            <input
              type="radio"
              name="tabs"
              id="tab3"
              // checked="checked"
              defaultChecked={tabSelected.shipper}
              onClick={(e) => tabClickHandler(e, "shipper")}
            />
            <label htmlFor="tab3">Shipper</label>
            <LocationHeaderInfo locationById={locationById} />
            <input
              type="radio"
              name="tabs"
              id="tab4"
              defaultChecked={tabSelected.dedicatedTrailers}
              onClick={(e) => tabClickHandler(e, "dedicatedTrailers")}
            />
            <label htmlFor="tab4">Dedicated Trailers</label>
            <LocationHeaderInfo locationById={locationById} />
            <input
              type="radio"
              name="tabs"
              id="tab5"
              defaultChecked={tabSelected.shipperPool}
              onClick={(e) => tabClickHandler(e, "shipperPool")}
            />
            <label htmlFor="tab5">Shipper Pool</label>
            <LocationHeaderInfo locationById={locationById} />
          </>
        ) : (
          ""
        )}
        {locationById?.isConsignee ? (
          <>
            <input
              type="radio"
              name="tabs"
              id="tab6"
              defaultChecked={tabSelected.consigee}
              onClick={(e) => tabClickHandler(e, "consigee")}
            />
            <label htmlFor="tab6">Consignee</label>
            <LocationHeaderInfo locationById={locationById} />
          </>
        ) : (
          ""
        )}

      </div>
    </div>
  );
}

export default LocationByIdHeader;
