import React, { useState, useEffect, useContext } from "react";
import PBBlock from "./pbblock";
import "./available.css";
import "./unavailable.css";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles({
  root: {
    width: "10%",
  },
});

const PlanningBoardOrderBlock = (props) => {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  useEffect(() => {
    // setdbStructure(pro)
    return () => { };
  }, []);
  let utilization = 0;
  let dbStructure = props.blockHours;
  if(props?.utilization && props?.utilization != 'null') {
    utilization = props.utilization;
  }
  const view = props.view;

  // 

  return (
    <>
      {dbStructure.length < 1 ? (
        <div className="planner_Board_section pr">
          {view == "driver" ? (
          <div className={classes.root}>
          <LinearProgressWithLabel value={utilization} />
        </div>
          )
        : null }

          <div className="available_planner available_planner_1440">
          <div className="day_time_inner11"></div>                  
                  <div className="day_time_inner11 from_left_1"></div>
                  <div className="day_time_inner11 from_left_2"></div>
                  <div className="day_time_inner11 from_left_3"></div>
                  <div className="day_time_inner11 from_left_4"></div>
                  <div className="day_time_inner11 from_left_5"></div>
                  <div className="day_time_inner11 from_left_6"></div>
                  <div className="day_time_inner11 from_left_7"></div>
                  <div className="day_time_inner11 from_left_8"></div>
                  <div className="day_time_inner11 from_left_9"></div>
                  <div className="day_time_inner11 from_left_10"></div>
                  <div className="day_time_inner11 from_left_11"></div>
                  <div className="day_time_inner11 from_left_12"></div>
                  <div className="day_time_inner11 from_left_13"></div>
                  <div className="day_time_inner11 from_left_14"></div>
                  <div className="day_time_inner11 from_left_15"></div>
                  <div className="day_time_inner11 from_left_16"></div>
                  <div className="day_time_inner11 from_left_17"></div>
                  <div className="day_time_inner11 from_left_18"></div>
                  <div className="day_time_inner11 from_left_19"></div>
                  <div className="day_time_inner11 from_left_20"></div>
                  <div className="day_time_inner11 from_left_21"></div>
                  <div className="day_time_inner11 from_left_22"></div>
                  <div className="day_time_inner11 from_left_23"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="planner_Board_section pr">
          {view == "driver" ? (
          <div className={classes.root}>
          <LinearProgressWithLabel value={utilization} />
        </div>
          )
        : null }

            <div className="available_planner available_planner_1440">
              {/* {
                Array.from(Array(24).keys()).map((e)=>(
                
                  <div style={{left:`${e*4.1664}%`}} className="day_time_inner11"></div>
                ))
              } */}

                  <div className="day_time_inner11"></div>                  
                  <div className="day_time_inner11 from_left_1"></div>
                  <div className="day_time_inner11 from_left_2"></div>
                  <div className="day_time_inner11 from_left_3"></div>
                  <div className="day_time_inner11 from_left_4"></div>
                  <div className="day_time_inner11 from_left_5"></div>
                  <div className="day_time_inner11 from_left_6"></div>
                  <div className="day_time_inner11 from_left_7"></div>
                  <div className="day_time_inner11 from_left_8"></div>
                  <div className="day_time_inner11 from_left_9"></div>
                  <div className="day_time_inner11 from_left_10"></div>
                  <div className="day_time_inner11 from_left_11"></div>
                  <div className="day_time_inner11 from_left_12"></div>
                  <div className="day_time_inner11 from_left_13"></div>
                  <div className="day_time_inner11 from_left_14"></div>
                  <div className="day_time_inner11 from_left_15"></div>
                  <div className="day_time_inner11 from_left_16"></div>
                  <div className="day_time_inner11 from_left_17"></div>
                  <div className="day_time_inner11 from_left_18"></div>
                  <div className="day_time_inner11 from_left_19"></div>
                  <div className="day_time_inner11 from_left_20"></div>
                  <div className="day_time_inner11 from_left_21"></div>
                  <div className="day_time_inner11 from_left_22"></div>
                  <div className="day_time_inner11 from_left_23"></div>
               
              {/* <div className="day_time_inner11 from_left_1"></div>
              <div className="day_time_inner11 from_left_2"></div> */}
              {dbStructure.filter((it) => it.isBlock > 0).length ? (
                // dbStructure.filter(it => it.isBlock >0).map(block => (
                <PBBlock
                  view={view}
                  block={dbStructure.filter((it) => it.isBlock > 0)}
                />
              ) : (
                // )
                // )
                ""
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PlanningBoardOrderBlock;
