import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import TrailerHeader from "../../components/trailerHeader/trailerHeader";
import TrailerTable from "../../components/trailerTable/trailerTable";
import React, { useState, useEffect, useContext, useCallback } from "react";
import TrailerService from "../../services/trailerService";
import TrailerByIdHeader from "../../components/trailerByIdHeader/trailerByIdHeader";
import TrailerBodyForDetails from "../../components/trailerBodyForDetails/trailerBodyForDetails";
import TrailerBodyForSpecification from "../../components/trailerBodyForSpecification/trailerBodyForSpecification";
import TrailerBodyForHistory from "../../components/trailerBodyForHistory/trailerBodyForHistory";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useHistory, useParams } from "react-router-dom";
import TerminalService from "../../services/terminalService";
import CommoditygroupService from "../../services/commoditygroupService";
import AppFilterService from "../../services/appFilterService";
import { ContextData } from "../../components/appsession";
import { DateTime } from "luxon";

function Trailers(location) {
  const [userData, setuserData] = useContext(ContextData);
  const { id } = useParams();

  const [allTrailers, setallTrailer] = useState([]);
  const [allTrailerCount, setallTrailerCount] = useState("");
  const [trailerClicked, settrailerClicked] = useState(false);
  const [trailerById, settrailerById] = useState({});
  const [headerTabName, setheaderTabName] = useState("details");
  const [commodity, setCommodity] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [terminalsOptions, setTerminalsOptions] = useState([]);
  const [trailerlistData, setTrailerlistData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const handelcallbackFromHeader = (childdata) => {
    settrailerClicked(childdata);
    setheaderTabName("details");
  };

  useEffect(async () => {
    const planning_terminal_ids = userData.planning_terminal_ids;

    if (planning_terminal_ids?.length > 0) {
      setIsLoading(true);
      const terminalService = new TerminalService();
      let terminalinformationlist = await terminalService.getTerminalByTerminalIds(
        planning_terminal_ids
      );
      setTerminalsOptions(terminalinformationlist);
      let filterData = {
        terminal_id: planning_terminal_ids,
      };
  
      const trailerService = new TrailerService();
      trailerService
        .getAllTrailersbyTerminalID(filterData)
        .then(function (trailerslist) {
          setIsLoading(false);
          setallTrailer(trailerslist);
          setTrailerlistData(trailerslist);
          setallTrailerCount(trailerslist.length);
          NotificationManager.success("Trailers loaded successfully", "Success");
        })
        .catch(function (err) {
          NotificationManager.error(err, "Error");
        });

    }
  }, [userData]);

  const handelcallback = (childdata, trailer) => {
    settrailerById(trailer);
    settrailerClicked(childdata);
  };

  const handelcallbackFromLocationHeader = (childdata) => {
    setheaderTabName(childdata);
  };

  useEffect(() => {
    const trailerService = new TrailerService();
    if (id !== undefined) {
      const t = trailerService
        .getTrailer(id)
        .then(function (trailer) {
          // settrailerById(trailer);
          handelcallback(true, trailer);
        })
        .catch(function (err) {
          NotificationManager.error(err, "Error");
        });
    }
  }, [id]);

  useEffect(() => {
    const commodity = new CommoditygroupService();
    commodity.getAllCommodityGroups().then((res) => {
      setCommodity(res);
    });

    const appFilter = new AppFilterService().getAppFilter();
    setRegionOptions(appFilter.region);
  }, []);

  const handelcallbackFromTrailer = (childData) => {
    if(childData.length > 0){
      const tempallTrailer = [...trailerlistData];
      const tempArray = [];
      tempallTrailer?.map((el) => {
        if (childData.indexOf(el.terminal?.terminal_id) > -1) {
          tempArray.push(el);
        }
      });
      setallTrailer(tempArray);
    }else{
      setallTrailer(trailerlistData);
    }
  }
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
        userclicked={trailerClicked}
        parentcallback={handelcallbackFromHeader}
      ></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {!trailerClicked ? (
              <>
                <TrailerHeader
                  allTrailers={allTrailers}
                  terminalsOptions={terminalsOptions}
                  commodity={commodity}
                  regionOptions={regionOptions}
                  handelcallbackFromTrailer={handelcallbackFromTrailer}
                />
                <TrailerTable
                  allTrailers={allTrailers}
                  isLoading = {isLoading}
                  parentcallback={handelcallback}
                  convertDateTime={convertDateTime}
                />
              </>
            ) : (
              <>
                <TrailerByIdHeader
                  trailerById={trailerById}
                  parentcallback={handelcallbackFromLocationHeader}
                  convertDateTime={convertDateTime}
                />
                {headerTabName === "details" ? (
                  <TrailerBodyForDetails trailer={trailerById} />
                ) : headerTabName === "Specifications" ? (
                  <TrailerBodyForSpecification trailer={trailerById} />
                ) : headerTabName === "History" ? (
                  <TrailerBodyForHistory trailerById={trailerById} />
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

export default Trailers;
