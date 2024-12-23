import React, { useState, useEffect, useContext } from "react";
import SearchFilter from "../../assets/images/search_filter.svg";
import Search from "../../assets/images/Search-Button.svg";
import TerminalService from "../../services/terminalService";
import AddIcon from "../../assets/images/add_icon.svg";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Typeahead } from "react-bootstrap-typeahead";
import DriverService from "../../services/driverService";
import LocationService from "../../services/locationService";
import Spinner from "react-bootstrap/Spinner";
import { Formik, Form, useFormik, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import IconButton from "@mui/material/IconButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { MenuItem } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { ContextData } from "../../components/appsession";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ToastContainer, toast } from "react-toastify";
import { process } from "@progress/kendo-data-query";

const LocationBodyForDetails = (props) => {
  const { locationById, isShipperOrConsignee, location, accessDisabled } = props;
  const [userData, setuserData] = useContext(ContextData);

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

  const [allDriverForLocation, setallDriverForLocation] = useState([]);
  const [searchtext, setSearchText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [warnningModalShow, setwarnningModalShow] = useState(false);
  const [driverDetailsForUpdate, setdriverDetailsForUpdate] = useState({});
  const [allDrivers, setallDrivers] = useState([]);
  const [seletedDriverForBan, setseletedDriverForBan] = useState({});
  const [allBanned, setallBanned] = useState([]);
  const [allLocationDrivers, setallLocationDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [driverID, setDriverID] = useState("");
  const [unBannedDriver, setUnBannedDriver] = useState([])
  // const [isLoading, setIsLoading] = useState(false);

  const [showDeleteModal, setshowDeleteModal] = useState(false);

  const [bannedDriverforEdit, setBannedDriverforEdit] = useState({});

  const [showEditModal, setshowEditModal] = useState(false);
  const [dataResult, setDataResult] = useState(process(allBanned, dataState));

  const roles_permission = userData.roles?.map((e) => e.permissionAccess);

  const permission_location = roles_permission[0].filter(
    (element) => element.permission === "Locations"
  );

  const dataStateChange = (event) => {
    setDataResult(process(allBanned, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allBanned, dataState));
  }, [allBanned]);

  useEffect(() => {
    let bannerDrivers = allBanned.map(banned => {
      return banned.driver_id
    })
    const unBanDriver = [];
    allDrivers.forEach(driver => {
      if(bannerDrivers.indexOf(driver.driver_id) == -1){
        unBanDriver.push(driver)
      }
    })
    setUnBannedDriver(unBanDriver)
  },[allDrivers, allBanned])

  useEffect(async () => {
    const userTerminalIds = await userData.terminals;
    if (userTerminalIds?.length > 0) {
      const terminalService = new TerminalService();
      let terminalinformationlist = await terminalService.getTerminalByIds(
        userTerminalIds
      );
      let default_terminal_ids = [];

      terminalinformationlist.forEach(function (terminalinformation) {
        default_terminal_ids.push(terminalinformation.code);
      });

      let filterData = {
        terminalId: default_terminal_ids,
      };

      const driverService = new DriverService();
      driverService
        .getBannedDrivers(filterData)
        .then(function (driversList) {
          setallDrivers(driversList);
          // setdriverlistData(driversList);
        })
        .catch(function (err) {
          NotificationManager.error(err, "Error");
        });
    }
  }, [userData]);

  useEffect(async () => {
    const driverService = new DriverService();
   
    try {
      setLoading(true);
      const allBannedDrivers = await driverService.getBannedDriversByLocation(
        locationById.id.toString(),
        searchtext
      );
      if (allBannedDrivers.length > 0) {
        setallBanned(allBannedDrivers);
      }
    } catch (err) {}
  }, []);

  useEffect(async () => {
    const driverService = new DriverService();

    try {
      setLoading(true);
      const allLocationDrivers = await driverService.getDriversByLocationID(
        locationById.id.toString(),
        searchtext
        // isShipperOrConsignee
      );

      if (allLocationDrivers.length > 0) {
        setallLocationDrivers(allLocationDrivers);

        props.parentCallBackForBanned(allLocationDrivers);
      } else {
        setallLocationDrivers([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    // await getAllDrivers();
  }, [isShipperOrConsignee.shipper]);

  // const getAllDrivers = async () => {
  //   const terminalService = new DriverService();
  //   const allDrivers = await terminalService.getAllDrivers();
  //   setallDrivers(allDrivers);
  // };

  const searchInputHandler = (e) => {
    setSearchText(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchHandler();
    }
  };

  const searchHandler = async (e) => {
    const locationService = new LocationService();
    setLoading(true);
    try {
      const allLocationDrivers = await locationService.getDriversByLocationID(
        locationById.id.toString(),
        searchtext,
        isShipperOrConsignee
      );
      if (allLocationDrivers.length > 0) {
        setallBanned(allLocationDrivers);
        props.parentCallBackForBanned(allLocationDrivers);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const driverIdHandler = (value) => {
    const isShipper = isShipperOrConsignee.shipper;
    setseletedDriverForBan(value[0]);
    setdriverDetailsForUpdate((item) => ({
      ...item,
      driverid: value[0].id,
      locationid: locationById.id.toString(),
      blocktype: isShipperOrConsignee,
    }));
  };

  const reasonForBandHandler = (value) => {
    setdriverDetailsForUpdate((prevState) => ({
      ...prevState,
      reason: value,
    }));
  };

  const bannedDriverHandler = async () => {
    
    const driverService = new DriverService();
    const blockDriver = await driverService.blockDriverForLocation(
      driverDetailsForUpdate
    );
    if (blockDriver.length > 0) {
      setallBanned(blockDriver);
      props.parentCallBackForBanned(blockDriver);
      setwarnningModalShow(false);
    }
  };

  // Edit Driver
  const editBannedDriver = (driver) => {
    setBannedDriverforEdit(driver);

    setshowEditModal(true);
  };

  const driverIdHandlerForEdit = (value) => {
    setBannedDriverforEdit((item) => ({
      ...item,
      driverid: value.driver_id,
    }));
  };

  const reasonForBandHandlerForEdit = (value) => {
    setBannedDriverforEdit((item) => ({
      ...item,
      reason: value,
    }));
  };

  // TODO need to integrate api call
  const updateBannedDriver = async () => {};
  const createBannedDriver = async (values) => {
    
    const payloadData = {
      driver_id: driverID,
      reason: values.reason,
      location_id: locationById.id.toString(),
    };
    try {
      setLoading(true);
      const driverService = new DriverService();
      const blockDriver = await driverService.addBannedDriver(payloadData);
      const drivers = new DriverService();
      const allBannedDrivers = await drivers.getBannedDriversByLocation(
        locationById.id.toString(),
        searchtext
      );
         if (allBannedDrivers.length > 0) {
          setallBanned(allBannedDrivers);
          // setallBanned(blockDriver)
          setModalShow(false);
          setLoading(false);
          props.parentCallBackForBanned(blockDriver);
              return toast.success(
                "Banned Driver added successfully",
                "Success"
              );
        } 
    } catch (error) {
      return toast.error(
        "Banned Driver not added successfully",
        "Error"
      );
    }
  };
  // DELETE Driver
  const openBannedDriverModal = (driver) => {
    setBannedDriverforEdit(driver);
    setshowDeleteModal(true);
  };

  const deleteBannedDriver = async () => {
    try {
      const driverService = new DriverService();
      let payloadData = {
        location_id: locationById.id.toString(),
        driver_id: bannedDriverforEdit.driver_id,
      };
      const unblockDriver = await driverService.unBlockDriverForLocation(
        payloadData
      );
      if (unblockDriver.length > 0) {
        setallBanned(
          allBanned.filter(
            (item) => item.driver_id !== bannedDriverforEdit.driver_id
          )
        );
        setshowDeleteModal(false);
        props.parentCallBackForBanned(unblockDriver);
        // return NotificationManager.success(
        //   "Banned Driver Unblocked successfully",
        //   "Success"
        // );
      }
    } catch (error) {
      return NotificationManager.error(
        "Banned Driver  Not Unblocked successfully",
        "Error"
      );
    }
  };

  const Deletebanneddriver = (props) => {
    return (
      <td>
        {/* {userData.roles[0].permissionAccess.filter(
          (it) =>
            it.permission === "Locations" &&
            it.isEdit === false
        ).length > 0 ? (
          <button
            class="btn btn-secondary"
            disabled
            //onClick={() => openBannedDriverModal(driver)}
            onClick={()=> props.openBannedDriverModal(props.dataItem)}
          >
            Unblock
          </button>
        ) : (
          <button
            class="btn_blue_sm btn-blue ml_10"
           // onClick={() => openBannedDriverModal(driver)}
          >
            Unblock
          </button>
        )} */}

        {/* {permission_location[0].isEdit ? (
          <button
            type="button"
            class="btn_blue_smadjust btn-blue ml_10"
            onClick={() => props.openBannedDriverModal(props.dataItem)}
          >
            Unblock
          </button>
        ) : (
          <button
            type="button"
            class="btn_blue_smadjust btn-blue ml_10"
            disabled
          >
            Unblock
          </button>
        )} */}
          <button
            type="button"
            class="btn_blue_smadjust btn-blue ml_10"
            onClick={() => props.openBannedDriverModal(props.dataItem)}
            disabled={accessDisabled ? true : false}
            style={{background : accessDisabled ? "#dddddd" : ""}}
          >
            Delete
          </button>
      </td>
    );
  };
  const DeleteBanned = (props) => (
    <Deletebanneddriver
      {...props}
      openBannedDriverModal={openBannedDriverModal}
    />
  );
  const handleDriverId = (e, newValue) => {
    setDriverID(newValue?.driver_id);
  };

  console.log("unBannedDriver==>>>>>",unBannedDriver)
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      <div className="row special_row_flex">
        <div className="col-xl-12">
          <div className="card card_shadow">
            {/* <div className="card-body">
              <h2 className="header-title">Additional Details</h2>
              <div className="container special_container_padding">
                <div className="details_wrapper">
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">Address-1:</div>
                      <div className="right_drescrition">
                        {location.address}
                      </div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">Address-2:</div>
                      <div className="right_drescrition">
                        {location.address1}
                      </div>
                    </div>
                  </div>
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">City:</div>
                      <div className="right_drescrition">{location.city}</div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">State:</div>
                      <div className="right_drescrition">{location.state}</div>
                    </div>
                  </div>

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">Zip:</div>
                      <div className="right_drescrition">{location.zip}</div>
                    </div>
                    <div className="Details_sec">
                      <div className="left_main">Timezone:</div>
                      <div className="right_drescrition">{location.region}</div>
                    </div>
                  </div>

                  <div className="main_details_sec">                   
                    <div className="Details_sec1">
                      <div className="left_main">Latitude/Longitude:</div>
                      <div className="right_drescrition">
                        {location.latitude +  "/"  + location.longitude}
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body">
              <h2 className="header-title">Hours Of Operation</h2>
              <div className="container special_container_padding">
                <div className="details_wrapper">
                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="left_main">Week</div>
                    </div>

                    <div className="Details_sec">
                      <div className="left_main">Start</div>
                    </div>

                    <div className="Details_sec">
                      <div className="left_main">End</div>
                    </div>
                  </div>

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="right_drescrition">Monday</div>
                    </div>

                    <div className="Details_sec">
                      <div className="right_drescrition">
                        {location.hours_of_operation_startts
                          ? location.hours_of_operation_startts
                          : "Not Available"}
                      </div>
                    </div>

                    <div className="Details_sec">
                      <div className="right_drescrition">
                        {location.hours_of_operation_endts
                          ? location.hours_of_operation_endts
                          : "Not Available"}
                      </div>
                    </div>
                  </div>

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="right_drescrition">Tuesday </div>
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_startts
                        ? location.hours_of_operation_startts
                        : "Not Available"}
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_endts
                        ? location.hours_of_operation_endts
                        : "Not Available"}
                    </div>
                  </div>

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="right_drescrition">Wednesday </div>
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_startts
                        ? location.hours_of_operation_startts
                        : "Not Available"}
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_endts
                        ? location.hours_of_operation_endts
                        : "Not Available"}
                    </div>
                  </div>

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="right_drescrition">Thursday</div>
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_startts
                        ? location.hours_of_operation_startts
                        : "Not Available"}
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_endts
                        ? location.hours_of_operation_endts
                        : "Not Available"}
                    </div>
                  </div>

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="right_drescrition">Friday </div>
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_startts
                        ? location.hours_of_operation_startts
                        : "Not Available"}
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_endts
                        ? location.hours_of_operation_endts
                        : "Not Available"}
                    </div>
                  </div>

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="right_drescrition">Saturday </div>
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_startts
                        ? location.hours_of_operation_startts
                        : "Not Available"}
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_endts
                        ? location.hours_of_operation_endts
                        : "Not Available"}
                    </div>
                  </div>

                  <div className="main_details_sec">
                    <div className="Details_sec">
                      <div className="right_drescrition">Sunday </div>
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_startts
                        ? location.hours_of_operation_startts
                        : "Not Available"}
                    </div>

                    <div className="Details_sec">
                      {location.hours_of_operation_endts
                        ? location.hours_of_operation_endts
                        : "Not Available"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <div className="banned_add_button_position">
              <div>
                <h2 className="header-title1">BANNED DRIVERS</h2>
              </div>
              <div>
                <div className="add_icon">
                  {/* {userData.roles[0].permissionAccess.filter(
                    (it) => it.permission === "Locations" && it.isEdit === false
                  ).length > 0 ? (
                    <Tooltip title={"Sorry you don't have permission"}>
                      <button
                        type="button"
                        className="btn_blue btn-blue mr_10 mb-20 mt_10"
                        onClick={() => setModalShow(true)}
                        disabled
                      >
                        ADD
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip title={"Block driver"}>
                      <button
                        type="button"
                        className="btn_blue btn-blue mr_10 mb-20 mt_10"
                        onClick={() => setModalShow(true)}
                      >
                        ADD
                      </button>
                    </Tooltip>
                  )} */}
                    <Tooltip title={"Block driver"}>
                      <button
                        type="button"
                        className="btn_blue btn-blue mb-20"
                        onClick={() => setModalShow(true)}
                        disabled={accessDisabled ? true : false}
                        style={{background : accessDisabled ? "#dddddd" : ""}}
                      >
                        ADD
                      </button>
                    </Tooltip>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              {allBanned?.length > 0 ? (
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
                  onRowClick={(e) => props.parentcallback(true, e.dataItem)}
                >
                  <GridColumn title="Action" cell={DeleteBanned} />
                  <GridColumn field="driver_full_name" title="Driver Name" />
                  <GridColumn field="driver_id" title="Driver Id" />
                  <GridColumn field="reason" title="Reason" />

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

        {/* Formik from modal  */}
        <Modal
          show={modalShow}
          onHide={() => setModalShow(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              BAN DRIVER
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                driverid: "",
                reason: "",
              }}
              validationSchema={yup.object({
                // driverid: yup.string().required("Driver Id is required"),
                reason: yup.string().required("Reason is required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                createBannedDriver(values);
                setSubmitting(false);
              }}
            >
              {(formik) => (
                <Form>
                  <label htmlFor="exampleFormControlInput1">Driver Id *</label>
                  <div className="meterial_autocomplete">
                  <Autocomplete
                    id="combo-box-demo"
                    options={unBannedDriver}
                    getOptionLabel={(option) =>
                      (option.driver_id ? " " + option.driver_id : "")+ "-"+(option.first_name ? option.first_name : "") +
                      (option.name_mid_initial
                        ? " " + option.name_mid_initial
                        : "") +
                      (option.driver_name ? " " + option.driver_name : "")
                    }
                    onChange={handleDriverId}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        fullWidht={true}
                        {...params}
                        value={driverID}
                        placeholder="Driver Id..."
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        // error={
                        //   formik.touched.driverid &&
                        //   Boolean(formik.errors.driverid)
                        // }
                        // helperText={
                        //   formik.touched.driverid && formik.errors.driverid
                        // }
                      >
                      {/* {allDrivers.map((driver) => (
        <MenuItem key={driver.driver_id} value={driver.driver_id}>
          {driver.driver_id +
            " - " +
            }
        </MenuItem>
      ))} */}
                      </TextField>
                    )}
                  />
                  </div>


                  <label htmlFor="exampleFormControlInput1">Reason *</label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    name="reason"
                    multiline={true}
                    minRows={2}
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.reason && Boolean(formik.errors.reason)
                    }
                    helperText={formik.touched.reason && formik.errors.reason}
                  />
                <div className="banfooter_btn">
                  <Modal.Footer>
                    
                    <Button onClick={formik.handleReset}>Reset</Button>
                    <Button className="m_0" type="sumbit">Save</Button>
                    
                  </Modal.Footer>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        <Modal
          show={showDeleteModal}
          onHide={() => setshowDeleteModal(false)}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Unblock Banned Driver
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div class="form-group">
              <p>
                Are you sure you want to Unblock Banned Driver:
                {(bannedDriverforEdit?.driver_id
                  ? " " + bannedDriverforEdit?.driver_id
                  : "") +
                  " - " +
                  (bannedDriverforEdit?.driver_full_name
                    ? bannedDriverforEdit?.driver_full_name
                    : "")}{" "}
                ?
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={(e) => setshowDeleteModal(false)}>Close</Button>
            <Button onClick={(e) => deleteBannedDriver(e)}>Unblock</Button>
          </Modal.Footer>
        </Modal>
      </div>
      </div>

      
    </>
  );
};

export default LocationBodyForDetails;
