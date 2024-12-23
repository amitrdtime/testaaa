import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";

const TerminalLocationTable = (props) => {
  const { allTerminal, isDataLoadedParent } = props;

  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
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
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
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
  const [dataResult, setDataResult] = useState(process(allTerminal, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allTerminal, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allTerminal, dataState));
  }, [allTerminal]);

  const useStyles = makeStyles((theme) => ({
    statuscolor: {   
      marginTop: "10px",
      fontWeight: "bold",
      fontSize: 15,
    },
  }));
  const classes = useStyles();


  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body ">
            <div className="table-responsive">
              {allTerminal?.length > 0 ? (
                <Grid
                  filter={dataState.filter}
                  filterable={true}
                  // filterOperators={filterOperators}
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
                            color: e.dataItem.isActive ? "#259125" : "#FFA500",
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
                  <GridColumn
                    field="region"
                    title="Region"
                    width="200px"
                    filterable={true}
                  />
                  {/* <GridColumn
                    field="name"
                    title="Terminal"
                    width="200px"
                    filterable={true}
                  /> */}
                  
                  <GridColumn 
                    field="full_terminal_name"
                    title="Terminal"
                    width="200px"
                    filterable={true}
                  />

                  {/* <GridColumn
                    field="code"
                    title="Code"
                    width="200px"
                    filterable={true}
                  /> */}
                  <GridColumn
                    field={"address_city_state_zip"}
                    title="Address"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td  className={classes.statuscolor}
                        style={{
                          color: e.dataItem.address_city_state_zip ? "" : "#FFA500",
                        }}>
                              {e.dataItem.address_city_state_zip ? e.dataItem.address_city_state_zip : ""}
                            </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="city"
                    title="City"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td className={classes.statuscolor}
                        style={{
                          color: e.dataItem.city ? "" : "#FFA500",
                        }}>
                              {e.dataItem.city ? e.dataItem.city : ""}
                            </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="state"
                    title="State"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td className={classes.statuscolor}
                        style={{
                          color: e.dataItem.state ? "" : "#FFA500",
                        }}>
                              {e.dataItem.state ? e.dataItem.state : ""}
                            </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="phone"
                    title="Phone"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td className={classes.statuscolor}
                        style={{
                          color: e.dataItem.phone ? "" : "#FFA500",
                        }}>
                              {e.dataItem.phone ? e.dataItem.phone : ""}
                            </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="isshop"
                    cell={(e) => {
                      return (
                        <td
                          colSpan="1"
                          class=""
                          role="gridcell"
                          aria-colindex="7"
                          aria-selected="false"
                          data-grid-col-index="6"
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isshop ? "#259125" : "#FFA500",
                          }}
                        >
                          {e.dataItem.isshop ? "Yes" : "No"}
                        </td>
                      );
                    }}
                    title="Has a Shop"
                    width="200px"
                    filterable={true}
                  />
                  <GridColumn
                    field="iswash"
                    cell={(e) => {
                      return (
                        <td
                          colSpan="1"
                          class=""
                          role="gridcell"
                          aria-colindex="7"
                          aria-selected="false"
                          data-grid-col-index="6"
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.iswash ? "#259125" : "#FFA500",
                          }}
                        >
                          {e.dataItem.iswash ? "Yes" : "No"}
                        </td>
                      );
                    }}
                    title=" Has Wash Facility"
                    width="200px"
                    filterable={true}
                  />
                  <GridColumn
                    field="israilyard"
                    cell={(e) => {
                      return (
                        <td
                          colSpan="1"
                          class=""
                          role="gridcell"
                          aria-colindex="7"
                          aria-selected="false"
                          data-grid-col-index="6"
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.israilyard
                              ? "#259125"
                              : "#FFA500",
                          }}
                        >
                          {e.dataItem.israilyard ? "Yes" : "No"}
                        </td>
                      );
                    }}
                    title="Is a Railyard"
                    width="200px"
                    filterable={true}
                  />
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

export default TerminalLocationTable;
