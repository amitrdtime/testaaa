//import React from 'react'
import "./driverBodyForSchedule.css";
import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import DriverService from "../../services/driverService";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { DateTime } from "luxon";
import { ContextData } from "../appsession";
import Modal from "react-bootstrap/Modal";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import Button from "react-bootstrap/Button";
import { Typeahead } from 'react-bootstrap-typeahead';
import OverrideSchedule from "../../components/overrideSchedule/overrideSchedule";
import OverrideUpdateSchedule from "../../components/overrideUpdateSchedule/OverrideUpdateSchedule"
import { process } from "@progress/kendo-data-query";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { SecurityUpdateWarningOutlined } from "@mui/icons-material";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

let clonedElement = null;
gsap.registerPlugin(Draggable);

const DriverBodyForSchedule = (props) => {
  const [userData, setuserData] = useContext(ContextData);
  const heightRef = useRef(null);
  const unavailableBoxRef = useRef();
  const availableBoxRef = useRef();
  const scheduleContainerRef = useRef();
  const scheduleContainerGridRef = useRef();

  const { driver } = props;
  const gridProperties = {
    gridRows: 25,
    gridColumns: 8,
  }
  const [gridWidth, setGridWidth] = useState();
  const [gridHeight, setGridHeight] = useState()
  const [scheduleGrid, setScheduleGrid] = useState();
  const [scheduleData, setScheduleData] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
  const [daysArr, setDaysArr] = useState([
    {
      day: "Sun" || "Sunday",
      nights_out: "",
    },
    {
      day: "Mon" || "Monday",
      nights_out: ""
    },
    {
      day: "Tue" || "Tuesday",
      nights_out: ""
    },{
      day: "Wed" || "Wednesday",
      nights_out: ""
    },{
      day: "Thu" || "Thursday",
      nights_out: ""
    },{
      day: "Friday" || "Fri",
      nights_out: ""
    },{
      day: "Sat" || "Saturday",
      nights_out: ""
    }
  ]);
  const [modalShow, setModalShow] = useState(false)
  /// over_ride modal section start ///
  const [addoverridedate, setaddoverridedate] = useState({});
  const [overrideeditdata,setoverrideeditdata]=useState([]);

  const [showeditModal, setshoweditModal] = useState(false);
  const [openOverrideModal, setOpenOverrideModal] = useState(false)
  const [alloverrideSchedule, setalloverrideSchedule] = useState([])
  const [filledInCells , setfilledInCells] = useState([])
  const [loading, setLoading] = useState(false)
  const [nightOutData, setNightOutData] = useState([])
  const [nightForEdit, setNightForEdit] = useState({})
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });
  const [dataResult, setDataResult] = useState(
    process(alloverrideSchedule, dataState)
  );

  const dataStateChange = (event) => {
    setDataResult(process(alloverrideSchedule, event.dataState));
    setDataState(event.dataState);
  };

  const editoverridemodal = async (override) => {
    try {
      const driverService = new DriverService();
      const getoverridedata = await driverService.getOverridesbyoverridelistid(override.id)
      console.log("getoverridedata",getoverridedata)
      setoverrideeditdata(getoverridedata)
    }
    catch(error) {
      console.log("error")
    }
    setshoweditModal(true);
  };
  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  const saveDriverSchedule = async (requestData) => {
    try {
      
      await timeout(500)
        setLoading(true)
        const driverService = new DriverService();
        const addScheduleResponse = await driverService.addDriverSchedule(requestData)
        await refreshScheduleData()
        setLoading(false)
      
    }
    catch(error) {
      console.log("error")
    }
  }

  const updateDriverSchedule = async (requestData) => {
    try {
      const driverService = new DriverService();
      const addScheduleResponse = await driverService.updateDriverSchedule(requestData)
      await refreshScheduleData()
    }
    catch(error) {
      console.log("error")
    }
  }

  const Editoverridemodal = (props) => {
    return (
      <td className="adjustbutton">
        <button
          type="button"
          class="btn-blue_schedule_override ml_10"
          onClick={() => editoverridemodal(props.dataItem)}
        >
          Edit
          {/* <i class="fa fa-pencil mr_5 del_icon" aria-hidden="true" onClick={() => editoverridemodal(props.dataItem)}></i> */}
        </button>
      </td>
    );
  };
  const EditOverrideModal = (props) => (
    <Editoverridemodal
      {...props}
      editoverridemodal={editoverridemodal}
    />
  );

  const from_DateTimeValue = (props) => {
    let from_Dates = Date.parse(props.dataItem.from_date);
    return (
      <td>
        {DateTime.fromMillis(parseInt(from_Dates))
          .toFormat("MM-dd-yyyy")
          .toString()}
      </td>
    );
  };

  const to_DateTimeValue = (props) => {
    let to_Dates = Date.parse(props.dataItem.to_date);
    return (
      <td>
        {DateTime.fromMillis(parseInt(to_Dates))
          .toFormat("MM-dd-yyyy")
          .toString()}
      </td>
    );
  };

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

  function allowDrop(ev) {
    ev.preventDefault();
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
    let dayIndex = (drop_grid_cell - parseInt((drop_grid_cell / gridProperties.gridColumns))*gridProperties.gridColumns)-1

    if (dragAttribute_isNew === "true") {
      let allowDropBoolean = filledInCells.includes(drop_grid_cell);
      if (allowDropBoolean) {
        NotificationManager.error("You Cannot Drag Drop On An Already Existing Schedule","Error");
      } else {      
      let start_time = ((Math.floor(drop_grid_cell / gridProperties.gridColumns) - 1) * 60)
      let end_time = ((Math.floor(drop_grid_cell / gridProperties.gridColumns)) * 60)
      let newBlock = {
        "start_time": start_time,
        "end_time": end_time,
        "block_type": dragAttribute_blockType,
        "grid_cell_start_no": drop_grid_cell,
        "grid_cell_end_no": drop_grid_cell + gridProperties.gridColumns,
        "schedule_day": daysOfWeek[dayIndex]
      }
      let saveBlockObject = {
        "start_time": start_time,
        "end_time": end_time,
        "block_type": dragAttribute_blockType,
        "duration": end_time - start_time,
        "schedule_day": daysOfWeek[dayIndex],
        "driver_id": driver.driver_id,
      }
      scheduleDataArray.push(newBlock);
      saveDriverSchedule(saveBlockObject);
      setScheduleData(scheduleDataArray);
      }
    }
    else if (dragAttribute_block_position == "end") {
      if( loading == false ) {
        let dragAttribute_drag_cell = parseInt(ev.dataTransfer.getData("dragAttribute_drag_cell"));
        let index = scheduleDataArray.findIndex(x => parseInt(x.grid_cell_end_no) === dragAttribute_drag_cell)
        scheduleDataArray[index].grid_cell_end_no = drop_grid_cell;
        let start_time = (Math.floor(drop_grid_cell / gridProperties.gridColumns) - 1) * 60
        let end_time = (Math.floor(drop_grid_cell / gridProperties.gridColumns) - 1) * 60
        let updateScheduleBody = {}
        if(end_time <= scheduleDataArray[index].start_time) {
          NotificationManager.error("End time cannot be less than Start time","Error");
        } else {
          updateScheduleBody = {
           "end_time": end_time,
           "duration": end_time - scheduleDataArray[index].start_time,
           "id": scheduleDataArray[index].id,
           "driver_id": driver.driver_id,
           "block_type": dragAttribute_blockType,
           "schedule_day": daysOfWeek[dayIndex],
           "updated_by": userData.userId
         }
        }
  
        //Check For Same Day Schedule
          let check_if_same_day = (scheduleDataArray[index].grid_cell_start_no - parseInt(scheduleDataArray[index].grid_cell_start_no / gridProperties.gridColumns) * gridProperties.gridColumns - 1);
          if (dayIndex == check_if_same_day) {
              updateDriverSchedule(updateScheduleBody);
              setScheduleData(scheduleDataArray);    
            }
            else {
              NotificationManager.error("You Must Drag Between The Same Day","Error");
            }
      }

      }

    else if (dragAttribute_block_position == "start") {
      if( loading == false ) {
        let dragAttribute_drag_cell = parseInt(ev.dataTransfer.getData("dragAttribute_drag_cell"));
        let index = scheduleDataArray.findIndex(x => parseInt(x.grid_cell_start_no) === dragAttribute_drag_cell)
        scheduleDataArray[index].grid_cell_start_no = drop_grid_cell;
        let start_time = (Math.floor(drop_grid_cell / gridProperties.gridColumns)-1) * 60
        let updateScheduleBody = {}
        if(start_time >= scheduleDataArray[index].end_time){
          NotificationManager.error("Start time cannot be greater than End time","Error");
        } else {

           updateScheduleBody = {
            "start_time": start_time,
            // "end_time": end_time,
            "duration": scheduleDataArray[index].end_time - start_time,
            "id": scheduleDataArray[index].id,
            "driver_id": driver.driver_id,
            "block_type": dragAttribute_blockType,
            "schedule_day": daysOfWeek[dayIndex],
            "updated_by": userData.userId
          }
        }
  
        let check_if_same_day = (scheduleDataArray[index].grid_cell_end_no - parseInt(scheduleDataArray[index].grid_cell_end_no / gridProperties.gridColumns) * gridProperties.gridColumns - 1);
            if (dayIndex == check_if_same_day) {
              updateDriverSchedule(updateScheduleBody);
              setScheduleData(scheduleDataArray);
            }
            else {
              NotificationManager.error("You Must Drag Between The Same Day","Error");
            }
      }
      
    }
  }

  function getBlockTypeClassName(data) {
    if (data.block_type == "Available") {
      return "availablebutton-schedule";
    }
    else if (data.block_type == "Unavailable") {
      return "unavailablebutton-schedule";
    }
  }

  const refreshScheduleData = async ()=> {
    let scheduleDataArray = [];
    const driverService = new DriverService();
    const driverSchedule = await driverService.getDriverSchedule(
      driver.driver_id,
    );
    for (let index in driverSchedule) {
      let scheduleObject = driverSchedule[index];
      let dayIndex = daysOfWeek.indexOf(driverSchedule[index].schedule_day)
      scheduleObject.grid_cell_start_no = ((((driverSchedule[index].start_time / 60) + 1) * 8) + dayIndex + 1);
      scheduleObject.grid_cell_end_no = ((((driverSchedule[index].end_time / 60) + 1) * 8) + dayIndex + 1);
      scheduleDataArray.push(scheduleObject)
    }
    setScheduleData(scheduleDataArray)
  }
  const updateOverrideModal = async(value) => {
    setOpenOverrideModal(value);
    const driverService = new DriverService();
    const driverSchedule = await driverService.getoverridescheduledriverid(driver.driver_id);
    setDataResult(process(driverSchedule, dataState));
    setalloverrideSchedule(driverSchedule);
  };

  useEffect(async () => {
    //This UseEffect Colors Between the Blocks Of the Object , Modify this to change the color of the intermediate blocks , Not Start and End

    if (scheduleData) {
      //Clear All Divs From Draw
      for (
        let i = 0;
        i < gridProperties.gridRows * gridProperties.gridColumns;
        i++
      ) {
        try {
          document.getElementById(i + "_gridcell").style.backgroundColor =
            "white";
        } catch {
          //Do Nothing
        }
      }
      let filledCellArray = []

      for (let index in scheduleData) {
        //Color All Middle Cells Between Available and Drop
        let start_of_paint = scheduleData[index].grid_cell_start_no;
        let end_of_paint = scheduleData[index].grid_cell_end_no;

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
            if (scheduleData[index].block_type == "Available") {
              document.getElementById(i + "_gridcell").style.backgroundColor =
                "#77d6a2";
            } else if (scheduleData[index].block_type == "Unavailable") {
              document.getElementById(i + "_gridcell").style.backgroundColor =
                "#fa737c";
            }
          }
        }
      }
      setfilledInCells(filledCellArray);
    }
  }, [scheduleData, loading]);


  async function deleteOverrides(ev) {
    ev.preventDefault();
    

    let dragAttribute_targetId = ev.target.parentElement.id;
    let delete_grid_cell_start = parseInt(dragAttribute_targetId.split("_")[0]);

    let index = scheduleData.findIndex(x => parseInt(x.grid_cell_start_no) === delete_grid_cell_start);
    let deleteKeyForDatabase = scheduleData[index].id;
    //Somnath Write Service For Delete Here

    try {
      const driverService = new DriverService();
      const driverSchedulereturn = await driverService.deleteoverrideschedulebyid(deleteKeyForDatabase);
      let splicedArray = scheduleData.filter(object => {
        return object.id !== deleteKeyForDatabase;
      });
      setScheduleData(splicedArray)
      NotificationManager.success("This Schedule is Deleted", "Success");
    }
    catch {
      NotificationManager.error("Oops ! There is an error , please contact support !", "Error");
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
    await refreshScheduleData()
  }, []);

  useEffect(async () => {
    const driverService = new DriverService();
    const driverSchedule = await driverService.getoverridescheduledriverid(driver.driver_id);
    const driverNightOuts = await driverService.getSchedulePreferencesbyId(driver.driver_id);
    setNightOutData(driverNightOuts);
    setDataResult(process(driverSchedule, dataState));
    setalloverrideSchedule(driverSchedule);
  }, []);

  useEffect(() => {
    setDataResult(process(alloverrideSchedule, dataState));
  }, [alloverrideSchedule]);

  useEffect (() => {
    const tempdaysArr = [...daysArr]
    nightOutData.map(el=>{
      tempdaysArr.map((element,index)=>{
        if(element.day == el.day) {
          tempdaysArr[index].nights_out = el.nights_out;
          tempdaysArr[index].id = el.id;
          tempdaysArr[index].driver_id = el.driver_id;
      }
    })
  })
  setDaysArr(tempdaysArr)
},[nightOutData]) /** @audit dropdown array */

  const handleChange = (e, day) => {
    console.log("target", e.target.value);
    // if(e.target.value !==''){
      const driverService = new DriverService();
      let tempdaysArr = [...daysArr];
      tempdaysArr = tempdaysArr.map((el, index) => {
        if (el.day === day) {
          tempdaysArr[index].nights_out = e.target.value;
          if(e.target.value !==''){
            if(tempdaysArr[index].id){
              // console.log('older one',el)
              const obj = {
                    id : index,
                    driver_id : driver.driver_id,
                    nights_out : e.target.value,
                    day : el.day
              }
              driverService.updateSchedulePreferences(obj)
              driverService.getSchedulePreferencesbyId(driver.driver_id);
            } else{
              const obj = {
                driver_id : driver.driver_id,
                nights_out : e.target.value,
                day : el.day,
                created_by : userData.userId
            }
            driverService.addDriverSchedulePreferences(obj)
            driverService.getSchedulePreferencesbyId(driver.driver_id);
            // console.log('newer one',obj)
            } 
          }
          return el;
          
        } else {
          return el;
        }
      });
      setDaysArr(tempdaysArr);
    // }
  };

  return (
    <>
    <NotificationContainer />
      <div className="row mt_30">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body" ref={scheduleContainerRef}>
              <div className="table_header_section">
                <div className="table_header">Schedule Details</div>
              </div>
              <div className="schedule_information_text">
                To set a drivers Available and/or Unavailable time you simply
                drag either the green or red box and drop it at the desired
                start time for the desired day of the week. You can then adjust
                the time by dragging either the start or end time up or down.
              </div>
              <div className="arrowcalender">
                <div className="indicator_wrapper">
                  <div className="indicator_divide">
                    <div className="planner_date_text1">Weekly Schedule</div>
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

                  <button
                    type="button"
                    className="btn-blue_schedule"
                    onClick={() => setModalShow(true)}
                  >
                    Overrides
                  </button>
                </div>
              </div>
                
                <div className="night_out_sec_main">
                  <div className="night_out_individual_left_text">Night Outs</div>  
                    {/* @audit-ok Dropdown */}
                    {daysArr &&
                    daysArr.length &&
                    daysArr.map((el, index) => (
                      <div className="night_out_individual" key={el.id}>
                        <select
                          className="d-block  form-control mt-4 mx-auto"
                          onChange={(e) => handleChange(e, el.day)}
                          value={daysArr[index].nights_out}
                          id="variation-select"
                        >
                          <option value={''} selected disabled>Select Y/N</option>
                          <option value={false || "false"}>No</option>
                          <option value={true || "true"}>Yes</option>
                        </select>
                      </div>
                    ))}
						      </div>
                <div
                className="container_schedule"
                ref={scheduleContainerGridRef}
              >
                {scheduleGrid
                  ? scheduleGrid.map((gridElement) =>
                    gridElement.i < 8 ? (
                      <>
                        <div
                          id={gridElement.i + "_topHeaderCell"}
                          className="schedule-grid"
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
                              daysOfWeek[gridElement.i - 1]
                            )
                          }
                        </div>
                      </>
                    ) : gridElement.i % 8 === 0 ? (
                      <div
                        id={gridElement.i + "_gridcell"}
                        className="schedule-grid"
                        style={{
                          top: gridElement.y,
                          left: gridElement.x,
                          width: gridWidth - 1,
                          height: gridHeight - 1,
                        }}
                      >
                        { //Gridelement is genererated from I , there is a minus 1 as the number of rows are 25 and not 24
                          gridElement.i / 8 - 1 + ":00"
                        }

                      </div>
                    ) : (
                      <>
                       <div
                          id={gridElement.i + "_gridcell"}
                          key={gridElement.i + "_gridcell"}
                          className="schedule-grid"
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
                                <>
                                  {loading ? (<div className={getBlockTypeClassName(data)}>{data.block_type == "Available" ? (<ProgressBar animated variant="success" now={100}/>) : (<ProgressBar animated variant="danger" now={100}/>)}</div>
                                  ) : (
                                    <div className={getBlockTypeClassName(data)}
                                      draggable="true"
                                      onDragStart={(e) => dragElement(e, data.block_type, "start", false)}
                                      id={`${data.grid_cell_start_no}_gridData`}
                                      key={data.grid_cell_start_no + "_gridData"}>{data.block_type}<div className="close_avail_unavail" onClick={(e) => deleteOverrides(e)}>X</div></div>
                                  )
                                  }
                                </>

                              )
                                : null
                            )
                          ) : null}
                          {scheduleData.length > 0 ? (
                            scheduleData.map((data) =>
                              data.grid_cell_end_no === gridElement.i ? (
                                <>
                                  {loading ? (<div className={getBlockTypeClassName(data)}>{data.block_type == "Available" ? (<ProgressBar animated variant="success" now={100}/>) : (<ProgressBar animated variant="danger" now={100}/>)}</div>
                                  ) : (<div className={getBlockTypeClassName(data)}
                                    draggable="true"
                                    onDragStart={(e) => dragElement(e, data.block_type, "end", false)}
                                    id={`${data.grid_cell_end_no}_gridData`}
                                    key={data.grid_cell_end_no + "_gridData"}>End</div>)}
                                </>
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
      </div>
      {/* modal for kendotable */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="override_modal_header_close override_head_set_close" closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className="override_modal_header override_head_set">
            <Modal.Title id="contained-modal-title-vcenter" className="header-title1">
              OVERRIDES
            </Modal.Title>
            <button
              type="button"
              className="btn_blue btn-blue_schedule_override"
              onClick={() => setOpenOverrideModal(true)}
            >
              ADD
            </button>
          </div>
          <div class="form-group">
            {alloverrideSchedule?.length > 0 ? (
              <Grid
                filter={dataState.filter}
                filterable={true}
                sort={dataState.sort}
                sortable={true}
                pageable={{
                  buttonCount: 10,
                  info: true,
                  previousNext: true,
                  pageSizes: true,
                }}
                resizable={true}
                skip={dataState.skip}
                take={dataState.take}
                data={dataResult}
                onDataStateChange={dataStateChange}
              // onRowClick={(e) => props.parentcallback(true, e.dataItem)}
              >
                <GridColumn cell={from_DateTimeValue}
                  title="From Date"
                  width="300px"
                />
                <GridColumn cell={to_DateTimeValue}
                  title="To Date"
                  width="300px"
                />
                <GridColumn title="Action" cell={EditOverrideModal} />
              </Grid>
            ) : (
              <div className="text-center">No data found</div>

            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
      {/* modal for add */}
      <Modal
        show={openOverrideModal}
        onHide={() => setOpenOverrideModal(false)}
        size="xl"
        className="xxx"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="add_override_close" closeButton>
        
        </Modal.Header>
        <Modal.Body>
        {/* <div className="override_modal_header override_head_set">
          <Modal.Title id="contained-modal-title-vcenter addoverride_header" className="header-title1">
            Add Overrides
          </Modal.Title>
          
            </div> */}
            <OverrideSchedule driver={driver} updateOverrideModal={updateOverrideModal} />
        </Modal.Body>

      </Modal>
      {/* modal for edit */}
      <Modal
        show={showeditModal}
        onHide={() => setshoweditModal(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter" className="header-title1">
            Edit Overrides
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverrideUpdateSchedule driver={driver} updateOverrideModal={updateOverrideModal} overrideeditdata={overrideeditdata}/>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DriverBodyForSchedule;
