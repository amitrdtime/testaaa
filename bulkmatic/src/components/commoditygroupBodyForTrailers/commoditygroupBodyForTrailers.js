import React, { useState, useEffect } from "react";
import Search from "../../assets/images/Search-Button.svg";
import CommoditygroupService from "../../services/commoditygroupService";
import Spinner from "react-bootstrap/Spinner";

import { Box, TablePagination } from "@material-ui/core";

const CommoditygroupBodyForTrailers = (props) => {
  const { commoditygroup } = props;
  const [allTrailersDetails, setallTrailersDetails] = useState([]);
  const [searchData, setsearchData] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [allDataAfterSearch, setallDataAfterSearch] = useState([]);

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
            item.eqmake.toUpperCase().indexOf(searchData.toUpperCase()) > -1
        )
      );
    } else {
      setallDataAfterSearch([]);
    }
  };

  // useEffect(async () => {
  //   setIsLoading(false);
  //   const commoditygroupService = new CommoditygroupService();
  //   const allcommoditytrailers =
  //     await commoditygroupService.getAllTrailerByCommodityGroupId(
  //       commoditygroup.code,
  //       searchData
  //     );
  //   setallTrailersDetails(allcommoditytrailers);
  //   // props.parentCallBackFromTrailerGroup(allcommoditytrailers);
  //   setIsLoading(true);
  // }, []);

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
              <h2 className="header-title">Trailers</h2>
              <div className="search_area">
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
              </div>
            </div>
            <div className="table-responsive">
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
                  {/* {loading ? (
                    <div className="loader_wrapper">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : allTrailersDetails.length === 0 ? (
                    <div>
                      <p> No Trailer Data</p>
                    </div>
                  ) : (
                    allTrailersDetails.map((item, i) => (
                      <tr key={i}>
                        <th>{item.trailer_id}</th>
                        <td>{item.eqtype}</td>
                        <td>{item.eqmake}</td>
                        <td>{item.eqmodel}</td>
                        <td>{item.eqtypegroup}</td>
                      </tr>
                    ))
                  )} */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommoditygroupBodyForTrailers;
