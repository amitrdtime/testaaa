import React, { useState, useEffect, useContext } from 'react';
import * as ReactDOM from 'react-dom';


import "./plannerBoardTrailersTable.css";

import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { IntlProvider, load, LocalizationProvider, loadMessages, IntlService } from '@progress/kendo-react-intl';
//import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
//import currencyData from 'cldr-core/supplemental/currencyData.json';
//import weekData from 'cldr-core/supplemental/weekData.json';
//import numbers from 'cldr-numbers-full/main/es/numbers.json';
//import currencies from 'cldr-numbers-full/main/es/currencies.json';
//import caGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
//import dateFields from 'cldr-dates-full/main/es/dateFields.json';
//import timeZoneNames from 'cldr-dates-full/main/es/timeZoneNames.json';
//load(likelySubtags, currencyData, weekData, numbers, currencies, caGregorian, dateFields, timeZoneNames);
import likelySubtags from './dt/likelySubtags.json';
import currencyData from './dt/currencyData.json';
import weekData from './dt/weekData.json';
import numbers from './dt/numbers.json';
import currencies from './dt/currencies.json';
import caGregorian from './dt/ca-gregorian.json';
import dateFields from './dt/dateFields.json';
import timeZoneNames from './dt/timeZoneNames.json';
import '@progress/kendo-theme-default/dist/all.css';
// import "~@progress/kendo-theme-default/dist/all.scss";
load(likelySubtags, currencyData, weekData, numbers, currencies, caGregorian, dateFields, timeZoneNames);
//import esMessages from './es.json';
//loadMessages(esMessages, 'es-ES');
import esMessages from './dt/es.json';
loadMessages(esMessages, 'es-ES');
import { process } from '@progress/kendo-data-query';
import UserService from '../../services/userService';
import { ContextData } from '../../components/appsession';
import ProgressBar from "react-bootstrap/ProgressBar";
import { Box, Button, Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
//import orders from './orders.json';
//import orders from './dt/trailers.json';
const DATE_FORMAT = 'yyyy-mm-dd hh:mm:ss.SSS';
const intl = new IntlService('en');
// orders.forEach(o => {
//   o.orderDate = intl.parseDate(o.orderDate ? o.orderDate : '20/20/2020', DATE_FORMAT);
//   o.shippedDate = o.shippedDate ? undefined : intl.parseDate(o.shippedDate ? o.orderDate.toString() : '20/20/2020', DATE_FORMAT);
// });

const DetailComponent = props => {
  const dataItem = props.dataItem;
  return null; {/*<div>
     <section style={{
      width: "200px",
      float: "left"
    }}>
      <p><strong>Street:</strong> {dataItem.shipAddress.street}</p>
      <p><strong>City:</strong> {dataItem.shipAddress.city}</p>
      <p><strong>Country:</strong> {dataItem.shipAddress.country}</p>
      <p><strong>Postal Code:</strong> {dataItem.shipAddress.postalCode}</p>
    </section>
    <Grid
      className="child_planner_bottom_table"

      data={dataItem.details} /> 
  </div>;*/}
};

const PlannerBoardOrdersTable = (props) => {
  const { settabSelected,allTrailersArray } = props;
  console.log("allTrailersArray",allTrailersArray)
  let columns = [
    {id: 0, name: 'expanded', title: ' '},
    // {id: 1, name: "eqfleetcode" , title: "Fleet Code" },
    // {id: 2, name: "equnitcode" , title:"Unit Code"  },
    // {id: 3, name: "eqtype" , title:"Trailer Type"  },
    // {id: 4, name: "eqmake" , title:"Make"  },
    // {id: 5, name: "eqtypegroup" , title:"Type Group" },
    // {id: 6, name: "eqmodel" , title:"Model" },
    // {id: 7, name: "eqyear" , title:"Year" },
    // {id: 8, name: "eqstat" , title:"Stat" },
    // {id: 9, name: "eqvin" , title:"eqvin" },
    // {id: 10, name: "eqdescription" , title:"Description" },
    // {id: 11, name: "eqlicenseplate" , title:"License Plate" },
    // {id: 12, name: "eqlicensestate" , title:"License State" },
    // {id: 13, name: "eqlicensecountry" , title:"License Country" },
    // {id: 14, name: "eqlicenserenewaldate" , title:"License Renewal Date" },
    // {id: 15, name: "eqwheelbase" , title:"Wheel Base" },
    // {id: 16, name: "eqgrossweight" , title:"Gross Weight" },
    // {id: 17, name: "eqtareweight" , title:"Tare Weight" },
    // {id: 18, name: "eqcustomercode" , title:"Customer Code" },
    // {id: 19, name: "eqassetid" , title:"Assetid" },
    // {id: 20, name: "maintdate" , title:"Maint Date" },
    // {id: 21, name: "messages" , title:"Messages*" },
    // {id: 22, name: "lastserviceDate" , title:"Last Service Date" },
    // {id: 23, name: "pmdays" , title:"PM Days" },
    // {id: 24, name: "drybulk" , title:"Dry Bulk" },
    // {id: 25, name: "dryselfLoader" , title:"Dry Self Loader" },
    // {id: 26, name: "drystraight" , title:"Dry Straight" },
    // {id: 27, name: "drydustcollector" , title:"Dry Dust Collector" },
    // {id: 28, name: "drycooler" , title:"Dry Cooler" },
    // {id: 29, name: "dryfilltubes" , title:"Dry Fill Tubes" },
    // {id: 30, name: "dryfilltubeslocation" , title:"Dry Fill Tubes Location" },
    // {id: 31, name: "drycatwalk_topsafetyconfig" , title:"Dry Catwalk *" },
    // {id: 32, name: "dryisleadtrailer" , title:"Dry Is Lead Trailer" },
    // {id: 33, name: "drynumberofhosetubes" , title:"Dry Number Of Hose Tubes" },
    // {id: 34, name: "liquid" , title:"Liquid" },
    // {id: 35, name: "liquidunloadconfig" , title:"Liquid Unload Config" },
    // {id: 36, name: "liquidisinsualted" , title:"Liquid Is Insualted" },
    // {id: 37, name: "liquidhasintransitheat" , title:"Liquid Has Intransit Heat" },
    // {id: 38, name: "liquidpump" , title:"Liquid Pump" },
    // {id: 39, name: "liquidislargecube" , title:"Liquid Is LargeCube" },
    // {id: 40, name: "liquidnumberofcxle" , title:"Liquid Number Of Axle" },
    // {id: 41, name: "liquidchassis" , title:"Liquid Chassis" },
    // {id: 42, name: "van" , title:"Van" },
    // {id: 43, name: "vandimensions" , title:"Van Dimensions" },
    // {id: 44, name: "vandoorconfiguration" , title:"Van Door Configuration" },
    // {id: 45, name: "vanisfoodgrad" , title:"Van Is Food Grad" },
    // {id: 46, name: "vaninhouse" , title:"Van In House" },
    {id:1 , name:"Commodity_Group", title:"Commodity Group"},  
    {id:2 , name:"Days_Since_Last_Wash", title:"Days Since Last Wash"},
    {id:3 , name:"Days_to_Next_Wash", title:"Days to Next Wash"},
    {id:4 , name:"Dedicated", title:"Dedicated"},    
    {id:5 , name:"Height", title:"Height"},
    {id:6 , name:"Last_Commodity", title:"Last Commodity"},    
    {id:7 , name:"Last_Order", title:"Last Order"},    
    {id:8 , name:"Last_Product", title:"Last Product"},
    {id:9 , name:"Last_Wash_W/O", title:"Last Wash W/O"},
    {id:10 , name:"Last_Washed", title:"Last Washed"},
    {id:11 , name:"Length", title:"Length"},
    {id:12 , name:"License", title:"License"},
    {id:13 , name:"Loads_Since_Last_Wash", title:"Loads Since Last Wash"},
    {id:14, name:"Loads_to_Next_Wash", title:"Loads to Next Wash"},
    {id:15 , name:"Make", title:"Make"},
    {id:16 , name:"Model", title:"Model"},
    {id:17 , name:"PM_Due_Date", title:"PM Due Date"},
    {id:18 , name:"Shipper_Pool", title:"Shipper Pool"},
    {id:19 , name:"State", title:"State"},    
   
    {id:20 , name:"Status", title:"Status"},    
    {id:21 , name:"Tare_Weight", title:"Tare Weight"},    
    {id:22 , name:"Terminal", title:"Terminal"},
    {id:23 , name:"Trailer_ID", title:"Trailer ID"},
    {id:24 , name:"Volume", title:"Volume"},
    {id:25 , name:"Width", title:"Width"},
    {id:26 , name:"latitude", title:" Latitude"},
    {id:27 , name:"longitude", title:"Longitude"},
    {id:28 , name:"terminal_id", title:"TerminalId"},
    {id:29 , name:"trailer_id", title:"TrailerId"},
    // {id:28 , name:"Loads Since Last Wash", title:"Loads Since Last Wash"},
    // {id:29, name:"Loads to Next Wash", title:"Loads to Next Wash"},
    // {id:30 , name:"Make", title:"Make"},
    // {id:16 , name:"Model", title:"Model"},     


    
  ];

  const [userData, setuserData] = useContext(ContextData);

  if (userData.hasOwnProperty("trailerColumns")){
    columns = userData.trailerColumns;
  }

  const locales = [{
    language: 'en-US',
    locale: 'en'
  }, {
    language: 'es-ES',
    locale: 'es'
  }];
  const [dataState, setDataState] = React.useState({
    skip: 0,
    take: 20,
    sort: [{
      field: 'orderDate',
      dir: 'desc'
    }],
    // group: [{
    //   field: 'customerID'
    // }]
  });
  const [currentLocale, setCurrentLocale] = React.useState(locales[0]);
  const [orders, setorders] = useState([]);
  const [dataResult, setDataResult] = React.useState(process(orders, dataState));
  const [isDataloaded, setIsDataLoaded] =  useState(false);



  
  const expandChange = event => {
    const isExpanded = event.dataItem.expanded === undefined ? event.dataItem.aggregates : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setDataResult({
      ...dataResult
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

  const dataStateChange = event => {
    setDataResult(process(orders, event.dataState));
    setDataState(event.dataState);
    userData.trailerDataState = event.dataState;
    const userService = new UserService();
   userService.updateUser(userData);
   
  };


  const columnReorderChange = function(event){
    const userService = new UserService();
    userData.trailerColumns = event.target._columns.map(it => {
      return {
        id: it.index,
        name: it.field,
        title: it.title
      }
    });

    userService.updateUser(userData);
  }

  useEffect(() => {
    var arrayOfObj = [];
    if(allTrailersArray && Object.keys(allTrailersArray))
    {
      arrayOfObj = Object.keys(allTrailersArray).map(i => allTrailersArray[i])
      setorders(arrayOfObj)
      setIsDataLoaded(true);
    }
    if (!userData.hasOwnProperty("trailerDataState")){
      setDataResult(process(arrayOfObj, dataState));
      // setIsDataLoaded(true);
    } else {
      setDataResult(process(arrayOfObj, userData.trailerDataState));
    }
  }, [allTrailersArray])

  return (
    <div className="tab_inside_section">
      <div className="tab_inside_section_top">

        <div className="tab_inside_section_top_left">
        </div>

        <div className="tab_inside_section_top_right">
          {isDataloaded === "true" ? (
            ""
          ) : (
            <Link
              component={RouterLink}
              onClick={() => {
                setIsDataLoaded("false");
                window.open(`/TrailersPage?date=${new Date().getTime()}`, "_blank");
             
              }}
            >
              
              <button variant="contained" type="button" className="btn_signout"><i class="fa fa-external-link"></i></button>
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

      {
        (isDataloaded) ?

        <LocalizationProvider language={currentLocale.language}>
          <IntlProvider locale={currentLocale.locale}>

            <ExcelExport data={orders} ref={exporter => {
              _export = exporter;
            }}>
              <Grid sortable={true} filterable={true} groupable={true} reorderable={true} pageable={{
                buttonCount: 4,
                pageSizes: true
              }}resizable={true} data={dataResult} {...dataState} onDataStateChange={dataStateChange} 
                detail={DetailComponent} expandField="expanded" 
                onExpandChange={expandChange}
                onColumnReorder = {columnReorderChange}
                >
                <GridToolbar>
                  {/* Locale:&nbsp;&nbsp;&nbsp;
                  <DropDownList value={currentLocale} textField="language" onChange={e => {
                    setCurrentLocale(e.target.value);
                  }} data={locales} />&nbsp;&nbsp;&nbsp;
                  <button title="Export to Excel" className="k-button k-primary" onClick={exportExcel}>
                    Export to Excel
                  </button>&nbsp;
                  <button className="k-button k-primary" onClick={exportPDF}>Export to PDF</button> */}
                </GridToolbar>
                  {
                    columns.slice(1).map(it => 
                          (<GridColumn field= { it.name } title= { it.title } width="200px" />))
                  }

                {/* <GridColumn field="eqfleetcode" title="Fleet Code" width="200px" />
                <GridColumn field="equnitcode" title="Unit Code" width="200px" /> 
                <GridColumn field="eqtype" title="Trailer Type" width="200px" /> 
                <GridColumn field="eqmake" title="Make" width="200px" /> 
                <GridColumn field="eqtypegroup" title="Type Group" width="200px" />
                <GridColumn field="eqmodel" title="Model" width="200px" />
                <GridColumn field="eqyear" title="Year" width="200px" />
                <GridColumn field="eqstat" title="Stat" width="200px" />
                <GridColumn field="eqvin" title="eqvin" width="200px" />
                <GridColumn field="eqdescription" title="Description" width="200px" />
                <GridColumn field="eqlicenseplate" title="License Plate" width="200px" />
                <GridColumn field="eqlicensestate" title="License State" width="200px" />
                <GridColumn field="eqlicensecountry" title="License Country" width="200px" />
                <GridColumn field="eqlicenserenewaldate" title="License Renewal Date" width="200px" />
                <GridColumn field="eqwheelbase" title="Wheel Base" width="200px" />
                <GridColumn field="eqgrossweight" title="Gross Weight" width="200px" />
                <GridColumn field="eqtareweight" title="Tare Weight" width="200px" />
                <GridColumn field="eqcustomercode" title="Customer Code" width="200px" />
                <GridColumn field="eqassetid" title="Assetid" width="200px" />
                <GridColumn field="maintdate" title="Maint Date" width="200px" />
                <GridColumn field="messages" title="Messages*" width="200px" />
                <GridColumn field="lastserviceDate" title="Last Service Date" width="200px" />
                <GridColumn field="pmdays" title="PM Days" width="200px" />
                <GridColumn field="drybulk" title="Dry Bulk" width="200px" />
                <GridColumn field="dryselfLoader" title="Dry Self Loader" width="200px" />
                <GridColumn field="drystraight" title="Dry Straight" width="200px" />
                <GridColumn field="drydustcollector" title="Dry Dust Collector" width="200px" />
                <GridColumn field="drycooler" title="Dry Cooler" width="200px" />
                <GridColumn field="dryfilltubes" title="Dry Fill Tubes" width="200px" />
                <GridColumn field="dryfilltubeslocation" title="Dry Fill Tubes Location" width="200px" />
                <GridColumn field="drycatwalk_topsafetyconfig" title="Dry Catwalk *" width="200px" />
                <GridColumn field="dryisleadtrailer" title="Dry Is Lead Trailer" width="200px" />
                <GridColumn field="drynumberofhosetubes" title="Dry Number Of Hose Tubes" width="200px" />
                <GridColumn field="liquid" title="Liquid" width="200px" />
                <GridColumn field="liquidunloadconfig" title="Liquid Unload Config" width="200px" />
                <GridColumn field="liquidisinsualted" title="Liquid Is Insualted" width="200px" />
                <GridColumn field="liquidhasintransitheat" title="Liquid Has Intransit Heat" width="200px" />
                <GridColumn field="liquidpump" title="Liquid Pump" width="200px" />
                <GridColumn field="liquidislargecube" title="Liquid Is LargeCube" width="200px" />
                <GridColumn field="liquidnumberofcxle" title="Liquid Number Of Axle" width="200px" />
                <GridColumn field="liquidchassis" title="Liquid Chassis" width="200px" />
                <GridColumn field="van" title="Van" width="200px" />
                <GridColumn field="vandimensions" title="Van Dimensions" width="200px" />
                <GridColumn field="vandoorconfiguration" title="Van Door Configuration" width="200px" />
                <GridColumn field="vanisfoodgrad" title="Van Is Food Grad" width="200px" />
                <GridColumn field="vaninhouse" title="Van In House" width="200px" /> */}


                {/* <GridColumn field="eqvin" title="eqvin" width="200px" />
                <GridColumn field="eqmodel"  title="eqmodel" width="280px" />
                <GridColumn field="eqlicenserenewaldate" filter="date" format="{0:D}" title="eqlicenserenewaldate" width="300px" />
                <GridColumn field="eqmake"  title="eqmake" width="280px" />
                <GridColumn field="eqtype"  title="eqtype" width="280px" />
                <GridColumn field="equnitcode" title="equnitcode" width="200px" />
                <GridColumn locked={true} field="id" filterable={false} title="ID" width="90px" /> */}
              </Grid>
            </ExcelExport>
            {/* <GridPDFExport ref={element => {
              _pdfExport = element;
            }} margin="1cm">
              {<Grid data={process(orders, {
                skip: dataState.skip,
                take: dataState.take
              })}>
                <GridColumn field="eqvin" title="eqvin" width="200px" />
                <GridColumn field="eqmodel"  title="eqmodel" width="280px" />
                <GridColumn field="eqlicenserenewaldate" filter="date" format="{0:D}" title="eqlicenserenewaldate" width="300px" />
                <GridColumn field="eqmake"  title="eqmake" width="280px" />
                <GridColumn field="eqtype"  title="eqtype" width="280px" />
                <GridColumn field="equnitcode" title="equnitcode" width="200px" />                
                <GridColumn locked={true} field="id" filterable={false} title="ID" width="90px" />
              </Grid>}
            </GridPDFExport> */}

          </IntlProvider>
        </LocalizationProvider>

        :

        <ProgressBar animated now={100} />
      }


      </div>
      {/* <div className="tab_inside_section_bottom_2">
                                <div className="tab_inside_section_bottom_2_left_pagination">
                                    Pagination Goes Here....
                                </div>
                                <div className="tab_inside_section_bottom_2_right_pagination">
                                    Pagination Goes Here....
                                </div>
                            </div> */}
    </div>
  )
}

export default PlannerBoardOrdersTable
