import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CommoditygroupService from "../../services/commoditygroupService";
import TerminalServie from "../../services/terminalService";
import UserService from "../../services/userService";
import PlanningBoardService from "../../services/planingBoardService";
import CommodityService from "../../services/commodityService";
import ApiFilterService from "../../services/appFilterService";
import { Calendar } from "@progress/kendo-react-dateinputs";

import { ContextData } from "../../components/appsession";

import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const PlannerBoardPagination = (props) => {


  const searchHandler = () => {
    props.paginationParentCallback(filterData, allCommodityGroup);
    setPlannerBoardLoadingPage(true);
    PlanningBoardRowBodyFormatted = null;
    let pageNumber = event.target.textContent;
    setPageNumber(pageNumber)
    const slicedplanningBoardDriverResponse = PlanningBoardDriversResponse?.slice(((pageNumber - 1) * 25), (pageNumber * 25));
    console.log(slicedplanningBoardDriverResponse);

    setPlanningBoardDrivers(slicedplanningBoardDriverResponse);
    setPlannerBoardLoadingPage(false);
  };
  const handlePagination = () => {
    props.paginationParentCallback(filterData, allCommodityGroup);
    setPlannerBoardLoadingPage(true);
    PlanningBoardRowBodyFormatted = null;
    let pageNumber = event.target.textContent;
    setPageNumber(pageNumber)
    const slicedplanningBoardDriverResponse = PlanningBoardDriversResponse?.slice(((pageNumber - 1) * 25), (pageNumber * 25));
    console.log(slicedplanningBoardDriverResponse);

    setPlanningBoardDrivers(slicedplanningBoardDriverResponse);
    setPlannerBoardLoadingPage(false);
  };

  return (
    <Stack spacing={2}>
    <Pagination onChange={handlePagination} count={PlanningBoardDriversResponse?.length} color="primary" />
    </Stack>
  )
  }
export default PlannerBoardPagination;
