import React, { useState, useEffect, useContext } from "react";

import "./plannerBoardOrdersTable.css";

import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";

import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  IntlProvider,
  load,
  LocalizationProvider,
  loadMessages,
  IntlService,
} from "@progress/kendo-react-intl";
import likelySubtags from "./dt/likelySubtags.json";
import currencyData from "./dt/currencyData.json";
import weekData from "./dt/weekData.json";
import numbers from "./dt/numbers.json";
import currencies from "./dt/currencies.json";
import caGregorian from "./dt/ca-gregorian.json";
import dateFields from "./dt/dateFields.json";
import timeZoneNames from "./dt/timeZoneNames.json";
import "@progress/kendo-theme-default/dist/all.css";

load(
  likelySubtags,
  currencyData,
  weekData,
  numbers,
  currencies,
  caGregorian,
  dateFields,
  timeZoneNames
);

import esMessages from "./dt/es.json";
loadMessages(esMessages, "es-ES");
import { process } from "@progress/kendo-data-query";
import { ContextData } from "../../components/appsession";
import UserService from "../../services/userService";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Box, Button, Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { DateTime } from "luxon";

const DATE_FORMAT = "yyyy-mm-dd hh:mm:ss.SSS";
const intl = new IntlService("en");

const DetailComponent = (props) => {
  const dataItem = props.dataItem;
  return null;
  {
  }
};

const PlannerBoardOrdersTable = (props) => {
  const { allOrdersArray, startdate } = props;
  const [isDataloaded, setIsDataLoaded] = useState(false);
  const [userData, setuserData] = useContext(ContextData);

  
  
  const locales = [
    {
      language: "en-US",
      locale: "en",
    },
    {
      language: "es-ES",
      locale: "es",
    },
  ];

  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: 20,
    sort: [
      {
        field: "orderDate",
        dir: "desc",
      },
    ]
  });
  const [currentLocale, setCurrentLocale] = React.useState(locales[0]);
  const [orders, setorders] = useState([]);
  const [dataResult, setDataResult] = React.useState(
    process(orders, dataState)
  );

  let columns = [
    { id: 0, name: "expanded", title: " " },
    { id: 1, name: "ActualWgt", title: "ActualWgt", width: "280px" },
    { id: 2, name: "BOL", title: "BOL", width: "280px" },
    { id: 3, name: "Commodity", title: "Commodity", width: "280px" },
    { id: 4, name: "Commodity_Group", title: "Commodity Group", width: "280px" },
    { id: 5, name: "Consignee_Ref", title: "Consignee_Ref", width: "280px" },
    { id: 6, name: "Customer", title: "Customer", width: "280px" },
    { id: 7, name: "Delivery_Actual_Arrive", title: "Delivery_Actual_Arrive", width: "280px" },
    { id: 8, name: "Delivery_Actual_Depart", title: "Delivery_Actual_Depart", width: "280px" },
    { id: 9, name: "Delivery_Address", title: "Delivery_Address", width: "280px" },
    { id: 10, name: "Delivery_City", title: "Delivery_City", width: "280px" },
    { id: 11, name: "Delivery_ETA", title: "Delivery_ETA", width: "280px" },
    { id: 12, name: "Delivery_Name", title: "Delivery_Name", width: "280px" },
    { id: 13, name: "Delivery_Planned_Arrive", title: "Delivery_Planned_Arrive", width: "280px" },
    { id: 14, name: "Delivery_Planned_Depart", title: "Delivery_Planned_Depart", width: "280px" },
    { id: 15, name: "Delivery_State", title: "Delivery_State", width: "280px" },
    { id: 16, name: "Delivery_Timezone", title: "Delivery_Timezone", width: "280px" },
    { id: 17, name: "Delivery_Type", title: "Delivery_Type", width: "280px" },
    { id: 18, name: "Delivery_Zip", title: "Delivery_Zip", width: "280px" },
    { id: 19, name: "Distance", title: "Distance", width: "280px" },
    { id: 20, name: "Driver_ID", title: "Driver_ID", width: "280px" },
    { id: 21, name: "Driver_Load", title: "Driver_Load", width: "280px" },
    { id: 22, name: "Driver_Unload", title: "Driver_Unload", width: "280px" },
    { id: 23, name: "Drop_Flag", title: "Drop_Flag", width: "280px" },
    { id: 24, name: "Early_Delivery_Appt", title: "Early_Delivery_Appt", width: "280px" },
    { id: 25, name: "Early_Pickup_Appt", title: "Early_Pickup_Appt", width: "280px" },
    { id: 26, name: "HazMat", title: "HazMat", width: "280px" },
    { id: 27, name: "HazMat_Code", title: "HazMat_Code", width: "280px" },
    { id: 28, name: "Late_Delivery_Appt", title: "Late_Delivery_Appt", width: "280px" },
    { id: 29, name: "Late_Pickup_Appt", title: "Late_Pickup_Appt", width: "280px" },
    { id: 30, name: "Move_ID", title: "Move_ID", width: "280px" },
    { id: 31, name: "Move_Status", title: "Move_Status", width: "280px" },
    { id: 32, name: "On_Hold", title: "On_Hold", width: "280px" },
    { id: 33, name: "On_Hold_Reason", title: "On_Hold_Reason", width: "280px" },
    { id: 34, name: "Order_ID", title: "Order_ID", width: "280px" },
    { id: 35, name: "Order_Status", title: "Order_Status", width: "280px" },
    { id: 36, name: "Ordered_Wgt", title: "Ordered_Wgt", width: "280px" },
    { id: 37, name: "PO_Lot", title: "PO_Lot", width: "280px" },
    { id: 38, name: "Pickup_Actual_Arrive", title: "Pickup_Actual_Arrive", width: "280px" },
    { id: 39, name: "Pickup_Actual_Depart", title: "Pickup_Actual_Depart", width: "280px" },
    { id: 40, name: "Pickup_Address", title: "Pickup_Address", width: "280px" },
    { id: 41, name: "Pickup_City", title: "Pickup_City", width: "280px" },
    { id: 42, name: "Pickup_ETA", title: "Pickup_ETA", width: "280px" },
    { id: 43, name: "Pickup_Name", title: "Pickup_Name", width: "280px" },
    { id: 44, name: "Pickup_Planned_Arrive", title: "Pickup_Planned_Arrive", width: "280px" },
    { id: 45, name: "Pickup_Planned_Depart", title: "Pickup_Planned_Depart", width: "280px" },
    { id: 46, name: "Pickup_State", title: "Pickup_State", width: "280px" },
    { id: 47, name: "Pickup_Timezone", title: "Pickup_Timezone", width: "280px" },
    { id: 48, name: "Pickup_Type", title: "Pickup_Type", width: "280px" },
    { id: 49, name: "Pickup_Zip", title: "Pickup_Zip", width: "280px" },
    { id: 50, name: "Product", title: "Product", width: "280px" },
    { id: 51, name: "Sent_To_Driver", title: "Sent_To_Driver", width: "280px" },
    { id: 52, name: "Tankwash_WO", title: "Tankwash_WO", width: "280px" },
    { id: 53, name: "Terminal_ID", title: "Terminal_ID", width: "280px" },
    { id: 54, name: "Tractor_ID", title: "Tractor_ID", width: "280px" },
    { id: 55, name: "Trailer_ID", title: "Trailer_ID", width: "280px" },
  ];

  

  if (userData.hasOwnProperty("orderColumns")) {
    columns = userData.orderColumns;
  }

  const columnReorderChange = function (event) {
    const userService = new UserService();
    userData.orderColumns = event.target._columns.map((it) => {
      return {
        id: it.index,
        name: it.field,
        title: it.title,
        width: it.width,
      };
    });
    userService.updateUser(userData);
  };

  const dataStateChange = (event) => {
    setDataResult(process(orders, event.dataState));
    setDataState(event.dataState);

    userData.orderDataState = event.dataState;
    const userService = new UserService();
    userService.updateUser(userData);
  };

  const expandChange = (event) => {
    const isExpanded =
      event.dataItem.expanded === undefined
        ? event.dataItem.aggregates
        : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setDataResult({
      ...dataResult,
    });
  };

  let _pdfExport;

  const exportExcel = () => {
    _export.save();
  };

  let _export;

  const exportPDF = () => {
    _pdfExport.save();
  };

  useEffect(() => {
    var arrayOfObj = [];
    
    if (allOrdersArray && Object.keys(allOrdersArray)) {
      arrayOfObj = Object.keys(allOrdersArray).map((i) => allOrdersArray[i]);
      let newDataValue = [];
      for (let index = 0; index < arrayOfObj.length; index++) {
        const temp = arrayOfObj[index];

        if(temp.Delivery_Actual_Arrive === null )
        {
          temp.Delivery_Actual_Arrive = ''
        }
        else
        {
        const millis_Delivery_Actual_Arrive = parseInt(temp.Delivery_Actual_Arrive*1000); 
        const Timezone_Delivery_Actual_Arrive = temp.Delivery_Timezone;

        temp.Delivery_Actual_Arrive = DateTime.fromMillis(millis_Delivery_Actual_Arrive)
        .setZone(Timezone_Delivery_Actual_Arrive)
        .toFormat("MM-dd-yyyy HH:MM ZZZZ");
        }

        if(temp.Delivery_Actual_Depart === null )
        {
          temp.Delivery_Actual_Depart = ''
        }
        else
        {
        const millis_Delivery_Actual_Depart = parseInt(temp.Delivery_Actual_Depart*1000); 
        const Timezone_Delivery_Actual_Depart = temp.Delivery_Timezone;

        temp.Delivery_Actual_Depart = DateTime.fromMillis(millis_Delivery_Actual_Depart)
        .setZone(Timezone_Delivery_Actual_Depart)
        .toFormat("MM-dd-yyyy HH:MM ZZZZ");

        }

        if(temp.Delivery_Planned_Arrive === null )
        {
          temp.Delivery_Planned_Arrive = ''
        }
        else
        {
        const millis_Delivery_Planned_Arrive = parseInt(temp.Delivery_Planned_Arrive*1000); 
        const Timezone_Delivery_Planned_Arrive = temp.Delivery_Timezone;

        temp.Delivery_Planned_Arrive = DateTime.fromMillis(millis_Delivery_Planned_Arrive)
        .setZone(Timezone_Delivery_Planned_Arrive)
        .toFormat("MM-dd-yyyy HH:MM ZZZZ");
        }

        if(temp.Delivery_Planned_Depart === null )
        {
          temp.Delivery_Planned_Depart = ''
        }
        else
        {
        const millis_Delivery_Planned_Depart = parseInt(temp.Delivery_Planned_Depart*1000); 
        const Timezone_Delivery_Planned_Depart = temp.Delivery_Timezone;

        temp.Delivery_Planned_Depart = DateTime.fromMillis(millis_Delivery_Planned_Depart)
        .setZone(Timezone_Delivery_Planned_Depart)
        .toFormat("MM-dd-yyyy HH:MM ZZZZ");

        }

        if(temp.Early_Delivery_Appt === null )
        {
          temp.Early_Delivery_Appt = ''
        }
        else
        {
        const millis_Early_Delivery_Appt = parseInt(temp.Early_Delivery_Appt*1000); 
        const Timezone_Early_Delivery_Appt = temp.Delivery_Timezone;

        temp.Early_Delivery_Appt = DateTime.fromMillis(millis_Early_Delivery_Appt)
        .setZone(Timezone_Early_Delivery_Appt)
        .toFormat("MM-dd-yyyy HH:MM ZZZZ");
        }

        if(temp.Early_Pickup_Appt === null )
        {
          temp.Early_Pickup_Appt = ''
        }
        else
        {
          const millis_Early_Pickup_Appt = parseInt(temp.Early_Pickup_Appt*1000); 
          const Timezone_Early_Pickup_Appt = temp.Delivery_Timezone;

          temp.Early_Pickup_Appt = DateTime.fromMillis(millis_Early_Pickup_Appt)
          .setZone(Timezone_Early_Pickup_Appt)
          .toFormat("MM-dd-yyyy HH:MM ZZZZ");
        }

        if(temp.Late_Delivery_Appt === null )
        {
          temp.Late_Delivery_Appt = ''
        }
        else
        {

          const millis_Late_Delivery_Appt = parseInt(temp.Late_Delivery_Appt*1000); 
          const Timezone_Late_Delivery_Appt = temp.Delivery_Timezone;

          temp.Late_Delivery_Appt = DateTime.fromMillis(millis_Late_Delivery_Appt)
          .setZone(Timezone_Late_Delivery_Appt)
          .toFormat("MM-dd-yyyy HH:MM ZZZZ");

        }

        if(temp.Late_Pickup_Appt === null )
        {
          temp.Late_Pickup_Appt = ''
        }
        else
        {

          const millis_movementpickupactual_departure = parseInt(temp.movementpickupactual_departure*1000); 
          const Timezone_movementpickupactual_departure = temp.movementpickuptimezone;

          temp.movementpickupactual_departure = DateTime.fromMillis(millis_movementpickupactual_departure)
          .setZone(Timezone_movementpickupactual_departure)
          .toFormat("MM-dd-yyyy HH:MM ZZZZ");

        }

        if(temp.movementpickupsched_arrive_early === null )
        {
          temp.movementpickupsched_arrive_early = ''
        }
        else
        {
          const millis_movementpickupsched_arrive_early = parseInt(temp.movementpickupsched_arrive_early*1000); 
          const Timezone_movementpickupsched_arrive_early = temp.movementpickuptimezone;

          temp.movementpickupsched_arrive_early = DateTime.fromMillis(millis_movementpickupsched_arrive_early)
          .setZone(Timezone_movementpickupsched_arrive_early)
          .toFormat("MM-dd-yyyy HH:MM ZZZZ");
        }

        
        if(temp.Pickup_Planned_Arrive === null )
        {
          temp.Pickup_Planned_Arrive = ''
        }
        else
        {
          const millis_Pickup_Planned_Arrive = parseInt(temp.Pickup_Planned_Arrive*1000); 
          const Timezone_Pickup_Planned_Arrive = temp.Pickup_Timezone;
  
          temp.Pickup_Planned_Arrive = DateTime.fromMillis(millis_Pickup_Planned_Arrive)
          .setZone(Timezone_Pickup_Planned_Arrive)
          .toFormat("MM-dd-yyyy HH:MM ZZZZ");
        }


        
        if(temp.movementpickupsched_arrive_late === null )
        {
          temp.Pickup_Planned_Depart = ''
        }
        else
        {
          const millis_Pickup_Planned_Depart = parseInt(temp.Pickup_Planned_Depart*1000); 
          const Timezone_Pickup_Planned_Depart = temp.Pickup_Timezone;
  
          temp.Pickup_Planned_Depart = DateTime.fromMillis(millis_Pickup_Planned_Depart)
          .setZone(Timezone_Pickup_Planned_Depart)
          .toFormat("MM-dd-yyyy HH:MM ZZZZ");
        }
       

        newDataValue.push(temp);
      }

      setorders(newDataValue);
      setIsDataLoaded(true);
    }

    if (!userData.hasOwnProperty("orderDataState")) {
      setDataResult(process(arrayOfObj, dataState));
    } else {
      setDataResult(process(arrayOfObj, userData.orderDataState));
    }
  }, [allOrdersArray]);

  return (
    <div className="tab_inside_section">
      <div className="tab_inside_section_top">
        <div className="tab_inside_section_top_left"></div>

        <div className="tab_inside_section_top_right">
          {isDataloaded === "true" ? (
            ""
          ) : (
            <Link
              component={RouterLink}
              onClick={() => {
                setIsDataLoaded("false");
                window.open(
                  `/orders?date=${new Date(startdate).toISOString()}`,
                  "_blank"
                );
              }}
            >
              <button variant="contained" type="button" className="btn_signout">
                <i class="fa fa-external-link"></i>
              </button>
            </Link>
          )}
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={(e) => props.settabSelected("")}
          ></i>
        </div>
      </div>
      <div className="tab_inside_section_bottom">
        {isDataloaded ? (
          <LocalizationProvider language={currentLocale.language}>
            <IntlProvider locale={currentLocale.locale}>
              <ExcelExport
                data={orders}
                ref={(exporter) => {
                  _export = exporter;
                }}
              >
                <Grid
                  sortable={true}
                  filterable={true}
                  groupable={true}
                  reorderable={true}
                  pageable={{
                    buttonCount: 4,
                    pageSizes: true,
                  }}
                  resizable={true}
                  data={dataResult}
                  {...dataState}
                  onDataStateChange={dataStateChange}
                  detail={DetailComponent}
                  expandField="expanded"
                  onExpandChange={expandChange}
                  onColumnReorder={columnReorderChange}
                >
                  <GridToolbar>
                  </GridToolbar>
                  {columns.slice(1).map((it) => (
                    <GridColumn
                      key={it.id}
                      field={it.name}
                      title={it.title}
                      width={it.width}
                    />
                  ))}
                </Grid>
              </ExcelExport>
            </IntlProvider>
          </LocalizationProvider>
        ) : (
          <ProgressBar animated now={100} />
        )}
      </div>
    </div>
  );
};

export default PlannerBoardOrdersTable;
