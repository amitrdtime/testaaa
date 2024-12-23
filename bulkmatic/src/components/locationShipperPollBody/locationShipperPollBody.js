import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Typeahead } from "react-bootstrap-typeahead";
import CommoditygroupService from "../../services/commoditygroupService";
import LocationService from "../../services/locationService";
import {
  NotificationManager,
  NotificationContainer,
} from "react-notifications";

import { ContextData } from "../../components/appsession";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import ProgressBar from "react-bootstrap/ProgressBar";
import { DateTime } from "luxon";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DateFnsUtils from "@date-io/date-fns";

const LocationShipperPoolBody = (props) => {
  const [userData, setuserData] = useContext(ContextData);

  const planners = userData.roles?.map((e) => e.permissionAccess);
  const commodity = planners[0].filter(
    (element) => element.permission === "Locations"
  );
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });
  const [inViewModaldataState, setinViewModaldataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });
  const { locationById, accessDisabled } = props;
  const [searchtext, setSearchText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [allCGs, setallCG] = useState([]);
  const [seletedCG, setseletedCG] = useState({});

  const [allShipperPoolTrailers, setallShipperPoolTrailers] = useState([]);
  const [allShipperPool, setallShipperPool] = useState([]);
  const [showEditModal, setshowEditModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [showViewModal, setshowViewModal] = useState(false);
  const [editDisable, setEditDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [shipperPoolDetails, setshipperPoolDetails] = useState({});
  const [shipperForEdit, setshipperForEdit] = useState({});

  const [EffectiveDate, setEffectiveDate] = useState(null);
  const [ExpiryDate, setExpiryDate] = useState(null);

  const [dataResult, setDataResult] = useState(
    process(allShipperPool, dataState)
  );
  const [
    dataResultallShipperPoolTrailers,
    setdataResultallShipperPoolTrailers,
  ] = useState(false);

  const currentDate = new Date();

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const dateString =
    currentYear +
    "-" +
    ("0" + (currentMonth + 1)).slice(-2) +
    "-" +
    ("0" + currentDayOfMonth).slice(-2);

  const dataStateChange = (event) => {
    setDataResult(process(allShipperPool, event.dataState));
    setDataState(event.dataState);
  };

  const inviewModaldataStateChange = (event) => {
    setdataResultallShipperPoolTrailers(
      process(allShipperPoolTrailers, event.dataState)
    );
    setinViewModaldataState(event.dataState);
  };

  const showTrailersInPool = async (e) => {
    console.log(e.id);
    //API Call For Shipper Pool
    const locationService = new LocationService();
    let allShipperPoolTrailers = await locationService.getShipperPoolsById(
      e.id
    );
    if (allShipperPoolTrailers.length > 0) {
      setallShipperPoolTrailers(allShipperPoolTrailers);
      setdataResultallShipperPoolTrailers(
        process(allShipperPoolTrailers, dataState)
      );
      setshowViewModal(true);
    }
  };

  useEffect(() => {
    setDataResult(process(allShipperPool, dataState));
  }, [allShipperPool]);

  //   const searchInputHandler = (e) => {
  //     setSearchText(e.target.value);
  //   };

  //   const handleKeyPress = (e) => {
  //     if (e.key === "Enter") {
  //       searchHandler();
  //     }
  //   };
  //   const searchHandler = async (e) => {
  //     // console.log("search", )
  //   };

  useEffect(async () => {
    const locationService = new LocationService();
    try {
      const allShipperPools = await locationService.getShipperPoolByLocationID(
        locationById.id.toString(),
        searchtext
      );
      if (allShipperPools.length > 0) {
        let newDataValue = [];
        for (let index = 0; index < allShipperPools.length; index++) {
          const temp = allShipperPools[index];
          temp.effective_date_utc = DateTime.fromMillis(
            parseInt(temp.effective_date_utc * 1000)
          )
            .toFormat("MM-dd-yyyy")
            .toString();
          if (temp.expiration_date_utc === null) {
             temp.expiration_date_utc = "";
          } else {
            temp.expiration_date_utc = DateTime.fromMillis(
              parseInt(temp.expiration_date_utc * 1000)
            )
              .toFormat("MM-dd-yyyy")
              .toString();
          }
          newDataValue.push(temp);
        }
        setallShipperPool(newDataValue);
        props.parentCallBackFromShipperPoll(newDataValue);
      }
    } catch (error) {
      NotificationManager.error("Network Error", "Error");
    }
  }, []);

  const getAllCGs = async () => {
    const cgService = new CommoditygroupService();
    const allCgs = await cgService.getAllCommodityGroups();
    setallCG(allCgs);
  };

  useEffect(() => {
    getAllCGs();
  }, []);

  const commodityGroupIdHandler = (e, value) => {
    if (value) {
      setseletedCG(value);
      setshipperPoolDetails((item) => ({
        ...item,
        commodityid: value.code,
        locationid: locationById.id.toString(),
      }));
    }
  };

  const captureTargetCount = function (value) {
    setshipperPoolDetails((item) => ({
      ...item,
      targetcount: value,
    }));
  };

  const captureEffectiveDate = function (value) {
    setshipperPoolDetails((item) => ({
      ...item,
      effectivedate: value,
    }));
  };

  const captureExpiryDate = function (value) {
    console.log(value);
    setshipperPoolDetails((item) => ({
      ...item,
      expirationdate: value,
    }));
  };
  const dateFormator = (date) => {
    return (
      date.getDate() +
      "-" +
      date.toLocaleString("default", { month: "short" }) +
      "-" +
      date.getFullYear()
    );
  };
  const editShipperPool = (shipper) => {
    setshipperForEdit(shipper);

    setshowEditModal(true);
    setEditDisable(true);
  };

  const captureExpiryDateForEdit = (value) => {
    if (value) {
      setshipperForEdit((item) => ({
        ...item,
        expiration_date: value,
      }));
    }
  };

  const captureEffectiveDateForEdit = (value) => {
    setshipperForEdit((item) => ({
      ...item,
      effectivedate: value,
    }));
  };
  const commodityGroupIdHandlerForEdit = (value) => {
    if (value[0]) {
      setseletedCG(value[0]);
      setshipperForEdit((item) => ({
        ...item,
        commodityid: value[0].code,
        locationid: locationById.id.toString(),
      }));
    }
  };

  const captureTargetCountForEdit = (value) => {
    if (value) {
      setshipperForEdit((item) => ({
        ...item,
        targetcount: value,
      }));
    }
  };

  const createShipperPool = async () => {
    const locationService = new LocationService();
    try {
      const effectivedate = DateTime.fromJSDate(EffectiveDate)
        .startOf("day")
        .toUTC()
        .toMillis();
      const expirationdate = DateTime.fromJSDate(ExpiryDate)
        .startOf("day")
        .toUTC()
        .toMillis();

      let payload = {
        commodityid: shipperPoolDetails.commodityid,
        effectivedate: effectivedate,
        expirationdate: expirationdate,
        locationid: shipperPoolDetails.locationid,
        targetcount: shipperPoolDetails.targetcount,
      };
      if(effectivedate > expirationdate){
        return toast.error("Expiration Date can't be before Effective Date", "Error");
      }
      if (
        !payload.commodityid ||
        !payload.effectivedate ||
        !payload.locationid ||
        !payload.targetcount
      ) {
        return toast.error("Please fill all required fields", "Error");
      }

      const shipperPools = await locationService.createShipperPool(payload);
      if (shipperPools.length > 0) {
        // const allShipperPools =
        //   await locationService.getShipperPoolByLocationID(
        //     locationById.id.toString(),
        //     searchtext
        //   );
        let newDataValue = [];
        for (let index = 0; index < shipperPools.length; index++) {
          const temp = shipperPools[index];
          temp.effective_date_utc = DateTime.fromMillis(
            parseInt(temp.effective_date_utc * 1000)
          )
            .toFormat("MM-dd-yyyy")
            .toString();
          if (temp.expiration_date_utc === null) {
            temp.expiration_date_utc = "";
          } else {
            temp.expiration_date_utc = DateTime.fromMillis(
              parseInt(temp.expiration_date_utc * 1000)
            )
              .toFormat("MM-dd-yyyy")
              .toString();
          }
          newDataValue.push(temp);
        }
        setallShipperPool(newDataValue);
        props.parentCallBackFromShipperPoll(newDataValue);
        setModalShow(false);
        setEffectiveDate(null);
        setExpiryDate(null);
      }
      return toast.success("Shipper Pool Added successfully", "Success");
    } catch (error) {
      toast.error("Shipper Pool  not Added successfully", "Error");
    }
  };

  const saveShipperPool = async () => {
    try {
      let effectivedate = Date.parse(shipperForEdit.effective_date_utc);
      let expirationdate = Date.parse(shipperForEdit.expiration_date_utc);
      //   const effectivedate = DateTime.fromJSDate(EffectiveDate)
      //   .startOf("day")
      //   .toUTC()
      //   .toMillis();
      // const expirationdate = DateTime.fromJSDate(ExpiryDate)
      //   .startOf("day")
      //   .toUTC()
      //   .toMillis();
      if(effectivedate > expirationdate){
        return toast.error("Expiration Date can't be before Effective Date", "Error");
      }
      let payLoad = {
        id: shipperForEdit.id,
        locationid: shipperForEdit.location_id,
        commodityid: shipperForEdit.commoditygroup_id,

        effectivedate: effectivedate,
        expirationdate: expirationdate,
        targetcount: shipperForEdit.targetcount,
      };

      const locationService = new LocationService();
      const shipperPools = await locationService.saveShipperPool(payLoad);

      if (shipperPools.length > 0) {
        // const allShipperPools =
        //   await locationService.getShipperPoolByLocationID(
        //     locationById.id.toString(),
        //     searchtext
        //   );
        let newDataValue = [];
        for (let index = 0; index < shipperPools.length; index++) {
          const temp = shipperPools[index];
          temp.effective_date_utc = DateTime.fromMillis(
            parseInt(temp.effective_date_utc * 1000)
          )
            .toFormat("MM-dd-yyyy")
            .toString();
          if (temp.expiration_date_utc === null) {
            temp.expiration_date_utc = "";
          }else{
            temp.expiration_date_utc = DateTime.fromMillis(
              parseInt(temp.expiration_date_utc * 1000)
            )
              .toFormat("MM-dd-yyyy")
              .toString();
          }
          newDataValue.push(temp);
        }
        setallShipperPool(newDataValue);
        props.parentCallBackFromShipperPoll(newDataValue);
        setshowEditModal(false);
      }

      return toast.success("Shipper Pool Updated successfully", "Success");
    } catch (error) {
      console.log(error);
      return toast.error("Shipper Pool not Updated", "Error");
    }
  };

  const openDeleteShipperPoolModal = (shipper) => {
    setshipperForEdit(shipper);
    setshowDeleteModal(true);
  };

  const deleteShipperPool = async () => {
    try {
      const locationService = new LocationService();

      let payload = {
        id: shipperForEdit.id,
      };

      const shipperPoolsDeleteResponse =
        await locationService.deleteShipperPool(payload);

      if (shipperPoolsDeleteResponse) {
        const allShipperPools =
          await locationService.getShipperPoolByLocationID(
            locationById.id.toString(),
            searchtext
          );
        let newDataValue = [];
        for (let index = 0; index < allShipperPools.length; index++) {
          const temp = allShipperPools[index];
          temp.effective_date_utc = DateTime.fromMillis(
            parseInt(temp.effective_date_utc * 1000)
          )
            .toFormat("MM-dd-yyyy")
            .toString();
          if (temp.expiration_date_utc === null) {
            temp.expiration_date_utc = "";
          }else{
            temp.expiration_date_utc = DateTime.fromMillis(
              parseInt(temp.expiration_date_utc * 1000)
            )
              .toFormat("MM-dd-yyyy")
              .toString();
          }  
          newDataValue.push(temp);
        }
        setallShipperPool(newDataValue);
        props.parentCallBackFromShipperPoll(newDataValue);
        setshowDeleteModal(false);
      }
      return toast.success("Shipper Pool Deleted successfully", "Success");
    } catch (error) {
      return toast.error("Shipper Pool Not Deleted", "Error");
    }
  };
  //   const effDateTimeValue = (props) => {
  //     // console.log("date time shipper",props.dataItem)
  //     let effDate = Date.parse(props.dataItem.effective_date);
  //     return (
  //       <td>
  //         {DateTime.fromMillis(parseInt(effDate))
  //           .toFormat("MM-dd-yyyy")
  //           .toString()}
  //       </td>
  //     );
  //   };
  //   const expDateTimeValue = (props) => {
  //     let expDate = Date.parse(props.dataItem.expiration_date);
  //     return (
  //       <td>
  //         {DateTime.fromMillis(parseInt(expDate))
  //           .toFormat("MM-dd-yyyy")
  //           .toString()}
  //       </td>
  //     );
  //   };

  const Editdeleteshipperpool = (props) => {
    return (
      <td className="adjustbutton">
        <button
          type="button"
          class="btn_blue_smadjust btn-blue ml_10"
          onClick={() => editShipperPool(props.dataItem)}
          disabled={accessDisabled ? true : false}
          style={{background: accessDisabled ? "#dddddd" : ""}}
        >
          <i class="fa fa-pencil mr_5 del_icon" aria-hidden="true"></i>
          EDIT
        </button>
        <button
          type="button"
          class="btn_blue_smadjust btn-blue ml_10"
          onClick={() => openDeleteShipperPoolModal(props.dataItem)}
          disabled={accessDisabled ? true : false}
          style={{background: accessDisabled ? "#dddddd" : ""}}
        >
          <i class="fa fa fa-trash mr_5 del_icon" aria-hidden="true"></i>
          DELETE
        </button>
      </td>
    );
  };
  const EditDeleteShipperPool = (props) => (
    <Editdeleteshipperpool
      {...props}
      deleteShipperPool={deleteShipperPool}
      editShipperPool={editShipperPool}
    />
  );

  const handleDateChangeEffectiveDate = (date) => {
    setEffectiveDate(date);
  };

  const handleDateChangeExpiryDate = (date) => {
    setExpiryDate(date);
  };

  function handleDateChangeEffectiveDateForEditChange(value) {
    setshipperForEdit((prevState) => ({
      ...prevState,
      effective_date_utc: value,
    }));
  }

  function handleDateChangeExpiryDateForEditChange(value) {
    setshipperForEdit((prevState) => ({
      ...prevState,
      expiration_date_utc: value,
    }));
  }

  function handleCloseCreate() {
    setModalShow(false);
    setEffectiveDate(null);
    setExpiryDate(null);
  }

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="row mt_30">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body">
              <div className="table_header_section">
                <div>
                  <h2 className="header-title1">
                    Shipper Pool: {allShipperPool?.length}
                  </h2>
                </div>
                <div className="df">
                  <button
                    type="button"
                    className="btn_blue btn-blue"
                    onClick={() => setModalShow(true)}
                    disabled={accessDisabled ? true : false}
                    style={{background: accessDisabled ? "#dddddd" : ""}}
                  >
                    ADD
                  </button>
                </div>
              </div>
              {allShipperPool?.length > 0 ? (
                <Grid
                  filter={dataState.filter}
                  filterable={true}
                  sort={dataState.sort}
                  sortable={true}
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
                  onRowClick={(e) => showTrailersInPool(e.dataItem)}
                >
                  <GridColumn title="Action" cell={EditDeleteShipperPool} />
                  <GridColumn
                    field="commoditygroup_id"
                    title="CommodityGroup"
                  />
                  <GridColumn field="target_count" title="Target Count" />
                  <GridColumn
                    field="effective_date_utc"
                    title="Effective Date"
                  />
                  <GridColumn
                    field="expiration_date_utc"
                    title="Expiration Date"
                  />
                </Grid>
              ) : loading ? (
                <div>
                  <ProgressBar animated now={100} />
                  <div className="middle loader--text1"> </div>
                </div>
              ) : (
                <div>No data found</div>
              )}
            </div>
          </div>
        </div>
        {/* Modal For Add */}
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              ADD SHIPPER POOL
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div class="form-group">
              <label for="typeHeadCommodityGroup">Commodity Group *</label>
              <div className="meterial_autocomplete">
                <Autocomplete
                  id="combo-box-demo"
                  options={allCGs}
                  getOptionLabel={(option) =>
                    `${option.code} : ${option.description}`
                  }
                  onChange={commodityGroupIdHandler}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Choose a Commodity Group..."
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <label for="txtTargetCount">Target Count *</label>
              <input
                name="count"
                type="number"
                class="form-control label_padding"
                id="txtTargetCount"
                onInput={(event) => captureTargetCount(event.target.value)}
                placeholder="e.g. 10"
              />
              <label for="txtEffectiveDate">Effective Date *</label>
              <div className="meterial_autocomplete">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    format="MM-dd-yyyy"
                    id="date-picker-inline"
                    fullWidth="true"
                    minDate={dateString}
                    error={false}
                    helperText={null}
                    inputVariant="outlined"
                    value={EffectiveDate}
                    placeholder="MM-dd-yyyy"
                    onChange={handleDateChangeEffectiveDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <label for="txtExpiryDate">Expiration Date</label>
              <div className="meterial_autocomplete">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    format="MM-dd-yyyy"
                    id="date-picker-inline"
                    fullWidth="true"
                    inputVariant="outlined"
                    value={ExpiryDate}
                    minDate={dateString}
                    error={false}
                    helperText={null}
                    placeholder="MM-dd-yyyy"
                    onChange={handleDateChangeExpiryDate}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseCreate}>Close</Button>
            <Button type="submit" onClick={(e) => createShipperPool(e)}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* modal for edit */}
        <Modal
          show={showEditModal}
          onHide={() => setshowEditModal(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit SHIPPER POOL
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="form-group">
              <label for="typeHeadCommodityGroup">Commodity Group *</label>
              <div className="meterial_autocomplete">
                <Typeahead
                  id="typeHeadCommodityGroup"
                  //labelKey="id"
                  onChange={commodityGroupIdHandlerForEdit}
                  disabled={editDisable}
                  options={allCGs}
                  labelKey={(option) => `${option.code}`}
                  defaultSelected={
                    shipperForEdit.commoditygroup_id
                      ? [{ code: shipperForEdit.commoditygroup_id }]
                      : []
                  }
                  // defaultSelected={
                  //   shipperForEdit.commoditygroup_id
                  //     ? [{ code: shipperForEdit.commoditygroup_id }]
                  //     : []
                  // }

                  placeholder="Choose a Commodity..."
                  clearButton
                />
              </div>

              <label for="txtTargetCount">Target Count *</label>
              <div className="meterial_autocomplete">
                <input
                  type="number"
                  class="form-control"
                  id="txtTargetCount"
                  onInput={(event) =>
                    captureTargetCountForEdit(event.target.value)
                  }
                  placeholder="e.g. 10"
                  defaultValue={shipperForEdit.target_count}
                  disabled={editDisable}
                />
              </div>

              <label for="txtEffectiveDate">Effective Date *</label>
              <div className="meterial_autocomplete">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    format="MM-dd-yyyy"
                    id="date-picker-inline"
                    fullWidth="true"
                    minDate={dateString}
                    inputVariant="outlined"
                    variant="outlined"
                    disabled={true}
                    value={shipperForEdit.effective_date_utc}
                    error={false}
                    helperText={null}
                    placeholder="MM-dd-yyyy"
                    onChange={handleDateChangeEffectiveDateForEditChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>

              <label for="txtExpiryDate">Expiration Date</label>
              <div className="meterial_autocomplete">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    format="MM-dd-yyyy"
                    id="date-picker-inline"
                    fullWidth="true"
                    variant="outlined"
                    inputVariant="outlined"
                    value={shipperForEdit.expiration_date_utc}
                    error={false}
                    helperText={null}
                    minDate={dateString}
                    placeholder="MM-dd-yyyy"
                    onChange={handleDateChangeExpiryDateForEditChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => setshowEditModal(false)}>Close</Button>
            <Button onClick={(e) => saveShipperPool(e)}>Save</Button>
          </Modal.Footer>
        </Modal>

        {/* modal for Delete */}
        <Modal
          show={showDeleteModal}
          onHide={() => setshowDeleteModal(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Delete Shipper Pool
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="form-group">
              <p>
                Are you sure you want to Delete target count{" "}
                {shipperForEdit.target_count} ?
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => setshowDeleteModal(false)}>Close</Button>
            <Button onClick={(e) => deleteShipperPool(e)}>Delete</Button>
          </Modal.Footer>
        </Modal>

        {/* modal for View */}
        <Modal
          show={showViewModal}
          size="lg"
          onHide={() => setshowViewModal(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Trailers In the Pool
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {allShipperPoolTrailers?.length > 0 ? (
              <Grid
                filter={inViewModaldataState.filter}
                filterable={true}
                sort={inViewModaldataState.sort}
                sortable={true}
                pageable={{
                  buttonCount: 10,
                  info: true,
                  previousNext: true,
                  pageSizes: true,
                }}
                resizable={true}
                skip={inViewModaldataState.skip}
                take={inViewModaldataState.take}
                data={dataResultallShipperPoolTrailers}
                onDataStateChange={inviewModaldataStateChange}
              >
                <GridColumn field="trailer_id" title="Trailer ID" />
                <GridColumn field="type" title="Type" />
                <GridColumn field="last_move_order" title="Last Move / Order" />
                <GridColumn field="current_status" title="Current Status" />
                <GridColumn field="current_location" title="Current Location" />
              </Grid>
            ) : loading ? (
              <div>
                <ProgressBar animated now={100} />
                <div className="middle loader--text1"> </div>
              </div>
            ) : (
              <div>No data found</div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => setshowViewModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default LocationShipperPoolBody;
