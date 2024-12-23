import React, { useState, useEffect } from "react";
import UserImage from "../../assets/images/users/user-2.jpg";
import bg from "../../assets/images/cg.png";
import Spinner from "react-bootstrap/Spinner";
import { Box, TablePagination } from "@material-ui/core";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  IntlProvider,
  load,
  LocalizationProvider,
  loadMessages,
  IntlService,
} from "@progress/kendo-react-intl";
import { process } from "@progress/kendo-data-query";
import { Tooltip } from "@mui/material";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";

const CommoditygroupTable = (props) => {
  const { allCommodityGroup } = props;
  const useStyles = makeStyles((theme) => ({
    statuscolor: {
     textAlign:"center!important",
      fontWeight: "bold",
      fontSize: 15
    },
  }));
  const classes = useStyles();
  const [allCommodityGroupData, setallCommodityGroupData] = useState([]);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 10,
    filter: {
      logic: "and",
      filters: [
        {
          field: "isActive",
          operator: "eq",
          value: true
        }
      ],
    },
    sort: [{
      field: '',
      dir: 'desc'
    }],
  });
  // const filterOperators = {
  //   text: [
  //     {
  //       text: 'grid.filterContainsOperator',
  //       operator: 'contains',
  //     },
  //   ],
  //   numeric: [
  //     {
  //       text: 'grid.filterEqOperator',
  //       operator: 'eq',
  //     },
  //   ],
  //   date: [
  //     {
  //       text: 'grid.filterEqOperator',
  //       operator: 'eq',
  //     },
  //   ],
  //   boolean: [
  //     {
  //       text: 'grid.filterEqOperator',
  //       operator: 'eq',
  //     },
  //   ],
  // };
  const [dataResult, setDataResult] = useState(
    process(allCommodityGroup, dataState)
  );

  const dataStateChange = (event) => {
    setDataResult(process(allCommodityGroup, event.dataState));
    setDataState(event.dataState);
  };



  useEffect(() => {
    setDataResult(process(allCommodityGroup, dataState));
  }, [allCommodityGroup]);

  useEffect(() => {
    if (allCommodityGroup.length > 0) {
      setallCommodityGroupData(allCommodityGroup);
    }
  }, [allCommodityGroup.length]);

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body ">
            <div className="table-responsive">
              {allCommodityGroup?.length > 0 ? (
                <Grid
                  filter={dataState.filter}
                  filterable={true}
                  //filterOperators={filterOperators}
                  sort={dataState.sort}
                  sortable={true}
                  pageable={{
                    pageSizes: [5, 10, 20, 25, 50, 100],
                    info: true,
                    previousNext: true,
                    buttonCount : 10
                  }}
                  resizable={true}
                  skip={dataState.skip}
                  take={dataState.take}
                  data={dataResult}
                  onDataStateChange={dataStateChange}
                  onRowClick={(e) => props.parentcallback(true, e.dataItem)}
                >
                  <GridColumn
                    field="isActive"
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isActive
                              ? "#259125"
                              : "#FF0000",
                          }}
                        >
                          {e.dataItem.isActive ? "True" : "False"}
                        </td>
                      );
                    }}
                    title="Is Active"
                 
                    width="150px"
                    filterable={true}
                    filter={"boolean"}
                  />
                  <GridColumn field="code" title="Code"
                    cell={(e) => {
                      return (
                        <td
                        >
                          {e.dataItem.code ? e.dataItem.code : " No data"}
                        </td>
                      );
                    }} />
                  <GridColumn field="name" title="Commodity Group Name"
                    cell={(e) => {
                      return (
                        <td
                        >
                          {e.dataItem.name ? e.dataItem.name : " No data"}
                        </td>
                      );
                    }} />
                  {/* <GridColumn field="description" title="Description"
                    cell={(e) => {
                      return (
                        <td
                        >
                          {e.dataItem.description ? e.dataItem.description : " No data"}
                        </td>
                      );
                    }} /> */}
                </Grid>
              ) : (
                <div>
                  <ProgressBar animated now={100}
                  />
                  <div class='loader'>
                    <div class='loader--text'></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommoditygroupTable;
