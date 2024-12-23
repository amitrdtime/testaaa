import baselinesave from "../../assets/images/baseline_save.png";
import React, { useState, useEffect, useContext } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import ProgressBar from "react-bootstrap/ProgressBar";
import PlanningBoardOrderBlock from "./planningboardorderblock";

const PlanningBoardRowBody = (props) => {
  
  const [blockHours, setBlockHours] = useState([])

  const blockHoursData = [];

  useEffect(() => {

    for(let loop=0; loop < props.rowdata.length; loop++){
      // 
      // 
      getBlockDataObject(props.rowdata[loop], new Date(props.startdate));
    }
    
    for(let loop=0; loop < 24; loop++){
      if (!blockHoursData.filter(it => it.startHour === loop).length){
       blockHoursData.push({ startHour: loop, isBlock: 0, PU: 1, DEL: 1, MV: 2, endHour: 1, orderid: 97920, trailerid: 1001  });
      }
    }

    const dataFinalObject = blockHoursData.sort((a, b) => a.startHour > b.startHour)

    setBlockHours(dataFinalObject);

    return () => {
      
    }
  }, [])

  const dateDiffInHours= function(startDate, endDate) {
    const _MS_PER_Minutes = 1000 * 60 * 60;

    if (startDate === NaN || startDate === null)
        return 0;
    
    if (endDate === NaN || endDate === null)
        return 0;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());
    const utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds());
  
    return Math.floor((utc2 - utc1) / _MS_PER_Minutes);
  }

  const getPU = function(order, obj){
    let start_pk_ts = new Date(order.actual_arrival_to_pickup).getHours(); 
    obj.startHour = start_pk_ts;
    obj.isBlock = 1;
    
    let nextStartTs = start_pk_ts;
    let difference = Math.round(dateDiffInHours(new Date(order.actual_arrival_to_pickup), new Date(order.actual_departure_to_pickup)));
    if (difference < 1)
      difference = 1;

    obj.PU = difference;

    nextStartTs = nextStartTs + difference;
  }

  const getMV = function(order, obj){

  }

  const getDEL = function(order, obj){

  }

  const getBlockDataObject = function(order, planningDate){
    const obj = {};
    // { startHour: 0, isBlock: -1, PU: 1, DEL: 1, MV: 2, endHour: 1, orderid: 97920, trailerid: 1001  },
    let nextStartTs = 0;
    // order.actual_arrival_to_pickup - Start of the pick up
    // order.actual_departure_to_pickup - Start of the journey
    // order.actual_arrival_to_delivery - Reached the delivery location
    // order.actual_departure_to_delivery - Delivery completed.

    if (new Date(order.actual_arrival_to_pickup).getTime() < planningDate.getTime()) { // If block starts previous day
      if (new Date(order.actual_departure_to_pickup).getTime() < planningDate.getTime()) {
        if (new Date(order.actual_arrival_to_delivery).getTime() < planningDate.getTime()) {
          if (new Date(order.actual_departure_to_delivery).getTime() < planningDate.getTime()) {
            // draws the last drop segment of the block. [Delivery completed.]
            obj.startHour = 0;
            obj.isBlock = 1;
            obj.PU = 0;
            nextStartTs = obj.startHour;
    
            let diff = 0; 
            obj.MV = diff;
      
            if (nextStartTs < 24) {
        
              diff = 0; //new Date(order.actual_departure_to_delivery).getHours(); //Math.round(dateDiffInHours(new Date(order.actual_arrival_to_delivery), new Date(order.actual_departure_to_delivery)));
              
              obj.DEL = diff;
              obj.orderid = order.orderId;
              obj.trailerid = order.trailerId;
      
              blockHoursData.push(obj);
      
            }
      
            const totalRunDuration = obj.DEL+ obj.MV + obj.PU;
            
            if (totalRunDuration > 1){
              for(let loop =0; loop < totalRunDuration -1; loop++){
                  let tempObj = {...obj};
                  tempObj.startHour = obj.startHour + 1 + loop;
                  tempObj.isBlock = 99;
                  blockHoursData.push(tempObj);    
                }
              }
          } else { 
            // order.actual_arrival_to_delivery - Reached the delivery location
            obj.startHour = 0;
            obj.isBlock = 1;
            let difference = 0;

            obj.PU = 0;
            nextStartTs = obj.startHour;
   
            let diff = 0; 
            obj.MV = diff;
      
            if (nextStartTs < 24) {
      
              diff = new Date(order.actual_departure_to_delivery).getHours(); //Math.round(dateDiffInHours(new Date(order.actual_arrival_to_delivery), new Date(order.actual_departure_to_delivery)));
              
              obj.DEL = diff;
              obj.orderid = order.orderId;
              obj.trailerid = order.trailerId;
      
              blockHoursData.push(obj);
      
            }
      
            const totalRunDuration = obj.DEL+ obj.MV + obj.PU;
            
            if (totalRunDuration > 1){
              for(let loop =0; loop < totalRunDuration -1; loop++){
                  let tempObj = {...obj};
                  tempObj.startHour = obj.startHour + 1 + loop;
                  tempObj.isBlock = 99;
                  blockHoursData.push(tempObj);    
                }
              }
          }
        } else {
          obj.startHour = 0;
          obj.isBlock = 1;
          
          let nextStartTs = 0;
          let difference = 0;

          obj.PU = difference;
    
          nextStartTs = nextStartTs + difference;
    
          let diff = new Date(order.actual_arrival_to_delivery).getHours(); //Math.round(dateDiffInHours(new Date(order.actual_departure_to_pickup), new Date(order.actual_arrival_to_delivery)));
    
          if (diff < 1)
            diff = 1;
          else if (diff + nextStartTs > 24)
            diff = 24 - nextStartTs; // goes to next day, Another condition needs to be done if it comes from prior day - to be addressed
    
          obj.MV = diff;
    
          if (nextStartTs < 24) {
    
            if (diff + nextStartTs > 24)
              diff = 24 - nextStartTs; // goes to next day, Another condition needs to be done if it comes from prior day - to be addressed
    
            diff = Math.round(dateDiffInHours(new Date(order.actual_arrival_to_delivery), new Date(order.actual_departure_to_delivery)));
            if (diff < 1)
              diff = 1;
            
            obj.DEL = diff;
            obj.orderid = order.orderId;
            obj.trailerid = order.trailerId;
    
            blockHoursData.push(obj);
    
          }
    
          const totalRunDuration = obj.DEL+ obj.MV + obj.PU;
          
          if (totalRunDuration > 1){
            for(let loop =0; loop < totalRunDuration -1; loop++){
                let tempObj = {...obj};
                tempObj.startHour = obj.startHour + 1 + loop;
                tempObj.isBlock = 99;
                blockHoursData.push(tempObj);
    
              }
            }
        }
      } else {
        obj.startHour = 0;
        obj.isBlock = 1;
        
        let nextStartTs = 0;
        let difference = new Date(order.actual_arrival_to_pickup).getHours(); //Math.round(dateDiffInHours(new Date(order.actual_arrival_to_pickup), new Date(order.actual_departure_to_pickup)));
        if (difference < 1)
          difference = 1;
  
        obj.PU = difference;
  
        nextStartTs = nextStartTs + difference;
  
        let diff = Math.round(dateDiffInHours(new Date(order.actual_departure_to_pickup), new Date(order.actual_arrival_to_delivery)));
  
        if (diff < 1)
          diff = 1;
        else if (diff + nextStartTs > 24)
          diff = 24 - nextStartTs; // goes to next day, Another condition needs to be done if it comes from prior day - to be addressed
  
        obj.MV = diff;
  
        if (nextStartTs < 24) {
  
          if (diff + nextStartTs > 24)
            diff = 24 - nextStartTs; // goes to next day, Another condition needs to be done if it comes from prior day - to be addressed
  
          diff = Math.round(dateDiffInHours(new Date(order.actual_arrival_to_delivery), new Date(order.actual_departure_to_delivery)));
          if (diff < 1)
            diff = 1;
          
          obj.DEL = diff;
          obj.orderid = order.orderId;
          obj.trailerid = order.trailerId;
  
          blockHoursData.push(obj);
  
        }
  
        const totalRunDuration = obj.DEL+ obj.MV + obj.PU;
        
        if (totalRunDuration > 1){
          for(let loop =0; loop < totalRunDuration -1; loop++){
              let tempObj = {...obj};
              tempObj.startHour = obj.startHour + 1 + loop;
              tempObj.isBlock = 99;
              blockHoursData.push(tempObj);
  
            }
          }
      }
    } else { // In case the block starts in the same day and continue till next day

      let start_pk_ts = new Date(order.actual_arrival_to_pickup).getHours(); 
      obj.startHour = start_pk_ts;
      obj.isBlock = 1;
      
      nextStartTs = start_pk_ts;
      let difference = Math.round(dateDiffInHours(new Date(order.actual_arrival_to_pickup), new Date(order.actual_departure_to_pickup)));
      if (difference < 1)
        difference = 1;

      obj.PU = difference;

      nextStartTs = nextStartTs + difference;

      let diff = Math.round(dateDiffInHours(new Date(order.actual_departure_to_pickup), new Date(order.actual_arrival_to_delivery)));

      if (diff < 1)
        diff = 1;
      else if (diff + nextStartTs > 24)
        diff = 24 - nextStartTs; // goes to next day, Another condition needs to be done if it comes from prior day - to be addressed

      obj.MV = diff;

      if (nextStartTs < 24) {

        if (diff + nextStartTs > 24)
          diff = 24 - nextStartTs; // goes to next day, Another condition needs to be done if it comes from prior day - to be addressed

        diff = Math.round(dateDiffInHours(new Date(order.actual_arrival_to_delivery), new Date(order.actual_departure_to_delivery)));
        if (diff < 1)
          diff = 1;
        
        obj.DEL = diff;
        obj.orderid = order.orderId;
        obj.trailerid = order.trailerId;

        blockHoursData.push(obj);

      }

      const totalRunDuration = obj.DEL+ obj.MV + obj.PU;
      
      if (totalRunDuration > 1){
        for(let loop =0; loop < totalRunDuration -1; loop++){
            let tempObj = {...obj};
            tempObj.startHour = obj.startHour + 1 + loop;
            tempObj.isBlock = 99;
            blockHoursData.push(tempObj);

          }
        }
    }

    // 
  }


  
  return (
    <>
      <PlanningBoardOrderBlock blockHours= { blockHours } />
      <div className="planner_board_right_image">
        <img
          src={baselinesave}
          alt="Baseline-Save"
          title="Baseline-Save"
          className="planner_right_image"
        />
      </div>
    </>
  );
};

export default PlanningBoardRowBody;
