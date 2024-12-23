import React, { useState, useEffect, useContext } from "react";
import Search from "../../assets/images/Search-Button.svg";
import Spinner from "react-bootstrap/Spinner";
import { Box, TablePagination } from "@material-ui/core";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ModalInput from "../../common/ModalInput";
import { ContextData } from "../../components/appsession";

const CommoditygroupBodyForDetails = (props) => {
  const [userData, setuserData] = useContext(ContextData);
  const { commoditygroup, setcommoditygroupById, callbackAftersave } = props;
  const [commodities, setcommodities] = useState([]);
  const [searchData, setsearchData] = useState("");
  const [isDataLoaded, setisDataLoaded] = useState(false);
  const [allDataAfterSearch, setallDataAfterSearch] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [modalShow, setModalShow] = useState(false);

  const [commodityObj, setCommodityObj] = useState({});

  const planners = userData.roles?.map((e) => e.permissionAccess);

  const commodityperm = planners[0].filter(
    (element) => element.permission === "Commodity Groups"
  );
  let sortedCommodity = [...commodities]
  sortedCommodity.sort((a,b) => a.code.toUpperCase() < b.code.toUpperCase() ? -1 : 1 )
  let DataAfterSearchSorted = [...allDataAfterSearch]
  DataAfterSearchSorted.sort((a,b) => a.code.toUpperCase() < b.code.toUpperCase() ? -1 : 1 )

  useEffect(async () => {
    setcommodities(commoditygroup.commodities);
    setisDataLoaded(true);
  }, []);

  useEffect(() => {
    setcommodities(commoditygroup.commodities);
  });
  const searchInputHandler = (value) => {
    setsearchData(value.toUpperCase());
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  const searchHandler = () => {
    let allCommodities = commodities;
    if (searchData) {
      setallDataAfterSearch(
        allCommodities.filter(
          (item) =>
            item.name.toUpperCase().indexOf(searchData.toUpperCase()) > -1 ||
            item.code.toUpperCase().indexOf(searchData.toUpperCase()) > -1
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

  const editModal = (commodity) => {
    setCommodityObj(commodity);
    setModalShow(true);
  };

  return (
    <div className="col-xl-12">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body special_card_padding">
            <h2 className="header-title"> </h2>
            <div className="search_area">
              <div className="search_left"></div>
              <div className="search_middle">
                <input
                  type="text"
                  placeholder="Search Commodity..."
                  className="special_searchbox"
                  onChange={(e) => searchInputHandler(e.target.value)}
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
            {isDataLoaded ? (
              <table className="table table-borderless table-hover  table-centered m-0 special_fonts commodity_override">
                <thead className="table-light commodity_override_deep">
                  <tr>
                    <th>Action</th>
                    <th>Code</th>
                    <th>Name</th>
                    <th colSpan={4}>Load Time</th>
                    <th colSpan={2}>Unload Time</th>
                  </tr>
                </thead>
                <thead className="table-light ">
                  <tr>
                    <th>Edit</th>
                    <th></th>
                    <th></th>
                    <th>Yes</th>
                    <th>No</th>
                    <th>Tl</th>
                    <th>Nb</th>
                    <th>Yes</th>
                    <th>No</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {DataAfterSearchSorted.length > 0
                      ? DataAfterSearchSorted.map((commodity, index) => (
                          <tr key={index}>
                            <td>
                              <Button onClick={() => editModal(commodity)}>
                                Edit
                              </Button>
                            </td>
                            <td>{commodity.code}</td>
                            <td>{commodity.name}</td>
                            {/* <td>{commoditygroup.loadtime}</td> */}
                            <td>
                              {commodity.lutformatted.loadtime.yes.loadtime}
                            </td>
                            <td>
                              {commodity.lutformatted.loadtime.no.loadtime}
                            </td>
                            <td>
                              {commodity.lutformatted.loadtime.tl.loadtime}
                            </td>
                            <td>
                              {commodity.lutformatted.loadtime.nb.loadtime}
                            </td>
                            <td>
                              {commodity.lutformatted.unloadtime.yes.unloadtime}
                            </td>
                            <td>
                              {commodity.lutformatted.unloadtime.no.unloadtime}
                            </td>
                            {/* <td>{commoditygroup.unloadtime}</td> */}
                          </tr>
                        ))
                      : (rowsPerPage > 0
                          ? sortedCommodity.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : sortedCommodity
                        ).map((commodity, index) => (
                          <tr key={index}>
                            {commodityperm[0].isEdit ? (
                              <td>
                                <Button onClick={() => editModal(commodity)}>
                                  Edit
                                </Button>
                              </td>
                            ) : (
                              <td>
                                <Button disabled>Edit</Button>
                              </td>
                            )}
                            <td>{commodity.code}</td>
                            <td>{commodity.name}</td>
                            {/* <td>{commoditygroup.loadtime}</td>
                                                                <td>{commoditygroup.unloadtime}</td> */}
                            <td>
                              {commodity.lutformatted?.loadtime?.yes?.loadtime}
                            </td>
                            <td>
                              {commodity.lutformatted?.loadtime?.no?.loadtime}
                            </td>
                            <td>
                              {commodity.lutformatted?.loadtime?.tl?.loadtime}
                            </td>
                            <td>
                              {commodity.lutformatted?.loadtime?.nb?.loadtime}
                            </td>
                            <td>
                              {
                                commodity.lutformatted?.unloadtime?.yes
                                  ?.unloadtime
                              }
                            </td>
                            <td>
                              {
                                commodity.lutformatted?.unloadtime?.no
                                  ?.unloadtime
                              }
                            </td>
                          </tr>
                        ))}
                  </>
                </tbody>
              </table>
            ) : (
              <div className="loader_wrapper_table">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
            <Modal
              show={modalShow}
              onHide={() => setModalShow(false)}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              className="comodity_modal"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ModalInput
                  commodityObj={commodityObj}
                  setcommoditygroupById={setcommoditygroupById}
                  setCommodityObj={setCommodityObj}
                  setcommodities={setcommodities}
                  commodities={commodities}
                  type="commodity"
                  commoditygroup={commoditygroup}
                  setModalShow={setModalShow}
                  callbackAftersave={callbackAftersave}
                />
              </Modal.Body>
            </Modal>
            <Box>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={commodities.length}
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
  );
};

export default CommoditygroupBodyForDetails;
