import Trailer from "../../assets/images/baseline_trailer.png";
// import baselinesave from "../../assets/images/baseline_save.png";
// import PlannerBoardTrailersTable from "../plannerBoardTrailersTable/plannerBoardTrailersTable";
// import PlannerBoardOrdersTable from "../plannerBoardOrdersTable/plannerBoardOrdersTable";

import React, { useState, useEffect, useContext } from "react";
// import Draggable, { DraggableCore } from "react-draggable";
import ProgressBar from "react-bootstrap/ProgressBar";
import PlanningBoardRowBodyFormatted from "../planningboardRow/planningboardRowFormatted";
// import PlanningBoardService from "../../services/planingBoardService";

const PlannerBoardTrailerViewBodyFormatted = (props) => {
  const { PlanningBoardResponse , startdate } = props;
  const [allOrdersArray, setAllOrdersArray] = useState([]);
  const [allTrailersArray, setAllTrailersArray] = useState([]);
  const [tabSelected, settabSelected] = useState("");
  const [hourArr, sethourArr] = useState(Array.from(Array(24).keys()));
  const [completeDate, setcompleteDate] = useState({});
  const [defaultDate, setdefaultDate] = useState(new Date(Date.now()));
  const [dateClickedIndex, setdateClickedIndex] = useState(0);
  const [dataRowArr, setdataRowArr] = useState(Array.from(Array(5).keys()));
  const [PlanningBoardData, setallPlanningBoardData] = useState({});

  const handleStart = () => {};
  const handleDrag = () => {};
  const handleStop = () => {};
  const getCompleteDate = (currentdate) => {
    let day = currentdate.toDateString().split(" ")[0];
    let month = currentdate.toDateString().split(" ")[1];
    let date = currentdate.toDateString().split(" ")[2];
    let year = currentdate.toDateString().split(" ")[3];
    setcompleteDate({
      day: day,
      month: month,
      date: date,
      year: year,
    });
  };
  useEffect(() => {
    var currentdate = new Date(Date.now());
    getCompleteDate(currentdate);
  }, []);
  useEffect(() => {
    getCompleteDate(new Date(startdate));
  }, [startdate]);

  // useEffect(() => {
  //   setAllOrdersArray(allOrders);
  // }, [allOrders]);

  // useEffect(() => {
  //   setAllTrailersArray(allTrailers);
  // }, [allTrailers]);

  const nextDateChange = (e) => {
    setdateClickedIndex(dateClickedIndex + 1);
    var currentdate = "";
    if (startdate) {
      currentdate = new Date(
        new Date(startdate).getTime() +
          (dateClickedIndex + 1) * 24 * 60 * 60 * 1000
      );
    } else {
      currentdate = new Date(
        Date.now() + (dateClickedIndex + 1) * 24 * 60 * 60 * 1000
      );
    }
    getCompleteDate(currentdate);
    var filterData = {};
    filterData["date"] = new Date(currentdate);
    props.parentCallBackForDriverViewBodyFormatted(filterData);
  };
  const previousDayChange = () => {
    setdateClickedIndex(dateClickedIndex - 1);
    if (startdate) {
      var currentdate = new Date(
        new Date(startdate).getTime() +
          (dateClickedIndex - 1) * 24 * 60 * 60 * 1000
      );
    } else {
      var currentdate = new Date(
        Date.now() + (dateClickedIndex - 1) * 24 * 60 * 60 * 1000
      );
    }
    getCompleteDate(currentdate);
    var filterData = {};
    filterData["date"] = new Date(currentdate);
    props.parentCallBackForDriverViewBodyFormatted(filterData);
  };

  return (
    <>
      <div className="row mt_30">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body ">
              <div className="planner_top_date">
                <div className="planner_date_text">
                  {completeDate.month +
                    " " +
                    completeDate.date +
                    " " +
                    completeDate.day +
                    " " +
                    completeDate.year}
                </div>
                <div className="ml_12">
                  <div>
                    <i
                      class="fa fa-caret-up fa-2x"
                      aria-hidden="true"
                      onClick={nextDateChange}
                    ></i>
                  </div>
                  <div>
                    <i
                      class="fa fa-caret-down fa-2x"
                      aria-hidden="true"
                      onClick={previousDayChange}
                    ></i>
                  </div>
                </div>
              </div>
              <div className="day_time_container">
                <div className="am_section">AM</div>
                <div className="day_time_section">
                  {hourArr.map((item) => (
                    <div className="day_time_inner" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="pm_section">PM</div>
              </div>

              <div className="planner_scroll_section">
                {Object.keys(PlanningBoardResponse).length > 0 ? (
                  <>
                    {Object.keys(PlanningBoardResponse).map((item) => (
                      <div className="planner_Board_wrapper" key={item}>
                        <div className="planner_board_left_image">
                          <div>
                            <img
                              src={Trailer}
                              alt="Baseline-Shiping"
                              title="Baseline-Shiping"
                              className="planner_left_image"
                            />
                          </div>
                          <div className="planner_board_left_image_text">
                            {
                              PlanningBoardResponse[item]
                                .trailerId /*trailerId Here DriverID from Item*/
                            }
                          </div>
                        </div>
                        <PlanningBoardRowBodyFormatted
                          view="trailer"
                          rowitem={item}
                          blockHours={PlanningBoardResponse[item]}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                  {
                    props.PlannerBoardLoadingPage? <ProgressBar animated now={100} /> : (<div>No planning to display</div>)
                  }
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlannerBoardTrailerViewBodyFormatted;
