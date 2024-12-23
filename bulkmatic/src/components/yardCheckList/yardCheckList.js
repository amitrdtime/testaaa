import React, { useState, useEffect } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Typeahead, AsyncTypeahead } from "react-bootstrap-typeahead";
import TrailerService from "../../services/trailerService";
import YardService from "../../services/yardService";
import "./yardCheckList.css";
import { DateTime } from "luxon";
import { process } from "@progress/kendo-data-query";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import { Autocomplete } from "@material-ui/lab";
import { MenuItem, TextField } from "@material-ui/core";
import YardCheckListHeader from "../../components/yardCheckListHeader/yardCheckListHeader";

const errors = {
  color: "red",
};

const YardCheckList = (props) => {
  const { terminalById, notifyParent, accessDisabled } = props;
  const [terminalByIdData, setterminalByIdData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalShowForAdd, setmodalShowForAdd] = useState(false);
  const [yardCheckInformation, setyardCheckInformation] = useState([]);
  const [isReload, setIsReload] = useState(false);
  const [hide, setHide] = useState(false);
  const [editRedtagDisable, setEditRedtagDisable] = useState(true);

  const [dataForBoolean, setdataForBoolean] = useState([
    {
      is_confirmation: "Yes",
    },
    {
      is_confirmation: "No",
    },
  ]);
  const [dataForRedtag, setdataForRedtag] = useState([
    {
      redflag: "Yes",
    },
    {
      redflag: "No",
    },
  ]);

  const [dataForStatus, setdataForStatus] = useState([
    {
      status: "Active",
    },
    {
      status: "In-Shop",
    },
    {
      status: "Sold",
    },
    {
      status: "Sale-Pending",
    },
    {
      status: "Collision",
    },
    {
      status: "On Order",
    },
  ]);
  const [allTrailers, setallTrailer] = useState([]);
  const [dataForAdd, setdataForAdd] = useState({});
  const [dataForUpdate, setdataForUpdate] = useState({});
  const [trailerDataForEdit, settrailerDataForEdit] = useState({});

  const printTableRef = useRef(null);
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
  const [dataResult, setDataResult] = useState(
    process(yardCheckInformation, dataState)
  );
  const dataStateChange = (event) => {
    setDataResult(process(yardCheckInformation, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(yardCheckInformation, dataState));
  }, [yardCheckInformation]);

  useEffect(async () => {
    const yardService = new YardService();
    let yardCheckTrailerAPI = await yardService.getYardCheckInformation(
      terminalById.id
    );

    yardCheckTrailerAPI = yardCheckTrailerAPI.data;

    for (let i = 0; i < yardCheckTrailerAPI.length; i++) {
      //For Trailer On Site
      if (yardCheckTrailerAPI[i].is_confirmation === null) {
      } else if (yardCheckTrailerAPI[i].is_confirmation) {
        yardCheckTrailerAPI[i].is_confirmation = "Yes";
      } else {
        yardCheckTrailerAPI[i].is_confirmation = "No";
      }
      //For RedTag
      if (yardCheckTrailerAPI[i].is_redflag === null) {
      } else if (yardCheckTrailerAPI[i].is_redflag) {
        yardCheckTrailerAPI[i].is_redflag = "Yes";
      } else {
        yardCheckTrailerAPI[i].is_redflag = "No";
      }
    }

    setyardCheckInformation(yardCheckTrailerAPI);
  }, [terminalById, isReload]);

  useEffect(async () => {
    const trailerService = new TrailerService();
    const trailers = await trailerService.getAllTrailersbyTerminalID([]);
    setallTrailer(trailers);
  }, []);

  const statusChangeHandlerForEdit = (value) => {
    if (value.length > 0) {
      setdataForUpdate((prev) => ({
        ...prev,
        is_status: value[0].status,
      }));
    }
  };

  const statusChangeHandlerForAdd = (value) => {
    if (value) {
      setdataForAdd((prev) => ({
        ...prev,
        is_status: value.status,
      }));
    }
  };
  const trailerChangeHandlerForAdd = (value) => {
    if (value) {
      setdataForAdd((prev) => ({
        ...prev,
        terminal_id: terminalById.terminalid,
        yardcheck_id: terminalById.id,
        trailer_id: value.trailer_id,
      }));
    }
  };

  const confirmChangeHandlerForAdd = (value) => {
    if (value) {
      setdataForUpdate((prev) => ({
        ...prev,
        is_confirmation: value.is_confirmation,
      }));
    }
  };

  const redTagChangeHandlerForAdd = (value) => {
    if (value) {
      setdataForUpdate((prev) => ({
        ...prev,
        is_redflag: value.redflag,
      }));
    }
  };

  const commentsChangeHandlerForAdd = (e) => {
    setdataForAdd((prev) => ({
      ...prev,
      check_comments: e.target.value,
    }));
  };

  ///edit part
  const confirmChangeHandlerForEdit = (e, value) => {
    if (value) {
      settrailerDataForEdit((prev) => ({
        ...prev,
        is_confirmation: value.is_confirmation,
      }));
      if (value.is_confirmation === "Yes") {
        setEditRedtagDisable(false);
      } else {
        setEditRedtagDisable(true);
        settrailerDataForEdit((prev) => ({
          ...prev,
          is_redflag: value.redflag,
        }));
      }
    } else {
      settrailerDataForEdit((prev) => ({
        ...prev,
        is_confirmation: null,
      }));

      settrailerDataForEdit((prev) => ({
        ...prev,
        is_redflag: dataForUpdate.redflag,
      }));
      setEditRedtagDisable(true);
    }
  };

  // useEffect(()=>{
  //   console.log("tt",dataForUpdate)
  //   if(dataForUpdate.is_confirmation==="Yes"){

  //     setEditRedtagDisable(false)
  //    }
  //    else if(dataForUpdate.is_confirmation==="No"){
  //     setEditRedtagDisable(true)
  //    }

  // },[dataForUpdate])

  const commentsChangeHandlerForEdit = (e) => {
    settrailerDataForEdit((prev) => ({
      ...prev,
      comment: e.target.value,
    }));
  };

  const redTagChangeHandlerForEdit = (e, value) => {
    if (value) {
      settrailerDataForEdit((prev) => ({
        ...prev,
        is_redflag: value.redflag,
      }));
    } else {
      settrailerDataForEdit((prev) => ({
        ...prev,
        is_redflag: null,
      }));
    }
  };
  ///edit part end
  /// end
  const addTrailer = async () => {
    const yardService = new YardService();
    try {
      const addTrailers = await yardService.addYardChkTrailer(dataForAdd);
      setmodalShowForAdd(false);
      setIsReload(!isReload);
      return NotificationManager.success(
        "Trailer Added Successfully",
        "success"
      );
    } catch (error) {
      return NotificationManager.error(error, "error");
    }
  };
  const submitDataHandler = async (yardCheckInformation) => {
    const submityard = yardCheckInformation;
    const yardsubmit = submityard.filter(
      (yard) => yard.is_confirmation === null
    );

    if (yardsubmit.length > 0) {
      NotificationManager.error(
        "Please Review All Trailers In the Yard Check",
        "Error"
      );
    } else {
      try {
        let data = {
          id: terminalById.id,
          endts: DateTime.now().toMillis(),
        };
        const yardService = new YardService();
        const Submission = await yardService.submitYardChkTrailer(data);
        notifyParent(Submission);
        //window.location.reload();
        return NotificationManager.success("Submitted", "Success");
      } catch (error) {
        NotificationManager.error("Failed", "Error");
      }
    }
  };

  useEffect(() => {
    setterminalByIdData(terminalById);
  }, []);

  const updateTrailerHandler = async () => {
    console.log("trailerDataForEdit.is_confirm", trailerDataForEdit);

    if (!trailerDataForEdit.is_confirmation) {
      return NotificationManager.error(
        "Trailer On Site must not be blank",
        "Error"
      );
    }
    if (
      trailerDataForEdit.is_redflag === "Yes" &&
      !trailerDataForEdit.comment
    ) {
      return NotificationManager.error("Comments Cannot be blank", "Error");
    } else {
      try {
        const yardService = new YardService();

        const editTrailers = await yardService.updateYardChkTrailer(
          trailerDataForEdit
        );

        if (editTrailers.length > 0) {
          setModalShow(false);
          setIsReload(!isReload);
          return NotificationManager.success("Trailer Updated", "Success");
        }
      } catch (error) {
        NotificationManager.error("Failed", "Error");
      }
    }
  };

  const openEditModal = (item) => {
    console.log("item", item);
    setModalShow(true);
    // if(item.is_confirmation==="Yes"){
    //   setEditRedtagDisable(false)
    //  }
    //  else {
    //   setEditRedtagDisable(true)
    //  }
    setdataForUpdate(item);
    settrailerDataForEdit((prev) => ({
      ...prev,
      comment: item.check_comments,
      is_status: item.status,
      yardcheck_id: item.yardcheck_id,
      trailer_id: item.trailer_id,
      id: item.id,
      is_confirmation: item.is_confirmation,
      is_redflag: item.is_redflag,
    }));
    if (item.is_confirmation === "Yes") {
      setEditRedtagDisable(false);
    } else {
      setEditRedtagDisable(true);
    }
  };
  const Edityardchecks = (props) => {
    return (
      <td className="adjustbutton">
        <button
          type="button"
          class="btn_blue_smadjust btn-blue ml_10"
          onClick={() => openEditModal(props.dataItem)}
          disabled={accessDisabled ? true : false}
          style={{ background: accessDisabled ? "#dddddd" : "" }}
        >
          <i class="fa fa-pencil mr_5 del_icon" aria-hidden="true"></i>
          EDIT
        </button>
      </td>
    );
  };
  const Edityardcheck = (props) => (
    <Edityardchecks {...props} openEditModal={openEditModal} />
  );

  return (
    <div className="row mt_30">
      <div className="col-xl-12">
        <div className="card card_shadow ">
          <div className="card-body ">
            <div className="table_header_section">
              <div className="table_header">Yard Checklist </div>
              <div className="df">
                {/* <button type="button" className="btn_blue btn-blue ml_10"  onClick={() => setModalShow(true)}>ADD</button> */}
                {terminalByIdData?.status?.toUpperCase() === "IN PROGRESS" ? (
                  <>
                    <button
                      type="button"
                      className="btn_blue btn-blue ml_10"
                      onClick={() => submitDataHandler(yardCheckInformation)}
                      disabled={accessDisabled ? true : false}
                      style={{ background: accessDisabled ? "#dddddd" : "" }}
                    >
                      SUBMIT
                    </button>
                    <button
                      type="button"
                      className="btn_blue btn-blue ml_10"
                      onClick={() => setmodalShowForAdd(true)}
                      disabled={accessDisabled ? true : false}
                      style={{ background: accessDisabled ? "#dddddd" : "" }}
                    >
                      ADD
                    </button>
                  </>
                ) : (
                  ""
                )}
                <ReactToPrint
                  trigger={() => (
                    <button type="button" className="btn_blue btn-blue ml_10">
                      PRINT
                    </button>
                  )}
                  content={() => printTableRef.current}
                />
              </div>
            </div>
            <div className="row yard_chk_list_res">
              {yardCheckInformation && yardCheckInformation?.length > 0 ? (
                <Grid
                  filter={dataState.filter}
                  sort={dataState.sort}
                  sortable={true}
                  filterable={true}
                  //   filterOperators={filterOperators}
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
                    field="trailer_id"
                    sortable={true}
                    title="Trailer Id"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {window.innerHeight > window.innerWidth
                            ? "Trailer Id - "
                            : ""}
                          {e.dataItem.trailer_id}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="is_confirmation"
                    title="Trailer On Site"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {window.innerHeight > window.innerWidth
                            ? "Trailer On Site - "
                            : ""}
                          {e.dataItem.is_confirmation}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="status"
                    title="Status"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {window.innerHeight > window.innerWidth
                            ? "Status - "
                            : ""}
                          {e.dataItem.status}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="is_redflag"
                    title="RedTag"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {window.innerHeight > window.innerWidth
                            ? "RedTag - "
                            : ""}
                          {e.dataItem.is_redflag}
                        </td>
                      );
                    }}
                  />
                  <GridColumn
                    field="check_comments"
                    title="Comments"
                    width="150px"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          {window.innerHeight > window.innerWidth
                            ? "Comments - "
                            : ""}
                          {e.dataItem.check_comments}
                        </td>
                      );
                    }}
                  />
                  {terminalByIdData?.status?.toUpperCase() === "IN PROGRESS" ? (
                    <GridColumn title="Action" cell={Edityardcheck} />
                  ) : (
                    ""
                  )}
                </Grid>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            EDIT TRAILER
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <div>
              <label for="typeHeadEditStatus">
                <b>Status:</b> {dataForUpdate?.status}{" "}
              </label>
            </div>
            <div className="meterial_autocomplete">
              <label for="typeHeadAddStatus">Trailer On Site*</label>

              <Autocomplete
                id="combo-box-demo"
                options={dataForBoolean}
                getOptionLabel={(option) => `${option.is_confirmation}`}
                defaultValue={{
                  is_confirmation: dataForUpdate?.is_confirmation
                    ? dataForUpdate?.is_confirmation
                    : [""],
                }}
                onChange={confirmChangeHandlerForEdit}
                disabled={accessDisabled ? true : false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose Trailer On Site..."
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="meterial_autocomplete">
              {/* <label for="typeHeadAddStatus">RedTag</label> */}
              {editRedtagDisable ? <label for="typeHeadAddStatus">RedTag</label> : <label for="typeHeadAddStatus">RedTag*</label>}
              <Autocomplete
                id="combo-box-demo"
                options={dataForRedtag}
                getOptionLabel={(option) => `${option.redflag}`}
                defaultValue={{
                  redflag: dataForUpdate?.is_redflag
                    ? dataForUpdate?.is_redflag
                    : [""],
                }}
                onChange={redTagChangeHandlerForEdit}
                disabled={editRedtagDisable}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose RedTag..."
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="mt_10">
              {/* <label for="exampleEditFormControlTextarea1">Comments</label> */}
              {trailerDataForEdit.is_redflag == "Yes" ? <label for="typeHeadAddStatus">Comments*</label> : <label for="typeHeadAddStatus">Comments</label>}
              {/* {trailerDataForEdit.is_redflag === "Yes" ? (
                <textarea
                  className="form-control"
                  name="comments"
                  id="exampleEditFormControlTextarea1"
                  rows="3"
                  defaultValue={
                    dataForUpdate?.check_comments
                      ? dataForUpdate?.check_comments
                      : ""
                  }
                  onChange={(e) => commentsChangeHandlerForEdit(e)}
                  placeholder="Enter comments"
                />
              ) : (
                <textarea
                  className="form-control"
                  name="comments"
                  id="exampleEditFormControlTextarea1"
                  rows="3"
                  defaultValue={
                    dataForUpdate?.check_comments
                      ? dataForUpdate?.check_comments
                      : ""
                  }
                  onChange={(e) => commentsChangeHandlerForEdit(e)}
                  placeholder="Enter comments"
                  disabled
                />
              )} */}
              <textarea
                  className="form-control"
                  name="comments"
                  id="exampleEditFormControlTextarea1"
                  rows="3"
                  defaultValue={
                    dataForUpdate?.check_comments
                      ? dataForUpdate?.check_comments
                      : ""
                  }
                  onChange={(e) => commentsChangeHandlerForEdit(e)}
                  placeholder="Enter comments"
                  disabled={trailerDataForEdit.is_redflag == "Yes" ? false : true}
                />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setModalShow(false)}>Close</Button>
          <Button onClick={updateTrailerHandler}>Save</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={modalShowForAdd}
        onHide={() => setmodalShowForAdd(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            ADD TRAILER
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <div className="meterial_autocomplete">
              <label for="exampleFormControlInput1">Trailer</label>
              <Autocomplete
                id="combo-box-demo"
                options={allTrailers}
                getOptionLabel={(option) =>
                  `${option.trailer_id} : ${option.eqmodel} `
                }
                onChange={trailerChangeHandlerForAdd}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Trailer Id..."
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="meterial_autocomplete">
              <label for="typeHeadAddStatus">Status</label>
              {/* <Typeahead
                id="typeHeadAddStatus"
                labelKey="status"
                options={dataForStatus}
                placeholder="Choose status..."
                onChange={statusChangeHandlerForAdd}
              /> */}
              <Autocomplete
                id="combo-box-demo"
                options={dataForStatus}
                getOptionLabel={(option) => `${option.status}`}
                onChange={statusChangeHandlerForAdd}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose status..."
                    variant="outlined"
                  />
                )}
              />
            </div>

            <div className="meterial_autocomplete">
              <label for="typeHeadAddStatus">Trailer On Site</label>

              <Autocomplete
                id="combo-box-demo"
                options={dataForBoolean}
                getOptionLabel={(option) => `${option.is_confirmation}`}
                onChange={confirmChangeHandlerForAdd}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose Trailer On Site..."
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="meterial_autocomplete">
              <label for="typeHeadAddStatus">RedTag</label>

              <Autocomplete
                id="combo-box-demo"
                options={dataForRedtag}
                getOptionLabel={(option) => `${option.redflag}`}
                onChange={redTagChangeHandlerForAdd}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose RedTag..."
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="mt_10">
              <label for="exampleAddFormControlTextarea1">Comments</label>
              <textarea
                className="form-control"
                placeholder="Comments...."
                id="exampleAddFormControlTextarea1"
                rows="3"
                onChange={(e) => commentsChangeHandlerForAdd(e)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setmodalShowForAdd(false)}>Close</Button>
          <Button onClick={addTrailer}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* table for print */}

      <div className="yardprint table_hidden" ref={printTableRef}>
        <table>
          <thead>
            <tr>
              <td className="out_table">
                <div className="header-space">&nbsp;</div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="out_table">
                <div className="content">
                  <table ref={printTableRef}>
                    <tr>
                      <th width="12%" className="text-center">
                        Trailer Id
                      </th>
                      <th width="10%" className="text-center">
                        Status
                      </th>
                      <th width="12%" className="text-center">
                        On Site
                      </th>
                      <th width="10%" className="text-center">
                        RedTag
                      </th>
                      <th className="text-center">Comments</th>
                    </tr>
                    {yardCheckInformation.length > 0 ? (
                      <>
                        <>
                          {yardCheckInformation.map((item) => (
                            <tr>
                              <td className="text-center">{item.trailer_id}</td>

                              <td className="text-center">{item.status}</td>

                              <td className="text-center">
                                {/* {item.is_confirmation == null
              ? "Y / N"
              : item.is_confirmation
                ? "Y / N"
                : "Y / N"} */}

                                {item.is_confirmation === "Yes" ? (
                                  <>
                                    <span className="printable">Y</span>
                                    <span>/ N</span>
                                  </>
                                ) : item.is_confirmation === "No" ? (
                                  <>
                                    <span>Y/ </span>
                                    <span className="printable"> N</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Y </span>
                                    <span>/ N</span>
                                  </>
                                )}
                              </td>

                              <td className="text-center">
                                {/* {item.is_redflag == null
              ? "Y / N"
              : item.is_redflag
                ? "Y / N"
                : "Y / N"} */}
                                {/* {item.is_redflag == null ? "" : item.is_redflag} */}

                                {item.is_redflag === "Yes" ? (
                                  <>
                                    <span className="printable">Y</span>
                                    <span>/ N</span>
                                  </>
                                ) : item.is_redflag === "No" ? (
                                  <>
                                    <span>Y/ </span>
                                    <span className="printable"> N</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Y </span>
                                    <span>/ N</span>
                                  </>
                                )}
                              </td>

                              <td>{item.check_comments}</td>
                            </tr>
                          ))}
                        </>
                      </>
                    ) : (
                      ""
                    )}
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="out_table">
                <div className="footer-space">&nbsp;</div>
              </td>
            </tr>
          </tfoot>
        </table>

        <div class="header">
          <div className="print_pop_adjust">
            <div className="print_pop_adjust_header11">
              <p>{terminalById?.terminal_name}</p>
            </div>
            <div className="print_bottom_adjust_header">
              <p>Yard Check by: {terminalById?.username}</p>
              <p>
                Start Time:{" "}
                {DateTime.fromMillis(parseInt(terminalById?.startTs))
                  .toFormat("MM-dd-yyyy hh:mm")
                  .toString()}
              </p>
              <p>
                End Time:{" "}
                {terminalById?.status?.toUpperCase() === "IN PROGRESS"
                  ? ""
                  : DateTime.fromMillis(parseInt(terminalById?.endTs))
                      .toFormat("MM-dd-yyyy hh:mm")
                      .toString()}
              </p>
            </div>
          </div>
        </div>
        <div class="footer">...</div>

        {/* <>
          <div className="print_pop_adjust">
            <div className="print_pop_adjust_header11">
              <p>{terminalById?.terminal_name}</p>
            </div>
            <div className="print_bottom_adjust_header">
              <p>Yard Check by: {terminalById?.username}</p>
              <p>
                Start Time:{" "}
                {DateTime.fromMillis(parseInt(terminalById?.startTs))
                  .toFormat("MM-dd-yyyy hh:mm")
                  .toString()}
              </p>
              <p>
                End Time:{" "}
                {terminalById?.status?.toUpperCase() === "IN PROGRESS"
                  ? ""
                  : DateTime.fromMillis(parseInt(terminalById?.endTs))
                    .toFormat("MM-dd-yyyy hh:mm")
                    .toString()}
              </p>
            </div>
          </div>

        </> */}
      </div>
    </div>
  );
};

export default YardCheckList;
