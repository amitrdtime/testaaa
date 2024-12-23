import React, { useState, useEffect, useContext } from 'react';
import * as ReactDOM from 'react-dom';
import "./trailespage.css";
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { GridPDFExport } from '@progress/kendo-react-pdf';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { IntlProvider, load, LocalizationProvider, loadMessages, IntlService } from '@progress/kendo-react-intl';

import '@progress/kendo-theme-default/dist/all.css';

import { process } from '@progress/kendo-data-query';
import UserService from '../../services/userService';
import { ContextData } from '../../components/appsession';
import ProgressBar from "react-bootstrap/ProgressBar";
import { Box, Button, Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const DATE_FORMAT = 'yyyy-mm-dd hh:mm:ss.SSS';
const intl = new IntlService('en');


const DetailComponent = props => {
    const dataItem = props.dataItem;
    return null;
};

const TrailerspageTable = (props) => {
    const { settabSelected, allTrailersArray } = props;
    let columns = [
        { id: 0, name: 'expanded', title: ' ' },
        { id: 1, name: "eqfleetcode", title: "Fleet Code" },
        { id: 2, name: "equnitcode", title: "Unit Code" },
        { id: 3, name: "eqtype", title: "Trailer Type" },
        { id: 4, name: "eqmake", title: "Make" },
        { id: 5, name: "eqtypegroup", title: "Type Group" },
        { id: 6, name: "eqmodel", title: "Model" },
        { id: 7, name: "eqyear", title: "Year" },
        { id: 8, name: "eqstat", title: "Stat" },
        { id: 9, name: "eqvin", title: "eqvin" },
        { id: 10, name: "eqdescription", title: "Description" },
        { id: 11, name: "eqlicenseplate", title: "License Plate" },
        { id: 12, name: "eqlicensestate", title: "License State" },
        { id: 13, name: "eqlicensecountry", title: "License Country" },
        { id: 14, name: "eqlicenserenewaldate", title: "License Renewal Date" },
        { id: 15, name: "eqwheelbase", title: "Wheel Base" },
        { id: 16, name: "eqgrossweight", title: "Gross Weight" },
        { id: 17, name: "eqtareweight", title: "Tare Weight" },
        { id: 18, name: "eqcustomercode", title: "Customer Code" },
        { id: 19, name: "eqassetid", title: "Assetid" },
        { id: 20, name: "maintdate", title: "Maint Date" },
        { id: 21, name: "messages", title: "Messages*" },
        { id: 22, name: "lastserviceDate", title: "Last Service Date" },
        { id: 23, name: "pmdays", title: "PM Days" },
        { id: 24, name: "drybulk", title: "Dry Bulk" },
        { id: 25, name: "dryselfLoader", title: "Dry Self Loader" },
        { id: 26, name: "drystraight", title: "Dry Straight" },
        { id: 27, name: "drydustcollector", title: "Dry Dust Collector" },
        { id: 28, name: "drycooler", title: "Dry Cooler" },
        { id: 29, name: "dryfilltubes", title: "Dry Fill Tubes" },
        { id: 30, name: "dryfilltubeslocation", title: "Dry Fill Tubes Location" },
        { id: 31, name: "drycatwalk_topsafetyconfig", title: "Dry Catwalk *" },
        { id: 32, name: "dryisleadtrailer", title: "Dry Is Lead Trailer" },
        { id: 33, name: "drynumberofhosetubes", title: "Dry Number Of Hose Tubes" },
        { id: 34, name: "liquid", title: "Liquid" },
        { id: 35, name: "liquidunloadconfig", title: "Liquid Unload Config" },
        { id: 36, name: "liquidisinsualted", title: "Liquid Is Insualted" },
        { id: 37, name: "liquidhasintransitheat", title: "Liquid Has Intransit Heat" },
        { id: 38, name: "liquidpump", title: "Liquid Pump" },
        { id: 39, name: "liquidislargecube", title: "Liquid Is LargeCube" },
        { id: 40, name: "liquidnumberofcxle", title: "Liquid Number Of Axle" },
        { id: 41, name: "liquidchassis", title: "Liquid Chassis" },
        { id: 42, name: "van", title: "Van" },
        { id: 43, name: "vandimensions", title: "Van Dimensions" },
        { id: 44, name: "vandoorconfiguration", title: "Van Door Configuration" },
        { id: 45, name: "vanisfoodgrad", title: "Van Is Food Grad" },
        { id: 46, name: "vaninhouse", title: "Van In House" }
    ];

    const [userData, setuserData] = useContext(ContextData);

    if (userData.hasOwnProperty("trailerColumns")) {
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
    const [isDataloaded, setIsDataLoaded] = useState(false);




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


    const columnReorderChange = function (event) {
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
        if (allTrailersArray && Object.keys(allTrailersArray)) {
            arrayOfObj = Object.keys(allTrailersArray).map(i => allTrailersArray[i])
            setorders(arrayOfObj)
            setIsDataLoaded(true);
        }
        if (!userData.hasOwnProperty("trailerDataState")) {
            setDataResult(process(arrayOfObj, dataState));
            // setIsDataLoaded(true);
        } else {
            setDataResult(process(arrayOfObj, userData.trailerDataState));
        }
    }, [allTrailersArray])

    return (
        <div className="tab_inside_section">


            <div className="tab_content">

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
                                    }} data={dataResult} {...dataState} onDataStateChange={dataStateChange}
                                        detail={DetailComponent} expandField="expanded"
                                        onExpandChange={expandChange}
                                        onColumnReorder={columnReorderChange}
                                    >

                                        {
                                            columns.slice(1).map(it =>
                                                (<GridColumn field={it.name} title={it.title} width="200px" />))
                                        }


                                    </Grid>
                                </ExcelExport>


                            </IntlProvider>
                        </LocalizationProvider>

                        :

                        <ProgressBar animated now={100} />
                }


            </div>

        </div>
    )
}

export default TrailerspageTable
