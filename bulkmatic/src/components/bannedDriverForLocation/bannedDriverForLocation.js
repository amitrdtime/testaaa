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
import TextField from "@material-ui/core/TextField";
import IconButton from "@mui/material/IconButton";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Grid, MenuItem } from "@material-ui/core";
import { Tooltip } from "@material-ui/core";
import { ContextData } from "../../components/appsession";

const errors = {
  color: "red",
};

const BannedDriverForLocation = (props) => {
  const { locationById, isShipperOrConsignee } = props;
  const [userData, setuserData] = useContext(ContextData);

  const [allDriverForLocation, setallDriverForLocation] = useState([]);
  const [searchtext, setSearchText] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [warnningModalShow, setwarnningModalShow] = useState(false);
  const [driverDetailsForUpdate, setdriverDetailsForUpdate] = useState({});
  const [allDrivers, setallDrivers] = useState([]);
  const [seletedDriverForBan, setseletedDriverForBan] = useState({});
  const [allBanned, setallBanned] = useState([]);
  const [allLocationDrivers, setallLocationDrivers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [showDeleteModal, setshowDeleteModal] = useState(false);

  const [bannedDriverforEdit, setBannedDriverforEdit] = useState({});

  const [showEditModal, setshowEditModal] = useState(false);
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
        .getAllDrivers(filterData)
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
      setIsLoading(true);
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
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
        return NotificationManager.success(
          "Banned Driver Unblocked successfully",
          "Success"
        );
      }
    } catch (error) {
      return NotificationManager.error(
        "Banned Driver  Not Unblocked successfully",
        "Error"
      );
    }
  };

  const createBannedDriver = async (values) => {
    const payloadData = {
      driver_id: values.driverid,
      reason: values.reason,
      location_id: locationById.id.toString(),
    };
    try {
      setIsLoading(true);
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
        setIsLoading(false);
        props.parentCallBackForBanned(blockDriver);
        return NotificationManager.success(
          "Banned Driver added successfully",
          "Success"
        );
      }
    } catch (error) {
      return NotificationManager.error(
        "Banned Driver not added successfully",
        "Error"
      );
    }
  };
  return (
    <div className="col-xl-6">
      <div className="col-xl-11">
        <div className="card card_shadow">
          <div className="card-body special_card_padding">
            <h2 className="header-title">BANNED DRIVERS</h2>
            {/* <div className="search_area">
              <div className="search_left">
                <img src={SearchFilter} className="search_filter_icon" />
              </div>
              <div className="search_middle">
                <input
                  type="text"
                  placeholder="Search By Driver Name,Driver Id..."
                  className="special_searchbox"
                  onChange={(e) => searchInputHandler(e)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="search_right">
                <img
                  src={Search}
                  className="search_button_icon"
                  onClick={(e) => searchHandler(e)}
                />
              </div>
            </div> */}

            <div className="table-responsive">
              <table className="table table-striped mb-0 table_scroll">
                <thead className="other_table_header">
                  <tr>
                    <th style={{ width: "39%" }}>Driver Name</th>
                    <th style={{ width: "20%" }}>Driver Id</th>
                    <th style={{ width: "18%" }}>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allBanned?.length > 0 ? (
                    allBanned.map((driver) => (
                      <tr key={allBanned.driver_id}>
                        <td style={{ width: "40%" }}>
                          {(driver.driver?.first_name
                            ? driver.driver?.first_name
                            : "") +
                            (driver.driver?.name_mid_initial
                              ? " " + driver.driver?.name_mid_initial
                              : "") +
                            (driver.driver?.driver_name
                              ? " " + driver.driver?.driver_name
                              : "")}
                        </td>
                        <td style={{ width: "24%" }}>{driver.driver_id}</td>
                        <td style={{ width: "18%" }}> {driver.reason}</td>
                        <td>
                          {/* <button
                                class="btn_blue_sm btn-blue ml_10"
                                onClick={() => editBannedDriver(driver)}
                              >
                                EDIT
                              </button> */}
                          {userData.roles[0].permissionAccess.filter(
                            (it) =>
                              it.permission === "Locations" &&
                              it.isEdit === false
                          ).length > 0 ? (
                            <button
                              class="btn btn-secondary"
                              disabled
                              onClick={() => openBannedDriverModal(driver)}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              class="btn_blue_sm btn-blue ml_10"
                              onClick={() => openBannedDriverModal(driver)}
                            >
                              Unblock
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : isLoading ? (
                    <div className="loader_wrapper">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
                    <div>No data found</div>
                  )}
                </tbody>
              </table>
              <NotificationContainer />
            </div>
            {/* <div className="add_icon">
              <Tooltip title="Block driver">
                <img
                  src={AddIcon}
                  className="add_icon_adjust"
                  onClick={() => setModalShow(true)}
                />
              </Tooltip>
            </div> */}

            <div className="add_icon">
              {userData.roles[0].permissionAccess.filter(
                (it) => it.permission === "Locations" && it.isEdit === false
              ).length > 0 ? (
                <IconButton onClick={() => setModalShow(true)} disabled>
                  <Tooltip title={"Sorry you don't have permission"}>
                    <img src={AddIcon} className="add_icon_adjust" />
                  </Tooltip>
                </IconButton>
              ) : (
                <IconButton onClick={() => setModalShow(true)}>
                  <Tooltip title={"Block driver"}>
                    <img src={AddIcon} className="add_icon_adjust" />
                  </Tooltip>
                </IconButton>
              )}
            </div>
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
              driverid: yup.string().required("Driver Id is required"),
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
                <Grid container spacing={2}>
                  <label for="exampleFormControlInput1">Driver Id</label>
                  <TextField
                    select
                    fullWidth
                    margin="normal"
                    name="driverid"
                    variant="outlined"
                    size="small"
                    value={formik.values.driverid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.driverid && Boolean(formik.errors.driverid)
                    }
                    helperText={
                      formik.touched.driverid && formik.errors.driverid
                    }
                  >
                    {allDrivers.map((driver) => (
                      <MenuItem key={driver.driver_id} value={driver.driver_id}>
                        {driver.driver_id +
                          " - " +
                          (driver.first_name ? driver.first_name : "") +
                          (driver.name_mid_initial
                            ? " " + driver.name_mid_initial
                            : "") +
                          (driver.driver_name ? " " + driver.driver_name : "")}
                      </MenuItem>
                    ))}
                  </TextField>

                  <label for="exampleFormControlInput1">Reason</label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    name="reason"
                    multiline={true}
                    rows={2}
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.reason && Boolean(formik.errors.reason)
                    }
                    helperText={formik.touched.reason && formik.errors.reason}
                  />
                </Grid>
                <Modal.Footer>
                  <Button onClick={formik.handleReset}>Reset</Button>
                  <Button type="sumbit">Save</Button>
                </Modal.Footer>
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
                (bannedDriverforEdit?.driver?.first_name
                  ? bannedDriverforEdit?.driver?.first_name
                  : "") +
                (bannedDriverforEdit?.driver?.name_mid_initial
                  ? " " + bannedDriverforEdit?.driver?.name_mid_initial
                  : "") +
                (bannedDriverforEdit?.driver?.driver_name
                  ? " " + bannedDriverforEdit?.driver?.driver_name
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
  );
};

export default BannedDriverForLocation;
