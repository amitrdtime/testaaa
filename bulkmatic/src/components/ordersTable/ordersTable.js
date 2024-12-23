import React, { useState, useEffect, useContext } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  IntlProvider,
  LocalizationProvider,
} from "@progress/kendo-react-intl";
import { process } from "@progress/kendo-data-query";
import { ContextData } from "../../components/appsession";
import UserService from "../../services/userService";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./ordersTable.css";

const DetailComponent = (props) => {
  const dataItem = props.dataItem;
  return null;
  {
  }
};

const OrdersTable = (props) => {
  const { allOrdersArray } = props;
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
    ],
    // group: [{
    //   field: 'customerID'
    // }]
  });
  const [currentLocale, setCurrentLocale] = React.useState(locales[0]);
  const [orders, setorders] = useState([]);
  const [dataResult, setDataResult] = React.useState(
    process(orders, dataState)
  );

  let columns = [
    { id: 0, name: "expanded", title: " " },
    { id: 1, name: "blnum", title: "Blnum", width: "200px" },
    { id: 2, name: "commodity", title: "Commodity", width: "280px" },
    { id: 3, name: "commodity_id", title: "Commodity ID", width: "280px" },
    {
      id: 4,
      name: "consignee_refno",
      title: "Consignee_Refno",
      width: "280px",
    },
    { id: 5, name: "customer_id", title: "Customer Id", width: "280px" },
    { id: 6, name: "id", title: "Order Id", width: "280px" },
    { id: 7, name: "order_type_id", title: "Order Type Id", width: "280px" },
    { id: 8, name: "preloaded", title: "Preloaded", width: "280px" },
    {
      id: 9,
      name: "preload_trailer_id",
      title: "Preload_Trailer_Id",
      width: "280px",
    },
    { id: 10, name: "status", title: "Status", width: "280px" },
    { id: 11, name: "ordered_wt", title: "Ordered Wt", width: "280px" },
    { id: 12, name: "lot_num", title: "Lot Num", width: "280px" },
    {
      id: 13,
      name: "trailer_wash_wo",
      title: "LTrailer Wash Wo",
      width: "280px",
    },
    { id: 14, name: "", title: "Weight", width: "280px" },
    { id: 15, name: "", title: "Weight Um", width: "280px" },
    {
      id: 16,
      name: "driver_load_unload",
      title: "Driver Load Unload",
      width: "280px",
    },
    { id: 17, name: "latitude", title: "Latitude", width: "280px" },
    { id: 18, name: "longitude", title: "Longitude", width: "280px" },
    { id: 19, name: "order_id", title: "Order Id", width: "280px" },
    {
      id: 20,
      name: "sched_arrive_early",
      filter: "date",
      format: "{0:D}",
      title: "Sched Arrive Early",
      width: "280px",
    },
    {
      id: 21,
      name: "sched_arrive_late",
      filter: "date",
      format: "{0:D}",
      title: "Sched Arrive Late",
      width: "280px",
    },
    { id: 22, name: "actual_arrival", title: "Actual Arrival", width: "280px" },
    {
      id: 23,
      name: "actual_departure",
      title: "Actual Departure",
      width: "280px",
    },
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
      setorders(arrayOfObj);
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
      <div className="tab_content">
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

export default OrdersTable;
