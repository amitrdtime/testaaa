import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";

const DriverTable = (props) => {
  const { allDrivers, isLoading } = props;
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [
        {
          field: "is_active",
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

  const useStyles = makeStyles((theme) => ({
    statuscolor: {
      textAlign: "center!important",
      fontWeight: "bold",
      fontSize: 15
    },
  }));
  const classes = useStyles();
  const [dataResult, setDataResult] = useState(process(allDrivers, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allDrivers, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allDrivers, dataState));
  }, [allDrivers]);


  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body ">
            {isLoading ? (
              <div>
                <ProgressBar animated now={100} />
                <div class="loader">
                  <div class="loader--text"></div>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                {allDrivers?.length > 0 ? (
                  <Grid
                    filter={dataState.filter}
                    sort={dataState.sort}
                    sortable={true}
                    filterable={true}
                    // filterOperators={filterOperators}
                    pageable={{
                      pageSizes: [5, 10, 20, 25, 50, 100],
                      info: true,
                      previousNext: true,
                      buttonCount: 10
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
                      field="driver_id"
                      title="Driver ID"
                      width="200px"
                      filterable={true}
                      cell={(e) => {
                        return (
                          <td>
                            {e.dataItem.driver_id ? e.dataItem.driver_id : ""}
                          </td>
                        );
                      }}
                    />
                    <GridColumn
                      field="driverfullName"
                      title="Name"
                      width="200px"
                      filterable={true}
                      cell={(e) => {
                        return (
                          <td>
                            {
                              (e.dataItem.driverfullName ? e.dataItem.driverfullName : "")}
                          </td>

                        );
                      }}
                    />
                    <GridColumn
                      field="cell_phone"
                      title="Cell"
                      width="250px"
                      filterable={true}
                      cell={(e) => {
                        return (
                          <td>
                            {e.dataItem.cell_phone ? e.dataItem.cell_phone : ""}
                          </td>
                        );
                      }}
                    />
                    <GridColumn
                      field="Email"
                      title="Email"
                      width="350px"
                      filterable={true}
                      cell={(e) => {
                        return (
                          <td>
                            {e.dataItem.Email ? e.dataItem.Email : ""}
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

                        return (
                          <td>
                            {e.dataItem.terminal_full_name ? e.dataItem.terminal_full_name : ""}
                          </td>
                        );
                      }}
                    />
                    <GridColumn
                      title="Driver Type"
                      field="driver_type_class"
                      width="200px"
                      filterable={true}
                      cell={(e) => {
                        return (
                          <td>
                            {e.dataItem.driver_type_class
                              ? e.dataItem.driver_type_class
                              : ""}
                          </td>
                        )
                      }}
                    />
                  </Grid>
                ) : isLoading ? (
                  <div>
                    <ProgressBar animated now={100}
                    />
                  </div>) : <div>No data found</div>
                }
              </div>
            )
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverTable;
