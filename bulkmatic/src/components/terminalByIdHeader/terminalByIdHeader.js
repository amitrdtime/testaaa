import React, { useState, useEffect } from "react";
import User from "../../assets/images/users/user-2.jpg";
import TerminalHeaderInfo from "../../pages/terminals/terminalHeader";

function TerminalByIdHeader(props) {
  const { terminal } = props;

  const [tabSelected, settabSelected] = useState({
    details: true,
    Planners: false,
    Users: false,
    Drivers: false,
    Trailers: false,
    Tractors: false,
  });
  const [loc, setloc] = useState([]);

  const tabClickHandler = (e, tabname) => {
    if (tabname === "details") {
      settabSelected({
        details: true,
        Planners: false,
        Users: false,
        Drivers: false,
        Trailers: false,
        Tractors: false,
      });
    }
    if (tabname === "Planners") {
      settabSelected({
        details: false,
        Planners: true,
        Users: false,
        Drivers: false,
        Trailers: false,
        Tractors: false,
      });
    }
    if (tabname === "Users") {
      settabSelected({
        details: false,
        Planners: false,
        Users: true,
        Drivers: false,
        Trailers: false,
        Tractors: false,
      });
    }
    if (tabname === "Drivers") {
      settabSelected({
        details: false,
        Planners: false,
        Users: false,
        Drivers: true,
        Trailers: false,
        Tractors: false,
      });
    }
    if (tabname === "Trailers") {
      settabSelected({
        details: false,
        Planners: false,
        Users: false,
        Drivers: false,
        Trailers: true,
        Tractors: false,
      });
    }
    if (tabname === "Tractors") {
      settabSelected({
        details: false,
        Planners: false,
        Users: false,
        Drivers: false,
        Trailers: false,
        Tractors: true,
      });
    }
    props.parentcallback(tabname);
  };

  useEffect(() => {
    if (terminal?.longitude || terminal?.latitude) {
      // alert("ok")
      let obj = {
        lat: Number(terminal?.latitude),
        lng: Number(terminal?.longitude),
      };
      setloc([obj]);
    }
  }, [Object.keys(terminal).length > 0]);

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
        <TerminalHeaderInfo terminal={terminal} loc={loc}/>
        <input
          type="radio"
          name="tabs"
          id="tab4"
          checked={tabSelected.Drivers}
          readOnly
          onClick={(e) => tabClickHandler(e, "Drivers")}
        />
        <label htmlFor="tab4">Drivers</label>
        <TerminalHeaderInfo terminal={terminal} loc={loc}/>
        <input
          type="radio"
          name="tabs"
          id="tab5"
          checked={tabSelected.Trailers}
          readOnly
          onClick={(e) => tabClickHandler(e, "Trailers")}
        />
        <label htmlFor="tab5">Trailers</label>
        <TerminalHeaderInfo terminal={terminal} loc={loc}/>
        <input
          type="radio"
          name="tabs"
          id="tab6"
          checked={tabSelected.Tractors}
          readOnly
          onClick={(e) => tabClickHandler(e, "Tractors")}
        />
        <label htmlFor="tab6">Tractors</label>
        <TerminalHeaderInfo terminal={terminal} loc={loc}/>
      </div>
    </div>
  );
}

export default TerminalByIdHeader;
