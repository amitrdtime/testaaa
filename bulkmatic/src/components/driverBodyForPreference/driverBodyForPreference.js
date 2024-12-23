import React, { useState, useEffect, useContext } from 'react'
import DriverService from '../../services/driverService'
import './driverBodyForPreference.css'
import {
   NotificationContainer,
   NotificationManager,
} from "react-notifications";
import Spinner from "react-bootstrap/Spinner";
import { ContextData } from '../appsession';

const DriverBodyForPreference = ({ driver }) => {
   const [userData, setuserData] = useContext(ContextData);
   const [prefSettings, setPrefSettings] = useState([])
   const [driverPref, setDriverPref] = useState([])
   const [driverDataForSave, setdriverDataForSave] = useState([])
   const [isLoading, setIsLoading] = useState(false)

   useEffect(async () => {
      setIsLoading(true);
      const driverService = new DriverService();
      driverService.getDriverPrefSetting().then(function (prefSets) {
         setPrefSettings(prefSets);
         driverService.getDriverPrefData(driver.driver_id).then(function (userPrefData) {
            setdriverDataForSave(userPrefData);
            setDriverPref(userPrefData);
            setIsLoading(false);
         })
      }).catch(function (err) {
         NotificationManager.error(err, "Error");
      })

   }, [])
   const handleSelectionChange = (e) => {
      const splitIds = e.target.id.split("_");
      const groupId = parseInt(splitIds[0]);
      const typeId = parseInt(splitIds[1]);
      const columnName = splitIds[2];
      const existingValue = driverDataForSave.filter(it => it.preftypeId === typeId);
      let newValue = {};
      const groupInfo = prefSettings.filter(it => it.groupId === groupId);

      if (groupInfo.length) {
         newValue.prefgroupId = groupInfo[0].groupId;
         const typeInfo = groupInfo[0].type.filter(it => it.typeId === typeId);
         if (typeInfo.length) {
            const typeData = typeInfo[0];
            newValue.preftypeId = typeData.typeId;
            if (existingValue.length) {
               const indexOfExistingValue = driverDataForSave.indexOf(existingValue[0]);
               newValue.id = existingValue[0].id;
               newValue.selectedValues = [...existingValue[0].selectedValues];
               const extstingDataValue = newValue.selectedValues.filter(it => it.column === columnName);
               if (extstingDataValue.length) {
                  const newDataValue = { column: columnName, value: e.target.value};
                  const valueIndex = newValue.selectedValues.indexOf(extstingDataValue[0])
                  newValue.selectedValues.splice(valueIndex, 1, newDataValue);
               } else {
                  const newDataValue = { column: columnName, value: e.target.value };
                  newValue.selectedValues.push(
                     newDataValue
                  );
               }
                  const newdriverDataForSave = [...driverDataForSave];
                  const alreadyCreatedData = newdriverDataForSave.filter(it => it.prefgroupId === newValue.prefgroupId
                     && it.preftypeId === newValue.preftypeId);
                  if (alreadyCreatedData.length) {
                     const alreadyIndex = newdriverDataForSave.indexOf(alreadyCreatedData[0])
                     newdriverDataForSave.splice(alreadyIndex, 1, newValue);
                  } else {
                     newdriverDataForSave.push(newValue);
                  }
                  setdriverDataForSave([...newdriverDataForSave]);

            } else {
               const newDataValue = { column: columnName, value: e.target.value };
               newValue.selectedValues = [];
               newValue.selectedValues.push(newDataValue);
               const newdriverDataForSave = [...driverDataForSave];
               newdriverDataForSave.push(newValue);
               setdriverDataForSave([...newdriverDataForSave]);
            }
         } else {
         }
      } else {

      }
   };
   const isDriverEdit = userData.roles[0].permissionAccess.filter(it => it.permission === "Drivers" && it.isEdit === false)
   const handleTextAreaChange = function (e) {
      const splitIds = e.target.id.split("_");
      const groupId = parseInt(splitIds[0]);
      const typeId = parseInt(splitIds[1]);
      const columnName = splitIds[2];
      const existingValue = driverDataForSave.filter(it => it.preftypeId === typeId);
      let newValue = {};
      const groupInfo = prefSettings.filter(it => it.groupId === groupId);

      if (groupInfo.length) {
         newValue.prefgroupId = groupInfo[0].groupId;
         const typeInfo = groupInfo[0].type.filter(it => it.typeId === typeId);
         if (typeInfo.length) {
            const typeData = typeInfo[0];
            newValue.preftypeId = typeData.typeId;
            if (existingValue.length) {
               const indexOfExistingValue = driverDataForSave.indexOf(existingValue[0]);
               newValue.id = existingValue[0].id;
               newValue.selectedValues = [...existingValue[0].selectedValues];
               const extstingDataValue = newValue.selectedValues.filter(it => it.column === columnName);
               if (extstingDataValue.length) {
                  const newDataValue = { column: columnName, value: e.target.value };
                  const valueIndex = newValue.selectedValues.indexOf(extstingDataValue[0])
                  newValue.selectedValues.splice(valueIndex, 1, newDataValue);
                  driverDataForSave.splice(indexOfExistingValue, 1, newValue);

               } else {
                  const newDataValue = { column: columnName, value: e.target.value };
                  newValue.selectedValues.push(
                     newDataValue
                  );
               }       
                  const newdriverDataForSave = [...driverDataForSave];
                  const alreadyCreatedData = newdriverDataForSave.filter(it => it.prefgroupId === newValue.prefgroupId
                     && it.preftypeId === newValue.preftypeId);

                  if (alreadyCreatedData.length) {
                     const alreadyIndex = newdriverDataForSave.indexOf(alreadyCreatedData[0])
                     newdriverDataForSave.splice(alreadyIndex, 1, newValue);
                  } else {
                     newdriverDataForSave.push(newValue);
                  }

                  setdriverDataForSave([...newdriverDataForSave]);
               

            } else {
               const newDataValue = { column: columnName, value: e.target.value };
               newValue.selectedValues = [];
               newValue.selectedValues.push(newDataValue);
               const newdriverDataForSave = [...driverDataForSave];
               newdriverDataForSave.push(newValue);
               setdriverDataForSave([...newdriverDataForSave]);
            }
         } else {
         }

      } else {

      }

   }

   const handleTextChange = function (e) {
      const splitIds = e.target.id.split("_");
      const groupId = parseInt(splitIds[0]);
      const typeId = parseInt(splitIds[1]);
      const columnName = splitIds[2];
      const existingValue = driverDataForSave.filter(it => it.preftypeId === typeId);
      let newValue = {};
      const groupInfo = prefSettings.filter(it => it.groupId === groupId);

      if (groupInfo.length) {
         newValue.prefgroupId = groupInfo[0].groupId;
         const typeInfo = groupInfo[0].type.filter(it => it.typeId === typeId);
         if (typeInfo.length) {
            const typeData = typeInfo[0];
            newValue.preftypeId = typeData.typeId;
            if (existingValue.length) {
               const indexOfExistingValue = driverDataForSave.indexOf(existingValue[0]);
               newValue.id = existingValue[0].id;
               newValue.selectedValues = [...existingValue[0].selectedValues];
               const extstingDataValue = newValue.selectedValues.filter(it => it.column === columnName);
               if (extstingDataValue.length) {
                  const newDataValue = { column: columnName, value: e.target.value };
                  const valueIndex = newValue.selectedValues.indexOf(extstingDataValue[0])
                  newValue.selectedValues.splice(valueIndex, 1, newDataValue);
               } else {
                  const newDataValue = { column: columnName, value: e.target.value };
                  newValue.selectedValues.push(
                     newDataValue
                  );
               }
                  const newdriverDataForSave = [...driverDataForSave];
                  const alreadyCreatedData = newdriverDataForSave.filter(it => it.prefgroupId === newValue.prefgroupId
                     && it.preftypeId === newValue.preftypeId);
                  if (alreadyCreatedData.length) {
                     const alreadyIndex = newdriverDataForSave.indexOf(alreadyCreatedData[0])
                     newdriverDataForSave.splice(alreadyIndex, 1, newValue);
                  } else {
                     newdriverDataForSave.push(newValue);
                  }
                  setdriverDataForSave([...newdriverDataForSave]);
               

            } else {
               const newDataValue = { column: columnName, value: e.target.value };
               newValue.selectedValues = [];
               newValue.selectedValues.push(newDataValue);
               const newdriverDataForSave = [...driverDataForSave];
               newdriverDataForSave.push(newValue);
               setdriverDataForSave([...newdriverDataForSave]);
            }
         } else {
         }

      } else {
      }
   }

   // Drafted, If required, it needs to be fine tuned and implemented.
   const handleCheckBoxChange = function (e) {
      const splitIds = e.target.id.split("_");
      const groupId = parseInt(splitIds[0]);
      const typeId = parseInt(splitIds[1]);
      const columnName = splitIds[2];
      const existingValue = driverDataForSave.filter(it => it.preftypeId === typeId);
      let newValue = {};
      const groupInfo = prefSettings.filter(it => it.groupId === groupId);

      if (groupInfo.length) {
         newValue.prefgroupId = groupInfo[0].groupId;
         const typeInfo = groupInfo[0].type.filter(it => it.typeId === typeId);
         if (typeInfo.length) {
            const typeData = typeInfo[0];
            newValue.preftypeId = typeData.typeId;
            if (existingValue.length) {
               const indexOfExistingValue = driverDataForSave.indexOf(existingValue[0]);
               newValue.id = existingValue[0].id;
               newValue.selectedValues = [...existingValue[0].selectedValues];
               const extstingDataValue = newValue.selectedValues.filter(it => it.column === columnName);
               if (extstingDataValue.length) {
                  const newDataValue = { column: columnName, value: e.target.value };
                  const valueIndex = newValue.selectedValues.indexOf(extstingDataValue[0])
                  newValue.selectedValues.splice(valueIndex, 1, newDataValue);
                  setdriverDataForSave([...newdriverDataForSave]);
               } else {
                  const newDataValue = { column: columnName, value: e.target.value };
                  newValue.selectedValues.push(
                     newDataValue
                  );
               }

                  const newdriverDataForSave = [...driverDataForSave];
                  const alreadyCreatedData = newdriverDataForSave.filter(it => it.prefgroupId === newValue.prefgroupId
                     && it.preftypeId === newValue.preftypeId);
                  if (alreadyCreatedData.length) {
                     const alreadyIndex = newdriverDataForSave.indexOf(alreadyCreatedData[0])
                     newdriverDataForSave.splice(alreadyIndex, 1, newValue);
                  } else {
                     newdriverDataForSave.push(newValue);
                  }
                  setdriverDataForSave([...newdriverDataForSave]);
               

            } else {
               const newDataValue = { column: columnName, value: e.target.value };
               newValue.selectedValues = [];
               newValue.selectedValues.push(newDataValue);
               const newdriverDataForSave = [...driverDataForSave];
               newdriverDataForSave.push(newValue);
               setdriverDataForSave([...newdriverDataForSave]);
            }
         } else {
         }

      } else {
      }
   }

   const SaveDriverPreference = async function () {
      let Err;
      let selectedValues = driverDataForSave.map(el => {
      const obj ={};
      obj.preftypeId = el.preftypeId;
      obj.label =
      el.preftypeId == 59  
      ?  
         "LOH preference per load" 
      : 
         (el.preftypeId ==60 
            ?
               "Distance per day preference"
            :
               '')
               
      obj['value'] = el.selectedValues[0]?.value
      return obj
      
   })      
         selectedValues.map(el => {
            if(el.value < 0){
               NotificationManager.error(`${el.label} value cannot be less than 0`, "Error");
               Err = true;
            } 
            if(el.preftypeId == 3 && el.value > 70){
               NotificationManager.error(`${el.label}  value cannot  be more than 70`, "Error");
               Err = true;
            }
            if(el.preftypeId == 4 && el.value > 24){
               NotificationManager.error(`${el.label}  value cannot  be more than 24`, "Error");
               Err = true;
            }
            if(el.preftypeId==59 && el.value> 9999){
               NotificationManager.error(`${el.label} value cannot  be more than 9999`, "Error");
               Err = true;
            }
            if(el.preftypeId==60 && el.value > 999){
               NotificationManager.error(`${el.label} value cannot  be more than 999`, "Error");
               Err = true;
            }
         } )
            if(!Err){
               try {

                  const driverService = new DriverService();
                  setIsLoading(true);
                  const driverServiceResponse = await driverService.saveDriverPreference(prefSettings, driverDataForSave, driver.driver_id);
                  if (driverServiceResponse) {
                        NotificationManager.success('Driver Preferences Updated Successfully', 'Success');
                  }

               } catch (err) {

                  NotificationManager.error(err, "Error");

               }

            }
    
    }
   


   return (
    <>
      <NotificationContainer /> 

      <div className="row mt_30">
         <div className="col-xl-12">
            <div className="card card_shadow">
               <div className="card-body ">
                  <div className="table_header_section">
                     <div className="table_header">Additional Preference</div>
                     <div className="df">
                        {userData.roles[0].permissionAccess.filter(it => it.permission === "Drivers" && it.isEdit === false ).length > 0 
                        ? 
                         <button type="button" disabled className="btn btn-secondary"
                         onClick={SaveDriverPreference} >SAVE</button>

                        :  <button type="button"   className="btn_blue btn-blue ml_10" 
                        onClick={SaveDriverPreference}>SAVE</button>  }
                     </div>
                  </div>
                  <div className="table-responsive fixed_preference_table driver_table">
                     {
                        prefSettings.length > 0 ? (
                        prefSettings.map((prefsets, index) => (
                           <table className="table table-borderless mb-0">
                              {
                                    prefsets.groupId !== 2 && prefsets.groupId !== 6
                                    ?
                              
                              <thead className="table-light othertableheader">
                                 <tr className="tabletr_adjust" key={index}>
                                    <div className="table_same_width"> <th className="loading_group_header">{prefsets.groupdesc}</th></div>

                                    {
                                       
                                       prefsets.columns?.map(data => (
                                          <div className="table_same_width1"><th> {data} </th></div>
                                       ))
                                      
                                       
                                    }
                                 </tr>
                              </thead>
                              
                                 : ""
                               }
                              {
                                 prefsets.type.length ?
                                    (<tbody>
                                       {
                                          prefsets.type.map((item,index) =>
                                          (  
                                             <tr className="tabletr_adjust" key={index}>
                                                <div className="table_same_width"><td className="loading_group_header_dres">{item.typedescription}</td></div>


                                                {
                                                   item.possibleValues.map(dataValue => (
                                                      <div className="table_same_width1">
                                                         <td className="text-center">
                                                            {
                                                               dataValue.values.length > 1 ?
                                                                  <select class="form-select" disabled={isDriverEdit[0]?.isEdit === false ? true : false}
                                                                     id={prefsets.groupId + "_" + item.typeId + "_" + dataValue.column}
                                                                     onChange={(e) => handleSelectionChange(e)}>
                                                                     {
                                                                        dataValue.values.map(value => (
                                                                           <option id={item.typeId + "_" + dataValue.column + "_" + dataValue.values[0]}
                                                                           selected={
                                                                                 !driverPref.length ? false
                                                                                    : driverPref.filter(it =>
                                                                                    (it.prefgroupId === prefsets.groupId
                                                                                       && it.preftypeId === item.typeId)).length ?
                                                                                       driverPref.filter(it =>
                                                                                       (it.prefgroupId === prefsets.groupId
                                                                                          && it.preftypeId === item.typeId))[0].selectedValues.filter(it => dataValue.column == it.column
                                                                                             && it.value === value)
                                                                                          .length > 0 : false
                                                                              }> {value} </option>
                                                                        ))
                                                                     }
                                                                  </select>
                                                                  :
                                                                  (

                                                                     dataValue.values[0] === "" ?
                                                                        dataValue.column === 'Comments' ?
                                                                           (
                                                                              <textarea rows={2}
                                                                              disabled={isDriverEdit[0]?.isEdit === false ? true : false}
                                                                                 onChange={(e) => handleTextAreaChange(e)}
                                                                                 id={prefsets.groupId + "_" + item.typeId + "_" + dataValue.column + "_" + dataValue.values[0]}
                                                                                 defaultValue={
                                                                                    !driverPref.length ? ""
                                                                                       : driverPref.filter(it =>
                                                                                       (it.prefgroupId === prefsets.groupId
                                                                                          && it.preftypeId === item.typeId)).length ?
                                                                                          driverPref.filter(it =>
                                                                                          (it.prefgroupId === prefsets.groupId
                                                                                             && it.preftypeId === item.typeId))[0]
                                                                                             .selectedValues.filter(it => dataValue.column == it.column)
                                                                                             .length ? driverPref.filter(it =>
                                                                                             (it.prefgroupId === prefsets.groupId
                                                                                                && it.preftypeId === item.typeId))[0]
                                                                                                .selectedValues.filter(it => dataValue.column == it.column)[0].value
                                                                                             : ""
                                                                                          : ""
                                                                                 }
                                                                              />
                                                                           )
                                                                           :
                                                                           (
                                                                              <input class="form-select" rows={2}
                                                                                type="number"
                                                                                disabled={isDriverEdit[0]?.isEdit === false ? true : false}
                                                                                  id={prefsets.groupId + "_" + item.typeId + "_" + dataValue.column + "_" + dataValue.values[0]}
                                                                                  onChange={(e) => handleTextChange(e)}
                                                                                  defaultValue={
                                                                                      !driverPref.length ? ""
                                                                                        : driverPref.filter(it =>
                                                                                        (it.prefgroupId === prefsets.groupId
                                                                                            && it.preftypeId === item.typeId)).length ?
                                                                                            driverPref.filter(it =>
                                                                                            (it.prefgroupId === prefsets.groupId
                                                                                              && it.preftypeId === item.typeId))[0]
                                                                                              .selectedValues.filter(it => dataValue.column == it.column)
                                                                                              .length ? driverPref.filter(it =>
                                                                                              (it.prefgroupId === prefsets.groupId
                                                                                                  && it.preftypeId === item.typeId))[0]
                                                                                                  .selectedValues.filter(it => dataValue.column == it.column)[0].value
                                                                                              : ""
                                                                                            : ""
                                                                                      }
                                                                              />
                                                                           )
                                                                        :
                                                                        (
                                                                           <>
                                                                              <input
                                                                                 onChange={(e) => handleCheckBoxChange(e)}
                                                                                 disabled={isDriverEdit[0]?.isEdit === false ? true : false}
                                                                                 id={prefsets.groupId + "_" + item.typeId + "_" + dataValue.column + "_" + dataValue.values[0]}
                                                                                 type="checkbox"
                                                                                 checked={
                                                                                    !driverPref.length ? false
                                                                                       : driverPref.filter(it =>
                                                                                       (it.prefgroupId === prefsets.groupId
                                                                                          && it.preftypeId === item.typeId)).length ?
                                                                                          driverPref.filter(it =>
                                                                                          (it.prefgroupId === prefsets.groupId
                                                                                             && it.preftypeId === item.typeId))[0]
                                                                                             .selectedValues.filter(it =>
                                                                                                dataValue.column == it.column
                                                                                                && it.value === dataValue.values[0])
                                                                                             .length > 0 : false
                                                                                 }
                                                                              />
                                                                              <label style={{ marginLeft: "5px" }} for={item.typeId + "_" + dataValue.column + "_" + dataValue.values[0]}> {dataValue.values[0]} </label>
                                                                           </>
                                                                        )
                                                                  )
                                                            }
                                                         </td>
                                                      </div>
                                                   ))
                                                }

                                             </tr>
                                          ))
                                       }
                                    </tbody>) : ""
                              }
                           </table>
                        ))
                        ) : (
                        isLoading ? (
                           <div className="loader_wrapper">
                           <Spinner animation="border" variant="primary" />
                         </div>
                        ) : 
                        (
                           <div>No data found </div>
                        )

                        )}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </>
   )
}
export default DriverBodyForPreference