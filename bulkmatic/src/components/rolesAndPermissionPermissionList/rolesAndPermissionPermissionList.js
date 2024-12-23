import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import PermissionService from "../../services/permissionService";
import RoleService from "../../services/roleService";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "./rolesAndPermissionPermissionList.css";
import { ContextData } from "../../components/appsession";
import UserService from "../../services/userService";
import { ConstructionOutlined } from "@mui/icons-material";
import ProgressBar from "react-bootstrap/ProgressBar";

const RolesAndPermissionPermissionList = ({ role, rolesHandler, accessDisabled }) => {
  const [userData, setuserData] = useContext(ContextData);
  const [modalShow, setModalShow] = useState(false);
  const [allPermissionsBeforeSave, setAllPermissions] = useState([]);
  const [permName, setPermName] = useState("");
  const [permDesc, setPermDesc] = useState("");
  const [checkedPermission, setCheckedPermissions] = useState([]);
  const [updateData, setupdateData] = useState({});
  const [arr, setArr] = useState([]);
  const [roleIsActive, setRoleIsActive] = useState(role.isActive);
  const [roleData, setRoleData] = useState(role);
  const [roles, setRoles] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const save = async () => {
    const permissionService = new PermissionService();
    const allPermissionsBeforeSave = await permissionService.getAllPermission();
    setAllPermissions(allPermissionsBeforeSave);
    setModalShow(false);
  };

  useEffect(async () => {
    try {
      const roleService = new RoleService();
      const roleValue = await roleService.getRole(role.roleId);
      setRoleIsActive(roleValue.isActive);
      setRoleData(roleValue);
      const permissionService = new PermissionService();
      const allpermissions = await permissionService.getAllPermission();
      setAllPermissions(allpermissions);
      setArr(roleValue.permissionAccess);
      setIsLoading(false);
    } catch (err) {
      return NotificationManager.error(err, "Error");
    }
  }, []);

  const savePermission = async (rlRole) => {
    const roleService = new RoleService();
    try {
      const roleServiceReponse = await roleService.updateRole(
        rlRole,
        arr,
        roleIsActive
      );
      NotificationManager.success(
        "Permissions Updated, Application Will Reload In 15 Seconds",
        "Success"
      );
      rolesHandler(true);
      setTimeout(function () {
        window.location.reload();
      }, 15000);
      rolesHandler(true);
    } catch (error) {
      return NotificationManager.error("Permission Update Failed", "Error");
    }
  };

  const checkboxHandler = (e, item, roleType) => {
    if (roleType === "view") {
      let tempArray = arr;
      let b = {
        permId: item.permId,
        permission: item.permName,
        isView: e.target.checked,
      };
      const arrayIndex = arr.findIndex((element) => element.permId == b.permId);

      if (arrayIndex > -1) {
        tempArray[arrayIndex].isView = e.target.checked;

        setArr(tempArray);
      } else {
        b.isEdit = false;
        const newarr = [...arr, b];
        setArr(newarr);
      }
    }
    if (roleType === "edit") {
      let tempArray = arr;
      let b = {
        permId: item.permId,
        permission: item.permName,
        isEdit: e.target.checked,
      };
      const arrayIndex = arr.findIndex((element) => element.permId == b.permId);

      if (arrayIndex > -1) {
        tempArray[arrayIndex].isEdit = e.target.checked;
        setArr(tempArray);
      } else {
        b.isView = false;
        const newarr = [...arr, b];
        setArr(newarr);
      }
    }
  };

  const editIsActiveHandler = (e) => {
    let isActive = e.target.checked;

    if (!isActive) {
      if (roles.includes(role.roleName)) {
        NotificationManager.error(
          "This role cannot be deactivated as it is assigned to users",
          "Error"
        );
        setRoleIsActive(true);
      } else {
        setRoleIsActive(e.target.checked);
      }
    } else {
      setRoleIsActive(e.target.checked);
    }
  };
  return (
    <>
       <NotificationContainer />

      <div className="row mt_30">
        <div className="col-xl-12">
          <div className="card card_shadow">
            <div className="card-body ">
              <div className="permissionchklistbutton">
                {/* <button type="button" className="btn_blue btn-blue ml_10"  onClick={() => setModalShow(true)}>ADD</button> */}
                {userData.userAccess.hasRolesEditAccess === true && !accessDisabled ? (
                  <button
                    type="button"
                    className="btn_blue btn-blue"
                    onClick={() => savePermission(role)}
                  >
                    SAVE
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={true}
                    // onClick={() => savePermission(role)}
                  >
                    SAVE
                  </button>
                )}
              </div>
              {isloading ? (
                <div>
                  <ProgressBar animated now={100} />
                </div>
              ) : (
                <div>
                  <div className="table_header_section">
                    <div className="table_header">
                      Permission Checklist ({roleData.roleName})
                    </div>
                    <div className="roleIsActive">
                      <input
                        type="checkbox"
                        id="roleIsActive"
                        disabled={
                          userData.roles[0].permissionAccess.filter(
                            (i) =>
                              i.permission === "Roles" && i.isEdit === false
                          ).length > 0
                            ? true
                            : false
                        }
                        checked={roleIsActive}
                        onChange={(e) => editIsActiveHandler(e)}
                      />
                      <label className="pl_6" htmlFor="roleIsActive">
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-borderless mb-0">
                      <thead className="table-light othertableheader">
                        <tr>
                          <th>Permission Name</th>
                          <th>View</th>
                          <th>Edit</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allPermissionsBeforeSave.length > 0 && !isloading ? (
                          allPermissionsBeforeSave.map((item) => (
                            <tr id={item.id}>
                              <th scope="row">{item.permName}</th>
                              <td>
                                <div className={accessDisabled ? "form-group1 disabledCheckbox" : "form-group1" }>
                                  <input
                                    type="checkbox"
                                    id={"view_" + item.permId}
                                    disabled={
                                      accessDisabled ? true :
                                      !userData.userAccess.hasRolesEditAccess
                                    }
                                    defaultChecked={
                                      arr.length > 0
                                        ? arr.filter(
                                            (i) => i.permId === item.permId
                                          )[0]?.isView
                                        : roleData.permissionAccess.find(
                                            (it) =>
                                              it.permId === item.permId &&
                                              it.isView === true
                                          )
                                    }
                                    onChange={(e) =>
                                      checkboxHandler(e, item, "view", roleData)
                                    }
                                  />
                                  <label
                                    htmlFor={"view_" + item.permId}
                                  ></label>
                                </div>
                              </td>
                              <td>
                                <div
                                  className={
                                    item.allowEdit === true && accessDisabled == false 
                                      ? "form-group1"
                                      : "form-group1 disabledCheckbox"
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    id={"edit_" + item.permId}
                                    disabled={
                                      accessDisabled ? true : (!item.allowEdit ||
                                        !userData.userAccess.hasRolesEditAccess)
                                    }
                                    defaultChecked={
                                      arr.length > 0
                                        ? arr.filter(
                                            (i) => i.permId === item.permId
                                          )[0]?.isEdit
                                        : roleData.permissionAccess.find(
                                            (it) =>
                                              it.permId === item.permId &&
                                              it.isEdit === true
                                          )
                                    }
                                    onChange={(e) =>
                                      checkboxHandler(e, item, "edit", roleData)
                                    }
                                  />
                                  <label
                                    htmlFor={"edit_" + item.permId}
                                  ></label>
                                </div>
                              </td>
                              <td>{item.description}</td>
                            </tr>
                          ))
                        ) : (
                          <div className="loader_wrapper">
                            <Spinner animation="border" variant="primary" />
                            <div>
                              <ProgressBar animated now={100} />
                            </div>
                          </div>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
            PERMISSION CREATION
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="form-group">
            <label for="exampleFormControlInput1">PERMISSION NAME</label>
            <input
              type="text"
              class="form-control"
              id="txtPermissionName"
              onInput={(event) => setPermName(event.target.value)}
              placeholder="e.g. Terminal Planner"
            />
            <label for="exampleFormControlInput1">PERMISSION DESCRIPTION</label>
            <input
              type="text"
              class="form-control"
              id="txtPermissionDesc"
              onInput={(event) => setPermDesc(event.target.value)}
              placeholder="e.g. Terminal Planner"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setModalShow(false)}>Close</Button>
          <Button onClick={(e) => save()}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RolesAndPermissionPermissionList;
