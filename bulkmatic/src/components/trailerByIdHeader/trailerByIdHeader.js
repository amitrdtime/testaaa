import React, { useState, useEffect } from "react";
import User from "../../assets/images/users/user-2.jpg";
import TrailerHeaderInfo from "./trailerHeader";

function TrailerByIdHeader(props) {
  const { trailerById, allTractor, convertDateTime } = props;

  const [tabSelected, settabSelected] = useState({
    details: true,
    Specifications: false,
    History: false,
  });
  const tabClickHandler = (e, tabname) => {
    if (tabname === "details") {
      settabSelected({
        details: true,
        Specifications: false,
        History: false,
      });
    }
    if (tabname === "Specifications") {
      settabSelected({
        details: false,
        Specifications: true,
        History: false,
      });
    }
    if (tabname === "History") {
      settabSelected({
        details: false,
        Specifications: false,
        History: true,
      });
    }
    props.parentcallback(tabname);
  };
  const location_section = {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
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
        <label for="tabone">Details</label>
        <TrailerHeaderInfo trailerById={trailerById} convertDateTime={convertDateTime} />
        <input
          type="radio"
          name="tabs"
          id="tabtwo"
          checked={tabSelected.Specifications}
          readOnly
          onClick={(e) => tabClickHandler(e, "Specifications")}
        />
        <label for="tabtwo">Specifications</label>
        <TrailerHeaderInfo trailerById={trailerById} convertDateTime={convertDateTime} />
        <input
          type="radio"
          name="tabs"
          id="tabthree"
          checked={tabSelected.History}
          readOnly
          onClick={(e) => tabClickHandler(e, "History")}
        />
        <label for="tabthree">History</label>
        <TrailerHeaderInfo trailerById={trailerById} convertDateTime={convertDateTime} />
      </div>
    </div>
  );
}

export default TrailerByIdHeader;
