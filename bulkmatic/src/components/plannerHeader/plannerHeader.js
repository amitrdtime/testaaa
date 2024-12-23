import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ApiFilterService from "../../services/appFilterService";
import { Calendar } from "@progress/kendo-react-dateinputs";

import { ContextData } from "../../components/appsession";

import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const PlannerHeader = (props) => {
  // const [userData, setuserData] = useContext(ContextData);
  const [commodityTypeDrpdownClicked, setcommodityTypeDrpdownClicked] =
    useState(false);
  const [terminalDrpdownClicked, setterminalDrpdownClicked] = useState(false);
  // const [plannerlDrpdownClicked, setplannerlDrpdownClicked] = useState(false);
  const [calenderDrpdownClicked, setcalenderDrpdownClicked] = useState(false);
  const [allCommodityGroup, setallCommodityGroup] = useState([]);
  const [allTerminal, setallTerminal] = useState([]);
  const [selectedCommodityTypeOptions, setSelectedCommodityTypeOptions] =
    useState([]);
  const [allCommodityTypeOptions, setCommodityTypeOptions] = useState([]);
  const [selectedTerminalOptions, setSelectedTerminalOptions] = useState([]);
  const [allTerminalOptions, setTerminalOptions] = useState([]);
  const [searchData, setSearchData] = useState('')

  useEffect(() => {
    let allCommoditytype = [];
    let allterminal = [];
    // let allplanners = [];
    for (let i = 0; i < allCommodityGroup.length; i++) {
      let obj = {
        label: allCommodityGroup[i].code,
        value: allCommodityGroup[i].code,
      };
      allCommoditytype.push(obj);
    }
    setCommodityTypeOptions(allCommoditytype);

    for (let i = 0; i < allTerminal.length; i++) {
      let obj = {
        label: allTerminal[i].name,
        value: allTerminal[i].code,
      };
      allterminal.push(obj);
    }
    setTerminalOptions(allterminal);
    setSelectedTerminalOptions(allterminal);
  }, [allCommodityGroup.length, allTerminal.length, ]);

  function getCommodityTypeDropdownButtonLabel({
    placeholderButtonLabel,
    value,
  }) {
    return `${placeholderButtonLabel}: ${value.length ? value.length : ""}`;
  }

  function getTerminalDropdownButtonLabel({ placeholderButtonLabel, value }) {
    return `${placeholderButtonLabel}: ${value.length ? value.length : ""}`;
  }

  function onChangeforCommodityType(value, event) {
    setSelectedCommodityTypeOptions(value);
  }

  function onChangeforTerminal(value) {
    setSelectedTerminalOptions(value);
  }

  const [tabSelected, setTabSelected] = useState({
    planner: true,
    driver: true,
    trailer: false,
    carrier: false,
  });
  const [selectedDate, setselectedDate] = useState(() => {
    return new Date();
  });
  const tabClickHandler = (tabname) => {
    if (tabname === "driver") {
      setTabSelected({
        
        driver: true,
        trailer: false,
        carrier: false,
      });
    }
    if (tabname === "trailer") {
      setTabSelected({
        driver: false,
        trailer: true,
        carrier: false,
      });
    }
    if (tabname === "carrier") {
      setTabSelected({
        driver: false,
        trailer: false,
        carrier: true,
      });
    }
    props.parrentCallBackForTab(tabname);
  };

  const searchHandler = () => {
    props.parentCallBackForPlannerHeader(filterData);
  };

  const SearchHandlerInput = (event) => {
    setSearchData(event.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  useEffect(async () => {
    // const commodityService = new CommodityService();
    const apiFilterService = new ApiFilterService();
    const userFilterData = apiFilterService.getUserFilter();
    setallTerminal(userFilterData.terminals);
    setallCommodityGroup(userFilterData.commodities);
  }, []);

  let filterData = {}
  if(tabSelected.carrier === true){
    filterData = {
      date: selectedDate,
      view: "carrier"
    }
  } else {
    filterData = {
      cgs: selectedCommodityTypeOptions.map((o) => o.value),
      terminal: selectedTerminalOptions.map((o) => o.value),
      date: selectedDate,
      search: searchData,
    }
  }
  // const filterData = {
  //   cgs: selectedCommodityTypeOptions.map((o) => o.value),
  //   terminal: selectedTerminalOptions.map((o) => o.value),
  //   date: selectedDate,
  //   search: searchData,
  //   view: tabSelected
  // };
  useEffect(() => {
    props.parentCallBackForPlannerHeader(filterData);
  }, [
    selectedCommodityTypeOptions,
    selectedTerminalOptions,
    selectedDate,
  ]);

  const calenderDropdownSelectHandler = (event) => {
    setselectedDate(event.value);
    setcalenderDrpdownClicked(false);
  };
  return (
    <div className="row df mt_30">
      <div className="tabs">
        <input
          type="radio"
          name="tabs"
          id="tabone"
          checked={tabSelected.planner}
          onChange={() => tabClickHandler("planner")}
        />
        <label htmlFor="tabone">Planning Board</label>
        <div className="tab">
          <div className="card-body">
            <div className="row top_adjust">
              <div className="df">
                <div
                  className={
                    tabSelected.driver
                      ? "panner_top_tab panner_top_tab_active "
                      : "panner_top_tab"
                  }
                  onClick={() => tabClickHandler("driver")}
                >
                  Driver View
                </div>
                <div
                  className={
                    tabSelected.trailer
                      ? "panner_top_tab ml_25 panner_top_tab_active"
                      : "panner_top_tab ml_25"
                  }
                  onClick={() => tabClickHandler("trailer")}
                >
                  Trailer View
                </div>
                <div
                  className={
                    tabSelected.carrier
                      ? "panner_top_tab ml_25 panner_top_tab_active"
                      : "panner_top_tab ml_25"
                  }
                  onClick={() => tabClickHandler("carrier")}
                >
                  Carrier View
                </div>
              </div>
            </div>
            <div className="row top_adjust df">
              <div className="input-group w-30 mt_26">
                <input
                  type="search"
                  className="form-control place_back"
                  placeholder="Search..."
                  id="top-search"
                  style={{ zIndex: "1" }}
                  onChange={(e) => SearchHandlerInput(e)}
                  onKeyPress={handleKeyPress}
                />

                <button
                  className="btn input-group-text search_btn"
                  type="submit"
                  onClick={(e) => searchHandler(e)}
                >
                  <i
                    className="fa fa-search f_color_white"
                    aria-hidden="true"
                  ></i>
                </button>
              </div>
              {tabSelected.carrier ? "" : <>
              <div className="multiselect ml_30 mt_26 pr">
                <>
                  <ReactMultiSelectCheckboxes
                    options={[...allCommodityTypeOptions]}
                    placeholderButtonLabel="Commodity Type"
                    getDropdownButtonLabel={getCommodityTypeDropdownButtonLabel}
                    value={selectedCommodityTypeOptions}
                    onChange={onChangeforCommodityType}
                    setState={setSelectedCommodityTypeOptions}
                    disabled={true}
                  />
                </>
                {commodityTypeDrpdownClicked ? "" : ""}
              </div>

              <div className="vl mt_32"></div>
              <div className="multiselect ml_30 mt_26 pr">
                <>
                  <ReactMultiSelectCheckboxes
                    options={[...allTerminalOptions]}
                    placeholderButtonLabel="Terminal"
                    getDropdownButtonLabel={getTerminalDropdownButtonLabel}
                    value={selectedTerminalOptions}
                    onChange={onChangeforTerminal}
                    setState={setSelectedTerminalOptions}
                    disabled={true}
                  />
                </>
                {terminalDrpdownClicked ? "" : ""}
              </div>
              </>
              }
              <div className="vl mt_32"></div>
              <div className="multiselect ml_30 mt_32 pr date_width_adjust">
                <div
                  className="selectBox"
                  onClick={() =>
                    setcalenderDrpdownClicked(!calenderDrpdownClicked)
                  }
                >
                  <select>
                    <option>Calendar</option>
                  </select>
                  <div className="overSelect"></div>
                </div>
                {calenderDrpdownClicked ? (
                  <div className="multiselect_select">
                    <Calendar
                      onChange={calenderDropdownSelectHandler}
                      value={selectedDate}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerHeader;
