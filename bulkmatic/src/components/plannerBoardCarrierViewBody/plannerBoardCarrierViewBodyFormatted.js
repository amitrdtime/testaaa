import BaselineShiping from "../../assets/images/baseline_local_shipping.png";
import PlannerBoardTrailersTable from "../plannerBoardTrailersTable/plannerBoardTrailersTable";
import PlannerBoardOrdersTable from "../plannerBoardOrdersTable/plannerBoardOrdersTable";

import React, { useState, useEffect, useContext } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import PlanningBoardRowBodyFormatted from "../planningboardRow/planningboardRowFormatted";

const PlannerBoardCarrierViewBodyFormatted = (props) => {
  const { allOrders, allTrailers, PlanningBoardResponse, startdate } = props;
  const [hourArr, sethourArr] = useState(Array.from(Array(24).keys()));
  const [completeDate, setcompleteDate] = useState({});
  const [defaultDate, setdefaultDate] = useState(new Date(Date.now()));
  const [dateClickedIndex, setdateClickedIndex] = useState(0);

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

  const nextDateChange = (e) => {
    let dateIndex = dateClickedIndex;
    setdateClickedIndex(dateIndex + 1);    
    var currentdate = '';
    if(startdate)
    {
      currentdate = new Date(
        new Date(startdate).getTime() + (1) * 24 * 60 * 60 * 1000
      );
    }
    else
    {
      currentdate = new Date(
        Date.now() + (1) * 24 * 60 * 60 * 1000
      );
    }
    getCompleteDate(currentdate);
    var filterData = {};
    filterData["date"] = new Date(currentdate);
    props.parentCallBackForDriverViewBodyFormatted(filterData);
  };
  
  const previousDayChange = () => {
    let dateIndex = dateClickedIndex;
    setdateClickedIndex(dateIndex - 1);
    if(startdate)
    {
      var currentdate = new Date(
        new Date(startdate).getTime() + (-1) * 24 * 60 * 60 * 1000
      );
    }
    else
    {
      var currentdate = new Date(
        Date.now() + (-1) * 24 * 60 * 60 * 1000
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
                <div className="am_section">A.M</div>
                <div className="day_time_section">
                  {hourArr.map((item) => (
                    <div className="day_time_inner" key={item}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="pm_section">P.M</div>
              </div>
              <div className="planner_scroll_section">
                {Object.keys(PlanningBoardResponse).length > 0 ? (
                  <>
                    {Object.keys(PlanningBoardResponse).map((item) => (

                      // 
                      <div className="planner_Board_wrapper" key={item}>
                        <div className="planner_board_left_image">
                          <div>
                            <img
                              src={BaselineShiping}
                              alt="Baseline-Shiping"
                              title="Baseline-Shiping"
                              className="planner_left_image"
                            />
                          </div>
                          <div className="planner_board_left_image_text">
                            {
                              PlanningBoardResponse[item].driverId /*driverId Here DriverID from Item*/
                            }
                          </div>
                        </div>
                        <PlanningBoardRowBodyFormatted view= "driver" rowitem={item} blockHours = {PlanningBoardResponse[item]} />
                      </div>
                    ))}
                  </>
                ) : (      
                  <>
                    {
                      props.PlannerBoardLoadingPage? (<ProgressBar animated now={100} />) : (<div>No planning to display</div>)
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

export default PlannerBoardCarrierViewBodyFormatted;
