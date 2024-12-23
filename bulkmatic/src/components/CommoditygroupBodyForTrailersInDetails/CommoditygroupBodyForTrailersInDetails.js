import React, { useState, useEffect } from "react";

import Search from "../../assets/images/Search-Button.svg";
import CommoditygroupService from "../../services/commoditygroupService";
import Spinner from "react-bootstrap/Spinner";

import { Box, TablePagination } from "@material-ui/core";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import ProgressBar from "react-bootstrap/ProgressBar";

const CommoditygroupBodyForTrailersInDetails = (props) => {
  const { commoditygroup, convertDateTime } = props;
  const [allTrailersDetails, setallTrailersDetails] = useState([]);
  const [searchData, setsearchData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [allDataAfterSearch, setallDataAfterSearch] = useState([]);

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
  const filterOperators = {
    text: [
      {
        text: 'grid.filterContainsOperator',
        operator: 'contains',
      },
    ],
    numeric: [
      {
        text: 'grid.filterEqOperator',
        operator: 'eq',
      },
    ],
    date: [
      {
        text: 'grid.filterEqOperator',
        operator: 'eq',
      },
    ],
    boolean: [
      {
        text: 'grid.filterEqOperator',
        operator: 'eq',
      },
    ],
  };
  const useStyles = makeStyles((theme) => ({
    statuscolor: {
      // display: "inline-block",
      // marginLeft: "35px",
      // marginTop: "10px",
      // fontWeight: "bold",
      // fontSize: 15,
      fontWeight: "bold",
      textAlign:"center !important",
      fontSize: 15,
    },
  }));

  const classes = useStyles();
  const [dataResult, setDataResult] = useState(process(allTrailersDetails, dataState));
  // const [terminalNames, setTerminalNames] = useState()
  const dataStateChange = (event) => {
    setDataResult(process(allTrailersDetails, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allTrailersDetails, dataState));
  }, [allTrailersDetails]);


  const searchInputHandler = (e) => {
    setsearchData(e.target.value.toUpperCase());
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  const searchHandler = async (e) => {
    // const commoditygroupService = new CommoditygroupService();
    // const allcommoditytrailers =
    //   await commoditygroupService.getAllTrailerByCommodityGroupId(
    //     commoditygroup.code,
    //     searchData
    //   );
    // setallTrailersDetails(allcommoditytrailers);
    // props.parentCallBackFromTrailerGroup(allcommoditytrailers);
    let allTrailers = allTrailersDetails;
    if (searchData) {
      setallDataAfterSearch(
        allTrailers.filter(
          (item) =>
            item.trailer_id.toUpperCase().indexOf(searchData.toUpperCase()) >
              -1 ||
            item.eqtype.toUpperCase().indexOf(searchData.toUpperCase()) > -1 ||
            item.eqmake.toUpperCase().indexOf(searchData.toUpperCase()) > -1 || 
            item.eqmodel.toUpperCase().indexOf(searchData.toUpperCase()) > -1
        )
      );
    } else {
      setallDataAfterSearch([]);
    }
  };

  useEffect(async () => {
    setIsLoading(false);
    const commoditygroupService = new CommoditygroupService();
    const allcommoditytrailers =
      await commoditygroupService.getAllTrailerByCommodityGroupId(
        commoditygroup.code,
        searchData
      );
    setallTrailersDetails(allcommoditytrailers);
    props.parentCallBackFromTrailerGroup(allcommoditytrailers);
    setIsLoading(true);
  }, []);

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };
  
  return (
    <div className="col-xl-12">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body special_card_padding">
            <h2 className="header-title">Commodity Group Trailers</h2>
            <h2 className="header-title"> Total: {dataResult.total}</h2>

            <div className="table-responsive">
              {allTrailersDetails?.length > 0 ? (
                <Grid
                  filter={dataState.filter}
                  sort={dataState.sort}
                  sortable={true}
                  filterable={true}
                  //filterOperators={filterOperators}
                  pageable={{
                    buttonCount: 10,
                    info: true,
                    previousNext: true,
                    pageSizes: true,
                  }}
                  resizable={true}
                  skip={dataState.skip}
                  take={dataState.take}
                  data={dataResult}
                  onDataStateChange={dataStateChange}
                  // onRowClick={(e) => props.parentcallback(true, e.dataItem)}
                >
                  <GridColumn 
                    field="trailer_id" 
                    title="Trailer Id" 
                    width="200px"                    
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.trailer_id ? e.dataItem.trailer_id : ""}
                        </td>
                      );
                    }} />
                    <GridColumn 
                    field="eqstat" 
                    title="Status" 
                    width="200px"                    
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.eqstat === "A" ? "Active" : "Inactive"}
                        </td>
                      );
                    }} />
                 
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
                          {e.dataItem.eqlicenseplate ? e.dataItem.eqlicenseplate : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="driver_side_tag"
                    title="QR Code"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.driver_side_tag ? e.dataItem.driver_side_tag : ""}
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
                          {e.dataItem.region ? e.dataItem.region : ""}
                        </td>
                      );
                    }}
                  />

                  <GridColumn
                    field="terminal_full_name_cg"
                    title="Terminal"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.terminal_full_name_cg ? e.dataItem.terminal_full_name_cg : ""}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="commoditygroup_full_name_cg"
                    title="Commodity Group"
                    width="200px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {e.dataItem.commoditygroup_full_name_cg ? e.dataItem.commoditygroup_full_name_cg : ""}
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
                          {e.dataItem.pm_due_date_utc ? convertDateTime(e.dataItem.pm_due_date_utc) : ""}
                        </td>
                      );
                    }}
                  />
                </Grid>
              ) : (
                <div>
                  <h4 className="contactdata">No Data</h4>
                </div>
              )}
            </div>
            {/* <div className="search_area">
              <div className="search_left"></div>
              <div className="search_middle">
                <input
                  type="text"
                  placeholder="Search Trailers"
                  className="special_searchbox"
                  onChange={(e) => searchInputHandler(e)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="search_right">
                <img
                  src={Search}
                  className="search_button_icon"
                  onClick={searchHandler}
                />
              </div>
            </div> */}
          </div>
          {/* <div className="table-responsive">
            <table className="table table-borderless table-hover table-nowrap table-centered m-0 special_fonts">
              <thead className="table-light">
                <tr>
                  <th>TrailerID</th>
                  <th>Type</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Last Commodity Used</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <>
                    {allDataAfterSearch.length > 0
                      ? allDataAfterSearch.map((item, index) => (
                          <tr>
                            <th>{item.trailer_id}</th>
                            <td>{item.eqtype}</td>
                            <td>{item.eqmake}</td>
                            <td>{item.eqmodel}</td>
                            <td>
                              {item.last_commodity_used
                                ? item.last_commodity_used
                                : "NO DATA"}
                            </td>
                          </tr>
                        ))
                      : (rowsPerPage > 0
                          ? allTrailersDetails.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : allTrailersDetails
                        ).map((item, index) => (
                          <tr>
                            <th>{item.trailer_id}</th>
                            <td>{item.eqtype}</td>
                            <td>{item.eqmake}</td>
                            <td>{item.eqmodel}</td>
                            <td>
                              {item.last_commodity_used
                                ? item.last_commodity_used
                                : "NO DATA"}
                            </td>
                          </tr>
                        ))}
                  </>
                ) : (
                  <div className="loader_wrapper_table">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
              </tbody>
            </table>
            <Box>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={allTrailersDetails.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </Box>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default CommoditygroupBodyForTrailersInDetails;
