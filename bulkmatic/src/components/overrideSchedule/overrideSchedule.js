//import React from 'react'
import "./overrideSchedule.css";
import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import DriverService from "../../services/driverService";
import Button from "react-bootstrap/Button";

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
const OverrideSchedule = (props) => {
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
  const [overridesData, setOverridesData] = useState([]);
  const [overridesDate, setOverridesDate] = useState({});
  const [overrideFromDate, setOverrideFromDate] = useState(null);
  const [overrideToDate, setOverrideToDate] = useState(null);
  
  ///cell validaion in grid//
  const [dropInCells , setdropInCells] = useState([])
  ///end//
  const { driver, openOverrideModal } = props;
  const handleFromDateChange = (date) => {
    setOverrideFromDate(date);
  };

  const handleToDateChange = (date) => {
    setOverrideToDate(date);
  };

  function handleCloseForCreate() {
    setOverridesDate({});
    setOverridesData([]);
    props.updateOverrideModal(false);
  }

  function dragElement(ev, block_type, block_position, isNew) {
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


  useEffect(async () => {
    //This UseEffect Colors Between the Blocks Of the Object , Modify this to change the color of the intermediate blocks , Not Start and End

    if (overridesData) {
      //Clear All Divs From Draw
      for (
        let i = 0;
        i < gridProperties.gridRows * gridProperties.gridColumns;
        i++
      ) {
        try {
          document.getElementById(i + "_gridcell_override").style.backgroundColor =
            "white";
        } catch {
          //Do Nothing
        }
      }
      let filledCellArray = []

      for (let index in overridesData) {
        //Color All Middle Cells Between Available and Drop
        let start_of_paint = overridesData[index].grid_cell_start_no;
        let end_of_paint = overridesData[index].grid_cell_end_no;

        let dayIndex =
          end_of_paint -
          parseInt(end_of_paint / gridProperties.gridColumns) *
          gridProperties.gridColumns -
          1;

        //Color the Extension Cells
        for (let i = start_of_paint; i < end_of_paint; i++) {
          let check_if_same_day =
            i -
            parseInt(i / gridProperties.gridColumns) *
            gridProperties.gridColumns -
            1;
          if (dayIndex == check_if_same_day) {
            //Push Into The Validation Array If There Is a Match
            filledCellArray.push(i);
            if (overridesData[index].block_type == "Available") {
              document.getElementById(i + "_gridcell_override").style.backgroundColor =
                "#77d6a2";
            } else if (overridesData[index].block_type == "Unavailable") {
              document.getElementById(i + "_gridcell_override").style.backgroundColor =
                "#fa737c";
            }
          }
        }
      }
      setdropInCells(filledCellArray);
    }
  }, [overridesData]);

  function allowDrop(ev) {
    ev.preventDefault();
    const dataParam = {};
  }

  async function addOverride(e) {
    e.preventDefault();
    let overridesArray = []
    if (overrideFromDate && overrideToDate && (overridesData.length > 0)) {
      for (let i = 0; i < overridesData.length; i++) {
        overridesArray.push({
          start_time: overridesData[i].start_time,
          end_time: overridesData[i].end_time,
          duration: overridesData[i].end_time - overridesData[i].start_time,
          block_type: overridesData[i].block_type,
        })
      }
      let requestData = {
        driver_id: driver.driver_id,
        from_date: DateTime.fromJSDate(overrideFromDate).startOf("day").toUTC().toMillis(),
        to_date: DateTime.fromJSDate(overrideToDate).startOf("day").toUTC().toMillis(),
        overridesArray
      }
      console.log(requestData)
      const driverService = new DriverService();
      const addOverrideResponse = await driverService.addOverrideSchedule(requestData)



      props.updateOverrideModal(false);

    }
    else {
      NotificationManager.error("From Date, To Date, Schedule are mandatory", "Error");
    }
  }

  const dropElement = (ev) => {
    ev.preventDefault();
    let dragAttribute_blockType = ev.dataTransfer.getData("dragAttribute_blockType");
    let dragAttribute_isNew = ev.dataTransfer.getData("dragAttribute_isNew");
    let dragAttribute_block_position = ev.dataTransfer.getData("dragAttribute_block_position");
    let overridesDataArray = []
    overridesDataArray = [...overridesData];
    let drop_grid_cell = parseInt(ev.target.id.split("_")[0]);
    if (dragAttribute_isNew === "true") {
      let notallowedDrop = dropInCells.includes(drop_grid_cell);

      if(notallowedDrop){
        NotificationManager.error("You Cannot Drag Drop On An Already Existing Schedule","Error");
      }
      else{
        let start_time = (Math.floor(drop_grid_cell / gridProperties.gridColumns) - 1) * 60
      let end_time = (Math.floor(drop_grid_cell / gridProperties.gridColumns)) * 60
      let newBlock = {
        "start_time": start_time,
        "end_time": end_time,
        "block_type": dragAttribute_blockType,
        "grid_cell_start_no": drop_grid_cell,
        "grid_cell_end_no": drop_grid_cell + gridProperties.gridColumns,
      }
      overridesDataArray.push(newBlock);

      }
      
      
    }
    else if (dragAttribute_block_position == "end") {
      let dragAttribute_drag_cell = parseInt(ev.dataTransfer.getData("dragAttribute_drag_cell"));
      let index = overridesDataArray.findIndex(x => parseInt(x.grid_cell_end_no) === dragAttribute_drag_cell)
      let end_time = (Math.floor(drop_grid_cell / gridProperties.gridColumns) - 1) * 60
      if(end_time <= overridesDataArray[index].start_time){
        NotificationManager.error("End time cannot be less than Start time","Error");
       }
       else{
        overridesDataArray[index].end_time = end_time
        overridesDataArray[index].grid_cell_end_no = drop_grid_cell
       }
     
    }
    else if (dragAttribute_block_position == "start") {
      let dragAttribute_drag_cell = parseInt(ev.dataTransfer.getData("dragAttribute_drag_cell"));
      let index = overridesDataArray.findIndex(x => parseInt(x.grid_cell_start_no) === dragAttribute_drag_cell)
      let start_time = (Math.floor(drop_grid_cell / gridProperties.gridColumns) - 1) * 60
      if(start_time >= overridesDataArray[index].end_time){
        NotificationManager.error("Start time cannot be greater than End time","Error");
       }
       else{
        overridesDataArray[index].grid_cell_start_no = drop_grid_cell;
        overridesDataArray[index].start_time = start_time;
       }
     
    }
    setOverridesData(overridesDataArray);
  }

  function getBlockTypeClassName(data) {
    if (data.block_type == "Available") {
      return "availablebutton-schedule";
    }
    else if (data.block_type == "Unavailable") {
      return "unavailablebutton-schedule";
    }
  }

  useEffect(async () => {
    let gridArray = [];
    let gridWidth = window.innerWidth / gridProperties.gridColumns;

    setGridWidth(gridWidth);
    setGridHeight(30);
    let gridHeight = 30;
    let x, y;
    for (let i = 0; i < gridProperties.gridRows * gridProperties.gridColumns; i++) {
      y = Math.floor(i / gridProperties.gridColumns) * gridHeight;
      x = (i * gridWidth) % (gridProperties.gridColumns * gridWidth);
      gridArray.push({
        i: i,
        x: x,
        y: y
      })
    }
    setScheduleGrid(gridArray);
  }, []);
  return (
    <>
      <NotificationContainer />
      <div class="form-group">
        <div className="meterial_autocomplete">
          <div className="add_override_header">
          <div className="override_modal_header  header-title1">Add Overrides</div>
          <div className="add_override_save">
            <button
              type="button"
              className="btn_blue btn-blue_schedule_override"
              onClick={(e) => addOverride(e)}

            >
              SAVE
            </button>
          </div>
          </div>



          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className="add_override_date_sec">


              <div className="w-45">
                <div><label for="txtEffectiveDate">From Date </label></div>
                <KeyboardDatePicker
                  disableToolbar
                  inputVariant="outlined"
                  variant="outlined"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  placeholder="MM-dd-yyyy"
                  minDate={new Date()}
                  value={overrideFromDate}
                  onChange={handleFromDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </div>
              <div className="w-45">
                <div><label for="txtEffectiveDate">To Date </label></div>
                <KeyboardDatePicker
                  disableToolbar
                  inputVariant="outlined"
                  variant="outlined"
                  format="MM/dd/yyyy"
                  placeholder="MM-dd-yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  minDate={overrideFromDate}
                  value={overrideToDate}
                  onChange={handleToDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </div>
            </div>
          </MuiPickersUtilsProvider>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-12">
          <div className="card card_shadow1">
            <div className="card-body ">
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
                                  {gridElement.i === 0 ? "Schedule" : ""
                                  }
                                </div>
                              ) : gridElement.i % 2 === 0 ? (
                                <div
                                  id={gridElement.i + "_gridcell_override"}
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
                                gridElement.i === 1 ?(
                                  <div
                                  id={gridElement.i + "_gridcell_override"}
                                  key={gridElement.i + "_gridcell_override"}
                                  className="schedule-grid-popup"
                                  style={{
                                    top: gridElement.y,
                                    left: gridElement.x,
                                    width: gridWidth - 1,
                                    height: gridHeight - 1,
                                  }}
                                >
                                  </div>
                                ) :
                                <>
                                  <div
                                    id={gridElement.i + "_gridcell_override"}
                                    key={gridElement.i + "_gridcell_override"}
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
                                    {overridesData.length > 0 ? (
                                      overridesData.map((data) =>
                                        data.grid_cell_start_no === gridElement.i ? (
                                          <div className={getBlockTypeClassName(data)}
                                            draggable="true"
                                            onDragStart={(e) => dragElement(e, data.block_type, "start", false)}
                                            id={`${data.grid_cell_start_no}_gridData`}
                                            key={data.grid_cell_start_no + "_gridData"}>{data.block_type}</div>
                                        )
                                          : null
                                      )
                                    ) : null}
                                    {overridesData.length > 0 ? (
                                      overridesData.map((data) =>
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
      {/* <Button className="mb_20" onClick={handleCloseForCreate}>Close</Button>
      <Button className="mb_20 ml_5" type="submit" onClick={(e) => addOverride(e)}>Save</Button> */}
    </>
  );
};

export default OverrideSchedule;