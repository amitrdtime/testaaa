
import React, { useState, useEffect, useContext, useRef } from "react";
import "./planner.css";
import "./planner-top.css";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import PlanningBoardService from "../../services/planingBoardService";
import { DateTime } from "luxon";


const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: 500,
  },
  customTooltip: {
    maxWidth: 'none',
    backgroundColor: "#4267B2",
    borderColor: "#2C4F95",
    borderStyle: "solid",
    borderWidth: "2px",
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.54)",
    padding: "12px",
    borderRadius: "10px"
  },
  customArrow: {
    color: "#4267B2",
    fontSize: "20px"
  },
}));

const PBBlock = (props) => {
  const classes = useStyles();
  const widthRef = useRef(null);
  const [boxWidth, setBoxWidth] = useState(1);
  const [block, setBlock] = useState(props.block);
  const [impactViewModal, setImpactViewModal] = useState(false);
  const [allimpact, setallimpact] = useState([]);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 5,
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
    process(allimpact, dataState)
  );
  const dataStateChange = (event) => {
    setDataResult(process(allimpact, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allimpact, dataState));
  }, [allimpact]);


  useEffect(() => {
    setBoxWidth(parseInt(widthRef.current.clientWidth));
  }, []);

  useEffect(() => {
    const blockData = block.map((data, currentIndex) => {
      const xp = getXPosition(data.start);
      const of = getXPosition(data.OF);
      const pu = getXPosition(data.PU);
      const mv = getXPosition(data.MV);
      const del = getXPosition(data.DEL);
      const drawStartPercentage = getXPositionPercentage(data.start)
      const ofPercentage = getXPositionPercentage(data.OF);
      const puPercentage = getXPositionPercentage(data.PU);
      const mvPercentage = getXPositionPercentage(data.MV);
      let delPercentage = getXPositionPercentage(data.DEL);
      let totalBlockPercentage = puPercentage + mvPercentage + delPercentage;
      let middleBlockPercentage = totalBlockPercentage;

      //Adding Preprocessing Logic as not Every Header Matches Every Item

      //Modify Block
      if ((block.length - 1) !== currentIndex) {
        if (data.trailerid === block[currentIndex + 1].trailerid && block[currentIndex + 1].move_type == 'E') {
          //Extend The Block To Fill In The Next One
          middleBlockPercentage = middleBlockPercentage + getXPositionPercentage(block[currentIndex + 1].MV)
        }
      }

      //Remove Block
      if ((0) !== currentIndex) {
        if (data.trailerid === block[currentIndex - 1].trailerid && data.move_type == 'E') {
          //Extend The Block To Fill In The Next One
          middleBlockPercentage = 0
        }
      }


      return {
        ...data,
        drawStart: xp,
        OFX: of,
        PUX: pu,
        MVX: mv,
        DELX: del,
        drawStartPercentage: drawStartPercentage,
        ofWidthPercentage: ofPercentage,
        puWidthPercentage: puPercentage,
        mvWidthPercentage: mvPercentage,
        delWidthPercentage: delPercentage,
        totalWidthPercentage: totalBlockPercentage,
        middleWidthPercentage: middleBlockPercentage,
      };
    });


    setBlock(blockData);
  }, [boxWidth]);



  const getClassName = function (width, reachedOnTime) {
    return reachedOnTime
      ? "dragable_bottom_section_box dragable_width_" +
      width +
      " dragable-planner-blue"
      : "dragable_bottom_section_box dragable_width_" +
      width +
      " dragable-planner-yellow";
  };

  const getClassNameStatus = function (width, status) {
    switch (status) {
      case "green":
        return (
          "dragable_bottom_section_box cp dragable_width_" +
          width +
          " dragable-planner-green"
        );
      case "yellow":
        return (
          "dragable_bottom_section_box dragable_width_" +
          width +
          " dragable-planner-yellow"
        );
      case "red":
        return (
          "dragable_bottom_section_box dragable_width_" +
          width +
          " dragable-planner-red"
        );
    }
  };

  const getClassNameOf = function (width) {
    return (
      "dragable_bottom_section_box_of dragable_width_" +
      width +
      " dragable-planner-darkblue"
    );
  };

  const getXPosition = function (minutes) {
    const value = parseInt((boxWidth * minutes) / 1440);
    return value;

  };

  const getXPositionPercentage = function (minutes) {
    const value = minutes / 1440;
    const percentage = value * 100;
    return percentage;

  };

  const formatDate = (epoch_date, tzone) => {
    return DateTime.fromMillis(parseInt(epoch_date)).setZone(tzone).toFormat("MM-dd-yyyy HH:mm ZZZZ").toString()
  }

  const getTooltips = function (it) {
    let toolText = "";

    if (!it.loaded) {
      toolText = view === "driver" ? "T-" + it.trailerid : "D-" + it.driverid;
    } else {
      toolText =
        "O-" +
        it.orderid +
        "   " +
        (view === "driver" ? "T-" + it.trailerid : "D-" + it.driverid);
    }
    return toolText;
  };

  const getTopClassName = function (width, it) {
    let cssTopClass = "dragable_top_section_box";
    switch (it.zmitStatus) {
      case "green":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_green";
        break;
      case "orange":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_orange";
        break;
      case "white":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_white";
        break;
      case "carrierView":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_white";
        break;
      case "trailerView":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_white";
        break;
    }

    if (width > 5) {
      cssTopClass = cssTopClass + " dragable_top_section_box_border";
    } else {
      cssTopClass = cssTopClass + " dragable_top_section_box_border_nopadding";
    }

    if (it.loaded) return cssTopClass + " dragable_width_" + width;
    else return cssTopClass + " dragable_width_" + width; // + " dragable-planner-gray";
  };


  const getMiddleClassName = function (width, it, disblock, index) {
    let cssTopClass = "dragable_middle_section_box";
    switch (it.zmitStatus) {
      case "green":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_green";
        break;
      case "orange":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_orange";
        break;
      case "white":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_white";
        break;
      case "carrierView":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_white";
        break;
      case "trailerView":
        cssTopClass = cssTopClass + " dragable_top_section_box_border_white";
        break;
    }

    if (width > 5) {
      cssTopClass = cssTopClass + " dragable_top_section_box_border";
    } else {
      cssTopClass = cssTopClass + " dragable_top_section_box_border_nopadding";
    }

    if (it.loaded) return cssTopClass + " dragable_width_" + width;
    else return cssTopClass + " dragable_width_" + width;
  };

  const getTopClassNameOf = function (width) {
    return (
      "dragable_top_section_box_of  dragable_top_section_box_border_of dragable_width_" +
      width
    );
  };

  const handleTooltipClick = (moveType, status, data) => {
    const planningboardService = new PlanningBoardService();
    if (moveType == "pickup") {
      if (data.pickup_status !== "green") {
        const impactViewData = planningboardService
          .getImapctView(
            data.pickup_planned_depart,
            data.driverid,
            data.trailerid
          )
          .then((res) => {
            setallimpact(res.data);
            setImpactViewModal(true);
          })
          .catch((err) => {
          });
      }
    }
    else if (moveType == "delivery") {
      if (data.delivery_status !== "green") {
        const impactViewData = planningboardService
          .getImapctView(
            data.delivery_planned_depart,
            data.driverid,
            data.trailerid
          )
          .then((res) => {
            setallimpact(res.data);
            setImpactViewModal(true);
          })
          .catch((err) => {
          });
      }
    }
  };

  const view = props.view;

  return (
    <>
      {block.map((it, index) => (
        <div ref={widthRef} className="dragable_wrapper">
          <div>
            {
              <>
                {it.MVX + it.PUX + it.DELX > 0 ? (

                  // Orders tooltip
                  <Tooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">
                          {view === "driver" ? (
                            <>
                              <span className="tooltip-adjust">
                                <div className="main_tooltip_section1">
                                  <div className="tooltip_left_1">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Customer: </div>
                                      <div className="tooltip_text_right">  {it.customer_name}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Order: </div>
                                      <div className="tooltip_text_right">  {it.order_type_id}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Hold: </div>
                                      <div className="tooltip_text_right">   {it.on_hold ? it.on_hold : "No Data"}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_2">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Type: </div>
                                      <div className="tooltip_text_right">  </div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_3">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Terminal: </div>
                                      <div className="tooltip_text_right">   {it.terminalId} - {it.terminal_city ? it.terminal_city : "No Data"}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Status: </div>
                                      <div className="tooltip_text_right"> {it.order_status}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Reason: </div>
                                      <div className="tooltip_text_right"> {"No Data"}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_4">
                                  </div>
                                </div>
                                <div className="main_tooltip_section1 tooltip_inner_gap">
                                  <div className="tooltip_left_1">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">BOL: </div>
                                      <div className="tooltip_text_right">  {it.blnum}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_2">
                                  </div>
                                  <div className="tooltip_left_3">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Consignee Ref#: </div>
                                      <div className="tooltip_text_right"> {it.consignee_refno}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_4">
                                  </div>
                                </div>
                                <div className="main_tooltip_section1 tooltip_inner_gap">
                                  <div className="tooltip_left_1">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left fs_20">Shipper: </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_right">
                                        <p className="tooltip_text_right">
                                          {it.company_location_id ?
                                            (`${it.company_location_id} - ${it.location_name}`)
                                            : "No Data"
                                          }
                                          <br />
                                          {it.address1 ?
                                            (`${it.address1}`)
                                            : null
                                          }
                                          <br />
                                          {it.city ?
                                            (`${it.city}, ${it.state}, ${it.zip} `)
                                            : null
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_2">
                                  </div>
                                  <div className="tooltip_left_3">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left fs_20">Consignee: </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_right">
                                        <p className="tooltip_text_right">
                                          {it.company_location_id1 ?
                                            (`${it.company_location_id1} - ${it.location_name1}`)
                                            : "No Data"
                                          }
                                          <br />
                                          {it.address11 ?
                                            (`${it.address11}`)
                                            : null
                                          }
                                          <br />
                                          {it.city1 ?
                                            (`${it.city1}, ${it.state1}, ${it.zip1} `)
                                            : null
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_4">
                                  </div>
                                </div>
                                <div className="main_tooltip_section1 tooltip_inner_gap1">
                                  <div className="tooltip_left_1">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Driver Load : </div>
                                      <div className="tooltip_text_right">   {it.pickup_driver_load_unload ? it.pickup_driver_load_unload : "No Data"}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_2">
                                  </div>
                                  <div className="tooltip_left_3">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Driver Unload: </div>
                                      <div className="tooltip_text_right">    {it.delivery_driver_load_unload ? it.delivery_driver_load_unload : "No Data"}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_4">
                                  </div>
                                </div>
                                <div className="main_tooltip_section1 tooltip_inner_gap">
                                  <div className="tooltip_left_1">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Early Pickup Appt:  </div>
                                      <div className="tooltip_text_right">     {formatDate(it.pickup_sched_arrive_early_utc, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Late Pickup Appt:</div>
                                      <div className="tooltip_text_right">    {formatDate(it.pickup_sched_arrive_late_utc, it.pickup_timezone)}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_2">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Appt Rq'd: </div>
                                      <div className="tooltip_text_right"> {it.pickup_appt_required ? it.pickup_appt_required : "No Data"} </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Appt Confirmed:</div>
                                      <div className="tooltip_text_right">{it.picup_confirmed ? it.picup_confirmed : "No Data"}  </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">D- </div>
                                      <div className="tooltip_text_right">   {it.driverid}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_3">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Early Delivery Appt: </div>
                                      <div className="tooltip_text_right">   {formatDate(it.delivery_sched_arrive_early_utc, it.delivery_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Late Delivery Appt:</div>
                                      <div className="tooltip_text_right">   {formatDate(it.delivery_sched_arrive_late_utc, it.delivery_timezone)}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_4">

                                    <div className="tooltip_single_sec ">
                                      <div className="tooltip_text_left">Appt Rq'd: </div>
                                      <div className="tooltip_text_right"> {"No Data"} </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Appt Confirmed:</div>
                                      <div className="tooltip_text_right"> {"No Data"} </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="main_tooltip_section1 tooltip_inner_gap">
                                  <div className="tooltip_left_1">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Planning Comment:</div>
                                      <div className="tooltip_text_right">   {"No Data"}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_2">
                                  </div>
                                  <div className="tooltip_left_3">
                                  </div>
                                  <div className="tooltip_left_4">
                                  </div>
                                </div>
                                <div className="main_tooltip_section1 ">
                                  <div className="tooltip_left_1">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Commodity Group:</div>
                                      <div className="tooltip_text_right">
                                        {it.commoditygroupid || it.commoditygroup_description ?
                                          `${it.commoditygroupid}- ${it.commoditygroup_description}` : "No Data"
                                        }
                                      </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Product:</div>
                                      <div className="tooltip_text_right">   {it.commodity_desc}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_2">
                                  </div>
                                  <div className="tooltip_left_3">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Commodity:</div>
                                      <div className="tooltip_text_right">  {it.commodity_Id} - {it.commodity}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Ordered Weight: </div>
                                      <div className="tooltip_text_right">   {it.ordered_wt}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_left_4">
                                  </div>
                                </div>
                              </span>
                            </>
                          ) : (
                            <span className="tooltip-adjust">
                              <div className="main_tooltip_section1">
                                <div className="tooltip_left_1">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Customer: </div>
                                    <div className="tooltip_text_right">  {it.customer_name}</div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Order: </div>
                                    <div className="tooltip_text_right">  {it.orderid}</div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Hold: </div>
                                    <div className="tooltip_text_right">   {it.on_hold ? it.on_hold : "No Data"}</div>
                                  </div>

                                </div>

                                <div className="tooltip_left_2">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Type: </div>
                                    <div className="tooltip_text_right">  </div>
                                  </div>

                                </div>

                                <div className="tooltip_left_3">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Terminal: </div>
                                    <div className="tooltip_text_right">   {it.terminalId} - {it.terminal_city ? it.terminal_city : "No Data"}</div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Status: </div>
                                    <div className="tooltip_text_right"> {it.order_status}</div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Reason: </div>
                                    <div className="tooltip_text_right"> {"No Data"}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_4">
                                </div>
                              </div>
                              <div className="main_tooltip_section1 tooltip_inner_gap">
                                <div className="tooltip_left_1">

                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">BOL: </div>
                                    <div className="tooltip_text_right">  {it.blnum}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_2">
                                </div>
                                <div className="tooltip_left_3">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Consignee Ref#: </div>
                                    <div className="tooltip_text_right"> {it.consignee_refno}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_4">
                                </div>
                              </div>
                              <div className="main_tooltip_section1 tooltip_inner_gap">
                                <div className="tooltip_left_1">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left fs_20">Shipper: </div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_right">
                                      <p className="tooltip_text_right">
                                        {it.company_location_id ?
                                          (`${it.company_location_id} - ${it.location_name}`)
                                          : "No Data"
                                        }
                                        <br />
                                        {it.address1 ?
                                          (`${it.address1}`)
                                          : null
                                        }
                                        <br />
                                        {it.city ?
                                          (`${it.city}, ${it.state}, ${it.zip} `)
                                          : null
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="tooltip_left_2">
                                </div>
                                <div className="tooltip_left_3">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left fs_20">Consignee: </div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_right">
                                      <p className="tooltip_text_right">
                                        {it.company_location_id1 ?
                                          (`${it.company_location_id1} - ${it.location_name1}`)
                                          : "No Data"
                                        }
                                        <br />
                                        {it.address11 ?
                                          (`${it.address11}`)
                                          : null
                                        }
                                        <br />
                                        {it.city1 ?
                                          (`${it.city1}, ${it.state1}, ${it.zip1} `)
                                          : null
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="tooltip_left_4">
                                </div>
                              </div>
                              <div className="main_tooltip_section1 tooltip_inner_gap1">
                                <div className="tooltip_left_1">

                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Driver Load : </div>
                                    <div className="tooltip_text_right">   {it.pickup_driver_load_unload ? it.pickup_driver_load_unload : "No Data"}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_2">
                                </div>
                                <div className="tooltip_left_3">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Driver Unload: </div>
                                    <div className="tooltip_text_right">    {it.delivery_driver_load_unload ? it.delivery_driver_load_unload : "No Data"}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_4">
                                </div>
                              </div>
                              <div className="main_tooltip_section1 tooltip_inner_gap">
                                <div className="tooltip_left_1">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Early Pickup Appt:  </div>
                                    <div className="tooltip_text_right">     {formatDate(it.pickup_sched_arrive_early_utc, it.pickup_timezone)}</div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Late Pickup Appt:</div>
                                    <div className="tooltip_text_right">    {formatDate(it.pickup_sched_arrive_late_utc, it.pickup_timezone)}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_2">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Appt Rq'd: </div>
                                    <div className="tooltip_text_right"> {it.pickup_appt_required ? it.pickup_appt_required : "No Data"} </div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Appt Confirmed:</div>
                                    <div className="tooltip_text_right">{it.picup_confirmed ? it.picup_confirmed : "No Data"}  </div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">T- </div>
                                    <div className="tooltip_text_right">   {it.trailerid}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_3">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Early Delivery Appt: </div>
                                    <div className="tooltip_text_right">   {formatDate(it.delivery_sched_arrive_early_utc, it.delivery_timezone)}</div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Late Delivery Appt:</div>
                                    <div className="tooltip_text_right">   {formatDate(it.delivery_sched_arrive_late_utc, it.delivery_timezone)}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_4">
                                  <div className="tooltip_single_sec ">
                                    <div className="tooltip_text_left">Appt Rq'd: </div>
                                    <div className="tooltip_text_right"> {"No Data"} </div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Appt Confirmed:</div>
                                    <div className="tooltip_text_right"> {"No Data"} </div>
                                  </div>
                                </div>
                              </div>
                              <div className="main_tooltip_section1 tooltip_inner_gap">
                                <div className="tooltip_left_1">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Planning Comment:</div>
                                    <div className="tooltip_text_right">   {"No Data"}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_2">
                                </div>
                                <div className="tooltip_left_3">
                                </div>
                                <div className="tooltip_left_4">
                                </div>
                              </div>
                              <div className="main_tooltip_section1 ">
                                <div className="tooltip_left_1">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Commodity Group:</div>
                                    <div className="tooltip_text_right">
                                      {it.commoditygroupid || it.commoditygroup_description ?
                                        `${it.commoditygroupid}- ${it.commoditygroup_description}` : "No Data"
                                      }
                                    </div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Product:</div>
                                    <div className="tooltip_text_right">   {it.commodity_desc}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_2">
                                </div>
                                <div className="tooltip_left_3">
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Commodity:</div>
                                    <div className="tooltip_text_right">  {it.commodity_Id} - {it.commodity}</div>
                                  </div>
                                  <div className="tooltip_single_sec">
                                    <div className="tooltip_text_left">Ordered Weight: </div>
                                    <div className="tooltip_text_right">   {it.ordered_wt}</div>
                                  </div>
                                </div>
                                <div className="tooltip_left_4">
                                </div>
                              </div>
                            </span>
                          )}
                        </Typography>
                      </React.Fragment>
                    }
                    placement="top"
                    classes={{
                      tooltip: classes.customTooltip,
                      arrow: classes.customArrow,
                    }}
                    arrow
                  >
                    <>
                      {it.move_type === "E" ? (
                        <div></div>
                      ) : (
                        <Tooltip
                          title={
                            <React.Fragment>
                              <Typography color="inherit">
                                <span className="tooltip-adjust">
                                  <div className="main_tooltip_section1">
                                    <div className="tooltip_left_1">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Customer: </div>
                                        <div className="tooltip_text_right">  {it.customer_name}</div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Order: </div>
                                        <div className="tooltip_text_right">  {it.orderid}</div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Hold: </div>
                                        <div className="tooltip_text_right">   {it.on_hold ? it.on_hold : "No Data"}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_2">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Type: </div>
                                        <div className="tooltip_text_right">  </div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_3">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Terminal: </div>
                                        <div className="tooltip_text_right">   {it.terminalId} - {it.terminal_city ? it.terminal_city : "No Data"}</div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Status: </div>
                                        <div className="tooltip_text_right"> {it.order_status}</div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Reason: </div>
                                        <div className="tooltip_text_right"> {"No Data"}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_4">
                                    </div>
                                  </div>
                                  <div className="main_tooltip_section1 tooltip_inner_gap">
                                    <div className="tooltip_left_1">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">BOL: </div>
                                        <div className="tooltip_text_right">  {it.blnum}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_2">
                                    </div>
                                    <div className="tooltip_left_3">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Consignee Ref#: </div>
                                        <div className="tooltip_text_right"> {it.consignee_refno}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_4">
                                    </div>
                                  </div>
                                  <div className="main_tooltip_section1 tooltip_inner_gap">
                                    <div className="tooltip_left_1">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left fs_20">Shipper: </div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_right">
                                          <p className="tooltip_text_right">
                                            {it.company_location_id ?
                                              (`${it.company_location_id} - ${it.location_name}`)
                                              : "No Data"
                                            }
                                            <br />
                                            {it.address1 ?
                                              (`${it.address1}`)
                                              : null
                                            }
                                            <br />
                                            {it.city ?
                                              (`${it.city}, ${it.state}, ${it.zip} `)
                                              : null
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_2">
                                    </div>
                                    <div className="tooltip_left_3">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left fs_20">Consignee: </div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_right">
                                          <p className="tooltip_text_right">

                                            {it.company_location_id1 ?
                                              (`${it.company_location_id1} - ${it.location_name1}`)
                                              : "No Data"
                                            }
                                            <br />
                                            {it.address11 ?
                                              (`${it.address11}`)
                                              : null
                                            }
                                            <br />
                                            {it.city1 ?
                                              (`${it.city1}, ${it.state1}, ${it.zip1} `)
                                              : null
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_4">
                                    </div>
                                  </div>
                                  <div className="main_tooltip_section1 tooltip_inner_gap1">
                                    <div className="tooltip_left_1">

                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Driver Load : </div>
                                        <div className="tooltip_text_right">   {it.pickup_driver_load_unload ? it.pickup_driver_load_unload : "No Data"}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_2">
                                    </div>
                                    <div className="tooltip_left_3">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Driver Unload: </div>
                                        <div className="tooltip_text_right">    {it.delivery_driver_load_unload ? it.delivery_driver_load_unload : "No Data"}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_4">
                                    </div>
                                  </div>
                                  <div className="main_tooltip_section1 tooltip_inner_gap">
                                    <div className="tooltip_left_1">

                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Early Pickup Appt:  </div>
                                        <div className="tooltip_text_right">     {formatDate(it.pickup_sched_arrive_early_utc, it.pickup_timezone)}</div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Late Pickup Appt:</div>
                                        <div className="tooltip_text_right">    {formatDate(it.pickup_sched_arrive_late_utc, it.pickup_timezone)}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_2">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Appt Rq'd: </div>
                                        <div className="tooltip_text_right"> {it.pickup_appt_required ? it.pickup_appt_required : "No Data"} </div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Appt Confirmed:</div>
                                        <div className="tooltip_text_right">{it.picup_confirmed ? it.picup_confirmed : "No Data"}  </div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_3">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Early Delivery Appt: </div>
                                        <div className="tooltip_text_right">   {formatDate(it.delivery_sched_arrive_early_utc, it.delivery_timezone)}</div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Late Delivery Appt:</div>
                                        <div className="tooltip_text_right">   {formatDate(it.delivery_sched_arrive_late_utc, it.delivery_timezone)}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_4">
                                      <div className="tooltip_single_sec ">
                                        <div className="tooltip_text_left">Appt Rq'd: </div>
                                        <div className="tooltip_text_right"> {"No Data"} </div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Appt Confirmed:</div>
                                        <div className="tooltip_text_right"> {"No Data"} </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="main_tooltip_section1 tooltip_inner_gap">
                                    <div className="tooltip_left_1">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Planning Comment:</div>
                                        <div className="tooltip_text_right">   {"No Data"}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_2">
                                    </div>
                                    <div className="tooltip_left_3">
                                    </div>
                                    <div className="tooltip_left_4">
                                    </div>
                                  </div>
                                  <div className="main_tooltip_section1 ">
                                    <div className="tooltip_left_1">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Commodity Group:</div>
                                        <div className="tooltip_text_right">
                                          {it.commoditygroupid || it.commoditygroup_description ?
                                            `${it.commoditygroupid}- ${it.commoditygroup_description}` : "No Data"
                                          }
                                        </div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Product:</div>
                                        <div className="tooltip_text_right">   {it.commodity_desc}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_2">
                                    </div>
                                    <div className="tooltip_left_3">
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Commodity:</div>
                                        <div className="tooltip_text_right">  {it.commodity_Id} - {it.commodity}</div>
                                      </div>
                                      <div className="tooltip_single_sec">
                                        <div className="tooltip_text_left">Ordered Weight: </div>
                                        <div className="tooltip_text_right">   {it.ordered_wt}</div>
                                      </div>
                                    </div>
                                    <div className="tooltip_left_4">
                                    </div>
                                  </div>
                                </span>

                              </Typography>
                            </React.Fragment>
                          }
                          placement="top"
                          classes={{
                            tooltip: classes.customTooltip,
                            arrow: classes.customArrow,
                          }}
                          arrow
                        >
                          <div
                            className={getTopClassName(
                              it.MVX + it.PUX + it.DELX,
                              it
                            )}
                            style={{
                              width: it.totalWidthPercentage + "%",
                              left: it.drawStartPercentage + "%",
                              position: "absolute"
                            }}
                          >
                            <div className="dragable_top_section_box_minute_text">
                              {it.orderid}
                            </div>
                          </div>
                        </Tooltip>
                      )}
                      {it.middleWidthPercentage == 0 ? (<div> </div>) : (
                        <div
                          className={getMiddleClassName(
                            it.MVX + it.PUX + it.DELX,
                            it, block, index
                          )}
                          style={{
                            width: it.middleWidthPercentage + "%",
                            left: it.drawStartPercentage + "%",
                            position: "absolute"
                          }}
                        >
                          {view === "driver" ? (
                            <Tooltip
                              title={
                                <React.Fragment>
                                  <Typography color="inherit">
                                    <span className="tooltip-adjust">
                                      <div className="main_tooltip_section">
                                        <div className="tooltip_left">
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Trailer : </div>
                                            <div className="tooltip_text_right">{it.trailerid ?? "No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Type : </div>
                                            <div className="tooltip_text_right">{it.equip_types ?? "No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Commodity Group : </div>
                                            <div className="tooltip_text_right">{it.commoditygroupid}{it.commoditygroup_description} </div>
                                          </div>
                                          <div className="tooltip_single_sec trailer_gap">
                                            <div className="tooltip_text_left">Last Order : </div>
                                            <div className="tooltip_text_right"></div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Last Commodity : </div>
                                            <div className="tooltip_text_right"></div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Last Product : </div>
                                            <div className="tooltip_text_right"></div>
                                          </div>
                                          <div className="tooltip_single_sec trailer_gap">
                                            <div className="tooltip_text_left">Loads since last wash : </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Days since last wash : </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Last Wash Date : </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Last Wash W/O : </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec trailer_gap">
                                            <div className="tooltip_text_left">License : </div>
                                            <div className="tooltip_text_right">{it.license_plates ?? "No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">State : </div>
                                            <div className="tooltip_text_right">{it.state ?? "No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Year : </div>
                                            <div className="tooltip_text_right">{it.model_year ?? "No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Make : </div>
                                            <div className="tooltip_text_right">{it.makes ?? "No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Model : </div>
                                            <div className="tooltip_text_right">{it.models ?? "No Data"}</div>
                                          </div>
                                        </div>
                                        <div className="tooltip_right">
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Status: </div>
                                            <div className="tooltip_text_right">
                                              {it.stat === "A" ? "Active" :
                                                it.stat === "S" ? "Sold" :
                                                  it.stat === "I" ? "Inactive" :
                                                    it.stat === "T" ? "Sale-pending" :
                                                      it.stat === "O" ? "On-order" :
                                                        it.stat === "C" ? "Collision" :
                                                          it.stat === "In shop" ? "In shop" : "No Data"

                                              }
                                            </div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Terminal : </div>
                                            <div className="tooltip_text_right">{it.terminalId} - {it.terminal_city}</div>
                                          </div>
                                          <br />
                                          <div className="tooltip_single_sec trailer_gap">
                                            <div className="tooltip_text_left">Shipper Pool : </div>
                                            <div className="tooltip_text_right">{it.shipper_pool ?? "No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Dedicated : </div>
                                            <div className="tooltip_text_right">{it.dedicated ?? "No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec trailer_gap1">
                                            <div className="tooltip_text_left">Loads to next wash: </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Day to Next wash: </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Next Wash Date: </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">PM Due Date: </div>
                                            <div className="tooltip_text_right">
                                              {it?.pm_due_date_utc != null ? convertDateTime(it?.pm_due_date_utc) : "No Data"}
                                            </div>
                                          </div>
                                          <div className="tooltip_single_sec trailer_gap">
                                            <div className="tooltip_text_left">Length: </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Width: </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Height: </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Volume: </div>
                                            <div className="tooltip_text_right">{"No Data"}</div>
                                          </div>
                                          <div className="tooltip_single_sec">
                                            <div className="tooltip_text_left">Tare Weight: </div>
                                            <div className="tooltip_text_right">{it.tare_weight ?? "No Data"}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </span>
                                  </Typography>
                                </React.Fragment>
                              }
                              placement="top"
                              classes={{
                                tooltip: classes.customTooltip,
                                arrow: classes.customArrow,
                              }}
                              arrow
                            >
                              <div className="dragable_top_section_box_minute_text">
                                {it.trailerid}
                              </div>
                            </Tooltip>
                          ) : (
                            <Tooltip title={
                              <React.Fragment>
                                <Typography color="inherit">
                                  <span className="tooltip-adjust">
                                    <div className="main_tooltip_section">
                                      <div className="tooltip_left_driver">
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Driver : </div>
                                          <div className="tooltip_text_right">{it.driverid} - {it.driver_name ? it.driver_name : "No Data"}</div>
                                        </div>
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Terminal : </div>
                                          <div className="tooltip_text_right">{it.terminalId} - {it.terminal_city ? it.terminal_city : "No Data"}</div>
                                        </div>
                                        <div className="tooltip_single_sec pt_20">
                                          <div className="driver_special_text">Samsara Data</div>
                                        </div>
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Vehicle : </div>
                                          <div className="tooltip_text_right">{"No Data"}</div>
                                        </div>
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Duty Status : </div>
                                          <div className="tooltip_text_right">{"No Data"}</div>
                                        </div>
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Drive Remaining : </div>
                                          <div className="tooltip_text_right">{"No Data"}</div>
                                        </div>
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Shift Remaining : </div>
                                          <div className="tooltip_text_right">{"No Data"}</div>
                                        </div>
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Cycle Remaining : </div>
                                          <div className="tooltip_text_right">{"No Data"}</div>
                                        </div>
                                      </div>
                                      <div className="tooltip_middle_driver">
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Time in Status : </div>
                                          <div className="tooltip_text_right">{"No Data"}</div>
                                        </div>
                                      </div>
                                      <div className="tooltip_rightPu">
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Type : </div>
                                          <div className="tooltip_text_right">{it.drivertypeclass ? it.drivertypeclass : "No Data"}</div>
                                        </div>
                                        <div className="tooltip_single_sec">
                                          <div className="tooltip_text_left">Hired: </div>
                                          <div className="tooltip_text_right">{it.Hiredate ? it.Hiredate : "No Data"}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </span>
                                </Typography>
                              </React.Fragment>
                            }
                              placement="top"
                              classes={{
                                tooltip: classes.customTooltip,
                                arrow: classes.customArrow,
                              }}


                              arrow>

                              <div className="dragable_top_section_box_minute_text">
                                {it.driverid}
                              </div>

                            </Tooltip>

                          )}
                        </div>)}
                    </>
                  </Tooltip>
                ) : (
                  ""
                )}
                {it.OFX === 0 ? (
                  ""
                ) : (
                  <div
                    className={getTopClassNameOf(it.OFX)}
                    style={{ width: it.ofWidthPercentage + "%" }}
                  >
                    <div className="dragable_top_section_box_minute_text"></div>
                  </div>
                )}

                <div className="dragable_bottom_section cp">
                  {it.PU === 0 ? (
                    ""
                  ) : (
                    <Tooltip title={
                      <React.Fragment>
                        <Typography color="inherit">
                          {
                            <>
                              <span className="tooltip-adjust">
                                <div className="main_tooltip_section">
                                  <div className="tooltip_left">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Order: </div>
                                      <div className="tooltip_text_right">{it.orderid}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Move: </div>
                                      <div className="tooltip_text_right">{it.move_id}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_middle">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">  Type:</div>
                                      <div className="tooltip_text_right">  {it.order_type_id}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">  Type:</div>
                                      <div className="tooltip_text_right">  {it.movement_type}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_rightPu">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Status:</div>
                                      <div className="tooltip_text_right"> {it.order_status}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Status:</div>
                                      <div className="tooltip_text_right"> {it.movement_status}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="main_tooltip_section tooltip_inner_gap">
                                  <div className="tooltip_left">
                                    <div className="tooltip_single_sec  ">
                                      <div className="tooltip_text_left fs_20">{it.stop_pickup__type ? it.stop_pickup__type.toUpperCase() : "No Data"} : </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <p className="tooltip_text_right">
                                        {it.company_location_id ?
                                          (`${it.company_location_id} - ${it.location_name}`)
                                          : "No Data"
                                        }
                                        <br />
                                        {it.address1 ?
                                          (`${it.address1}`)
                                          : null
                                        }

                                        <br />
                                        {it.city ?
                                          (`${it.city}, ${it.state}, ${it.zip} `)
                                          : null
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div className="tooltip_middle">

                                  </div>
                                </div>

                                <div className="main_tooltip_section tooltip_inner_gap1">
                                  <div className="tooltip_left">



                                    <div className="tooltip_single_sec ">
                                      <div className="tooltip_text_left">Early Pickup Appt: </div>
                                      <div className="tooltip_text_right">  {formatDate(it.pickup_sched_arrive_early_utc, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec ">
                                      <div className="tooltip_text_left">Late Pickup Appt: </div>
                                      <div className="tooltip_text_right">  {formatDate(it.pickup_sched_arrive_late_utc, it.pickup_timezone)}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_middle">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">  Appt Rq'd:</div>
                                      <div className="tooltip_text_right">  {it.pickup_appt_required ? it.pickup_appt_required : "No Data"}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">  Appt confirmed:</div>
                                      <div className="tooltip_text_right">  {it.picup_confirmed ? it.picup_confirmed : "No Data"}</div>
                                    </div>

                                  </div>
                                  <div className="tooltip_rightPu">
                                  </div>
                                </div>
                                <div className="main_tooltip_section tooltip_inner_gap" >
                                  <div className="tooltip_left">
                                    <div className="tooltip_single_sec mt_5 ">
                                      <div className="tooltip_text_left">Planned Arrive : </div>
                                      <div className="tooltip_text_right">  {formatDate(it.pickup_planned_arrive, it.pickup_timezone)}</div>
                                    </div>

                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Planned Depart : </div>
                                      <div className="tooltip_text_right">  {formatDate(it.delivery_planned_depart, it.delivery_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">ETA: </div>
                                      <div className="tooltip_text_right"> {formatDate(it.pickup_eta_utc, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Actual Arrival : </div>
                                      <div className="tooltip_text_right">  {formatDate(it.pickup_actual_arrive, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Actual Depart : </div>
                                      <div className="tooltip_text_right">  {formatDate(it.pickup_actual_depart, it.pickup_timezone)}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_middle">
                                  </div>
                                  <div className="tooltip_rightPu">
                                  </div>
                                </div>
                              </span>
                            </>
                          }
                        </Typography>
                      </React.Fragment>
                    }
                      onClick={() => handleTooltipClick("pickup", it.pickup_status, it)}
                      placement="top"
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customArrow,
                      }}
                      arrow
                    >
                      <div
                        className={getClassNameStatus(it.PUX, it.pickup_status)}
                        style={{
                          width: it.puWidthPercentage + "%",
                          left: it.drawStartPercentage + "%",
                          position: "absolute"
                        }}
                      >
                        <div className="dragable_bottom_section_text">
                          {" "}
                          {it.pickup_type}{" "}
                        </div>
                      </div>
                    </Tooltip>
                  )}
                  {+it.MV === 0 ? (
                    ""
                  ) : (
                    <Tooltip title={
                      <React.Fragment>
                        <Typography color="inherit">
                          {
                            <>
                              <span className="tooltip-adjust">

                                <div className="main_tooltip_section">

                                  <div className="tooltip_left">

                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Order: </div>
                                      <div className="tooltip_text_right">{it.orderid}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Move: </div>
                                      <div className="tooltip_text_right">{it.move_id}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Brokerage: </div>
                                      <div className="tooltip_text_right">{it.brokerage}</div>
                                    </div>
                                    <div className="tooltip_single_sec pt_20">
                                      <div className="tooltip_text_left fs_20">Pickup:</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_right">
                                        <p className="tooltip_text_right">

                                          {it.company_location_id ?
                                            (`${it.company_location_id} - ${it.location_name}`)
                                            : "No Data"
                                          }
                                          <br />
                                          {it.address1 ?
                                            (`${it.address1}`)
                                            : null
                                          }
                                          <br />
                                          {it.city ?
                                            (`${it.city}, ${it.state}, ${it.zip} `)
                                            : null
                                          }
                                        </p>
                                      </div>
                                    </div>
                                    <div className="tooltip_single_sec pt_20">
                                      <div className="tooltip_text_left">Planned Arrival Time: </div>
                                      <div className="tooltip_text_right">{formatDate(it.pickup_planned_arrive, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Planned Depart Time: </div>
                                      <div className="tooltip_text_right">{formatDate(it.pickup_planned_depart, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">ETA: </div>
                                      <div className="tooltip_text_right"> {formatDate(it.pickup_eta_utc, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Actual Arrival Time: </div>
                                      <div className="tooltip_text_right">{formatDate(it.pickup_actual_arrive, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Actual Depart Time: </div>
                                      <div className="tooltip_text_right">{formatDate(it.pickup_actual_depart, it.pickup_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Distance: </div>
                                      <div className="tooltip_text_right">{it.distance} Miles</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_middle">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left"> Type: </div>
                                      <div className="tooltip_text_right">{it.stop_pickup__type}</div>
                                    </div>

                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left"> Type: </div>
                                      <div className="tooltip_text_right">{it.move_type}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_right">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Status: </div>
                                      <div className="tooltip_text_right">{it.order_status}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Status: </div>
                                      <div className="tooltip_text_right">{it.movement_status}</div>
                                    </div>
                                    <div className="tooltip_single_sec pt_20">
                                      <div className="tooltip_text_left fs_20">Delivery: </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_right">
                                        <p className="tooltip_text_right">
                                          {it.company_location_id1 ?
                                            (`${it.company_location_id1} - ${it.location_name1}`)
                                            : "No Data"
                                          }
                                          <br />
                                          {it.address11 ?
                                            (`${it.address11}`)
                                            : null
                                          }

                                          <br />
                                          {it.city1 ?
                                            (`${it.city1}, ${it.state1}, ${it.zip1} `)
                                            : null
                                          }
                                        </p>
                                      </div>
                                    </div>
                                    <div className="tooltip_single_sec pt_20">
                                      <div className="tooltip_text_left">Planned Arrive: </div>
                                      <div className="tooltip_text_right">{"No Data"}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Planned Depart: </div>
                                      <div className="tooltip_text_right">{"No Data"}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">ETA: </div>
                                      <div className="tooltip_text_right"> {"No Data"}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Actual Arrival Time: </div>
                                      <div className="tooltip_text_right">{"No Data"}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Actual Depart Time: </div>
                                      <div className="tooltip_text_right">{"No Data"}</div>
                                    </div>
                                  </div>
                                </div>
                              </span>
                            </>
                          }
                        </Typography>
                      </React.Fragment>
                    }
                      placement="top"
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customArrow,
                      }} arrow>
                      <div
                        className={getClassName(it.MVX, true)}
                        style={{
                          width: it.mvWidthPercentage + "%",
                          left: it.drawStartPercentage + it.puWidthPercentage + "%",
                          position: "absolute"
                        }}
                      >
                        <div className="dragable_bottom_section_text">
                          {it.move_type}
                        </div>
                      </div>
                    </Tooltip>
                  )}
                  {it.DEL === 0 ? (
                    ""
                  ) : (
                    <Tooltip title={
                      <React.Fragment>
                        <Typography color="inherit">
                          {
                            <>
                              <span className="tooltip-adjust">
                                <div className="main_tooltip_section">
                                  <div className="tooltip_left">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Order: </div>
                                      <div className="tooltip_text_right">{it.orderid}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Move: </div>
                                      <div className="tooltip_text_right">{it.move_id}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_middle">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">  Type:</div>
                                      <div className="tooltip_text_right">  {it.stop_delivery_type}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">  Type:</div>
                                      <div className="tooltip_text_right">  {"No Data"}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_rightPu">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Status:</div>
                                      <div className="tooltip_text_right"> {it.order_status}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Status:</div>
                                      <div className="tooltip_text_right"> {it.movement_status}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="main_tooltip_section tooltip_inner_gap">
                                  <div className="tooltip_left">
                                    <div className="tooltip_single_sec  ">
                                      <div className="tooltip_text_left fs_20">{it.stop_delivery_type ? it.stop_delivery_type.toUpperCase() : "No Data"} : </div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <p className="tooltip_text_right address_set">
                                        <p className="tooltip_text_right">
                                          {it.company_location_id1 ?
                                            (`${it.company_location_id1} - ${it.location_name1}`)
                                            : "No Data"
                                          }
                                          <br />
                                          {it.address11 ?
                                            (`${it.address11}`)
                                            : null
                                          }
                                          <br />
                                          {it.city1 ?
                                            (`${it.city1}, ${it.state1}, ${it.zip1} `)
                                            : null
                                          }
                                        </p>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="tooltip_middle">
                                  </div>
                                </div>
                                <div className="main_tooltip_section tooltip_inner_gap1">
                                  <div className="tooltip_left">
                                    <div className="tooltip_single_sec ">
                                      <div className="tooltip_text_left">Early Pickup Appt: </div>
                                      <div className="tooltip_text_right"> {formatDate(it.delivery_sched_arrive_early_utc, it.delivery_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec ">
                                      <div className="tooltip_text_left">Late Pickup Appt: </div>
                                      <div className="tooltip_text_right"> {formatDate(it.delivery_sched_arrive_late_utc, it.delivery_timezone)}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_middle">
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">  Appt Rq'd:</div>
                                      <div className="tooltip_text_right">  {"No Data"}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">  Appt confirmed:</div>
                                      <div className="tooltip_text_right">  {"No Data"}</div>
                                    </div>
                                  </div>
                                  <div className="tooltip_rightPu">
                                  </div>
                                </div>
                                <div className="main_tooltip_section tooltip_inner_gap" >
                                  <div className="tooltip_left">
                                    <div className="tooltip_single_sec mt_5 ">
                                      <div className="tooltip_text_left">Planned Arrive : </div>
                                      <div className="tooltip_text_right"> {formatDate(it.delivery_planned_arrive, it.delivery_timezone)}</div>
                                    </div>

                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Planned Depart : </div>
                                      <div className="tooltip_text_right">   {formatDate(it.delivery_planned_depart, it.delivery_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">ETA: </div>
                                      <div className="tooltip_text_right"> {formatDate(it.delivery_eta_utc, it.delivery_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Actual Arrival : </div>
                                      <div className="tooltip_text_right">  {formatDate(it.delivery_actual_arrive, it.delivery_timezone)}</div>
                                    </div>
                                    <div className="tooltip_single_sec">
                                      <div className="tooltip_text_left">Actual Depart : </div>
                                      <div className="tooltip_text_right">  {formatDate(it.delivery_actual_depart, it.delivery_timezone)}</div>
                                    </div>
                                  </div>

                                  <div className="tooltip_middle">
                                  </div>
                                  <div className="tooltip_rightPu">
                                  </div>
                                </div>
                              </span>
                            </>
                          }
                        </Typography>
                      </React.Fragment>
                    }
                      onClick={() => handleTooltipClick("delivery", it.delivery_status, it)}
                      placement="top"
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customArrow,
                      }}
                      arrow
                    >
                      <div
                        className={getClassNameStatus(
                          it.DELX,
                          it.delivery_status
                        )}
                        style={{
                          width: it.delWidthPercentage + "%",
                          left: it.drawStartPercentage + it.puWidthPercentage + it.mvWidthPercentage + "%",
                          position: "absolute"
                        }}
                      >
                        <div className="dragable_bottom_section_text">
                          {it.delivery_type}{" "}
                        </div>
                      </div>
                    </Tooltip>
                  )}
                  {it.OF === 0 ? (
                    ""
                  ) : (
                    <div
                      className={getClassNameOf(it.OFX)}
                      style={{ width: it.ofWidthPercentage + "%" }}
                    >
                      <div className="dragable_bottom_section_text">
                        {it.move_type}
                      </div>
                    </div>
                  )}
                </div>
              </>
            }
          </div>
        </div>
      ))}

      <Modal
        show={impactViewModal}
        onHide={() => setImpactViewModal(false)}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Impact View
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          >
            <GridColumn
              field="driver_id"
              title="Driver ID"
              width="200px"
              filterable={true}
              cell={(e) => {
                return <td>{e?.dataItem?.driver_id}</td>;
              }}
            />
            <GridColumn
              field="trailer_id"
              title="Trailer ID"
              width="200px"
              filterable={true}
              cell={(e) => {
                return <td>{e.dataItem.trailer_id}</td>;
              }}
            />
            <GridColumn
              field="terminal"
              title="Terminal"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.terminal ? e.dataItem.terminal : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="load_id"
              title="Load ID"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>{e.dataItem.load_id ? e.dataItem.load_id : ""}</td>
                );
              }}
            />
            <GridColumn
              field="loaded"
              title="Loaded"
              width="200px"
              filterable={true}
            />
            <GridColumn
              field="driver_load_unload"
              title="Driver Load Unload"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>{e.dataItem.driver_load_unload ? e.dataItem.driver_load_unload : ""}</td>
                );
              }}
            />
            <GridColumn
              field="lm_order_id"
              title="Order ID"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.lm_order_id
                      ? e.dataItem.lm_order_id
                      : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="stop_type"
              title="Stop Type"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.stop_type
                      ? e.dataItem.stop_type
                      : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="planned_arrive_utc"
              title="Planned Arrive"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.planned_arrive_utc
                      ? formatDate(e.dataItem.planned_arrive_utc)
                      : ""}
                  </td>
                );
              }}
            />

            <GridColumn
              field="planned_depart_utc"
              title="Planned Depart"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.planned_depart_utc
                      ? formatDate(e.dataItem.planned_depart_utc)
                      : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="sched_arrive_early_utc"
              title="Scheduled Arrive Early"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.sched_arrive_early_utc
                      ? formatDate(e.dataItem.sched_arrive_early_utc)
                      : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="sched_arrive_late_utc"
              title="Scheduled Arrive Late"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.sched_arrive_late_utc
                      ? formatDate(e.dataItem.sched_arrive_late_utc)
                      : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="actual_arrival_utc"
              title="Actual Arrival"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.actual_arrival_utc
                      ? formatDate(e.dataItem.actual_arrival_utc)
                      : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="actual_departure_utc"
              title="Actual Depart"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.actual_departure_utc
                      ? formatDate(e.dataItem.actual_departure_utc)
                      : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="eta_utc"
              title="ETA"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.eta_utc
                      ? formatDate(e.dataItem.eta_utc)
                      : ""}
                  </td>
                );
              }}
            />
            <GridColumn
              field="lm_location_name"
              title="Customer Information"
              width="200px"
              filterable={true}
              cell={(e) => {
                return (
                  <td>
                    {e.dataItem.lm_location_name
                      ? e.dataItem.lm_location_name
                      : ""}
                  </td>
                );
              }}
            />
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setImpactViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PBBlock;
