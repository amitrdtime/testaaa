import React, { useState, useEffect, useContext } from "react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import RoleService from "../../services/roleService";

import { NotificationManager } from "react-notifications";
import Spinner from "react-bootstrap/Spinner";
import { ContextData } from "../../components/appsession";
import { Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import ProgressBar from "react-bootstrap/ProgressBar";

import PermissionLists from "../rolesAndPermissionPermissionList/PermissionList";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import { process } from "@progress/kendo-data-query";

const errors = {
  color: "red",
};

const RolesAndPermissionTable = (props) => {
  const [userData, setuserData] = useContext(ContextData);
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [{
      field: '',
      dir: 'desc'
    }],
  });

  const { parentcallback, roles, accessDisabled } = props;

  const [modalShow, setModalShow] = useState(false);
  const [allroles, setallroles] = useState([]);

  const [dataResult, setDataResult] = useState(process(allroles, dataState));

  const [roleName, setRoleName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newRolePermission, setNewRolePermission] = useState([]);

  const dataStateChange = (event) => {
    setDataResult(process(allroles, event.dataState));
    setDataState(event.dataState);
  };


  useEffect(() => {
    setDataResult(process(allroles, dataState));
  }, [allroles]);

  const pageChange = (event) => {
    setPage(event.page);
  };
  const initialValues = {
    roleName: "",
  };

  const validation = yup.object().shape({
    roleName: yup
      .string()
      .required("Please enter a role name")
      .min(5, "Please enter min 5 char"),
  });

  const showAssignedRoles = (permissions) => {
    let toolTips = "";

    for (let loop = 1; loop < permissions.length; loop++) {
      toolTips =
        toolTips +
        permissions[loop].permission +
        " [" +
        (permissions[loop].isEdit ? "Edit" : "View") +
        "], ";
    }

    return toolTips;
  };

  const rolesClickHandler = (e, role) => {
    parentcallback(true, role);
  };

  const save = async () => {
    if (
      allroles.find((i) => i.roleName.toLowerCase() === roleName.toLowerCase())
    ) {
      return NotificationManager.error("Role Already Added", "error");
    }
    const roleService = new RoleService();
    const role = await roleService.createRole(roleName, newRolePermission);
    if (role) {
      NotificationManager.success("Role added successfully", "Success");
    }

    const allRolesAfterAdd = await roleService.getAllRole();
    setallroles(allRolesAfterAdd);
    setModalShow(false);
  };

  const handleAddPermissionChecked = (perms) => {
    
    setNewRolePermission(perms);
  };

  const handlePageChange = (e, newPage) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };


  useEffect(() => {
    if (roles.length > 0) {
      setallroles(roles);
    }
  }, [roles.length]);

  useEffect(() => {
    let arr = [];
    if (allroles.length > 0) {
      for (let index = 0; index < allroles.length; index++) {
        let a = allroles[index].permissionAccess
          // .map((e) => e.permission +((e.isEdit && e.isView)?"(both)":(e.isEdit?"(edit)":""))  )
          .map((e) => {
            if((e.isEdit && e.isView)){
              return e.permission+"(both)"
            }
            else{
              if(e.isEdit){
                return e.permission+"(edit)"
              }
              if(e.isView){
                return e.permission+"(view)"
              }
            }
          }
        
           ).filter((el)=>el !=null)
          .join(" , ");

        arr.push(Object.assign(allroles[index], { allRoles: a }));
      }
      setallroles(arr);
    }
  }, [allroles.length]);
  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body ">
              <div className="table-responsive">
              <div className="addbutton role_add_adjust">
               {userData?.userAccess?.hasRolesEditAccess ? 
                <>
                  {accessDisabled ? 
                    <button
                      type="button"
                      className="btn_blue btn-blue ml_10"
                      // onClick={() => setModalShow(true)}
                      disabled={true}
                      style={{background : "#dddddd"}}
                    >
                      ADD
                    </button> : 
                    <button
                    type="button"
                    className="btn_blue btn-blue ml_10"
                    onClick={() => setModalShow(true)}
                    >
                      ADD
                    </button>}
                 </>
                : 
                 ""
               }
                </div>
                
                 {allroles?.length > 0 ? (
               
             
                <Grid
                  filter={dataState.filter}
                  filterable={true}
                  sort={dataState.sort}
                  sortable={true}
                  pageable={{
                    pageSizes: [5, 10, 20, 25, 50, 100],
                    info: true,
                    previousNext: true,
                    buttonCount : 10
                  }}
                  resizable={true}
                  skip={dataState.skip}
                  take={dataState.take}
                  data={dataResult}
                  onDataStateChange={dataStateChange}
                  onRowClick={(e) => props.parentcallback(true, e.dataItem)}
                >
                  <GridColumn field="roleName" title="Roles" width="500px" />
                  
                  <GridColumn
                    field="allRoles"
                    title="Permission Name"
                    width="850px"
                  />
                </Grid>
                ) : (
                 
                  <div>
                  <ProgressBar animated now={100} 
                  />
                 <div className='middle loader--text1'> 
         
            </div>
                </div>
                )}
              </div>
              </div>
         
           
          </div>
        </div>
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validation}
          enableReinitialize={true}
          onSubmit={save}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  ROLE CREATION
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div class="form-group">
                  <label htmlFor="exampleFormControlInput1">ENTER ROLE NAME</label>
                  <input
                    type="text"
                    name="roleName"
                    class="form-control"
                    id="exampleFormControlInput1"
                    value={values.roleName}
                    onInput={(event) => setRoleName(event.target.value)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Administrator"
                  />
                  <PermissionLists
                    parentHandler={handleAddPermissionChecked}
                  ></PermissionLists>
                  <ErrorMessage
                    name="roleName"
                    render={(error) => <div style={errors}>{error}</div>}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={(e) => setModalShow(false)}>Close</Button>
                <Button
                  type="submit"
                  // onClick={(e) => save()}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default RolesAndPermissionTable;
