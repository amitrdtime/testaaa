import React, { useState, useEffect } from "react";
import UserImage from "../../assets/images/users/user-2.jpg";
import { Box, TablePagination } from "@material-ui/core";
import Spinner from "react-bootstrap/Spinner";


const LoadUnloadruleTable = (props) => {
  const { allCGs } = props;

  const [isDataLoaded, setisDataLoaded] = useState(false);
  const [allloadunloadData, setAllloadunloadData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const CommodityGroupClickHandler = (e, cgId) => {
    
    props.parentcallback(true, cgId);
  };
  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  useEffect(() => {
    
      setAllloadunloadData(allCGs);
   
  }, [allCGs.length]);

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body ">
            <div className="table-responsive">
              <table className="table table-borderless table-hover table-nowrap table-centered m-0 special_fonts">
                <thead className="table-light">
                  <tr>
                    <th colSpan="2" style={{ width: "50%" }}>
                      COMMODITY GROUPS{" "}
                    </th>
                    <th>INFORMATION</th>
                  </tr>
                </thead>
                <tbody>
                  {isDataLoaded ? (
                    <>
                      {(rowsPerPage > 0
                        ? allloadunloadData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : allloadunloadData &&
                          allloadunloadData.length > 0 &&
                          allloadunloadData
                      ).map((lut, index) => (
                        <tr
                          onClick={(e) => CommodityGroupClickHandler(e, lut)}
                          key={index}
                        >
                          <td style={{ width: "5%" }}>
                            <div className="active_outer">
                              <img
                                src={UserImage}
                                alt="contact-img"
                                title="contact-img"
                                className="rounded-circle avatar-sm"
                              />
                              <div
                                className={
                                  lut.isActive ? "active_sign" : "inactive_sign"
                                }
                              ></div>
                            </div>
                          </td>
                          <td>
                            <h5 className="m-0 fw-normal table_user_name_font">
                            {lut.code} : {lut.description}
                            </h5>
                          </td>
                          <td className="table_user_role_name_font">
                            <button
                              type="button"
                              className="btn_table btn-table"
                            >
                              Load Time: {lut.loadtime}
                            </button>
                            <button
                              type="button"
                              className="btn_table btn-table ml_5"
                            >
                              Unload Time: {lut.unloadtime}
                            </button>
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
                  count={allCGs.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onChangePage={handlePageChange}
                  onChangeRowsPerPage={handleRowsPerPageChange}
                />
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadUnloadruleTable;
