import React, { useState, useEffect, useContext, useRef } from "react";
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import PlannerHeader from "../../components/plannerHeader/plannerHeader";
import OrderService from "../../services/OrderService";
import TrailerService from "../../services/trailerService";
import PlanningBoardService from "../../services/planingBoardService";
import PlannerBoardTrailerViewBodyFormatted from "../../components/plannerBoardTrailerViewBody/plannerBoardTrailerViewBodyFormatted";
import PlannerBoardCarrierViewBodyFormatted from "../../components/plannerBoardCarrierViewBody/plannerBoardCarrierViewBodyFormatted";
import { DateTime } from "luxon";
import { ContextData } from "../../components/appsession";
import OrdersTab from "../../components/ordersTab/ordersTab";
import ProgressBar from "react-bootstrap/ProgressBar";
import BaselineShiping from "../../assets/images/baseline_local_shipping.png";
import PlannerBoardTrailersTable from "../../components/plannerBoardTrailersTable/plannerBoardTrailersTable";
import PlannerBoardOrdersTable from "../../components/plannerBoardOrdersTable/plannerBoardOrdersTable";
import PlanningBoardRowBodyFormatted from "../../components/planningboardRow/planningboardRowFormatted";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Trailer from "../../assets/images/baseline_trailer.png";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: 500,
  },
  customTooltip: {
    maxWidth: 'none',
    backgroundColor: "#4267B2",
    // borderColor:"#2C4F95",
    // borderStyle:"solid",
    // borderWidth:"2px",
    //boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.54)",
    padding: "12px",
    borderRadius: "10px"
  },
  customArrow: {
    color: "#4267B2",
    fontSize: "20px"
  },

}));
const Planner = () => {
  const [userData, setuserData] = useContext(ContextData);
  const { id } = useParams();
  const [isPlannerBoardClicked, setisPlannerBoardClicked] = useState(false);
  const [selectedTab, setselectedTab] = useState("driver");
  const [allOrders, setAllOrders] = useState([]);
  const [allTrailers, setAllTrailers] = useState([]);
  const [PlannerBoardLoadingPage, setPlannerBoardLoadingPage] = useState(true);
  const [PlanningBoardDriversResponse, setallPlanningBoardDriversView] = useState([]);
  const [planningBoardDrivers, setPlanningBoardDrivers] = useState([]);
  const [planningBoardTrailers, setPlanningBoardTrailers] = useState([]);
  const [planningBoardCarriers, setPlanningBoardCarriers] = useState([]);
  const [driverPageNumber, setDriverPageNumber] = useState(1);
  const [trailerPageNumber, setTrailerPageNumber] = useState(1)
  const [PlanningBoardTrailersResponse, setallPlanningBoardTrailersView] = useState([]);
  const [PlanningBoardCarriersResponse, setallPlanningBoardCarriersView] = useState([]);
  // const [userterminals, setUserTerminals] = useState([]);
  // const [plannerterminals, setPlannerTerminals] = useState([]);
  // const [userplanners, setUserPlanners] = useState([]);
  const [commodityGroup, setCommodityGroup] = useState([]);
  const [terminal, setTerminal] = useState([]);
  const [search, setSearch] = useState("");
  const [headerData, setHeaderData] = useState("");
  const [date, setDate] = useState(DateTime.now().startOf("day").toLocal().toMillis());

  // const [payloadForPlanningBoard, setSearchData] = useState({
  //   date: new Date(),
  //   commodityGroup: commodityGroup,
  //   terminal: terminal,
  //   // userterminals: userterminals,
  //   // plannerterminals: plannerterminals,
  //   // userplanners: userplanners,
  //   search: search,
  //   pageNumber: 1
  // });

  const [refreshByDate, setRefreshByDate] = useState(new Date());
  const refreshByDateRef = useRef(new Date());

  //From the other component
  const [allOrdersArray, setAllOrdersArray] = useState([]);
  const [allTrailersArray, setAllTrailersArray] = useState([]);
  const [tabSelected, settabSelected] = useState("");
  const [hourArr, sethourArr] = useState(Array.from(Array(24).keys()));
  


  const [completeDate, setcompleteDate] = useState({});
  const [defaultDate, setdefaultDate] = useState(new Date(Date.now()));
  const [dateClickedIndex, setdateClickedIndex] = useState(0);
  const classes = useStyles();

  // const payloadForPlanningBoard = {
  //   date,
  //   commodityGroup,
  //   terminal,
  //   search
  // }


  let payloadForPlanningBoard = {}
  if (selectedTab == "carrier") {
    payloadForPlanningBoard = {
      date
    }
  }
  else {
    payloadForPlanningBoard = {
      date,
      commodityGroup,
      terminal,
      search
    }
  }
  let payloadForOrders = {
    date,
    terminal
  }
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
    setAllOrdersArray(allOrders);
  }, [allOrders]);

  useEffect(() => {
    setAllTrailersArray(allTrailers);
  }, [allTrailers]);

  // useEffect(() => {
  //   getCompleteDate(new Date(payloadForPlanningBoard.date));
  // }, [payloadForPlanningBoard.date]);

  const nextDateChange = async (e) => {
    let newDate = DateTime.fromMillis(payloadForPlanningBoard.date).plus({ days: 1 }).toMillis();
    let dateIndex = dateClickedIndex;
    setdateClickedIndex(dateIndex + 1);
    payloadForPlanningBoard.date = newDate;
    let headerDataState = headerData;
    headerDataState.date = newDate;
    setHeaderData(headerDataState);
    payloadForPlanningBoard.date = newDate;
    await parentCallBackForPlannerHeader(headerDataState);
  };
  const previousDayChange = async () => {
    let newDate = DateTime.fromMillis(payloadForPlanningBoard.date).minus({ days: 1 }).toMillis();
    let dateIndex = dateClickedIndex;
    setdateClickedIndex(dateIndex + 1);
    payloadForPlanningBoard.date = newDate;
    let headerDataState = headerData;
    headerDataState.date = newDate;
    setHeaderData(headerDataState);
    payloadForPlanningBoard.date = newDate;
    await parentCallBackForPlannerHeader(headerDataState);
  };

  const refreshData = async (searchparams) => {
    setPlannerBoardLoadingPage(true);
    setHeaderData(searchparams);
    try {
      const selectedPageNumber = searchparams.pageNumber
      const orderService = new OrderService();
      const trailerService = new TrailerService();

      //Load Planning Board View From Service
      const planningboardService = new PlanningBoardService();
      //Pull and Send The Correct Date Here
      const planningBoardData = await planningboardService.getPlanningBoardData(searchparams, true); //Move Into Drivers Logic
      console.log("planningBoardData", planningBoardData)

      // const planningBoardData = await planningboardService.getPlanningBoardData(searchparams, selectedTab); //Move Into Drivers Logic
      const planningBoardDriverResponse =
        await planningboardService.getBoardByDriverFormatted(planningBoardData, searchparams); //Move Into Drivers Logic

      let Ids = searchparams.search;
      let dataAftfilter = [];
      if (Ids !== "") {
        dataAftfilter = planningBoardDriverResponse.filter(item => item.driverId === Ids);
        for (let i = 0; i < planningBoardDriverResponse.length; i++) {
          let data = planningBoardDriverResponse[i];
          for (let j = 0; j < data.planner.length; j++) {
            if (data.planner[j].orderid === Ids) {
              dataAftfilter.push(data);
            }
          }
        }
        setallPlanningBoardDriversView(dataAftfilter);
        const slicedplanningBoardDriverResponse = dataAftfilter.slice(0, 25);
        setPlanningBoardDrivers(slicedplanningBoardDriverResponse);
      } else {
        setallPlanningBoardDriversView(planningBoardDriverResponse);
        const slicedplanningBoardDriverResponse = planningBoardDriverResponse.slice(0, 25);
        setPlanningBoardDrivers(slicedplanningBoardDriverResponse);
      }

      const PlanningBoardTrailersResponse =
        await planningboardService.getBoardByTrailerFormatted(planningBoardData, searchparams);
      let ids = searchparams.search;
      let dataAftfilterTrailer = [];
      if (ids !== "") {
        dataAftfilterTrailer = PlanningBoardTrailersResponse.filter(item => item.trailerId === ids);

        for (let i = 0; i < PlanningBoardTrailersResponse.length; i++) {
          let data = PlanningBoardTrailersResponse[i];
          for (let j = 0; j < data.planner.length; j++) {
            if (data.planner[j].orderid === ids) {
              dataAftfilterTrailer.push(data);
            }
          }
        }
        setallPlanningBoardTrailersView(dataAftfilterTrailer);
        const slicedPlanningBoardTrailersResponse = dataAftfilterTrailer.slice(0, 25);
        setPlanningBoardTrailers(slicedPlanningBoardTrailersResponse);
      } else {
        setallPlanningBoardTrailersView(PlanningBoardTrailersResponse);
        const slicedplanningBoardTrailerResponse = PlanningBoardTrailersResponse.slice(0, 25);
        setPlanningBoardTrailers(slicedplanningBoardTrailerResponse);
      }
      // const slicedplanningBoardTrailerResponse = PlanningBoardTrailersResponse.slice(0, 25);
      // setPlanningBoardTrailers(slicedplanningBoardTrailerResponse);

      const PlanningBoardCarriersResponse =
        await planningboardService.getBoardByCarrierFormatted(planningBoardData, searchparams);
      setallPlanningBoardCarriersView(PlanningBoardCarriersResponse);
      if (PlanningBoardCarriersResponse?.length > 0) {
        const slicedplanningBoardCarrierResponse = PlanningBoardCarriersResponse?.slice(0, 25);
        setPlanningBoardCarriers(slicedplanningBoardCarrierResponse);
      }
      setPlannerBoardLoadingPage(false);
      const orderData = await orderService.getordertabinplanners(searchparams, true)
      setAllOrders(orderData);
      const trailerData = await trailerService.gettrailerstabbydate(searchparams.terminal, true)
      setAllTrailers(trailerData);
    }
    catch (error) {
      setPlannerBoardLoadingPage(false);
      console.log(error);
      NotificationManager.error(error, "An Error Has Occured. Please Try Again");
    }

  };

  //start of other component ordertab and trailers tab

  useEffect(async () => {
    let planningBoardData;
    setPlannerBoardLoadingPage(true);
    async function fetchPlanningBoardData() {
      try {
        const trailerService = new TrailerService();
        const orderService = new OrderService();

        const orderData = await orderService.getordertabinplanners(payloadForOrders)
        setAllOrders(orderData);
        trailerService.gettrailerstabbydate(payloadForPlanningBoard.terminal).
          then(function (trailers) {
            setAllTrailers(trailers);
          });
        //Load Planning Board View From Service
        const planningboardService = new PlanningBoardService();
        //Pull and Send The Correct Date Here
        planningBoardData = await planningboardService.getPlanningBoardData(payloadForPlanningBoard, true); //Move Into Drivers Logic
        console.log("planningBoardData", planningBoardData)

        const planningBoardDriverResponse =
          await planningboardService.getBoardByDriverFormatted(planningBoardData, payloadForPlanningBoard); //Move Into Drivers Logic
        const PlanningBoardTrailersResponse =
          planningboardService.getBoardByTrailerFormatted(planningBoardData, payloadForPlanningBoard);

        const PlanningBoardCarriersResponse =
          await planningboardService.getBoardByCarrierFormatted(planningBoardData, payloadForPlanningBoard);
        setPlannerBoardLoadingPage(false);

        //Move Into Drivers Logic
        if (planningBoardDriverResponse?.length > 0) {
          const slicedplanningBoardDriverResponse = planningBoardDriverResponse?.slice(0, 25);
          setPlanningBoardDrivers(slicedplanningBoardDriverResponse);
        }
        setallPlanningBoardDriversView(planningBoardDriverResponse);

        if (PlanningBoardTrailersResponse?.length > 0) {
          const slicedplanningBoardTrailerResponse = PlanningBoardTrailersResponse?.slice(0, 25);
          planningBoardTrailers(slicedplanningBoardTrailerResponse);
        }
        setallPlanningBoardTrailersView(PlanningBoardTrailersResponse);
        setallPlanningBoardCarriersView(PlanningBoardCarriersResponse);
        if (PlanningBoardCarriersResponse?.length > 0) {
          const slicedplanningBoardCarrierResponse = PlanningBoardCarriersResponse?.slice(0, 25);
          setPlanningBoardCarriers(slicedplanningBoardCarrierResponse);
        }
      }
      catch (error) {
        console.log(error);
        NotificationManager.error("An Error Has Occured. Please Try Again");
      }
    }
    await fetchPlanningBoardData();
    if (planningBoardData?.data?.length > 0) {
      setPlannerBoardLoadingPage(false);
    }
  }, []);
  //End of other component ordertab and trailers tab


  useEffect(async () => {
    const planningboardService = new PlanningBoardService();
    if (id !== undefined) {
      const OrdersRes = await planningboardService.getOrderById(id)
      if (OrdersRes) {
        const ordersdata = await planningboardService.getBoardByDriverFormatted(OrdersRes);
        setallPlanningBoardDriversView(ordersdata);
        const slicedplanningBoardDriverResponse = ordersdata.slice(0, 25);
        setPlanningBoardDrivers(slicedplanningBoardDriverResponse);
      }
    }
  }, [])

  // useEffect(() => {
  //   const orderService = new OrderService();
  //   orderService
  //     .getOrdersByDate(payloadForPlanningBoard.date, true)
  //     .then(function (orders) {
  //       setAllOrders(orders);
  //     });
  // }, [tabSelected]);

  const handelcallbackFromHeader = async (childdata) => {
    setisPlannerBoardClicked(childdata);
    setselectedTab("");
  };
  const parrentCallBackForTab = (data) => {
    let payload = payloadForPlanningBoard;
    payload.view = data;
    setselectedTab(data);
    refreshData(payload);
  };

  // const parentCallBackForDriverViewBodyFormatted = async (payloadForPlanningBoard) => {
  //   setSearchData({ ...payloadForPlanningBoard, date: payloadForPlanningBoard.date });
  //   refreshByDateRef.current = payloadForPlanningBoard.date;
  //   setRefreshByDate(payloadForPlanningBoard.date);
  // };

  const parentCallBackForPlannerHeader = async (filterData) => {
    setHeaderData(filterData);
    const selectedDate = new Date(filterData.date);
    let start = DateTime.fromJSDate(selectedDate).startOf("day").toUTC().toMillis();
    let newSearchData = filterData;
    newSearchData.date = start;
    filterData.date = start;

    setCommodityGroup(filterData.cgs);
    setTerminal(filterData.terminal);
    setSearch(filterData.search);
    setDate(start);
    await refreshData(filterData);
  };


  const handeDriverViewPagination = async (event, value) => {
    //let pageNumber = event.target.textContent;
    setDriverPageNumber(value);
  };
  const handeTrailerViewPagination = async (event, value) => {
    // let pageNumber = event.target.textContent;
    setTrailerPageNumber(value);
  };

  useEffect(() => {
    setPlannerBoardLoadingPage(true);
    if (PlanningBoardDriversResponse?.length > 0) {
      const slicedplanningBoardDriver = PlanningBoardDriversResponse?.slice(((driverPageNumber - 1) * 25), (driverPageNumber * 25));
      setPlanningBoardDrivers(slicedplanningBoardDriver);
      setPlannerBoardLoadingPage(false);
    }
  }, [driverPageNumber]);

  useEffect(() => {
    setPlannerBoardLoadingPage(true);
    if (PlanningBoardTrailersResponse?.length > 0) {
      const slicedplanningBoardTrailer = PlanningBoardTrailersResponse?.slice(((trailerPageNumber - 1) * 25), (trailerPageNumber * 25));
      setPlanningBoardTrailers(slicedplanningBoardTrailer);
      setPlannerBoardLoadingPage(false);
    }
  }, [trailerPageNumber]);

  useEffect(() => {
    console.log("payloadForPlanningBoard.date", payloadForPlanningBoard.date)

  }, [payloadForPlanningBoard.date]);
  function getTimeZone(plandate) {
    const millis = plandate
    const Timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return DateTime.fromMillis(millis)
      .setZone(Timezone)
      .toFormat("ZZZZ")
  }
  const convertDateTime = (epoch_date) => {
    // let date = Date.parse(props.dataItem.EffectiveDate)

    return (
      <td>
        {DateTime.fromMillis(parseInt(epoch_date * 1000))
          .toFormat("MM-dd-yyyy, HH:mm")
          .toString()}
      </td>
    );
  };

  return (
    <div>
      <div id="wrapper">
        <Header
          userclicked={isPlannerBoardClicked}
          parentcallback={handelcallbackFromHeader}
        ></Header>
        <AppBar></AppBar>
        <div className="content-page_yardcheck">
          <div className="content">
            <div className="container-fluid">
              {isPlannerBoardClicked ? (
                <></>
              ) : (
                <>
                  <PlannerHeader
                    parrentCallBackForTab={parrentCallBackForTab}
                    parentCallBackForPlannerHeader={
                      parentCallBackForPlannerHeader
                    }
                  />
                  {selectedTab === "carrier" ? (
                    <>
                      <div className="row mt_30">
                        <div className="col-xl-12">
                          <div className="card card_shadow">
                            <div className="card-body ">
                              <div className="planner_top_date">
                                <div className="planner_date_text">
                                  {DateTime.fromMillis(payloadForPlanningBoard.date).toFormat('MM/dd/yyyy')}
                                </div>
                                {/* <div className="ml_12">
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
                                </div> */}
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
                                {PlannerBoardLoadingPage ? (
                                  <ProgressBar animated now={100} />
                                ) :
                                  <>
                                    {Object.keys(PlanningBoardCarriersResponse).length > 0 ? (
                                      <>
                                        {Object.keys(PlanningBoardCarriersResponse).map((item) => (
                                          <>
                                            {PlanningBoardCarriersResponse[item]?.planner?.length > 0 ? (

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
                                                      PlanningBoardCarriersResponse[item].driverId /*driverId Here DriverID from Item*/
                                                    }
                                                  </div>
                                                </div>
                                                <PlanningBoardRowBodyFormatted view="driver"
                                                  rowitem={item}
                                                  key={PlanningBoardCarriersResponse[item].driverId}
                                                  blockHours={PlanningBoardCarriersResponse[item]} />
                                              </div>

                                            ) : ""}
                                          </>
                                        )

                                        )}
                                        {/* <Stack spacing={2}>
                                          <Pagination onChange={handePagination} count={Math.ceil(PlanningBoardCarriersResponse?.length)} color="primary" />
                                        </Stack> */}
                                      </>
                                    ) :
                                      <div>No planning to display</div>
                                    }
                                  </>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : selectedTab === "trailer" ? (
                    <>
                      <div className="row mt_30">
                        <div className="col-xl-12">
                          <div className="card card_shadow">
                            <div className="card-body ">
                              <div className="planner_top_date">
                                <div className="planner_date_text">
                                  {DateTime.fromMillis(payloadForPlanningBoard.date).toFormat('MM/dd/yyyy')}
                                </div>
                                {/* <div className="ml_12">
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
                                </div> */}
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
                                {PlannerBoardLoadingPage ? (
                                  <ProgressBar animated now={100} />
                                ) : (
                                  <>
                                    {Object.keys(planningBoardTrailers).length > 0 ? (
                                      <>
                                        {Object.keys(planningBoardTrailers).map((item) => (
                                          <div className="planner_Board_wrapper" key={item}>
                                            <div className="planner_board_left_image">
                                              <Tooltip title={
                                                <>
                                                  <Typography color="inherit">
                                                    <span className="tooltip-adjust">
                                                      <div className="main_tooltip_section">
                                                        <div className="tooltip_left">
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Trailer : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].trailerId ?? "No Data"}</div>
                                                          </div>
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Type : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].type ?? "No Data"}</div>
                                                          </div>
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Commodity Group : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].commodityid} {planningBoardTrailers[item].commodity_code}</div>
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
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].license_plate ?? "No Data"}</div>
                                                          </div>
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">State : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].state ?? "No Data"}</div>
                                                          </div>
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Year : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].year ?? "No Data"}</div>
                                                          </div>
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Make : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].make ?? "No Data"}</div>
                                                          </div>
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Model : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].model ?? "No Data"}</div>
                                                          </div>
                                                         
                                                          
                                                        </div>

                                                        <div className="tooltip_right">
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Status: </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].status ?? "No Data"}</div>
                                                          </div>
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Terminal : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].terminal} - {planningBoardTrailers[item].terminal_city}</div>
                                                          </div>

                                                          <br />
                                                          <div className="tooltip_single_sec trailer_gap">
                                                            <div className="tooltip_text_left">Shipper Pool : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].shipper_pool ?? "No Data"}</div>
                                                          </div>
                                                          <div className="tooltip_single_sec">
                                                            <div className="tooltip_text_left">Dedicated : </div>
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].dedicated ?? "No Data"}</div>
                                                          </div>


                                                          <div className="tooltip_single_sec trailer_gap">
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
                                                              {planningBoardTrailers[item]?.pm_due_date_utc != null ? convertDateTime(planningBoardTrailers[item]?.pm_due_date_utc) : "No Data"}
                                                              {/* {convertDateTime(planningBoardTrailers[item]?.pm_due_date_utc, planningBoardTrailers[item]?.pickup_timezone)} */}

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
                                                            <div className="tooltip_text_right">{planningBoardTrailers[item].tare_weight ?? "No Data"}</div>
                                                          </div>
                                                          
                                                          

                                                        </div>
                                                      </div>

                                                    </span>
                                                  </Typography>
                                                </>
                                              }
                                                placement="top" classes={{
                                                  tooltip: classes.customTooltip,
                                                  arrow: classes.customArrow,
                                                  tooltipfont: classes.tooltipfont
                                                }}
                                                arrow
                                              >
                                                <div>
                                                  <img
                                                    src={Trailer}
                                                    alt="Baseline-Shiping"
                                                    title="Baseline-Shiping"
                                                    className="planner_left_image"
                                                  />
                                                </div>
                                              </Tooltip>
                                              <div className="planner_board_left_image_text">
                                                {
                                                  planningBoardTrailers[item]
                                                    .trailerId /*trailerId Here DriverID from Item*/
                                                }
                                              </div>
                                            </div>
                                            <PlanningBoardRowBodyFormatted
                                              view="trailer"
                                              key={planningBoardTrailers[item].trailerId}
                                              rowitem={item}
                                              blockHours={planningBoardTrailers[item]}
                                            />
                                          </div>
                                        ))}
                                      </>
                                    ) : (
                                      <div>No planning to display</div>
                                    )}
                                  </>
                                )}

                              </div>
                              {!PlannerBoardLoadingPage ? (
                                <>
                                  {Object.keys(planningBoardTrailers)
                                    .length > 0 ? (
                                    <Stack spacing={2}>
                                      <Pagination
                                        onChange={handeTrailerViewPagination}
                                        count={Math.ceil(PlanningBoardTrailersResponse?.length / 25)}
                                        //page={driverPageNumber}
                                        color="primary" />
                                    </Stack>
                                  ) : ""}
                                </>
                              ) : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : selectedTab === "order" ? (
                    <OrdersTab startdate={payloadForPlanningBoard.date} />
                  ) : (
                    <>
                      <div className="row mt_30">
                        <div className="col-xl-12">
                          <div className="card card_shadow">
                            <div className="card-body ">
                              <div className="planner_top_date">
                                <div className="planner_date_text">
                                  {DateTime.fromMillis(payloadForPlanningBoard.date).toFormat("MM/dd/yyyy")}                                </div>
                                {/* <div className="ml_12">
                                  <div>
                                    <i
                                      className="fa fa-caret-up fa-2x"
                                      aria-hidden="true"
                                      onClick={nextDateChange}
                                    ></i>
                                  </div>
                                  <div>
                                    <i
                                      className="fa fa-caret-down fa-2x"
                                      aria-hidden="true"
                                      onClick={previousDayChange}
                                    ></i>
                                  </div>
                                </div> */}
                              </div>
                              <div className="planner_top_date">
                                <div className="planner_dates_text1">

                                  {getTimeZone(payloadForPlanningBoard.date)}
                                </div>

                              </div>
                              <div className="day_time_container">
                                <div className="am_section">HRS</div>
                                <div className="day_time_section">
                                  {hourArr.map((item) => (
                                    <div className="day_time_inner" key={item}>
                                      {item=="0"?`12  A.M`:item=="12"?`12  P.M`:item>11?`${item-12}  P.M`:`${item}  A.M` }
                                      <div class="vl_planner"></div>
                                      
                                    </div>

                                  ))}
                                </div>
                                <div className="pm_section">HRS</div>
                              </div>
                              <div className="planner_scroll_section" key={planningBoardDrivers}>
                                {PlannerBoardLoadingPage ? (
                                  <ProgressBar animated now={100} />
                                ) : (
                                  <>
                                    {Object.keys(planningBoardDrivers)
                                      .length > 0 ? (
                                      <>

                                        {Object.keys(
                                          planningBoardDrivers
                                        ).map((item) => (
                                          // 
                                          <div
                                            className="planner_Board_wrapper"
                                            key={item.driverId}
                                          >
                                            <div className="planner_driver_icon_section">
                                            <div className="planner_board_left_image">
                                              <Tooltip title={

                                                <>
                                                  <Typography color="inherit">
                                                  <span className="tooltip-adjust">
                                                    <div className="main_tooltip_section">
                                                      <div className="tooltip_left_driver">
                                                        <div className="tooltip_single_sec">
                                                          <div className="tooltip_text_left">Driver : </div>
                                                          <div className="tooltip_text_right">{planningBoardDrivers[item].driverId} - {planningBoardDrivers[item].driver_full_name ? planningBoardDrivers[item].driver_full_name : "No Data"}</div>
                                                        </div>

                                                        <div className="tooltip_single_sec">
                                                          <div className="tooltip_text_left">Terminal : </div>
                                                          <div className="tooltip_text_right">{planningBoardDrivers[item].terminal_id} - {planningBoardDrivers[item].terminal_city ? planningBoardDrivers[item].terminal_city : "No Data"}</div>
                                                        </div>

                                                        <div className="tooltip_single_sec pt_20">
                                                          <div className="driver_special_text">Samsara Data</div>
                                                          {/* <div className="tooltip_text_right">{planningBoardDrivers[item].samsara_id ? planningBoardDrivers[item].samsara_id : "No Data"}</div> */}
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
                                                          <div className="tooltip_text_right">{planningBoardDrivers[item].driver_type_class ? planningBoardDrivers[item].driver_type_class : "No Data"}</div>
                                                        </div>
                                                        <div className="tooltip_single_sec">
                                                        <div className="tooltip_text_left">Hired: </div>
                                                        <div className="tooltip_text_right">{planningBoardDrivers[item].hire_date ? planningBoardDrivers[item].hire_date : "No Data"}</div>
                                                      </div>
                                                     
                                                      
                                                      </div>
                                                      </div>

                                                    </span>
                                                    
                                                  </Typography>

                                                </>

                                              }
                                                placement="top" classes={{
                                                  tooltip: classes.customTooltip,
                                                  arrow: classes.customArrow,

                                                }}
                                                arrow>
                                                <div>
                                                  <img
                                                    src={BaselineShiping}
                                                    alt="Baseline-Shiping"

                                                    className="planner_left_image"
                                                  />
                                                </div>

                                              </Tooltip>

                                              <div className="planner_board_left_image_text">
                                                {
                                                  planningBoardDrivers[
                                                    item
                                                  ]
                                                    .driverId /*driverId Here DriverID from Item*/
                                                }
                                              </div>
                                            </div>
                                            <div className="driver_right_text">
                                              <p>Order</p>
                                              <p>Trailler</p>
                                              <p>Segment</p>
                                            </div>
                                            </div>
                                            <PlanningBoardRowBodyFormatted
                                              view="driver"
                                              key={planningBoardDrivers[item].driverId}
                                              rowitem={item}
                                              blockHours={
                                                planningBoardDrivers[item]
                                              }
                                            />
                                          </div>
                                        ))}

                                      </>

                                    ) : (
                                      <div>No planning to display</div>
                                    )}
                                  </>
                                )}
                              </div>
                              {!PlannerBoardLoadingPage ? (
                                <>
                                  {Object.keys(planningBoardDrivers)
                                    .length > 0 ? (
                                    <Stack spacing={2}>
                                      <Pagination
                                        onChange={handeDriverViewPagination}
                                        count={Math.ceil(PlanningBoardDriversResponse?.length / 25)}

                                        color="primary" />
                                    </Stack>
                                  ) : ""}
                                </>
                              ) : ""}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bottom_tab_wrapper">
                        <div className="tab_button_section ">
                          <button
                            className={`tab_button ${tabSelected === "orders" ? "active_tab" : ""
                              }`}
                            onClick={(e) => settabSelected("orders")}
                          >
                            ORDERS
                          </button>
                          <button
                            className={`tab_button ${tabSelected === "trailers" ? "active_tab" : ""
                              }`}
                            onClick={(e) => settabSelected("trailers")}
                          >
                            TRAILERS
                          </button>
                        </div>
                        {tabSelected === "" ? null : tabSelected ===
                          "orders" ? (
                          <PlannerBoardOrdersTable
                            settabSelected={settabSelected}
                            allOrdersArray={allOrdersArray}
                            startdate={payloadForPlanningBoard.date}
                          />
                        ) : (
                          <PlannerBoardTrailersTable
                            settabSelected={settabSelected}
                            allTrailersArray={allTrailersArray}
                          />
                        )}
                      </div>
                    </>

                    // <PlannerBoardDriverViewBodyFormatted
                    //   startdate={payloadForPlanningBoard.date}
                    //   allOrders={allOrders}
                    //   allTrailers={allTrailers}
                    //   PlanningBoardResponse={PlanningBoardDriversResponse}
                    //   PlannerBoardLoadingPage={PlannerBoardLoadingPage}
                    //   parentCallBackForDriverViewBodyFormatted={
                    //     parentCallBackForDriverViewBodyFormatted
                    //   }
                    // />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
