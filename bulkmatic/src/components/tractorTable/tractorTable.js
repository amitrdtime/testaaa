import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";
import { DateTime } from "luxon";

const TractorTable = (props) => {
  const { allTractors, isLoading, convertDateTime } = props;

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

  const useStyles = makeStyles((theme) => ({
    statuscolor: {
      fontWeight: "bold",
      textAlign: "center !important",
      fontSize: 15,
    },
  }));
  const classes = useStyles();
  const [dataResult, setDataResult] = useState(process(allTractors, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allTractors, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allTractors, dataState));
  }, [allTractors]);

  useEffect(() => {
    let arr = [];
    if (allTractors.length > 0) {
      allTractors.map((tractors) => {
        let a = `${tractors?.terminal?.terminal_id}-${tractors?.terminal?.name}`;
        arr.push(Object.assign(tractors, { allTerminal: a }));
      });
    }
  }, [allTractors.length]);

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body ">
            <div className="table-responsive">
              {isLoading? (
                  <div>
                  <ProgressBar animated now={100} />
                  <div class="loader">
                    <div class="loader--text"></div>
                  </div>
                </div>
              ) : (
              allTractors?.length > 0 ? (
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
                    field="status"
                    title="Status"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return <td>{e.dataItem.status}</td>;
                    }}
                  />
                  <GridColumn
                    field="tractor_id"
                    title="Id"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.tractor_id
                            ? e.dataItem.tractor_id
                            : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    title="Region"
                    field="region"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.region ? e.dataItem.region : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    title="Terminal"
                    field="terminal_full_name"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return <td>{e.dataItem.terminal_full_name}</td>;
                    }}
                  />
                  <GridColumn
                    field="description"
                    title="Description"
                    width="300px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.description
                            ? e.dataItem.description
                            : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="vin"
                    title="VIN"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>{e.dataItem.vin ? e.dataItem.vin : ""}</td>
                      );
                    }}
                  />
                  <GridColumn
                    field="make"
                    title="Make"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>{e.dataItem.make ? e.dataItem.make : ""}</td>
                      );
                    }}
                  />
                  <GridColumn
                    field="model"
                    title="Model"
                    width="250px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.model ? e.dataItem.model : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="pm_due_date_utc"
                    title="Next PM Date"
                    width="250px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td
                          style={{
                            padding: e.dataItem.pm_due_date_utc ? "8px 1px" : "8px 10px"
                          }}
                        >
                          {e.dataItem.pm_due_date_utc
                            ? convertDateTime(e.dataItem.pm_due_date_utc)
                            : ""
                          }
                        </td>
                      );
                    }}
                  />
                </Grid>
              ) : (
               "No data found"
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TractorTable;
