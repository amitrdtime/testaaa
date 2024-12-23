import React, { useState, useEffect, useContext } from "react";
import TerminalService from "../../services/terminalService";
import AppFilterService from "../../services/appFilterService";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import TractorHeader from "../../components/tractorHeader/tractorHeader";
import TractorTable from "../../components/tractorTable/tractorTable";
import TractorService from "../../services/tractorService";
import TractorByIdHeader from "../../components/tractorByIdHeader/tractorByIdHeader";
import TractorBodyForDetails from "../../components/tractorBodyForDetails/tractorBodyForDetails";
import TractorBodyForSpecification from "../../components/tractorBodyForSpecification/tractorBodyForSpecification";
import { NotificationManager } from "react-notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import { ContextData } from "../../components/appsession";
import { useHistory, useParams } from "react-router-dom";
import {DateTime} from "luxon";

function Tractors() {
  const [userData, setuserData] = useContext(ContextData);
  const { id } = useParams();
  const [allTractors, setallTractors] = useState([]);
  const [allTractorsCount, setallTractorsCount] = useState("");
  const [tractorClicked, settractorClicked] = useState(false);
  const [tractorById, settractorById] = useState({});
  const [headerTabName, setheaderTabName] = useState("details");
  const [terminalsOptions, setTerminalsOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [regionOptions, setregionOptions] = useState([]);
  const [tractorslistData, setTractorslistData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    const planning_terminal_ids = userData.planning_terminal_ids;
    if (planning_terminal_ids?.length > 0) {
      setIsLoading(true)
      const terminalService = new TerminalService();
      let terminalinformationlist = await terminalService.getTerminalByTerminalIds(
        planning_terminal_ids
        );
        
        let filterData = {
          terminal_id: planning_terminal_ids,
        };
        setTerminalsOptions(terminalinformationlist);

      const tractorService = new TractorService();
      tractorService
        .getAllTractors(filterData)
        .then(function (tractorslist) {
          setallTractors(tractorslist);
          setTractorslistData(tractorslist);
          setallTractorsCount(tractorslist.length);
          setIsLoading(false)
        })
        .catch(function (err) {
          NotificationManager.error(err, "Error");
        });
    }
  }, [userData]);

  const handelcallbackFromHeader = (childdata) => {
    settractorClicked(childdata);
    setheaderTabName("details");
  };

  const handelcallback =async (childdata, tractor) => {
    settractorById(tractor);
    settractorClicked(childdata);
  };

  useEffect(() => {
    const tractorService = new TractorService();
    if (id !== undefined) {
      const t = tractorService
        .getTractor(id)
        .then(function (tractor) {
          // settractorById(tractor);
          handelcallback(true, tractor);
        })
        .catch(function (err) {
          NotificationManager.error(err, "Error");
        });
    }
  }, [id]);

  const handelcallbackFromLocationHeader = (childdata) => {
    setheaderTabName(childdata);
  };
  const handelcallbackFromTractors = (childData) => {
    if (childData.length > 0) {
      const tempallTractors = [...tractorslistData];
      const tempArray = [];
      tempallTractors.map((el) => {
        if (childData.indexOf(el.terminal_id) > -1) {
          tempArray.push(el);
        }
      });
      setallTractors(tempArray);
    } else {
      setallTractors(tractorslistData);
    }
  };

  useEffect(() => {
    const appFilter = new AppFilterService().getAppFilter();
    setStateOptions(appFilter.state);
    setregionOptions(appFilter.region);
  }, []);

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
        userclicked={tractorClicked}
        parentcallback={handelcallbackFromHeader}
      ></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {!tractorClicked ? (
              <>
                <TractorHeader
                  allTractors={allTractors}
                  // parentCallBackForTractorFilter={
                  //   parentCallBackForTractorFilter
                  // }
                  // tractorDropdown={tractorDropdown}
                  parentCallback={handelcallbackFromTractors}
                  terminalsOptions={terminalsOptions}
                  stateOptions={stateOptions}
                  regionOptions={regionOptions}
                 
                />
                <TractorTable
                  allTractors={allTractors}
                  isLoading = {isLoading}
                  parentcallback={handelcallback}
                  convertDateTime={convertDateTime}
                />
              </>
            ) : (
              <>
                <TractorByIdHeader
                  tractorById={tractorById}
                  parentcallback={handelcallbackFromLocationHeader}
                  convertDateTime={convertDateTime}
                 
                />
                {headerTabName === "details" ? (
                  <TractorBodyForDetails tractor={tractorById} />
                ) : headerTabName === "Specifications" ? (
                  <TractorBodyForSpecification tractor={tractorById} />
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

export default Tractors;
