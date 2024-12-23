import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import UserService from "../../services/userService";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Checkbox } from "@progress/kendo-react-inputs";
import { process } from "@progress/kendo-data-query";

const Userfiltertable = ({ parentHandler, type, user, dataObject ,accessDisabled}) => {
  console.log("user-->>>",user)
  console.log("dataObject-->>>",dataObject)
  const [userChange, setUserChange] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [checkboxObject, setCheckboxObject] = useState([]);
  const [userObject, setUser] = useState({});
  const history = useHistory();
  const [uncheckedDriverIds, setUncheckedDriverIds] = useState([]);
  const [isDefaultPlannerChecked, setIsDefaultPlannerChecked] = useState([]);
  const [assignedDriversToUpdate, setAssignedDriversToUpdate] = useState([])
  const [dataState, setDataState] = useState({
    skip: 0,
    take: 25,
    /*filter: {
      logic: "and",
      filters: [
        {
          field: "is_active",
          operator: "eq",
          value: true,
        },
      ],
    },*/
    sort: [
      {
        field: "",
        dir: "desc",
      },
    ],
  });
  const [dataResult, setDataResult] = useState(process(dataObject, dataState));
 
  const dataStateChange = (event) => {
    setDataResult(process(dataObject, event.dataState));
    setDataState(event.dataState);
  };
  useEffect(() => {
    setDataResult(process(dataObject, dataState));
    setIsDefaultPlannerChecked(dataObject);
  }, [dataObject]);

  const searchHandler = (e, type) => {
    setSearchData(e.target.value);
    if (type === "Drivers") {
      parentHandler(type, e.target.value, "Search", []);
    }
    if (type === "Trailers") {
      
      parentHandler(type, e.target.value, "Search", []);
    }
    if (type === "Terminals") {
      parentHandler(type, e.target.value, "Search", []);
    }
  };
  useEffect(() => {
    setUser(user);
    setCheckboxObject(dataObject);
    if (type === "Drivers") {
     
      if (user.drivers.length)
        setUserChange(
          user.drivers.map((item) => {
            return { id: item, type: type };
          })
        );  
    }
    if (type === "Trailers") {
      
      if (user.trailers.length)
        setUserChange(
          user.trailers.map((item) => {
            return { id: item, type: type };
          })
        );
    }
    if (type === "Terminals") {
      if (user.terminals.length)
        setUserChange(
          user.terminals.map((item) => {
            return { id: item, type: type };
          })
        );
    }
    setIsDefaultPlannerChecked(dataObject);
  }, []);

  const updateUserData = (e, type) => {
    const userService = new UserService();
    let requestBody = {
      "user_id": user.userId,
      "changed_drivers": assignedDriversToUpdate
    }
    const deleteUserDriverResponse = userService
    .updateUserDriverPlanning(requestBody)
    .then(function (response) {
      // NotificationManager.success(
      //   "Drivers updated",
      //   "Success",
      //   2500
      // );    
    })
    .catch(function (err) {
      
    });
    if (type === "Drivers") {
      parentHandler(type, searchData, "Update", userChange);
      
    }
    if (type === "Trailers") {
      parentHandler(type, searchData, "Update", userChange);
    }
    if (type === "Terminals") {
      parentHandler(type, searchData, "Update", userChange);
    }
  };
  const handleIsDefaultPlannerCheckbox = (event, data) => {
    let isDriverIdPresent = false;
    let checkedDriversList = isDefaultPlannerChecked
    let checkedIndex = checkedDriversList.findIndex(x => x.driver_id === data.driver_id)
    checkedDriversList[checkedIndex].isDefaultPlanner = event.isSelected;
    let assignedDriversList = assignedDriversToUpdate;
    let index = assignedDriversList.findIndex(x => x.driver_id ===data.driver_id);
    if(index == -1) {
      let changedDriver = {
        driver_id: data.driver_id,
        is_default_planner: event.target.checked,
        terminal_id: data.terminal?.terminal_id
      }
      assignedDriversList.push(changedDriver);
    }
    else {
      assignedDriversList[index].is_default_planner = event.target.checked;
    }
    setIsDefaultPlannerChecked(checkedDriversList);
    setAssignedDriversToUpdate(assignedDriversList);
  };

  const checkboxHandler = (e, driver_id) => {
    let driverIdArray = uncheckedDriverIds;
    driverIdArray.push(driver_id)
    setUncheckedDriverIds(driverIdArray)
  }

  return (
    <>
    <div className="col-xl-50">
      <div className="card card_shadow">
        <div className="card-body special_card_padding">
        <div className="access_header">
          <h2 className="header-title">{type}</h2>
          {type === "Drivers" ? 
            <button
              type="button"
              className="btn_blue_sm btn-blue ml_10"
              onClick={(e) => updateUserData(e, type)}
              disabled={accessDisabled ? true : false} 
              style={{background : accessDisabled ? "#dddddd": ""}}
            >
              SAVE
            </button>
            : ""
          }
        </div>
          {type === "Drivers" ? (
            <div className="table-responsive table-area">             
              <Grid 
                filter={dataState.filter}
                sort={dataState.sort}
                sortable={true}
                filterable={true}
                // filterOperators={filterOperators}
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
              >
                <GridColumn title={`${type.replace("s", "")}ID`} field="driver_id"/>
                <GridColumn title="Name" field="newname"/>
                <GridColumn title="Terminal" field="terminal_full_name"/>
                <GridColumn title="Is Active" field="is_active"/>
                <GridColumn
                    field="isDefaultPlanner"
                    title="Responsibility"
                    filterable={true}
                    cell={(e) => {
                      return (
                        <td>
                          <input
                          id={e.dataItem.driver_id +"checkbox"}
                          name={e.dataItem.driver_id+"checkbox"}
                          type="checkbox"
                          onChange={(event) => handleIsDefaultPlannerCheckbox(event, e.dataItem)}
                          disabled={isDefaultPlannerChecked.filter(driver => driver.driver_id === e.dataItem.driver_id)[0]?.isDefaultPlanner ? true : false}
                          defaultChecked={isDefaultPlannerChecked.filter(driver => driver.driver_id === e.dataItem.driver_id)[0]?.isDefaultPlanner}
                        />
                        </td>
                      );
                    }}
                  />
              </Grid>
              <NotificationContainer />
            </div>
          ) : (
            <>
              {type === "Trailers" ? (
                <div className="table-responsive table-area">
                  <Grid
                    filter={dataState.filter}
                    sort={dataState.sort}
                    sortable={true}
                    filterable={true}
                    // filterOperators={filterOperators}
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
                  >
                    <GridColumn title={`${type.replace("s", "")}ID`} field="trailer_id"/>
                    <GridColumn title="Commodity Group" field="commoditygroup_full_name" />
                    <GridColumn title="Terminal" field="terminal_full_name"/>
                    <GridColumn title="Is Active" field="is_active"/>
                  </Grid>
                  <NotificationContainer />
                </div>
              ) : (
                ""
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Userfiltertable;
