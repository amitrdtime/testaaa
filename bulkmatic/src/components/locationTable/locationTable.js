import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import ProgressBar from "react-bootstrap/ProgressBar";
import { makeStyles } from "@material-ui/core/styles";

const LocationTable = (props) => {
  const { allLocation, isLocationLoaded } = props;

  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [
        {
          field: "isActive",
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
  const [dataResult, setDataResult] = useState(process(allLocation, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allLocation, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allLocation, dataState));
  }, [allLocation]);

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body ">
            <div className="table-responsive">
              {isLocationLoaded ? (
                <Grid
                  filter={dataState.filter}
                  filterable={true}
                  sort={dataState.sort}
                  sortable={true}
                  pageable={{
                    pageSizes: [5, 10, 20, 25, 50, 100],
                    info: true,
                    previousNext: true,
                    buttonCount: 10,
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
                    sortable={true}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isActive ? "#259125" : "#FF0000",
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
                    field="name"
                    title="Name"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>{e.dataItem.name ? e.dataItem.name : ""}</td>
                      );
                    }}
                  />
                  <GridColumn
                    field="code"
                    title="Code"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>{e.dataItem.code ? e.dataItem.code : ""}</td>
                      );
                    }}
                  />

                  <GridColumn
                    field="newaddress"
                    title="Address"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.newaddress
                            ? e.dataItem.newaddress
                            : ""}
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
                        <td>{e.dataItem.city ? e.dataItem.city : ""}</td>
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
                        <td>
                          {e.dataItem.state ? e.dataItem.state : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="zip"
                    title="Zip"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>{e.dataItem.zip ? e.dataItem.zip : ""}</td>
                      );
                    }}
                  />
                  <GridColumn
                    field="isConsignee"
                    title="Consignee"
                    width="200px"
                    filterable={true}
                    filter={"boolean"}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isConsignee
                              ? "#259125"
                              : "#FF0000",
                          }}
                        >
                          {e.dataItem.isConsignee ? "True" : "False"}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="isDroplot"
                    title="Droplot"
                    width="200px"
                    filterable={true}
                    filter={"boolean"}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isDroplot ? "#259125" : "#FF0000",
                          }}
                        >
                          {e.dataItem.isDroplot ? "True" : "False"}
                        </td>
                      );
                    }}
                  />
                  <GridColumn field="state" title="State" />
                  <GridColumn
                    field="isRailyard"
                    title="Railyard"
                    width="200px"
                    filterable={true}
                    filter={"boolean"}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isRailyard
                              ? "#259125"
                              : "#FF0000",
                          }}
                        >
                          {e.dataItem.isRailyard ? "True" : "False"}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="isShipper"
                    title="Shipper"
                    width="200px"
                    filterable={true}
                    filter={"boolean"}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isShipper ? "#259125" : "#FF0000",
                          }}
                        >
                          {e.dataItem.isShipper ? "True" : "False"}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="isShop"
                    title="Shop"
                    width="200px"
                    filterable={true}
                    filter={"boolean"}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isShop ? "#259125" : "#FF0000",
                          }}
                        >
                          {e.dataItem.isShop ? "True" : "False"}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="isTerminal"
                    title="Terminal"
                    width="200px"
                    filterable={true}
                    filter={"boolean"}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isTerminal
                              ? "#259125"
                              : "#FF0000",
                          }}
                        >
                          {e.dataItem.isTerminal ? "True" : "False"}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="isWash"
                    title="Wash"
                    width="200px"
                    filterable={true}
                    filter={"boolean"}
                    cell={(e) => {
                      return (
                        <td
                          className={classes.statuscolor}
                          style={{
                            color: e.dataItem.isWash ? "#259125" : "#FF0000",
                          }}
                        >
                          {e.dataItem.isWash ? "True" : "False"}
                        </td>
                      );
                    }}
                  />
                </Grid>
              ) : (
                <div>
                  <ProgressBar animated now={100} />
                  <div class="loader">
                    <div class="loader--text"></div>
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

export default LocationTable;
