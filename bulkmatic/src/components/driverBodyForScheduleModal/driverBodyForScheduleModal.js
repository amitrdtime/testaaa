//import React from 'react'
import "./driverBodyForScheduleModal.css";
import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import DriverService from "../../services/driverService";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { DateTime } from "luxon";
import { ContextData } from "../appsession";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

let clonedElement = null;
gsap.registerPlugin(Draggable);
const DriverBodyForScheduleModal = (props) => {
  const [userData, setuserData] = useContext(ContextData);
  const heightRef = useRef(null);
  const unavailableBoxRef = useRef();
  const availableBoxRef = useRef();
  const scheduleContainerRef = useRef();
  const scheduleContainerGridRef = useRef();

  const gridProperties = {
    gridRows: 25,
    gridColumns: 2,
  }
  const [gridWidth, setGridWidth] = useState();
  const [gridHeight, setGridHeight] = useState()
  const [scheduleGrid, setScheduleGrid] = useState();
  const [scheduleData, setScheduleData] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])

  const { driver } = props;
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
 
  useEffect(async () => {
    var currentdate = DateTime.local().toJSDate()

    getCompleteDate(currentdate);
    var dtArr = [];
    for (var m = 0; m < dayTimeArr.length; m++) {
      if (dayTimeArr[m].toString().length > 1) {
        dtArr.push(dayTimeArr[m]);
      } else {
        dtArr.push("0" + dayTimeArr[m]);
      }
    }
    setDayTimeArr(dtArr);

    setBoxHeight(parseInt(parseInt(heightRef.current.clientHeight) / 24));
 
  }, []);

  // useEffect(async () => {
  //   var dtArr = [];
  //   for (var m = 0; m < dayTimeArr.length; m++) {
  //     if (dayTimeArr[m].toString().length > 1) {
  //       dtArr.push(dayTimeArr[m]);
  //     } else {
  //       dtArr.push("0" + dayTimeArr[m]);
  //     }
  //   }
  //   setDayTimeArr(dtArr);
 
  // }, []);

  
  function dragElement(ev, block_type, block_position, isNew) {
    console.log("dragev", ev);

      if (userData.roles[0].permissionAccess.filter(it => it.permission === "Drivers" && it.isEdit === false).length > 0) {
        return NotificationManager.error(
          "You are not allowed to drag schedule", Error
        );
      } 
      else {
        ev.dataTransfer.setData("dragAttribute_targetId", ev.target.id);
        ev.dataTransfer.setData("dragAttribute_blockType", block_type);
        ev.dataTransfer.setData("dragAttribute_isNew", isNew);
        ev.dataTransfer.setData("dragAttribute_block_position", block_position);

        if (isNew) {
          ev.dataTransfer.dropEffect = "copy";
      }
      else {
        let grid_cell = ev.target.id.split("_")[0];
        ev.dataTransfer.dropEffect = "move";
        ev.dataTransfer.setData("dragAttribute_drag_cell", grid_cell);
      }
    }
  }

  function allowDrop(ev) {
    ev.preventDefault();
    const dataParam = {};
    // dataParam.scheduleId = startData + "_save";
    // handleDragSave(dataParam)

  }

  const dropElement = (ev) => {
    ev.preventDefault();
    let dragAttribute_targetId = ev.dataTransfer.getData("dragAttribute_targetId");
    let dragAttribute_blockType = ev.dataTransfer.getData("dragAttribute_blockType");
    let dragAttribute_isNew = ev.dataTransfer.getData("dragAttribute_isNew");
    let dragAttribute_block_position = ev.dataTransfer.getData("dragAttribute_block_position");
    let scheduleDataArray = []    
    scheduleDataArray = [...scheduleData];
    let drop_grid_cell = parseInt(ev.target.id.split("_")[0]);

    if (dragAttribute_isNew === "true") {
      console.log("scheduleData before add", scheduleData)
      console.log("dropev", ev);
      console.log("grid_cell", drop_grid_cell)
      let newBlock = {
        "start_time": 0,
        "end_time": 60,
        "block_type": dragAttribute_blockType,
        "grid_cell_start_no": drop_grid_cell
      }
      scheduleDataArray.push(newBlock);
      console.log("scheduleDataArray", scheduleDataArray);
    }
    else if(dragAttribute_block_position == "end" ) {
      let dragAttribute_drag_cell = parseInt(ev.dataTransfer.getData("dragAttribute_drag_cell"));
      let index = scheduleDataArray.findIndex(x => parseInt(x.grid_cell_end_no) === dragAttribute_drag_cell)
      console.log("index", index);
      scheduleDataArray[index].grid_cell_end_no = drop_grid_cell
    }
    setScheduleData(scheduleDataArray);
  }

  function getBlockTypeClassName(data) {
    console.log("data",data)
      if (data.block_type == "Available") {
        return "availablebutton-schedule";
      }
      else if (data.block_type == "Unavailable"){
        return "unavailablebutton-schedule";
      }
  }

  useEffect(async () => {
    let gridArray = [];
    let gridWidth = window.innerWidth / gridProperties.gridColumns;
    console.log("gridWidth",window.innerWidth)

    setGridWidth(gridWidth);
    setGridHeight(30);
    let gridHeight = 30;
    let x, y;
    for (let i = 0; i < gridProperties.gridRows * gridProperties.gridColumns; i++) {
      y = Math.floor(i / gridProperties.gridColumns) * gridHeight;
      console.log("y",y)
      x = (i * gridWidth) % (gridProperties.gridColumns * gridWidth);
      console.log("x",x)
      gridArray.push({
        i: i,
        x: x,
        y: y
      })
    }
    setScheduleGrid(gridArray);
    console.log("gridArray", gridArray)
    let boundsRefVariable = gsap.set(scheduleContainerGridRef.current, { height: gridProperties.gridRows * gridHeight + 1, width: gridProperties.gridColumns * gridWidth + 1 });
    console.log("boundsRefVariable", boundsRefVariable)
    let scheduleDataArray = []
    const driverService = new DriverService();
    const driverSchedule = await driverService.getDriverSchedule(
      driver.driver_id,
    );
    for (let index in driverSchedule) {
      let scheduleObject = driverSchedule[index];
      let dayIndex = daysOfWeek.indexOf(driverSchedule[index].schedule_day)
      scheduleObject.grid_cell_start_no = ((driverSchedule[index].start_time / 60) * 8 + dayIndex + 1);
      scheduleObject.grid_cell_end_no = ((driverSchedule[index].end_time / 60) * 8 + dayIndex + 1);
      scheduleDataArray.push(scheduleObject)
    }
    setScheduleData(scheduleDataArray)
    let snap = false;
  }, []);
  
  

 

  return (
    <>
    <div className="row mt_30">
      <div className="col-xl-12">
        <div className="card card_shadow1">
          <div className="card-body ">
            {/* <div className="row">
            <div className="col-md-12">
            <div className="col-md-6">
            <label >Form Date</label>
              <div className="meterial_autocomplete">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  
                    <KeyboardDatePicker
                    disableToolbar
                    format="MM-dd-yyyy"
                    id="date-picker-inline"
                    value={selectedDate}
                    inputVariant="outlined"                  
                    placeholder="MM-dd-yyyy"
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                  </MuiPickersUtilsProvider>
                </div>
            </div>
            <div className="col-md-6">
              
            <label>To Date</label>
              <div className="meterial_autocomplete">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  
                    <KeyboardDatePicker
                    disableToolbar
                    format="MM-dd-yyyy"
                    id="date-picker-inline"
                    
                    value={selectedDate}
                    inputVariant="outlined"                  
                    placeholder="MM-dd-yyyy"
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                  </MuiPickersUtilsProvider>
                </div>
              </div>
            </div>
          
            </div> */}
         
            {/* <div className="table_header_section">
              <div className="table_header">Schedule Details</div>
            </div> */}
            {/* <div className="schedule_information_text">To set a drivers Available and/or Unavailable time you simply drag either the green or red box and drop it at the desired start time for the desired day of the week.  You can then adjust the time by dragging either the start or end time up or down.</div> */}
            <div className="arrowcalender">

              <div className="indicator_wrapper">
                <div className="indicator_divide">
                  
                <div className="indicator_sec">
                      <div
                        id="available"
                        draggable="true"
                        onDragStart={(e) => dragElement(e, "Available", "header", true)}
                        className="indicator_inner ml_20"
                      >
                        <div
                          className="available_box"
                          ref={availableBoxRef}
                        ></div>
                        <div className="indicator_text">Available</div>
                      </div>
                      <div
                       id="unavailable" 
                       draggable="true"
                       onDragStart={(e) => dragElement(e, "Unavailable", "header", true)}
                      className="indicator_inner ml_20">
                        <div
                          className="unavailable_box"
                          ref={unavailableBoxRef}
                        ></div>
                        <div className="indicator_text">Unavailable</div>
                      </div>
                    </div>
                </div>
                
               
          
          
              </div>
             

            </div>
            <div className="table-responsive">
              <div className="calerder_total_section">
                <div className="appointment-popup">
                  <div className="appointment-calendar">
                    <div className="calendar-wrapper">
                      <div
                        className="calendar-week"
                        style={{ display: "inherit" }}
                      >
                      
                      </div>
                      <div className="calendar-week">
                        <ul>
                          <li>Schedule</li>
                          {/* <li>Available Schedule</li> */}
                          <li>Exception Schedule</li>
                         
                        </ul>
                       
                       
                      </div>
                      <div
                className="container_schedule"
                ref={scheduleContainerGridRef}
              >
                {scheduleGrid
                  ? scheduleGrid.map((gridElement) =>
                    gridElement.i < 1 ? (
                      <div
                        id={gridElement.i + "_topHeaderCell"}
                        className="schedule-grid-popup"
                        style={{
                          top: gridElement.y,
                          left: gridElement.x,
                          width: gridWidth - 1,
                          height: gridHeight - 1,
                        }}
                      >
                        {gridElement.i === 0 ? "Schedule" :
                          (
                            //-2 becuase World Weekdays start on Monday , and we want to start on Sunday and there are 8 elements
                            // daysOfWeek[gridElement.i - 1]
                            ""
                          )
                        }
                      </div>
                    ) : gridElement.i % 2 === 0 ? (
                      <div
                        id={gridElement.i + "_gridcell"}
                        className="schedule-grid-popup"
                        style={{
                          top: gridElement.y,
                          left: gridElement.x,
                          width: gridWidth - 1,
                          height: gridHeight - 1,
                        }}
                      >
                        { //Gridelement is genererated from I , there is a minus 1 as the number of rows are 25 and not 24
                          gridElement.i / 2 - 1 + ":00"
                        }

                      </div>
                    ) : (
                      <>
                        <div
                          id={gridElement.i + "_gridcell"}
                          key={gridElement.i + "_gridcell"}
                          className="schedule-grid-popup"
                          style={{
                            top: gridElement.y,
                            left: gridElement.x,
                            width: gridWidth - 1,
                            height: gridHeight - 1,
                          }}
                          onDrop={(e) => dropElement(e)}
                          onDragOver={(e) => allowDrop(e)}
                        >
                          {scheduleData.length > 0 ? (
                            scheduleData.map((data) =>
                              data.grid_cell_start_no === gridElement.i ? (

                                <div className={getBlockTypeClassName(data)}
                                  id={`${data.grid_cell_start_no}_gridData`}
                                  key={data.grid_cell_start_no + "_gridData"}>{data.block_type}</div>

                              )
                                : null
                            )
                          ) : null}
                          {scheduleData.length > 0 ? (
                            scheduleData.map((data) =>
                              data.grid_cell_end_no === gridElement.i ? (
                                <div className={getBlockTypeClassName(data)}
                                draggable="true"
                                onDragStart={(e) => dragElement(e, data.block_type, "end", false)}
                                  id={`${data.grid_cell_end_no}_gridData`}
                                  key={data.grid_cell_end_no + "_gridData"}>End</div>
                              )
                                : null
                            )
                          ) : null}

                        </div>
                      </>
                    )
                  )
                  : null}

              </div>
                    </div>
                  </div>
                </div>

                <NotificationContainer />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>   
    </>
  );
};

export default DriverBodyForScheduleModal;