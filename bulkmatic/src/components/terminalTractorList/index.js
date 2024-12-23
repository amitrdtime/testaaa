import React, { useState, useEffect } from "react";
import SearchFilter from "../../assets/images/search_filter.svg";
import Search from "../../assets/images/Search-Button.svg";
import TerminalService from "../../services/terminalService";
import Spinner from "react-bootstrap/Spinner";
import { Box, TablePagination } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";

const TerminalTractorList = (props) => {
  const { terminalById, convertDateTime } = props;
  const [allTractor, setallTractor] = useState([]);
  const [searchtext, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [allDataAfterSearch, setallDataAfterSearch] = useState([]);

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
  
  const [dataResult, setDataResult] = useState(process(allTractor, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allTractor, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allTractor, dataState));
  }, [allTractor]);


  useEffect(async () => {
    const terminalService = new TerminalService();

    try {
      setIsLoading(true);
      const allterminalTractors = await terminalService.getTractorsByTerminalID(
        terminalById.code,
        searchtext
      );
      

      
        props.praentCallBackformTerminal(allterminalTractors);

        setallTractor(allterminalTractors);
        setIsLoading(false);
      
    } catch (error) {
      console.log(error);
    }
  }, []);

  // const searchInputHandler = (e) => {
  //   setSearchText(e.target.value.toUpperCase());
  // };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     searchHandler();
  //   }
  // };
  // const searchHandler = async (e) => {
  //   let allTractors = allTractor;
  //   if (searchtext) {
  //     setallDataAfterSearch(
  //       allTractors.filter(
  //         (item) =>
  //           item.description.toUpperCase().indexOf(searchtext.toUpperCase()) >
  //             -1 ||
  //           item.tractor_id.toUpperCase().indexOf(searchtext.toUpperCase()) > -1
  //       )
  //     );
  //   } else {
  //     setallDataAfterSearch([]);
  //   }
  // };

  // const handlePageChange = (e, newPage) => {
  //   setPage(newPage);
  // };
  // const handleRowsPerPageChange = (e) => {
  //   setRowsPerPage(parseInt(e.target.value, 10));
  // };
  const ActivetractorData = allTractor.filter((it)=>it.is_active === true)
  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <div className="table_header_section w-96">
              <h2 className="header-title">
                Total: {ActivetractorData?.length}
              </h2>
              
            </div>

            <div className="table-responsive">
              {ActivetractorData?.length > 0 ? (
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
                  //onRowClick={(e) => props.parentcallback(true, e.dataItem)}
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
                    title="Tractor Id"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          <Link className="driver_table_link"
                                    to={"tractors/" + e.dataItem.tractor_id}
                                    target="_blank"
                                  >
                                    {e.dataItem.tractor_id?e.dataItem.tractor_id:""}
                                  </Link>
                               
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
              ) : isLoading ? (
                <div>
                  <ProgressBar animated now={100} />
                  <div className="middle loader--text1"> </div>
                </div>
              ) : (
                <div className="text-center">No data found</div>

              )}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalTractorList;
