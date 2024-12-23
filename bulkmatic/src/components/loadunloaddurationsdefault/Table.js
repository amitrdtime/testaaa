import Modal from "react-bootstrap/Modal";
import { Form, Formik } from "formik";
import { Grid, TextField } from "@material-ui/core";
import * as yup from "yup";
import { Button } from "@mui/material";
import {useEffect, useState, useContext } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import LUTRuleService from "../../services/loadunloadruleService";
import { ContextData } from "../../components/appsession";

const Table = (props) => {
  const [userData, setuserData] = useContext(ContextData);
  const planners = userData.roles?.map((e) => e.permissionAccess)
  const lutdur = planners[0].filter(element => element.permission === "Loading/Unloading Durations")
  
  //console.log('lutdur',lutdur)

  const {
    tablelist,
    setModalShow,
    modalShow,
    setTablelist,
    parentCallBackForDuration,
  } = props;
  const [editdata, setEditdata] = useState({});
  const [hide, setHide] = useState(false);

   const [isDisabled, setIsDisabled] = useState(false)
  const isAccess = () => {
    const permission = userData?.roles[0]?.permissionAccess.map(permit => {
      if(permit?.permission == "Loading/Unloading Durations" && permit?.isEdit == false){
          setIsDisabled(true)
      }
          
    });
  }
  useEffect(()=>{
    isAccess()
  },[])
  const theadstyle = {
    backgroundColor: "#4267B2",
    color: "#000",
    borderRadius: "10px",
    fontSize: "14px",
  };

  const thstyle = {
    color: "#fff",
  };

  const editButton = (data) => {
    setModalShow(true);
    setEditdata(data);
  };

  const updateDuration = async (values) => {
    const obj1 = {
      ...editdata,
    };
    const obj2 = values;
    const returnedTarget = Object.assign(obj1, obj2);
    if (returnedTarget.action_type === "PU" || returnedTarget.action_type === "SP") {
      const payload = {
        id: returnedTarget.id,
        actiontype: returnedTarget.action_type,
        loadflag: returnedTarget.driver_load_flag,
        cgid: returnedTarget.commoditygroup_id,
        commodityid:
          returnedTarget.commodityid === undefined
            ? null
            : returnedTarget.commodityid,
        shipperid:
          returnedTarget.shipper_id === undefined
            ? null
            : returnedTarget.shipper_id,
        loadtime:
          returnedTarget.duration === undefined
            ? null
            : returnedTarget.duration,
      };
      
      const lutService = new LUTRuleService();
      try {
        const UpdatedRes = await lutService.updateLUTRule(payload);
        if (UpdatedRes.length > 0) {
          const DefaultLutRules = new LUTRuleService();
          const data = await DefaultLutRules.getDefaultLutRules();
          setTablelist(data);
          setModalShow(false);
        }
      } catch (error) {
        
      }
    } else {
      const payload = {
        id: returnedTarget.id,
        actiontype: returnedTarget.action_type,
        loadflag: returnedTarget.driver_load_flag,
        cgid: returnedTarget.commoditygroup_id,
        commodityid:
          returnedTarget.commodityid === undefined
            ? null
            : returnedTarget.commodityid,
        shipperid:
          returnedTarget.shipperid === undefined
            ? null
            : returnedTarget.shipperid,
        unloadtime:
          returnedTarget.duration === undefined
            ? null
            : returnedTarget.duration,
      };
      

      const lutService = new LUTRuleService();
      try {
        const UpdatedRes = await lutService.updateLUTRule(payload);
        if (UpdatedRes.length > 0) {
          const DefaultLutRules = new LUTRuleService();
          const data = await DefaultLutRules.getDefaultLutRules();
          setTablelist(data);
          setModalShow(false);
        }
      } catch (error) {
        
      }
    }
  };

  return (
    <div className="col-xl-12">
      <div className="table-responsive">
        <table className="table">
          <thead className="thead-dark " style={theadstyle}>
            <tr>
              <th scope="col" style={thstyle}>
                StopType
              </th>
              <th scope="col" style={thstyle}>
                Description
              </th>
              <th scope="col" style={thstyle}>
                DriverLoad/Unload Flag
              </th>
              <th scope="col" style={thstyle}>
                Duration (min)
              </th>
              <th scope="col" style={thstyle}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {props.isDataloaded ? (
              tablelist?.map((data) => {
                return (
                  <tr
                    key={data?.id}
                    className="text-uppercase font-weight-bold"
                  >
                    <th scope="row" className="text-uppercase font-weight-bold">
                      {data.action_type === "DP"
                        ? "DEL"
                        : data.action_type === "PU"
                        ? "PU"
                        : data.action_type === "SP"
                        ? "SP"
                        : data.action_type === "SD"
                        ? "SD"
                        : "UNKNOWN"}
                    </th>
                    <td className="text-uppercase font-weight-bold">
                      {data.action_type === "PU"
                        ? "Pickup"
                        : data.action_type === "DP"
                        ? "Delivery"
                        : data.action_type === "SP"
                        ? "SPLIT PICKUP"
                        : "SPLIT DELIVERY"}
                    </td>
                    <td className="text-uppercase font-weight-bold">
                      {data.driver_load_flag}
                    </td>
                    <td className="text-uppercase font-weight-bold">
                      {data?.action_type === "DP" || data?.action_type === "SD"
                        ? data?.unload_time
                        : data?.load_time}
                    </td>
                    {/* { lutdur[0].isEdit ?
                    <td>
                      <button
                        className="btn_blue_sm btn-blue ml_10"
                        onClick={() => editButton(data)}
                      >
                        Edit
                      </button>
                    </td>
                    : 
                    <td>
                    <button
                      className="btn_blue_sm btn-blue ml_10"
                      disabled
                    >
                      Edit
                    </button>
                  </td>
                  } */}
                  <td>
                    <button
                      className="btn_blue_sm btn-blue ml_10"
                      onClick={() => editButton(data)}
                      disabled={isDisabled ? true : false}
                      style={{background : isDisabled ? "#dddddd" : ""}}
                    >
                      Edit
                    </button>
                  </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5">
                  <ProgressBar animated now={100} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Duration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              duration:
                editdata?.action_type === "DP" || editdata?.action_type === "SD"
                  ? editdata?.unload_time
                  : editdata?.load_time,
              driverloadflag: editdata?.driver_load_flag,
              actiontype: editdata?.action_type,
              id: editdata?.id,
            }}
            validationSchema={yup.object().shape({
              duration: yup.string().required("Duration is required"),
              // driverloadflag: yup
              //   .string()
              //   .required("DriverLoad/Unload Flag is required"),
              // actiontype: yup.string().required("Action Type is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              updateDuration(values);
              setSubmitting(false);
            }}
          >
            {({ errors, handleChange, touched, values, setFieldValue }) => (
              <Form>
                <Modal.Body>
                  <Grid container spacing={2}>
                    {hide ? (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            id="id"
                            name="id"
                            label="id"
                            type="number"
                            fullWidth
                            value={values.id}
                            onChange={handleChange}
                            error={errors.id && touched.id}
                            helperText={errors.id && touched.id}
                          />
                        </Grid>
                      </>
                    ) : (
                      ""
                    )}
                    <label for="typeHeadCommodityGroup">Duration Mins</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      name="duration"
                      placeholder="e.g. 30 mins"
                      size="small"
                      value={values.duration}
                      onChange={handleChange}
                      error={touched.duration && Boolean(errors.duration)}
                      helperText={touched.duration && errors.duration}
                    />
                    <label for="typeHeaddriverloadflag">Driver load flag</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      name="driverloadflag"
                      placeholder="e.g. Yes or No"
                      size="small"
                      value={values.driverloadflag}
                      onChange={handleChange}
                      error={
                        touched.driverloadflag && Boolean(errors.driverloadflag)
                      }
                      helperText={
                        touched.driverloadflag && errors.driverloadflag
                      }
                      disabled={true}
                    />
                    <label for="typeHeaddriverloadflag">Stop Type</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      name="actiontype"
                      placeholder="PU"
                      size="small"
                      value={values.actiontype}
                      onChange={handleChange}
                      error={touched.actiontype && Boolean(errors.actiontype)}
                      helperText={touched.actiontype && errors.actiontype}
                      disabled={true}
                    />
                  </Grid>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => setModalShow(false)}>Close</Button>
                  <Button type="sumbit">Save</Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Table;
