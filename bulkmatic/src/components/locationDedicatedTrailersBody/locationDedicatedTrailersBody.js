import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import LocationService from "../../services/locationService";
import CommoditygroupService from "../../services/commoditygroupService";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Formik, Form } from "formik";
import * as yup from "yup";

import ProgressBar from "react-bootstrap/ProgressBar";
import { ContextData } from "../../components/appsession";
import { DateTime } from "luxon";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";

import { Grid, GridColumn } from "@progress/kendo-react-grid";

import { process } from "@progress/kendo-data-query";

// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import DateFnsUtils from "@date-io/date-fns";

const LocationDedicatedTrailersBody = (props) => {
  const [userData, setuserData] = useContext(ContextData);
  const { locationById, accessDisabled } = props;
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

  const [modalShow, setModalShow] = useState(false);

  const [allCGs, setallCG] = useState([]);
  const [seletedCG, setseletedCG] = useState({});

  const [allDedicatedTrailers, setallDedicatedTrailers] = useState([]);

  const [allTrailers, setallTrailers] = useState([]);
  const [seletedTrailer, setseletedTrailer] = useState({});

  const [shipperPools, setshipperPools] = useState({});
  const [showDeleteModal, setshowDeleteModal] = useState(false);

  const [showEditModal, setshowEditModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [trailerForEdit, settrailerForEdit] = useState({});
  const [dedicatedTrailerDetails, setdedicatedTrailerDetails] = useState({});

  const [EffectiveDate, setEffectiveDate] = useState(null);
  const [ExpiryDate, setExpiryDate] = useState(null);

  const [dataResult, setDataResult] = useState(
    process(allDedicatedTrailers, dataState)
  );

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

  const searchHandler = async (e) => {
    await getallDedicatedTrailer();
  };

  const dataStateChange = (event) => {
    setDataResult(process(allDedicatedTrailers, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allDedicatedTrailers, dataState));
  }, [allDedicatedTrailers]);

  const handleDateChangeEffectiveDate = (date) => {
    setEffectiveDate(date);
  };
  const handleDateChangeExpiryDate = (date) => {
    setExpiryDate(date);
  };

  const addDedicatedTrailers = async () => {
    const locationService = new LocationService();
    const effectivedate = DateTime.fromJSDate(EffectiveDate)
      .startOf("day")
      .toUTC()
      .toMillis();
    const expirationdate = DateTime.fromJSDate(ExpiryDate)
      .startOf("day")
      .toUTC()
      .toMillis();
    if(effectivedate > expirationdate){
      return toast.error("Expiration Date can't be before Effective Date", "Error");
    }
    if (
      !seletedCG.code ||
      !dedicatedTrailerDetails.locationid ||
      !dedicatedTrailerDetails.trailerid ||
      !effectivedate
    ) {
      return toast.error("Please fill all required fields", "Error");
    }
    const payload = {
      commodityid: seletedCG.code,
      locationid: dedicatedTrailerDetails.locationid,
      trailerid: dedicatedTrailerDetails.trailerid,
      effectivedate: effectivedate,
      expirationdate: expirationdate,
    };
    try {
      const dts = await locationService.addDedicatedTrailer(payload);
      const allDTs = await locationService.getDedicatedTrailersByLocationID(
        locationById.id.toString()
      );
      if (dts.length > 0) {
        let newDataValue = [];
        for (let index = 0; index < allDTs.length; index++) {
          const temp = allDTs[index];
          temp.effective_date_utc = DateTime.fromMillis(
            parseInt(temp.effective_date_utc * 1000)
          )
            .toFormat("MM-dd-yyyy")
            .toString();
          if (temp.expiration_date_utc === 0) {
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
        setallDedicatedTrailers(newDataValue);
        props.parentCallBackFromLocationBodyForDedicatedTrailer(newDataValue);
       
        setModalShow(false);
        setEffectiveDate(null);
        setExpiryDate(null);
      }
      return toast.success(
        "Dedicated Trailer is  Added",
        "success"
      );
    } catch (error) {
      toast.error("This trailer has already been dedicated for these dates", "Error");
    }
  };

  const initalValue = {
    commodity: "",
    effDate: "",
    expDate: "",
    trailer: "",
  };
  const initalValueForEdit = {
    commodity: trailerForEdit.CommodityGroup ?? "",
    effDate: trailerForEdit.EffectiveDate ?? null,
    expDate: trailerForEdit.expiration_date ?? null,
    trailer: trailerForEdit.trailerid ?? "",
  };
  const validation = yup.object().shape({
    effDate: yup.date().nullable().required("Effective date is required"),
    expDate: yup
      .date()
      .min(yup.ref("effDate"), "Expiration date can't be before Effective date")
      .required("Expiration date is required"),
  });

  const saveDedicatedTrailers = async () => {
    const locationService = new LocationService();
    let effective = new Date(trailerForEdit.effective_date_utc).getTime();

    // var effectivedate = DateTime.fromJSDate(trailerForEdit.effective_date_utc)
    //   .startOf("day")
    //   .toUTC()
    //   .toMillis();

    var expirationdate = DateTime.fromJSDate(trailerForEdit.expiration_date_utc)
      .startOf("day")
      .toUTC()
      .toMillis();
      if(effective > expirationdate){
        return toast.error("Expiration Date can't be before Effective Date", "Error");
      }
    let payload = {
      id: trailerForEdit.dedicatedtrailer_id,
      trailerid: trailerForEdit.trailer_id,
      effectivedate: effective,
      expirationdate: expirationdate,
    };
    try {
      const dts = await locationService.saveDedicatedTrailer(payload);
      if (dts.length > 0) {
        const allDTs = await locationService.getDedicatedTrailersByLocationID(
          locationById.id.toString()
        );
        let newDataValue = [];
        for (let index = 0; index < allDTs.length; index++) {
          const temp = allDTs[index];
          temp.effective_date_utc = DateTime.fromMillis(
            parseInt(temp.effective_date_utc * 1000)
          )
            .toFormat("MM-dd-yyyy")
            .toString();
          if (temp.expiration_date_utc === 0) {
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
        setallDedicatedTrailers(newDataValue);
        props.parentCallBackFromLocationBodyForDedicatedTrailer(newDataValue);
        setshowEditModal(false);
      }
      return toast.success(
        "Dedicated Trailer not Updated",
        "success"
      );
    } catch (error) {
      return toast.error(
        "Dedicated Trailer not Updated",
        "Error"
      );
    }
  };

  const removeDedicatedTrailer = async () => {
    const locationService = new LocationService();
    try {
      let payload = {
        id: trailerForEdit.dedicatedtrailer_id,
      };
      const removeRes = await locationService.removeDedicatedTrailer(payload);
      if (removeRes === 1) {
        const locationService = new LocationService();
        const allDTs = await locationService.getDedicatedTrailersByLocationID(
          locationById.id.toString()
        );
        let newDataValue = [];
        for (let index = 0; index < allDTs.length; index++) {
          const temp = allDTs[index];
          temp.effective_date_utc = DateTime.fromMillis(
            parseInt(temp.effective_date_utc * 1000)
          )
            .toFormat("MM-dd-yyyy")
            .toString();
          if (temp.expiration_date_utc === 0) {
            temp.expiration_date_utc = "";
          } else {
            temp.expiration_date_utc = DateTime.fromMillis(
              parseInt(temp.expiration_date_utc * 1000 || "NO DATA")
            )
              .toFormat("MM-dd-yyyy")
              .toString();
          }
          newDataValue.push(temp);
        }
        setallDedicatedTrailers(newDataValue);
        props.parentCallBackFromLocationBodyForDedicatedTrailer(newDataValue);
        setshowDeleteModal(false);     
      }
      
      return toast.success(
        "Dedicated Trailer is  deleted",
        "success"
      );
    
    } catch (error) {
      return toast.error(
        "Dedicated Trailer is not deleted",
        "Error"
      );
    }
  };

  const getallDedicatedTrailer = async () => {
    const locationService = new LocationService();
    try {
      const allDTs = await locationService.getDedicatedTrailersByLocationID(
        locationById.id.toString()
      );
      if (allDTs.length > 0) {
        let newDataValue = [];
        for (let index = 0; index < allDTs.length; index++) {
          const temp = allDTs[index];
          temp.effective_date_utc = DateTime.fromMillis(
            parseInt(temp.effective_date_utc * 1000)
          )
            .toFormat("MM-dd-yyyy")
            .toString();
          if (temp.expiration_date_utc === 0) {
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
        setallDedicatedTrailers(newDataValue);
        props.parentCallBackFromLocationBodyForDedicatedTrailer(newDataValue);
      }
    } catch (error) {
      NotificationManager.error("No Dedicated Trailer Found", "Error");
    }
  };

  useEffect(() => {
    setLoading(true);
    getallDedicatedTrailer();
    getAllCGs();
    setLoading(false);
  }, []);

  const getAllCGs = async () => {
    const cgService = new CommoditygroupService();
    const allCgs = await cgService.getAllCommodityGroups();

    setallCG(allCgs);
  };

  const getAllTrailers = async (cgId) => {
    const cgService = new CommoditygroupService();
    const alltrailers = await cgService.getAllTrailerByCommodityGroupId(
      cgId,
      ""
    );

    setallTrailers(alltrailers);
  };

  const getAllShipperPools = async (cgId) => {
    const shippers = locationById.shipperpoolid.filter((it) => it.cg === cgId);

    setshipperPools(shippers);
  };

  // const commodityGroupIdHandler = (value) => {
  //   if (value) {
  //     setseletedCG(value);
  //     setdedicatedTrailerDetails((item) => ({
  //       ...item,
  //       // commodityid: value[0].code,
  //       locationid: locationById.id.toString(),
  //     }));

  //     getAllTrailers(value.code).then(function () {});

  //     getAllShipperPools(value.code).then(function () {});
  //   }
  // };

  const commodityGroupIdHandler = (e, value) => {
    if (value) {
      setseletedCG(value);
      setdedicatedTrailerDetails((item) => ({
        ...item,
        locationid: locationById.id.toString(),
      }));
      getAllTrailers(value.code).then(function () { });
    }
  };

  const trailerIdIdHandler = (e, value) => {
    if (value) {
      setseletedTrailer(value);
      setdedicatedTrailerDetails((item) => ({
        ...item,
        trailerid: value.trailer_id,
      }));
    }
  };

  // const shipperpoolIdIdHandler = (value) => {
  //   if (value[0]) {
  //     setseletedShipperPool(value[0]);
  //     setdedicatedTrailerDetails((item) => ({
  //       ...item,
  //       shipperpoolid: value[0].poolid,
  //     }));
  //   }
  // };

  //   const dateFormatter = date => {
  //    var today = date;
  //    var dd = String(today?.getDate()).padStart(2, '0');
  //    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //    var yyyy = today.getFullYear();

  //    today = yyyy + '-' + mm + '-' + dd;
  //    console.log("Today",today);
  //    return today;
  //  }

  // const captureEffectiveDate = function (value) {
  //   // setdedicatedTrailerDetails((item) => ({
  //   //   ...item,
  //   //   effectivedate: value,
  //   // }));
  //   setEffDate(value);
  // };

  // const captureExpiryDate = function (value) {
  //   // setdedicatedTrailerDetails((item) => ({
  //   //   ...item,
  //   //   expirationdate: value,
  //   // }));
  //   setExpDate(value);
  // };
  // const dateFormator = (date) => {
  //   return (
  //     date.getDate() +
  //     "-" +
  //     date.toLocaleString("default", { month: "short" }) +
  //     "-" +
  //     date.getFullYear()
  //   );
  // };

  const editDedicatedTrailers = (trailer) => {
    getAllShipperPools(trailer.CommodityGroup);

    setshowEditModal(true);
    settrailerForEdit(trailer);
    getAllTrailers(trailer.CommodityGroup);
  };

  // const formatDate = (date) => {
  //   var d = new Date(date),
  //     month = "" + (d.getMonth() + 1),
  //     day = "" + d.getDate(),
  //     year = d.getFullYear();

  //   if (month.length < 2) month = "0" + month;
  //   if (day.length < 2) day = "0" + day;

  //   return [month, day, year].join("-");
  // };

  const commodityGroupIdHandlerForEdit = (e, value) => {
    if (value.length > 0) {
      settrailerForEdit((item) => ({
        ...item,
        cgId: value.code,
        locationid: locationById.id.toString(),
      }));

      getAllTrailers(value.code);
      getAllShipperPools(value.code).then(function () { });
    } else {
      settrailerForEdit((item) => ({
        ...item,
        cgId: "",
      }));
      getAllTrailers("");
      const shippers = locationById.shipperpoolid;
      setshipperPools(shippers);
    }
  };

  const trailerIdIdHandlerEdit = (e, value) => {
    settrailerForEdit((item) => ({
      ...item,
      trailerid: value.id,
    }));
  };

  // const shipperpoolIdIdHandlerEdit = (value) => {
  //   if (value[0]) {
  //     settrailerForEdit((item) => ({
  //       ...item,
  //       shipperpoolid: value[0].poolid,
  //     }));
  //   }
  // };
  // const captureEffectiveDateEdit = function (value) {
  //   settrailerForEdit((item) => ({
  //     ...item,
  //     EffectiveDate: value,
  //   }));
  //   // setEffDateEdit(value)
  // };

  // const captureExpiryDateEdit = function (value) {
  //   settrailerForEdit((item) => ({
  //     ...item,
  //     ExpirationDate: value,
  //   }));
  //   setExpDateEdit(value);
  // };

  function handleDateChangeEffectiveDateForEditChange(value) {
    settrailerForEdit((prevState) => ({
      ...prevState,
      effective_date_utc: value,
    }));
  }

  function handleDateChangeExpiryDateForEditChange(value) {
    settrailerForEdit((prevState) => ({
      ...prevState,
      expiration_date_utc: value,
    }));
  }

  function handleShowModalclose() {
    setModalShow(false);
    setEffectiveDate(null);
    setExpiryDate(null);
  }

  function openDeleteTrailerModal(trailer) {
    settrailerForEdit(trailer);
    setshowDeleteModal(true);
  }

  const Editdeletededicatedtrailers = (props) => {
    return (
      <td className="adjustbutton">
        <button
            type="button"
            class="btn_blue_smadjust btn-blue ml_10"
            onClick={() => props.editDedicatedTrailers(props.dataItem)}
            disabled={accessDisabled ? true : false}
            style={{background: accessDisabled ? "#dddddd" : ""}}
          >
            <i class="fa fa-pencil mr_5 del_icon" aria-hidden="true"></i>
            EDIT
          </button>
          <button
            type="button"
            class="btn_blue_smadjust btn-blue ml_10"
            onClick={() => props.openDeleteTrailerModal(props.dataItem)}
            disabled={accessDisabled ? true : false}
            style={{background: accessDisabled ? "#dddddd" : ""}}
          >
            <i class="fa fa fa-trash mr_5 del_icon" aria-hidden="true"></i>
            DELETE
          </button>
      </td>
    );
  };

  const EditDeleteDedicatedTrailer = (props) => (
    <Editdeletededicatedtrailers
      {...props}
      openDeleteTrailerModal={openDeleteTrailerModal}
      editDedicatedTrailers={editDedicatedTrailers}
    />
  );
  // const EffdateTimeValue = (props) => {
  //   // console.log("date time dedi",props.dataItem)
  //   let date = Date.parse(props.dataItem.EffectiveDate);
  //   return (
  //     <td>
  //       {DateTime.fromMillis(parseInt(date)).toFormat("MM-dd-yyyy").toString()}
  //     </td>
  //   );
  // };
  // const ExpdateTimeValue = (props) => {
  //   // console.log("date time dedi",props.dataItem)
  //   let date = Date.parse(props.dataItem.expiration_date);
  //   return (
  //     <td>
  //       {DateTime.fromMillis(parseInt(date)).toFormat("MM-dd-yyyy").toString()}
  //     </td>
  //   );
  // };
  // const convertDateTime = (epoch_date) => {
  //   return (
  //     <td>
  //       {DateTime.fromMillis(parseInt(epoch_date * 1000))
  //         .toFormat("MM-dd-yyyy ")
  //         .toString()}
  //     </td>
  //   );
  // };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <div className="row mt_30">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body">
              <div className="table-responsive">
                <div className="button-right">
                  <div>
                    <h2 className="header-title1">
                      Total Dedicated Trailers: {allDedicatedTrailers?.length}
                    </h2>
                  </div>
                  <div className="addbutton">
                    {/* {commodity[0].isEdit ? (
                      <button
                        type="button"
                        className="btn_blue btn-blue mr_10 mb-20 "
                        onClick={() => setModalShow(true)}
                      >
                        ADD
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn_blue btn-blue mr_10 mb-20 "
                        disabled
                      >
                        ADD
                      </button>
                    )} */}
                    <button
                        type="button"
                        className="btn_blue btn-blue mr_10 mb-20 "
                        onClick={() => setModalShow(true)}
                        // disabled={accessDisabled ? true : false}
                        style={{background : accessDisabled ? "#dddddd" : ""}}
                      >
                        ADD
                      </button>
                  </div>
                </div>
                {allDedicatedTrailers?.length > 0 ? (
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
                      title="Action"
                      width="200px"
                      cell={EditDeleteDedicatedTrailer}
                      filterable={false}
                    />
                    <GridColumn
                      field="trailer_id"
                      title="Trailer Id"
                      width="200px"
                    />
                    <GridColumn
                      field="commodity_group"
                      title="Commodity Group"
                      width="200px"
                    />
                    <GridColumn
                      field="effective_date_utc"
                      title="Effective Date"
                      width="200px"
                    />
                    <GridColumn
                      field="expiration_date_utc"
                      title="Expiration Date"
                      width="200px"
                    />
                    <GridColumn
                      field="is_active"
                      sortable={true}
                      cell={(e) => {
                        return (
                          <td
                            style={{
                              color: e.dataItem.is_active
                                ? "#259125"
                                : "#FF0000",
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
                        return (
                          <td>
                            {e.dataItem.status == "A" ? "Active" : "Inactive"}
                          </td>
                        );
                      }}
                    />
                    <GridColumn
                      field="make"
                      title="Make"
                      width="200px"
                      cell={(e) => {
                        return (
                          <td>
                            {e.dataItem.make ? e.dataItem.make : ""}
                          </td>
                        );
                      }}
                    />
                    <GridColumn field="model" title="Model" width="200px" />
                    <GridColumn
                      field="license_plate"
                      title="License Plate"
                      width="200px"
                      cell={(e) => {
                        return (
                          <td>
                            {e.dataItem.license_plate
                              ? e.dataItem.license_plate
                              : ""}
                          </td>
                        );
                      }}
                    />
                    <GridColumn
                      field="driver_side_tag"
                      title="QR code"
                      width="200px"
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
                      field="terminal_full_name"
                      title="Terminal"
                      width="200px"
                    />
                    <GridColumn field="region" title="Region" width="200px" />
                    <GridColumn
                      field="pm_due_date_utc"
                      title="Next PM Date"
                      width="200px"
                      cell={(e) => {
                        return (
                          <td>
                            {e.dataItem.pm_due_date_utc == 0
                              ? ""
                              : e.dataItem.pm_due_date_utc}
                          </td>
                        );
                      }}
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
              ADD DEDICATED TRAILER
            </Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={initalValue}
            validationSchema={validation}
            enableReinitialize={true}
          // onSubmit={addDedicatedTrailers}
          >
            {({ values, handleChange, handleBlur }) => (
              <>
                <Modal.Body>
                  <div class="form-group">
                    <label for="typeHeadCommodityGroup">
                      Commodity Group *
                    </label>
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

                    <label for="typeHeadTrailerId">Trailer ID *</label>
                    <div className="meterial_autocomplete">
                      <Autocomplete
                        id="combo-box-demo"
                        options={allTrailers}
                        getOptionLabel={(option) =>
                          `${option.trailer_id} - ${option.eqmodel}`
                        }
                        onChange={trailerIdIdHandler}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose a Trailer..."
                            variant="outlined"
                          />
                        )}
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
                          value={EffectiveDate}
                          error={false}
                          helperText={null}
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
                  <Button onClick={handleShowModalclose}>Close</Button>
                  <Button type="submit" onClick={addDedicatedTrailers}>
                    Save
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Formik>
        </Modal>

        {/* Modal For Edit */}
        <Modal
          show={showEditModal}
          onHide={() => setshowEditModal(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              EDIT DEDICATED TRAILER
            </Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={initalValueForEdit}
            // validationSchema={validation}
            enableReinitialize={true}
          // onSubmit={saveDedicatedTrailers}
          >
            {({ values, handleChange, handleBlur }) => (
              <Form>
                <Modal.Body>
                  <div class="form-group">
                    <label for="typeHeadCommodityGroup">
                      Commodity Group *
                    </label>
                    <div className="meterial_autocomplete">
                      <Autocomplete
                        id="combo-box-demo"
                        options={allCGs}
                        getOptionLabel={(option) =>
                          `${option.code} : ${option.description}`
                        }
                        defaultValue={{
                          code:
                            trailerForEdit.commodity_group === ""
                              ? trailerForEdit.commodity_group
                              : trailerForEdit.commodity_group,
                          description:
                            trailerForEdit.commodity_description === ""
                              ? trailerForEdit.commodity_description
                              : trailerForEdit.commodity_description,
                        }}
                        disabled={true}
                        getOptionSelected={(option) => option.code}
                        onChange={commodityGroupIdHandlerForEdit}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose a Commodity Group..."
                            variant="outlined"
                          />
                        )}
                      />
                    </div>

                    <label for="typeHeadTrailerId">Trailer ID *</label>
                    <div className="meterial_autocomplete">
                      <Autocomplete
                        id="combo-box-demo"
                        options={allTrailers}
                        getOptionLabel={(option) =>
                          `${option.trailer_id} - ${option.eqmodel}`
                        }
                        onChange={trailerIdIdHandlerEdit}
                        disabled={true}
                        defaultValue={{
                          trailer_id: trailerForEdit.trailer_id,
                          eqmodel: trailerForEdit.model,
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose a Trailer..."
                            variant="outlined"
                          />
                        )}
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
                          error={false}
                          helperText={null}
                          minDate={dateString}
                          inputVariant="outlined"
                          variant="outlined"
                          disabled={true}
                          value={trailerForEdit.effective_date_utc}
                          placeholder="MM-dd-yyyy"
                          onChange={handleDateChangeEffectiveDateForEditChange}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </div>

                    <label for="txtExpiryDate">Expiration Date </label>
                    <div className="meterial_autocomplete">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          error={false}
                          helperText={null}
                          format="MM-dd-yyyy"
                          id="date-picker-inline"
                          fullWidth="true"
                          variant="outlined"
                          inputVariant="outlined"
                          value={trailerForEdit.expiration_date_utc}
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
                  <Button onClick={(e) => setshowEditModal(false)}>
                    Close
                  </Button>
                  <Button type="submit" onClick={saveDedicatedTrailers}>
                    Save
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
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
              Delete Dedicated Trailer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="form-group">
              <p>
                Do you want to Delete the Trailer Id {trailerForEdit.trailer_id}{" "}
                ?
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => setshowDeleteModal(false)}>Close</Button>
            <Button onClick={(e) => removeDedicatedTrailer(e)}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default LocationDedicatedTrailersBody;
