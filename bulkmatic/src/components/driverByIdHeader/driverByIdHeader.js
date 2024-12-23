import React, { useState } from "react";
import DriverHeaderInfo from "./driverHeader";

function DriverByIdHeader(props) {
  const { driverById } = props;
  const [loc, setloc] = useState([]);
  const [tabSelected, settabSelected] = useState({
    details: true,
    preference: false,
    certifications: false,
    shedule: false,
  });

  const tabClickHandler = (e, tabname) => {
    if (tabname === "details") {
      settabSelected({
        details: true,
        preference: false,
        certifications: false,
        shedule: false,
      });
    }
    if (tabname === "preference") {
      settabSelected({
        details: false,
        preference: true,
        certifications: false,
        shedule: false,
      });
    }
    if (tabname === "certifications") {
      settabSelected({
        details: false,
        preference: false,
        certifications: true,
        shedule: false,
      });
    }
    if (tabname === "shedule") {
      settabSelected({
        details: false,
        preference: false,
        certifications: false,
        shedule: true,
      });
    }
    props.parentcallback(tabname);
  };

  return (
    <div className="row df mt_30">
      <div className="tabs">
        <input
          type="radio"
          name="tabs"
          id="tabone"
          checked={tabSelected.details}
          readOnly
          onClick={(e) => tabClickHandler(e, "details")}
        />
        <label htmlFor="tabone">Details</label>
        <DriverHeaderInfo driverById={driverById}/>
        <input
          type="radio"
          name="tabs"
          id="tabtwo"
          checked={tabSelected.preference}
          readOnly
          onClick={(e) => tabClickHandler(e, "preference")}
        />
        <label htmlFor="tabtwo">Preferences</label>
        <DriverHeaderInfo driverById={driverById}/>
  
        
        {
          driverById &&
            <>
              <input
                type="radio"
                name="tabs"
                id="tab4"
                checked={tabSelected.shedule}
                readOnly
                onClick={(e) => tabClickHandler(e, "shedule")}
              />
              <label htmlFor="tab4">Schedule</label>
              <DriverHeaderInfo driverById={driverById}/>
            </>
        }
      </div>
    </div>
  );
}

export default DriverByIdHeader;
