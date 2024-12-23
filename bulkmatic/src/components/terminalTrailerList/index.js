import React, { useState, useEffect } from "react";
import SearchFilter from "../../assets/images/search_filter.svg";
import Search from "../../assets/images/Search-Button.svg";
import Addicon from "../../assets/images/add_icon.svg";
import TrailerService from "../../services/trailerService";
import Spinner from "react-bootstrap/Spinner";
import { Box, TablePagination } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";

const TerminalTrailerList = (props) => {
  const { terminalById } = props;
  const [searchtext, setSearchText] = useState("");
  const [allTrailer, setallTrailer] = useState([]);
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
  // const filterOperators = {
  //   text: [
  //     {
  //       text: "grid.filterContainsOperator",
  //       operator: "contains",
  //     },
  //   ],
  //   numeric: [
  //     {
  //       text: "grid.filterEqOperator",
  //       operator: "eq",
  //     },
  //   ],
  //   date: [
  //     {
  //       text: "grid.filterEqOperator",
  //       operator: "eq",
  //     },
  //   ],
  //   boolean: [
  //     {
  //       text: "grid.filterEqOperator",
  //       operator: "eq",
  //     },
  //   ],
  // };

  const [dataResult, setDataResult] = useState(process(allTrailer, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allTrailer, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allTrailer, dataState));
  }, [allTrailer]);

  useEffect(async () => {
    setIsLoading(true);
    const trailerService = new TrailerService();
    const allterminaltrailers = await trailerService.getTrailersByTerminalId(
      terminalById.code,
      searchtext
    );

    props.parentCallBackFromTerminal(allterminaltrailers);
    setallTrailer(allterminaltrailers);
    setIsLoading(false);
  }, []);

  // const searchHandler = async () => {
  //   let allTrailers = allTrailer;
  //   if (searchtext) {
  //     setallDataAfterSearch(
  //       allTrailers.filter(
  //         (item) =>
  //           item.trailer_id.toUpperCase().indexOf(searchtext.toUpperCase()) >
  //             -1 ||
  //           item.eqmodel.toUpperCase().indexOf(searchtext.toUpperCase()) >
  //             -1
  //       )
  //     );
  //   } else {
  //     setallDataAfterSearch([]);
  //   }
  // };
  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     searchHandler();
  //   }
  // };

  // const handlePageChange = (e, newPage) => {
  //   setPage(newPage);
  // };
  // const handleRowsPerPageChange = (e) => {
  //   setRowsPerPage(parseInt(e.target.value, 10));
  // };

  const activetrailerdata = allTrailer.filter((it) => it.is_active === true);
  // console.log("activetrailerdata",activetrailerdata)

  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <div className="table_header_section w-96">
              <h2 className="header-title">
                {" "}
                Total: {activetrailerdata?.length}
              </h2>
              {/* <div className="search_area">
                <div className="search_left">
                  <img src={SearchFilter} className="search_filter_icon" />
                </div>
                <div className="search_middle">
                  <input
                    type="text"
                    placeholder="Search Trailers"
                    className="special_searchbox"
                    onChange={(e) => setSearchText(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="search_right">
                  <img
                    src={Search}
                    className="search_button_icon"
                    onClick={() => searchHandler()}
                  />
                </div>
              </div> */}
            </div>

            <div className="table-responsive">
              {activetrailerdata?.length > 0 ? (
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
                      return <td>{e.dataItem.trailer_id}</td>;
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
                    field="eqlicensestate"
                    title="Lic State"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.eqlicensestate
                            ? e.dataItem.eqlicensestate
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
                  <GridColumn
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
                  />
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

export default TerminalTrailerList;
