import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Typeahead } from "react-bootstrap-typeahead";
import CommoditygroupService from "../../services/commoditygroupService";
import LocationService from "../../services/locationService";
import Spinner from "react-bootstrap/Spinner";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Chip } from "@material-ui/core";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";

const LoadUnloadDurationsByLocation = (props) => {
  const { allLocation } = props;
  
  const initialDataState = {
    skip: 0,
    take: 25,
  };
  const [modalShow, setModalShow] = useState(false);
  const [allCGs, setallCG] = useState([]);
  const [seletedCG, setseletedCG] = useState({});
  const [shipperPoolDetails, setshipperPoolDetails] = useState({});
  const [allShipperPool, setallShipperPool] = useState([]);
  const [showEditModal, setshowEditModal] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [shipperForEdit, setshipperForEdit] = useState({});

  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
  });

  const [dataResult, setDataResult] = useState(process(allLocation, dataState));

  const dataStateChange = (event) => {
    setDataResult(process(allLocation, event.dataState));
    setDataState(event.dataState);
  };

  const columnReorderChange = function (event) {
    
    allLocation = event.target._columns.map((it) => {
      return {
        id: it.index,
        name: it.field,
        title: it.title,
      };
    });
  };

  useEffect(() => {
    setDataResult(process(allLocation, dataState));
  }, [allLocation]);

  const pageChange = (event) => {
    setPage(event.page);
  };
  const getAllCGs = async () => {
    const cgService = new CommoditygroupService();
    const allCgs = await cgService.getAllCommodityGroups();
    setallCG(allCgs);
  };
  // 

  const commodityGroupIdHandler = (value) => {
    if (value[0]) {
      setseletedCG(value[0]);
      setshipperPoolDetails((item) => ({
        ...item,
        commodityid: value[0].code,
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
  };
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  const captureExpiryDateForEdit = (value) => {
    setshipperForEdit((item) => ({
      ...item,
      expirationdate: value,
    }));
  };
  const captureEffectiveDateForEdit = (value) => {
    setshipperForEdit((item) => ({
      ...item,
      effectivedate: value,
    }));
  };

  const commodityGroupIdHandlerForEdit = (value) => {
    if (value.length > 0) {
      setshipperForEdit((item) => ({
        ...item,
        cgId: value[0].code,
        locationid: locationById.id.toString(),
      }));
    } else {
      setshipperForEdit((item) => ({
        ...item,
        cgId: "",
      }));
    }
  };
  const captureTargetCountForEdit = (value) => {
    if (value) {
      setshipperForEdit((item) => ({
        ...item,
        TargetCount: value,
      }));
    }
  };
  const createShipperPool = async () => {
    const locationService = new LocationService();
    try {
      const shipperPools = await locationService.createShipperPool(
        shipperPoolDetails
      );
      if (shipperPools.length > 0) {
        setallShipperPool(shipperPools);
        setModalShow(false);
        props.parentCallBackFromShipperPoll(shipperPools);
      }
      NotificationManager.success(
        "Shipper Pool  Added successfully",
        "Success"
      );
    } catch (error) {
      NotificationManager.error(
        "Shipper Pool  not Added successfully",
        "Error"
      );
    }
  };
  const saveShipperPool = async () => {
    
    try {
      const locationService = new LocationService();
      const shipperPools = await locationService.saveShipperPool(
        shipperForEdit
      );
      
      setallShipperPool(shipperPools);

      setshowEditModal(false);
      props.parentCallBackFromShipperPoll(shipperPools);

      return NotificationManager.success(
        "Shipper Pool Updated successfully",
        "Success"
      );
    } catch (error) {
      return NotificationManager.error("Shipper Pool not Updated", "Error");
    }
  };
  const openDeleteShipperPoolModal = (shipper) => {
    setshipperForEdit(shipper);
    setshowDeleteModal(true);
  };
  const deleteShipperPool = async () => {
    try {
      const locationService = new LocationService();
      const shipperPools = await locationService.deleteShipperPool(
        shipperForEdit
      );
      setallShipperPool(shipperPools);
      setshowDeleteModal(false);
      props.parentCallBackFromShipperPoll(shipperPools);

      return NotificationManager.success(
        "Shipper Pool Deleted successfully",
        "Success"
      );
    } catch (error) {
      return NotificationManager.error("Shipper Pool Not Deleted", "Error");
    }
  };

  const initialValuesAdd = {
    cgName: "",
    count: "",
    effDate: "",
    expDate: "",
  };
  const validationAdd = Yup.object().shape({
    cgName: Yup.string().required("Select a commodity group"),
    count: Yup.string().required("Enter"),
  });

  const initialValuesEdit = {
    cgName: shipperForEdit.CommodityGroup,
    count: shipperForEdit.TargetCount,
    effDate: shipperForEdit.EffectiveDate,
    expDate: shipperForEdit.ExpirationDate,
  };
  const validationEdit = {
    cgName: Yup.string().required("Select a commodity group"),
    count: Yup.string()
      .required("Select a count")
      .min(1, "Count cannot be 0 or less than 0"),
  };

  

  return (
    <div className="row mt_30">
      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <div className="table_header_section w-96">
              {/* <div>
                <h2 className="header-title">By Location</h2>
              </div> */}
              <div>
              </div>
              <div className="df">


                <button
                  type="button"
                  className="btn_blue btn-blue float-right"
                  onClick={() => setModalShow(true)}
                >
                  ADD
                </button>

              </div>
            </div>

            {allLocation?.length > 0 ? (
            <Grid
              filter={dataState.filter}
              filterable={true}
              groupable={true}
              reorderable={true}
              pageable={{
                pageSizes: [5, 10, 20, 25, 50, 100],
                info: true,
                previousNext: true,
              }}
              resizable={true}
              skip={dataState.skip}
              take={dataState.take}
              data={dataResult}
              onDataStateChange={dataStateChange}
            >
              <GridColumn
                field="location_id"
                title="Location ID"
                width="200px"
                filterable={true}
                filter={"numeric"}
              />
              <GridColumn
                field="name"
                title="Location Name"
                width="200px"
                filterable={true}
              />
              <GridColumn
                field="code"
                title="CommodityGroup"
                width="200px"
                filterable={true}
              />
              <GridColumn
                field="commodity"
                title="Commodity"
                width="200px"
                filterable={true}
              />
              <GridColumn
                field="driver_load_flag"
                title="Load Flag"
                width="200px"
                filterable={true}
              />
              <GridColumn
                field="action_type"
                title="Action Type"
                width="200px"
                filterable={true}
              />
              <GridColumn
                field="loadtime"
                title="Load Time"
                width="200px"
                filterable={true}
              />
              <GridColumn
                cell={(e) => {
                  return (
                    <>
                      <button
                        type="button"
                        class="btn_blue_sm btn-blue ml_10"
                        onClick={() => editShipperPool(item)}
                      >
                        <i
                          class="fa fa-pencil mr_5 del_icon"
                          aria-hidden="true"
                        ></i>
                        EDIT
                      </button>
                      <button
                        type="button"
                        class="btn_blue_sm btn-blue ml_10"
                        onClick={() => openDeleteShipperPoolModal(item)}
                      >
                        <i
                          class="fa fa fa-trash mr_5 del_icon"
                          aria-hidden="true"
                        ></i>
                        DELETE
                      </button>
                    </>
                  );
                }}
                title="Action"
                width="200px"
                filterable={true}
              />
            </Grid>
            ):<div className="loader_wrapper">
            <Spinner animation="border" variant="primary" />
          </div>
              }
            <NotificationContainer />
            {/* </div> */}
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
        <Formik
          initialValues={initialValuesAdd}
          validationSchema={validationAdd}
          enableReinitialize={true}
          onSubmit={createShipperPool}
        >
          {(props) => (
            <Form>
              <Modal.Body>
                <div class="form-group">
                  <label for="typeHeadCommodityGroup">Commodity Group</label>
                  <Typeahead
                    id="typeHeadCommodityGroup"

                    name="cgName"
                    onChange={commodityGroupIdHandler}

                    labelKey={(option) =>
                      `${option.code} : ${option.description}`
                    }
                    options={allCGs}
                    placeholder="Choose a Commodity Group"
                    onBlur={props.handleBlur}
                    value={props.values.cgName}

                  />
                  <ErrorMessage
                    name="cgName"
                    render={(error) => (
                      <div className="errormessage">{error}</div>
                    )}
                  />

                  <label for="txtTargetCount">Target Count</label>
                  <TextField
                    type="number"
                    name="count"
                    class="form-control"
                    id="txtTargetCount"
                    onInput={(event) => captureTargetCount(event.target.value)}
                    placeholder="e.g. 10"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.count}
                  />
                  <ErrorMessage
                    name="count"
                    render={(error) => (
                      <div className="errormessage">{error}</div>
                    )}
                  />
                  <label for="txtEffectiveDate">Effective Date</label>
                  <TextField
                    type="date"
                    name="effDate"
                    class="form-control"
                    id="txtEffectiveDate"
                    onInput={(event) =>
                      captureEffectiveDate(event.target.value)
                    }
                    placeholder="e.g. 12/31/2021"
                  />

                  <label for="txtExpiryDate">Expiration Date</label>
                  <TextField
                    type="date"
                    name="expDate"
                    class="form-control"
                    id="txtExpiryDate"
                    onInput={(event) => captureExpiryDate(event.target.value)}
                    placeholder="e.g. 12/31/2021"
                  />
                </div>
              </Modal.Body>
            </Form>
          )}
        </Formik>
        <Modal.Footer>
          <Button onClick={(e) => setModalShow(false)}>Close</Button>
          <Button
            type="submit"

          >
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
        <Formik
          initialValues={initialValuesEdit}
          validationSchema={validationEdit}
          enableReinitialize={true}
          onSubmit={saveShipperPool}
        >
          {(props) => (
            <Form>
              <Modal.Body>
                <div class="form-group">
                  <label for="typeHeadCommodityGroup">Commodity Group</label>

                  <Typeahead
                    id="typeHeadCommodityGroup"

                    name="cgName"
                    onChange={commodityGroupIdHandlerForEdit}
                    options={allCGs}
                    labelKey={(option) => `${option.code}`}
                    defaultSelected={
                      shipperForEdit.cgId
                        ? [{ code: shipperForEdit.CommodityGroup }]
                        : []
                    }
                    onBlur={props.handleBlur}
                    value={props.values.cgName}
                  />
                  <ErrorMessage
                    name="cgName"
                    render={(error) => (
                      <div className="errormessage">{error}</div>
                    )}
                  />

                  <label for="txtTargetCount">Target Count</label>
                  <input
                    type="number"
                    name="count"
                    class="form-control"
                    id="txtTargetCount"
                    onInput={(event) =>
                      captureTargetCountForEdit(event.target.value)
                    }
                    placeholder="e.g. 10"
                    defaultValue={shipperForEdit.TargetCount}
                    onBlur={props.handleBlur}
                    value={props.values.cgName}
                  />
                  <ErrorMessage
                    name="count"
                    render={(error) => (
                      <div className="errormessage">{error}</div>
                    )}
                  />
                  <label for="txtEffectiveDate">Effective Date</label>
                  <TextField
                    type="date"
                    name="effDate"
                    class="form-control"
                    id="txtEffectiveDate"
                    onInput={(event) =>
                      captureEffectiveDateForEdit(event.target.value)
                    }
                    placeholder="e.g. 12/31/2021"
                    defaultValue={formatDate(shipperForEdit.EffectiveDate)}
                  />
                  <label for="txtExpiryDate">Expiration Date</label>
                  <TextField
                    type="date"
                    name="expDate"
                    class="form-control"
                    id="txtExpiryDate"

                    placeholder="e.g. 12/31/2021"
                    defaultValue={formatDate(shipperForEdit.ExpirationDate)}
                  />
                </div>
              </Modal.Body>
            </Form>
          )}
        </Formik>
        <Modal.Footer>
          <Button onClick={(e) => setshowEditModal(false)}>Close</Button>
          <Button
            type="submit"
          >
            Save
          </Button>
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
            <p>Are you want to Delete {shipperForEdit.CommodityGroup} ?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setshowDeleteModal(false)}>Close</Button>
          <Button onClick={(e) => deleteShipperPool(e)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoadUnloadDurationsByLocation;
