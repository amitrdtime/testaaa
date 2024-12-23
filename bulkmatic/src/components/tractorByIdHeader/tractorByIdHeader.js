import React, { useState, useEffect } from "react";
import User from "../../assets/images/users/user-2.jpg";
import TractorHeaderInfo from "./tractorHeader"

function TractorByIdHeader(props) {
  const { tractorById, allTractors, convertDateTime} = props;

  const [tabSelected, settabSelected] = useState({
    details: true,
    Specifications: false,
  });

  const tabClickHandler = (e, tabname) => {
    if (tabname === "details") {
      settabSelected({
        details: true,
        Specifications: false,
      });
    }
    if (tabname === "Specifications") {
      settabSelected({
        details: false,
        Specifications: true,
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
          defaultChecked={tabSelected.details}
          onClick={(e) => tabClickHandler(e, "details")}
        />
        <label htmlFor="tabone">Details</label>
        <TractorHeaderInfo tractorById={tractorById} convertDateTime={convertDateTime} />
        <input
          type="radio"
          name="tabs"
          id="tabtwo"
          defaultChecked={tabSelected.Specifications}
          onClick={(e) => tabClickHandler(e, "Specifications")}
        />
        <label htmlFor="tabtwo">Specifications</label>
        <TractorHeaderInfo tractorById={tractorById} convertDateTime={convertDateTime} />
      </div>
    </div>
  );
}

export default TractorByIdHeader;
