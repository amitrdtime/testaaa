import React, { useState, useEffect, useCallback, useContext } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CommoditygroupService from "../../services/commoditygroupService";

import LUTRuleService from "../../services/loadunloadruleService";

import { Formik, Form } from "formik";

import { Grid as MuiGrid, MenuItem, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { Tooltip } from "@material-ui/core";
import { ContextData } from "../../components/appsession";
import ProgressBar from "react-bootstrap/ProgressBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoadTimesForLocation = (props) => {
  const { accessDisabled } = props;
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
  const { locationById, isShipperOrConsignee } = props;

  const [searchtext, setSearchText] = useState("");
  const [allCGs, setallCG] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [seletedCG, setseletedCG] = useState({});
  const [seletedCommodity, setSeletedCommodity] = useState({});
  const [loadTimesDetails, setLoadTimesDetails] = useState({});
  const [allShipperLoadTime, setallShipperLoadTime] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataResult, setDataResult] = useState(
    process(allShipperLoadTime, dataState)
  );

  const [hide, setHide] = useState(false);

  const dataStateChange = (event) => {
    setDataResult(process(allShipperLoadTime, event.dataState));
    setDataState(event.dataState);
  };

  useEffect(() => {
    setDataResult(process(allShipperLoadTime, dataState));
  }, [allShipperLoadTime]);

  const loadoption = [
    {
      id: "1",
      status: "Yes",
    },
    {
      id: "2",
      status: "No",
    },
    {
      id: "3",
      status: "TL",
    },
    {
      id: "4",
      status: "NB",
    },
  ];

  const unloadoption = [
    {
      id: 1,
      status: "Yes",
    },
    {
      id: 2,
      status: "No",
    },
  ];

  const [loadOption, setLoadOption] = useState("");
  const [unloadOption, setUnloadOption] = useState("");

  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [shipperForEdit, setshipperForEdit] = useState({});
  const [showEditModal, setshowEditModal] = useState(false);
  const [editDisable, setEditDisable] = useState(false);

  const getallcommodities = () => {
    let commodities = [];
    if (seletedCG.commodities) {
      seletedCG.commodities.map((item) => {
        commodities.push(item);
      });
    }
    return commodities;
  };

  useEffect(() => {
    getallcommodities();
  }, [seletedCG]);
  const getloadTime = useCallback(async () => {
    setIsLoading(true);
    const lUTRuleService = new LUTRuleService();
    try {
      const loadTime = await lUTRuleService.getLutrulesbyshipper(
        locationById.id.toString(),
        searchtext
      );
      if (loadTime.length > 0) {
        setallShipperLoadTime(loadTime);
        props.parentCallBackForShipperLoadTimes(loadTime);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    getloadTime();
    getAllCGs();
  }, [isShipperOrConsignee.consignee]);

  const getAllCGs = async () => {
    const cgService = new CommoditygroupService();
    const allCgs = await cgService.getAllCommodityGroups();
    setallCG(allCgs);
  };

  const searchInputHandler = (e) => {
    setSearchText(e.target.value);
  };

  const updateLoadTimeHandler = () => {
    setModalShow(true);
  };

  const searchHandler = async (e) => {
    setIsLoading(true);
    const LUTRuleServiceInnerFilter = new LUTRuleService();
    try {
      const loadTime = await LUTRuleServiceInnerFilter.getLutrulesbyshipper(
        locationById.id.toString(),
        searchtext
      );
      if (loadTime.length > 0) {
        setallShipperLoadTime(loadTime);
        props.parentCallBackForShipperLoadTimes(loadTime);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  // TODO : api integration need

  const editShipperPool = (shipper) => {
    setshipperForEdit(shipper);

    setshowEditModal(true);
    setEditDisable(true);
  };

  // ! THIS IS FOR DELETE
  const openDeleteShipperModal = (shipper) => {
    setshipperForEdit(shipper);
    setshowDeleteModal(true);
    setEditDisable(true);
  };

  const deleteShipper = async () => {
    try {
      let payload = {
        id: shipperForEdit.id,
      };
      const lutService = new LUTRuleService();
      const shipper = await lutService.deleteLUTRule(payload);
      const getloadTime = await lutService.getLutrulesbyshipper(
        locationById.id.toString(),
        searchtext
      );
      if (getloadTime.length > 0) {
        setallShipperLoadTime(
          allShipperLoadTime.filter((item) => item.id != shipperForEdit.id)
        );
      } else {
        setallShipperLoadTime(getloadTime);
      }
      setshowDeleteModal(false);
      setIsLoading(false);
      props.parentCallBackForShipperLoadTimes(getloadTime);
      return toast.success(
        "Load/Unload Override Deleted successfully",
        "Success"
      );
    } catch (error) {
      return toast.error("Load/Unload Override Not Deleted", "Error");
    }
  };

  /// create api Load / Unload time For Location
  const createLoadTime = async (e) => {
    e.preventDefault();
    if (
      !loadTimesDetails.cgid ||
      !loadTimesDetails.locationid ||
      isShipperOrConsignee.shipper
        ? !loadOption
        : !unloadOption ||
          !loadTimesDetails.commodityid ||
          !loadTimesDetails.loadtime
    ) {
      return toast.error("Please fill all required fields", "Error");
    }
    let payload = {
      cgid: loadTimesDetails.cgid,
      locationid: loadTimesDetails.locationid,
      loadflag: isShipperOrConsignee.shipper ? loadOption : unloadOption,
      commodityid: loadTimesDetails.commodityid,
      loadtime: isShipperOrConsignee.shipper ? loadTimesDetails.loadtime : null,
      unloadtime: isShipperOrConsignee.consignee
        ? loadTimesDetails.loadtime
        : null,
      actiontype: isShipperOrConsignee.shipper ? "PU" : "DEL",
    };
    const lutService = new LUTRuleService();
    try {
      const loadtime = await lutService.createLUTRule(payload);

      const addloadtime = await lutService.getLutrulesbyshipper(
        locationById.id.toString(),
        searchtext
      );

      if (loadtime.length > 0) {
        setallShipperLoadTime(addloadtime);
        props.parentCallBackForShipperLoadTimes(addloadtime);
        setModalShow(false);
        toast.success("Shipper Load Time Added successfully", "Success");
      }
    } catch (error) {
      toast.error("Shipper Load Time not Added successfully", "Error");
    }
    setLoadTimesDetails({})
  };

  const updateShipper = async (values) => {
    // if (isShipperOrConsignee.shipper === true || values.loadtime === "") {
    //   return toast.error("Please fill all required fields", "Error");
    // }
    // if (!isShipperOrConsignee.consignee === true || values.unloadtime === "") {
    //   return toast.error("Please fill all required fields", "Error");
    // }

    if (values.commodityid !== shipperForEdit.commodityid) {
      shipperForEdit.loadtime = values.loadtime;
      shipperForEdit.unloadtime = values.unloadtime;
      shipperForEdit.loadflag = values.loadflag;
      (shipperForEdit.actiontype = isShipperOrConsignee.shipper ? "PU" : "DEL"),
        (shipperForEdit.cgid = shipperForEdit.commoditygroupid);
      shipperForEdit.commodityid = shipperForEdit.commodityid;

      const {
        commoditygroupid,
        commodityid,
        loadtime,
        unloadtime,
        loadflag,
        actiontype,
      } = shipperForEdit;

      const Updatedata = {
        id: shipperForEdit.id,
        cgid: commoditygroupid,
        shipperid: locationById.id.toString(),
        actiontype: actiontype,
        loadflag: loadflag,
        // commodityid: commodityid,
        commodityid: commodityid === undefined ? null : commodityid,
        loadtime: loadtime,
        unloadtime: unloadtime,
      };
      const lutService = new LUTRuleService();
      try {
        const UpdatedRes = await lutService.updateLUTRule(Updatedata);
        if (UpdatedRes.length > 0) {
          const lUTRuleService = new LUTRuleService();
          const loadTime = await lUTRuleService.getLutrulesbyshipper(
            locationById.id.toString(),
            searchtext
          );
          if (loadTime.length > 0) {
            setallShipperLoadTime(loadTime);
            props.parentCallBackForShipperLoadTimes(loadTime);
            toast.success(
              "Load/Unload Override Updated successfully",
              "Success"
            );
            setshowEditModal(false);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Load/Unload Override not Updated successfully", "Error");
      }
    } else {
      const Updatedata = {
        id: shipperForEdit.id,
        cgid: values.cgid,
        shipperid: locationById.id.toString(),
        actiontype: values.actiontype,
        loadflag: values.loadflag,
        commodityid: values.commodityid,
        loadtime: values.loadtime,
        unloadtime: values.unloadtime,
      };
      const lutService = new LUTRuleService();
      try {
        setIsLoading(true);
        const UpdatedRes = await lutService.updateLUTRule(Updatedata);
        if (UpdatedRes.length > 0) {
          const lUTRuleService = new LUTRuleService();
          const loadTime = await lUTRuleService.getLutrulesbyshipper(
            locationById.id.toString(),
            searchtext
          );
          if (loadTime.length > 0) {
            setallShipperLoadTime(loadTime);
            props.parentCallBackForShipperLoadTimes(loadTime);
            setshowEditModal(false);
          }
        }
        setIsLoading(false);
        toast.success("Load/Unload Override Updated successfully", "Success");
      } catch (error) {
        setIsLoading(false);
        toast.error("Load/Unload Override not Updated successfully", "Error");
      }
    }
  };
  const commodityGroupIdHandler = (e, value) => {
    if (value) {
      setseletedCG(value);
      setLoadTimesDetails((item) => ({
        ...item,
        cgid: value.code,
        locationid: locationById.id.toString(),
      }));
    }
  };

  const captureStopType = (value) => {
    setLoadTimesDetails((item) => ({
      ...item,
      actiontype: value,
    }));
  };

  const captureLoadFlag = (e, value) => {
    // setLoadTimesDetails((item) => ({
    //   ...item,
    //   loadflag: value,
    // }));
    setLoadOption(value.status);
  };

  const captureUnLoadFlag = (e, value) => {
    setUnloadOption(value.status);
  };

  const commodityIdHandler = (e, value) => {
    if (value) {
      setLoadTimesDetails((item) => ({
        ...item,
        commodityid: value.id,
      }));
    }
  };

  const captureDuration = (value) => {
    setLoadTimesDetails((item) => ({
      ...item,
      loadtime: value,
    }));
  };

  function handleCloseForCreate() {
    setLoadTimesDetails({});
    setLoadOption("");
    setUnloadOption("");
    setModalShow(false);
  }

  function handleCloseForEdit() {
    setshowEditModal(false);
  }

  const arrayData = isShipperOrConsignee.shipper
    ? dataResult.data?.filter((it) => it.actiontype === "PU")
    : dataResult.data?.filter((it) => it.actiontype === "DEL");
  const time = isShipperOrConsignee.shipper ? "loadtime" : "unloadtime";

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <div className="col-xl-12">
        <div className="card card_shadow">
          <div className="card-body">
            <div className="load_header">
              <div>
                <h2 className="header-title1">
                  {isShipperOrConsignee.shipper
                    ? "Location Load Time Override"
                    : "Location Unload Time Override"}
                </h2>
              </div>
              <div className="addbutton">
                <Tooltip title="Add">
                  <button
                    type="button"
                    className="btn_blue btn-blue mb-20"
                    onClick={(e) => updateLoadTimeHandler(e)}
                    disabled={accessDisabled ? true : false}
                    style={{ background: accessDisabled ? "#dddddd" : "" }}
                  >
                    ADD
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="table-responsive">
              <div className="button-right">
                {allShipperLoadTime ? (
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
                    data={arrayData}
                    onDataStateChange={dataStateChange}
                    // onRowClick={(e) => props.parentcallback(true, e.dataItem)}
                  >
                    <GridColumn
                      title="Action"
                      filterable={false}
                      cell={(e) =>
                        e?.dataItem?.shipperid && (
                          <>
                            <button
                              className="btn_blue_sm btn-blue ml_10"
                              onClick={() => editShipperPool(e?.dataItem)}
                              disabled={accessDisabled ? true : false}
                              style={{background: accessDisabled ? "#dddddd" : "",}}
                            >
                              <i class="fa fa-pencil mr_5 del_icon" aria-hidden="true"></i>
                              Edit
                            </button>

                            <button
                              className="btn_blue_sm btn-blue ml_10"
                              onClick={() => 
                                openDeleteShipperModal(e?.dataItem)
                              } 
                              disabled={accessDisabled ? true : false}
                              style={{background: accessDisabled ? "#dddddd" : ""}}
                            >
                              <i class="fa fa fa-trash mr_5 del_icon" aria-hidden="true"></i>
                              Delete
                            </button>
                          </>
                        )
                      }
                    />
                    <GridColumn
                      field="commoditygroup"
                      title="Commodity Group"
                    />
                    <GridColumn field="commodity" title="Commodity" />
                    <GridColumn field="actiontype" title="Stop Type" />
                    <GridColumn
                      field="driverloadflag"
                      title="Driver Load/Unload Flag"
                    />
                    <GridColumn field={time} title="Duration (mins)" />
                  </Grid>
                ) : isLoading ? (
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

          {/* create loadtime modal */}
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {isShipperOrConsignee.shipper
                  ? "Location Load Time Override"
                  : "Location Unload Time Override"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={createLoadTime}>
                <MuiGrid spacing={2}>
                  <MuiGrid item xs={12}>
                    <label for="typeHeadCommodityGroup">
                      Stop Type - {isShipperOrConsignee.shipper ? "PU" : "DEL"}
                    </label>
                    {/* <div className="meterial_autocomplete">
                      {hide ? (
                        <TextField
                          fullWidth
                          select
                          variant="outlined"
                          name="actiontype"
                          class="label_padding"
                          placeholder="Select Stop Type"
                          size="small"
                          onChange={(e) => captureStopType(e.target.value)}
                        >
                          {isShipperOrConsignee.shipper ? (
                            <MenuItem value="PU">PU</MenuItem>
                          ) : (
                            <MenuItem value="DP">DEL</MenuItem>
                          )}
                        </TextField>
                      ) : (
                        
                      )}
                    </div> */}
                  </MuiGrid>

                  <MuiGrid item xs={12}>
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
                  </MuiGrid>

                  <MuiGrid item xs={12}>
                    <label for="typeHeadCommodityGroup">Commodity *</label>

                    <div className="meterial_autocomplete">
                      <Autocomplete
                        id="combo-box-demo"
                        options={
                          seletedCG?.commodities?.length > 0
                            ? seletedCG?.commodities
                            : []
                        }
                        getOptionLabel={(option) => `${option?.name}`}
                        onChange={commodityIdHandler}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose a Commodity..."
                            variant="outlined"
                          />
                        )}
                      />
                    </div>

                    <MuiGrid item xs={12}>
                      <label for="typeHeadCommodityGroup">
                        {isShipperOrConsignee.shipper
                          ? "Driver Load Flag *"
                          : "Driver Unload Flag *"}
                      </label>
                      <div className="meterial_autocomplete">
                        {/* <TextField
                          fullWidth
                          select
                          variant="outlined"
                          name="loadflag"
                          size="small"
                          placeholder="Choose a load flag..."
                          onChange={(e) => captureLoadFlag(e.target.value)}
                        >
                          {isShipperOrConsignee.shipper
                            ? loadoption.map((option) => (
                                <MenuItem key={option.id} value={option.status}>
                                  {option.status}
                                </MenuItem>
                              ))
                            : unloadoption.map((option) => (
                                <MenuItem key={option.id} value={option.status}>
                                  {option.status}
                                </MenuItem>
                              ))}
                        </TextField> */}
                        {isShipperOrConsignee.shipper ? (
                          <Autocomplete
                            id="combo-box-demo"
                            options={loadoption}
                            getOptionLabel={(option) => `${option.status}`}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder={
                                  isShipperOrConsignee.shipper
                                    ? "Choose a Driver Load Flag"
                                    : "Choose a Driver Unload Flag"
                                }
                              />
                            )}
                            onChange={captureLoadFlag}
                          />
                        ) : (
                          <Autocomplete
                            id="combo-box-demo"
                            options={unloadoption}
                            getOptionLabel={(option) => `${option.status}`}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={
                                  isShipperOrConsignee.shipper
                                    ? "Choose a Driver Load Flag"
                                    : "Choose a Driver Unload Flag"
                                }
                                variant="outlined"
                              />
                            )}
                            onChange={captureUnLoadFlag}
                          />
                        )}
                      </div>
                    </MuiGrid>
                  </MuiGrid>
                  <MuiGrid item xs={12}>
                    <label for="typeHeadCommodityGroup">
                      Duration (mins) *
                    </label>
                    <div className="meterial_autocomplete">
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="number"
                        name="loadtime"
                        placeholder="Enter Duration (mins)"
                        size="small"
                        onChange={(e) => captureDuration(e.target.value)}
                      />
                    </div>
                  </MuiGrid>
                </MuiGrid>
                <Modal.Footer>
                  <Button onClick={handleCloseForCreate}>Close</Button>
                  <Button type="sumbit">Save</Button>
                </Modal.Footer>
              </form>
            </Modal.Body>
          </Modal>

          {/* formik edit modal */}
          <Modal
            show={showEditModal}
            onHide={() => setshowEditModal(false)}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {isShipperOrConsignee.shipper
                  ? "LOAD TIMES UPDATE"
                  : "UNLOAD TIMES UPDATE"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                initialValues={{
                  // shipperForEdit.commoditygroup === ""
                  //                     ? shipper.commoditygroupid
                  //                     : shipper.commoditygroup
                  cgid:
                    shipperForEdit.commoditygroup === ""
                      ? shipperForEdit.commoditygroupid
                      : shipperForEdit.commoditygroup || "",
                  actiontype: isShipperOrConsignee.shipper ? "PU" : "DEL" || "",
                  loadflag: shipperForEdit.driverloadflag || "",
                  commodityid: shipperForEdit.commodity || "",
                  loadtime: shipperForEdit.loadtime || "",
                  unloadtime: shipperForEdit.unloadtime || "",
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  updateShipper(values);
                  setSubmitting(false);
                }}
              >
                {({ errors, handleChange, touched, values, setFieldValue }) => (
                  <>
                    <Form>
                      <Modal.Body>
                        <MuiGrid container spacing={2}>
                          <div className="meterial_autocomplete">
                            {/* <TextField
                              fullWidth
                              select
                              variant="outlined"
                              placeholder="Choose a action type..."
                              margin="normal"
                              name="actiontype"
                              size="small"
                              value={values.actiontype}
                              onChange={handleChange}
                              disabled={editDisable}
                            >
                              {isShipperOrConsignee.shipper ? (
                                <MenuItem value="PU">PU</MenuItem>
                              ) : (
                                <MenuItem value="DP">DEL</MenuItem>
                              )}
                            </TextField> */}
                            <label for="typeHeadCommodityGroup">
                              Stop Type -{" "}
                              {isShipperOrConsignee.shipper ? "PU" : "DEL"}{" "}
                            </label>
                          </div>

                          <label for="typeHeadCommodityGroup">
                            Commodity Groups *
                          </label>
                          <div className="meterial_autocomplete">
                            <Autocomplete
                              id="combo-box-demo"
                              size="small"
                              placeholder="Choose a commodity group...N"
                              options={allCGs}
                              disabled={editDisable}
                              getOptionLabel={(option) =>
                                setseletedCG(option) || option.description
                              }
                              // shipperForEdit.commoditygroup === ""
                              //                     ? shipper.commoditygroupid
                              //                     : shipper.commoditygroup
                              defaultValue={{
                                code:
                                  shipperForEdit.commoditygroup === ""
                                    ? shipperForEdit.commoditygroupid
                                    : shipperForEdit.commoditygroup,
                                description:
                                  shipperForEdit.commoditygroup === ""
                                    ? shipperForEdit.commoditygroupid
                                    : shipperForEdit.commoditygroup,
                              }}
                              // onChange={(e, newVal) => {
                              //   if (typeof newVal !== "string" && newVal !== null) {
                              //     setFieldValue("cgid", newVal.code);
                              //   } else if (newVal === null) {
                              //     setFieldValue("cgid", "");
                              //   }
                              // }}
                              getOptionSelected={(option) => option.code}
                              fullWidth
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="cgid"
                                  error={touched.cgid && Boolean(errors.cgid)}
                                  helperText={touched.cgid && errors.cgid}
                                  variant="outlined"
                                  onChange={handleChange}
                                  disabled={editDisable}
                                />
                              )}
                            />
                          </div>

                          <label for="typeHeadCommodityGroup">
                            Commodity *
                          </label>
                          <div className="meterial_autocomplete">
                            <TextField
                              fullWidth
                              placeholder="e.g. 323"
                              select
                              variant="outlined"
                              margin="normal"
                              name="commodityid"
                              size="small"
                              value={values.commodityid}
                              onChange={handleChange}
                              disabled={editDisable}
                              // error={touched.commodityid && Boolean(errors.commodityid)}
                              // helperText={touched.commodityid && errors.commodityid}
                            >
                              {shipperForEdit.commodity ? (
                                <MenuItem
                                  key={shipperForEdit.id}
                                  value={shipperForEdit.commodity}
                                >
                                  {shipperForEdit.commodity}
                                </MenuItem>
                              ) : (
                                <MenuItem key="0" value="">
                                  Choose a product...
                                </MenuItem>
                              )}
                              {seletedCG.commodities?.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </div>
                          <label for="typeHeadCommodityGroup">
                            {isShipperOrConsignee.shipper
                              ? "Driver Load Flag *"
                              : "Driver Unload Flag *"}
                          </label>
                          <div className="meterial_autocomplete">
                            <TextField
                              fullWidth
                              select
                              variant="outlined"
                              margin="normal"
                              placeholder="Choose a load flag..."
                              name="loadflag"
                              size="small"
                              value={values.loadflag}
                              onChange={handleChange}
                              disabled={editDisable}
                              // error={touched.loadflag && Boolean(errors.loadflag)}
                              // helperText={touched.loadflag && errors.loadflag}
                            >
                              {isShipperOrConsignee.shipper
                                ? loadoption.map((option) => (
                                    <MenuItem
                                      key={option.id}
                                      value={option.status}
                                      placeholder="Choose a load flag..."
                                    >
                                      {option.status}
                                    </MenuItem>
                                  ))
                                : unloadoption.map((option) => (
                                    <MenuItem
                                      key={option.id}
                                      value={option.status}
                                      placeholder="Choose a load flag..."
                                    >
                                      {option.status}
                                    </MenuItem>
                                  ))}
                            </TextField>
                          </div>

                          <label for="typeHeadCommodityGroup">
                            Duration (mins) *
                          </label>

                          {isShipperOrConsignee.shipper ? (
                            <div className="meterial_autocomplete">
                              <TextField
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                name="loadtime"
                                placeholder="e.g. 30"
                                size="small"
                                value={values.loadtime}
                                onChange={handleChange}
                              />
                            </div>
                          ) : (
                            <div className="meterial_autocomplete">
                              <TextField
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                name="unloadtime"
                                placeholder="e.g. 30"
                                size="small"
                                value={values.unloadtime}
                                onChange={handleChange}
                              />
                            </div>
                          )}
                        </MuiGrid>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={handleCloseForEdit}>Close</Button>
                        <Button type="sumbit">Save</Button>
                      </Modal.Footer>
                    </Form>
                  </>
                )}
              </Formik>
            </Modal.Body>
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
                {isShipperOrConsignee.shipper
                  ? "  Delete Shipper Load Times"
                  : "Delete Consignee Unload Times"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div class="form-group">
                <p>
                  Are you sure you want to Delete Load Time:&nbsp;
                  {isShipperOrConsignee.shipper
                    ? shipperForEdit.loadtime
                    : shipperForEdit.unloadtime}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={(e) => setshowDeleteModal(false)}>Close</Button>
              <Button onClick={(e) => deleteShipper(e)}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default LoadTimesForLocation;
