import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../../components/header";
import AppBar from "../../components/appbar";
import RolesAndPermissionHeader from '../../components/rolesAndPermissionHeader/rolesAndPermissionHeader';
import RolesAndPermissionTable from '../../components/rolesAndPermissionTable/rolesAndPermissionTable';
import RolesAndPermissionPermissionList from '../../components/rolesAndPermissionPermissionList/rolesAndPermissionPermissionList';
import React, { useState, useEffect, useContext } from 'react';
import RoleService from '../../services/roleService';
import PermissionService from '../../services/permissionService';
import { ContextData } from "../../components/appsession";

function Roles() {
  const [userData, setuserData] = useContext(ContextData);
  const [isRoleClicked, setisRoleClicked] = useState(false)
  const [role, setRole] = useState({});
  const [allRoles, setAllRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [filterData, setfilterData] = useState("")
  const [roleCount, setRoleCount] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
console.log(userData)
  const isAccess = () => {
    const permission = userData?.roles[0]?.permissionAccess.map(permit => {
      if(permit?.permission == "Roles" && permit?.isEdit == false){
          setIsDisabled(true)
      }
          
    });
  }
  useEffect(async() => {
    const roleService = new RoleService();    
    const roles = await roleService.filterRoles(filterData);
    setAllRoles(roles)
    setRoleCount(roles.length);
    const permissionService = new PermissionService();
    const permissions = await permissionService.getAllPermission();
    setAllPermissions(permissions);
  }, [filterData])

  useEffect(async() => {
   isAccess()
  }, [role]);

  const handelcallback = (childdata, role) => {
    setRole(role);
    setisRoleClicked(childdata)
  }
  const handelcallbackFromHeader = (childdata) => {
    setisRoleClicked(childdata)
  }
  const parentCallBackForPermissionFilter=(searchData)=>{
    setfilterData(searchData)
  }

  const rolesHandler = async(isSaved) => {
    if (isSaved) {
        const roleService = new RoleService();
        const allRoles = await roleService.getAllRole();
        setAllRoles(allRoles)
    }
  }
  
  return (
    <div id="wrapper">
      <Header userclicked={isRoleClicked} parentcallback={handelcallbackFromHeader}></Header>
      <AppBar></AppBar>
      <div className="content-page">
        <div className="content">
          <div className="container-fluid">
            {!isRoleClicked ?
              <>
                <RolesAndPermissionHeader roleCount = { roleCount } parentCallBackForPermissionFilter={parentCallBackForPermissionFilter}/>
                <RolesAndPermissionTable  parentcallback={handelcallback} roles = {allRoles} accessDisabled={isDisabled}/>
              </>
              :
              <>
              <RolesAndPermissionPermissionList role = { role } rolesHandler = { rolesHandler } accessDisabled={isDisabled}/>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;