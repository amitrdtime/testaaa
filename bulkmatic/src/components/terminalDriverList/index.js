import React, { useState, useEffect } from "react";
import SearchFilter from "../../assets/images/search_filter.svg";
import Search from "../../assets/images/Search-Button.svg";
import Addicon from "../../assets/images/add_icon.svg";
import DriverService from "../../services/driverService";
import TerminalService from "../../services/terminalService";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Box, TablePagination } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "react-bootstrap";

const TerminalDriverList = (props) => {
  const { terminalById } = props;
  const [allDriver, setallDriver] = useState([]);
  const [searchtext, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
console.log("allDriver",allDriver)
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
  
  const [dataResult, setDataResult] = useState(process(allDriver, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allDriver, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allDriver, dataState));
  }, [allDriver]);



  useEffect(async () => {
    setIsLoading(true);
    const terminalService = new TerminalService();
    const allterminalDrivers = await terminalService.getDriversByTerminalID(
      terminalById.code,
      searchtext
    );

    props.parentCallBackForTerminal(allterminalDrivers);
    setallDriver(allterminalDrivers);
        setIsLoading(false);
  }, []);

  const searchInputHandler = (e) => {
    setSearchText(e.target.value.toUpperCase());
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // filterHandler();
      searchHandler();
    }
  };

  const searchHandler = () => {
    let allDrivers = allDriver;
    if (searchtext) {
      setallDataAfterSearch(
        allDrivers.filter(
          (item) =>
            item.newname.toUpperCase().indexOf(searchtext.toUpperCase()) > -1 ||
            item.driver_id.toUpperCase().indexOf(searchtext.toUpperCase()) > -1
        )
      );
    } else {
      setallDataAfterSearch([]);
    }
  };
  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  

  return (
    <div className="row special_row_flex">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <div className="table_header_section w-96">
            <div>
                <h2 className="header-title">Total: {allDriver?.length}</h2>
              </div>
              {/* <div className="search_area">
                <div className="search_left">
                  <img src={SearchFilter} className="search_filter_icon" />
                </div>
                <div className="search_middle">
                  <input
                    type="text"
                    placeholder="Search Drivers"
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

           
            <div className="table-responsive">
              {allDriver?.length > 0 ? (
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
                    buttonCount : 10
                  }}
                  resizable={true}
                  skip={dataState.skip}
                  take={dataState.take}
                  data={dataResult}
                  onDataStateChange={dataStateChange}
                  onRowClick={(e) => props.parentCallBackForTerminal(true, e.dataItem)}
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
                          <Link className="driver_table_link"
                            to={"drivers/" + e.dataItem.driver_id}
                            target="_blank"
                          >
                            {e.dataItem.driver_id ?e.dataItem.driver_id: ""}                                                     
                          </Link>
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
                          (e.dataItem.driverfullName ? e.dataItem.driverfullName  : "")}
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
                     {e.dataItem.region?e.dataItem.region:""} 
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
                     {e.dataItem.terminal_full_name?e.dataItem.terminal_full_name:""} 
                      </td>
                       
                        
                      );
                    }} 
                    />
                    <GridColumn 
                      title="Driver Type"
                      field="driver_type_class"
                      width="200px"
                      filterable={true}
                      cell={(e)=>{
                          return (
                            <td>
                              {e.dataItem.driver_type_class
                              ?e.dataItem.driver_type_class
                              :""}
                            </td>
                          )
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

export default TerminalDriverList;
