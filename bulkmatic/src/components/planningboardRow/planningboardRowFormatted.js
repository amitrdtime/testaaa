import baselinesave from "../../assets/images/baseline_save.png";
import React, { useState, useEffect, useContext } from "react";
import PlanningBoardOrderBlock from "./planningboardorderblock";

const PlanningBoardRowBodyFormatted = (props) => {
  
  const blockHours = props.blockHours;
  // 
  return (
    <>
      {<PlanningBoardOrderBlock view = { props.view } 
      blockHours= { blockHours.planner } 
      utilization={blockHours.utilization}
      />}
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

export default PlanningBoardRowBodyFormatted;
