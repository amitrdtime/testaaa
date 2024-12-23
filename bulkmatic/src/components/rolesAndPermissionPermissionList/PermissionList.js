import React, { useState, useEffect, useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

import PermissionService from '../../services/permissionService';
import RoleService from '../../services/roleService';
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import './rolesAndPermissionPermissionList.css';
import { ContextData } from '../appsession';

const PermissionLists = ({ parentHandler }) => {
    const userData= useContext(ContextData);

    const [allPermissions, setAllPermissions] = useState([])
    const [arr, setArr] = useState([])

    useEffect(async () => {
        const permissionService = new PermissionService();
        const allpermissions = await permissionService.getAllPermission();
        setAllPermissions(allpermissions);
    }, [])

    const editCheckHandler = (e, item) => {
        let b = {
            "permId": item.permId,
            "permission": item.permName,
            "isEdit": e.target.checked
        }
        const objectToremove = arr.findIndex(element => element.permId == b.permId)
        if (objectToremove > -1) {
            const deleted = arr.splice(objectToremove, 1)
            b.isView = deleted.isView === undefined? false : deleted.isView;
            const newArr = [...arr, b]
            setArr(newArr)
        }
        else {
            b.isView = false;
            const newarr = [...arr, b]
            setArr(newarr)
        }
        parentHandler(arr)
    }

    const viewCheckHandler = (e, item) => {
        let b = {
            "permId": item.permId,
            "permission": item.permName,
            "isView": e.target.checked
        }
        const objectToremove = arr.findIndex(element => element.permId == b.permId)
        if (objectToremove > -1) {
            const deleted = arr.splice(objectToremove, 1)
            b.isEdit = deleted.isEdit === undefined? false : deleted.isEdit;
            const newArr = [...arr, b]
            setArr(newArr)
        }
        else {
            b.isEdit = false;
            const newarr = [...arr, b]
            setArr(newarr)
        }
        parentHandler(arr)
    }

    return (
        <>
            <div className="row mt_30">
                <div className="col-xl-12">
                    <div className="card card_shadow">
                        <div className="card-body ">
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
                                        {
                                            allPermissions.map((item) => (
                                                <tr id={item.id} key={item.id}>
                                                    <th scope="row">{item.permName}</th>
                                                    <td>
                                                        <div className="form-group1">
                                                            <input type="checkbox" id={"view_" + item.permId} 
                                                                disabled = {!userData.userAccess?.hasRolesEditAccess}
                                                                defaultChecked={arr.length > 0 ?
                                                                    arr.filter(i => i.permId === item.permId)[0]?.isView : false}
                                                                onChange={(e) => viewCheckHandler(e, item)} />
                                                            <label htmlFor={"view_" + item.permId}></label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className = {(item.allowEdit === true) ? 'form-group1' : 'form-group1 disabledCheckbox' }>
                                                            <input type="checkbox" id={"edit_" + item.permId}                                                                      
                                                                disabled = {!item.allowEdit || !userData.userAccess?.hasRolesEditAccess}                                                        
                                                                defaultChecked={arr.length > 0 ?
                                                                    arr.filter(i => i.permId === item.permId)[0]?.isEdit 
                                                                    : false}
                                                                onChange={(e) => editCheckHandler(e, item)} />
                                                            <label htmlFor={"edit_" + item.permId}></label>
                                                        </div>
                                                    </td>
                                                    <td>{item.description}</td>
                                                </tr>

                                            ))
                                        }
                                    </tbody>
                                </table>
                                <NotificationContainer />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default PermissionLists
