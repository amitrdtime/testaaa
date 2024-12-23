import BaselineShiping from "../../assets/images/baseline_local_shipping.png";
//import baselinesave from "../../assets/images/baseline_save.png";
import Carrier from "../../assets/images/baseline_carrier.png";
import PlannerBoardTrailersTable from "../plannerBoardTrailersTable/plannerBoardTrailersTable";
import PlannerBoardOrdersTable from "../plannerBoardOrdersTable/plannerBoardOrdersTable";

import React, { useState, useEffect, useContext } from 'react';
import Draggable, { DraggableCore } from 'react-draggable';


const PlannerBoardCarrierViewBody = (props) => {
    const {allOrders,allTrailers} = props;
    const [allOrdersArray, setAllOrdersArray] = useState([]);
    const [allTrailersArray, setAllTrailersArray] = useState([]);
    const [tabSelected, settabSelected] = useState("");
    const [hourArr, sethourArr] = useState(Array.from(Array(24).keys()));
    const [completeDate, setcompleteDate] = useState({});
    const [defaultDate, setdefaultDate] = useState(new Date(Date.now()))
    const [dateClickedIndex, setdateClickedIndex] = useState(0)
    const [dataRowArr, setdataRowArr] = useState(Array.from(Array(5).keys()));


    const handleStart = () => {
0
    }
    const handleDrag = () => {

    }
    const handleStop = () => {

    }
    const getCompleteDate = (currentdate) => {

        let day = currentdate.toDateString().split(" ")[0]
        let month = currentdate.toDateString().split(" ")[1]
        let date = currentdate.toDateString().split(" ")[2]
        let year = currentdate.toDateString().split(" ")[3]
        setcompleteDate({
            "day": day,
            "month": month,
            "date": date,
            "year": year

        })
    }
    useEffect(() => {
        var currentdate = new Date(Date.now());
        getCompleteDate(currentdate);
    }, []);

    useEffect(() => {        
        setAllOrdersArray(allOrders); 
    },[allOrders]);

    useEffect(() => {        
        setAllTrailersArray(allTrailers); 
    },[allTrailers]);

    const nextDateChange = (e) => {
        setdateClickedIndex(dateClickedIndex + 1)
        var currentdate = new Date(Date.now() + (dateClickedIndex + 1) * 24 * 60 * 60 * 1000)
        getCompleteDate(currentdate)
    }
    const previousDayChange = () => {
        setdateClickedIndex(dateClickedIndex - 1)
        var currentdate = new Date(Date.now() + (dateClickedIndex - 1) * 24 * 60 * 60 * 1000)
        getCompleteDate(currentdate)

    }

    return (
        <>
            <div className="row mt_30">
                <div className="col-xl-12">
                    <div className="card card_shadow">
                        <div className="card-body ">
                            <div className="planner_top_date">
                                <div className="planner_date_text">
                                    {completeDate.month + " " + completeDate.date + " " + completeDate.day + " " + completeDate.year}
                                </div>
                                <div className="ml_12">
                                    <div><i class="fa fa-caret-up fa-2x" aria-hidden="true" onClick={nextDateChange}></i></div>
                                    <div><i class="fa fa-caret-down fa-2x" aria-hidden="true" onClick={previousDayChange}></i></div>
                                </div>

                            </div>
                            <div className="day_time_container">
                                <div className="am_section">A.M</div>
                                <div className="day_time_section">
                                    {
                                        hourArr.map(item => (
                                            <div className="day_time_inner" key={item}>
                                                {item}
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="pm_section">P.M</div>
                            </div>

                            <div className="planner_scroll_section"
                            >
                                {
                                    dataRowArr.map((item => (
                                        <div className="planner_Board_wrapper" key={item}>
                                            <div className="planner_board_left_image_carrier">
                                                <div><img src={Carrier} alt="Baseline-Shiping" title="Baseline-carrier" className="planner_left_image" /></div>
                                                <div className="planner_board_left_image_text_carrier">Bulkmatic Soln.</div>
                                            </div>
                                            <div className="planner_Board_section pr">
                                                {/* <div className="planner_Board_unavailable"></div>
                                                <div className="planner_Board_unavailable"></div> */}
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                                <div className="planner_Board_available"></div>
                                   


                                               
                                            </div>
                                            <div className="planner_board_right_image">
                                            {/* <img src={baselinesave} alt="Baseline-Save" title="Baseline-Save" className="planner_right_image" /> */}
                                            </div>
                                        </div>

                                    )))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           
        </>






    )
}

export default PlannerBoardCarrierViewBody
