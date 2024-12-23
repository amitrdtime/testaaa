import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";

const TrailerTable = (props) => {
  const { allTrailers, isLoading, convertDateTime } = props;
  const useStyles = makeStyles((theme) => ({
    statuscolor: {
      fontWeight: "bold",
      textAlign: "center !important",
      fontSize: 15,
    },
  }));
  const classes = useStyles();

  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [
        {
          field: "is_active",
          operator: "eq",
          value: true,
        },
      ],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });

  const [dataResult, setDataResult] = useState(process(allTrailers, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allTrailers, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allTrailers, dataState));
  }, [allTrailers]);

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body ">
            <div className="table-responsive">
              {isLoading ? 
            (
              <div>
              <ProgressBar animated now={100} />
              <div class="loader">
                <div class="loader--text"></div>
              </div>
            </div>
            ) : (
              allTrailers?.length > 0 ? (
                <Grid
                  filter={dataState.filter}
                  sort={dataState.sort}
                  sortable={true}
                  filterable={true}
                  //filterOperators={filterOperators}
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
                    field="is_active"
                    sortable={true}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.is_active ? "#259125" : "#FF0000",
                          }}
                        >
                          {e.dataItem.is_active ? "True" : "False"}
                        </td>
                      );
                    }}
                    title="Is Active"
                    width="150px"
                    filterable={true}
                    filter={"boolean"}
                  />
                  <GridColumn
                    field="eqstat"
                    title="Status"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return <td>{e.dataItem.eqstat}</td>;
                    }}
                  />
                  <GridColumn
                    field="trailer_id"
                    title="Trailer Id"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.trailer_id
                            ? e.dataItem.trailer_id
                            : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="eqmake"
                    title="Make"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.eqmake ? e.dataItem.eqmake : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="eqmodel"
                    title="Model"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.eqmodel ? e.dataItem.eqmodel : ""}
                        </td>
                      );
                    }}
                  />

                  <GridColumn
                    field="eqlicenseplate"
                    title="License Plate"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.eqlicenseplate
                            ? e.dataItem.eqlicenseplate
                            : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="driver_side_tag"
                    title="QR code"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.driver_side_tag
                            ? e.dataItem.driver_side_tag
                            : ""}
                        </td>
                      );
                    }}
                  />
                  {/* <GridColumn
                    field="eqfleetcode"
                    title="Fleet Code"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.eqfleetcode
                            ? e.dataItem.eqfleetcode
                            : ""}
                        </td>
                      );
                    }}
                  /> */}

                  <GridColumn
                    field="terminal_full_name"
                    title="Terminal"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.terminal_full_name
                            ? e.dataItem.terminal_full_name
                            : ""}
                        </td>
                      );
                    }}
                  />

                  <GridColumn
                    field="region"
                    title="Region"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem?.terminal.region
                            ? e.dataItem?.terminal.region
                            : ""}
                        </td>
                      );
                    }}
                  />

                  <GridColumn
                    field="commoditygroup_full_name"
                    title="Commoditygroup"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.commoditygroup_full_name
                            ? e.dataItem.commoditygroup_full_name
                            : ""}
                        </td>
                      );
                    }}
                  />

                  <GridColumn
                    field="pm_due_date_utc"
                    title="Next PM Date"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td
                          style={{
                            padding: e.dataItem.pm_due_date_utc ? "8px 1px" : "8px 10px"
                          }}
                          >
                          {
                            e.dataItem.pm_due_date_utc ? 
                            convertDateTime(e.dataItem.pm_due_date_utc) 
                            : ""
                          }
                        </td>
                      );
                    }}
                  />
                </Grid>
              ) : (
                <div>
                  No data found
                </div>
              )
            )
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerTable;
