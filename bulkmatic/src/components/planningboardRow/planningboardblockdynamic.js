import baselinesave from "../../assets/images/baseline_save.png";
import React, { useState, useEffect, useContext } from "react";
import Draggable, { DraggableCore } from "react-draggable";
import ProgressBar from "react-bootstrap/ProgressBar";
import parse from 'html-react-parser';
import JsxParser from 'react-jsx-parser'
import PlanningBoardBlock from "./block";

const PlanningBoardBlockDynamic = (props) => {
  useEffect(() => {
    // setdbStructure(pro)
    return () => {
      
    }
  }, [])

  let pbStructure = {
    unavailble: [
      { start: 0, end: 0, length: 1, type: "", orderid: "", trailerid: "", driverid: "", hasOnTime: true, actionValue: ""}
    ],
    available: [
      { start: 0, end: 0, length: 1, type: "", orderid: "", trailerid: "", driverid: "", hasOnTime: true, actionValue: ""}
    ],
    block: [
      { start: 0, end: 0, length: 1, type: "", orderid: "", trailerid: "", driverid: "", hasOnTime: true, actionValue: ""}
    ]
  }

  dbStructure = props.blockHours;

  const view = props.view;
  // 
   
  return (
    <>
    {
      pbStructure.block.length < 1? "" :      
      (
        <div className="planner_Board_section pr">
          {
            dbStructure.filter(it => it.startHour === 0 && it.isBlock === -1).length?
              (<div className="planner_Board_unavailable"></div>) 
              : dbStructure.filter(it => it.startHour === 1 && it.isBlock === 0).length? (<div className="planner_Board_available"></div>) 
              : dbStructure.filter(it => it.startHour === 1 && it.isBlock !== 99).length? (<><div className="planner_Board_available"></div><PlanningBoardBlock view= { view } block= { dbStructure.filter(it => it.startHour === 0) }/></>) : (<div className="planner_Board_available"></div>) 
          }
        </div>        
      )
    }
    </>
  );
};

export default PlanningBoardBlockDynamic;
