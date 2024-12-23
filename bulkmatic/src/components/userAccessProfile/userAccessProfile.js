import React, { useState, useEffect, useContext } from 'react';
import CheckboxTree from './js/CheckboxTree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import AccessProfileService from '../../services/accessProfileService';
import UserService from '../../services/userService';
import Skeleton from 'react-loading-skeleton';
import Spinner from 'react-bootstrap/Spinner';
import {
   NotificationContainer,
   NotificationManager,
} from "react-notifications";
import { ContextData } from "../../components/appsession";
import { number } from 'yup/lib/locale';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";

let AllUniqueTerminals = [];
const mappedallterminals2 = [];
let allPreviousPlanners = [];
let allusersData = ''; 
var isOldTerminalAssignment = false;
let userDefaultPlanners = [];

const UserAccessProfile = (props) => {
   const {user, accessDisabled } = props
   const [checked, setchecked] = useState([]);
   const [expanded, setexpanded] = useState([]);
   const [nodes, setnodes] = useState([]);
   const [permisions, setpermisions] = useState([])
   const [isDataLoaded, setisDataLoaded] = useState(false);
   const [plannerChecked, setplannerChecked] = useState([])
   const [previousPlannerTerminal, setPreviousPlannerTerminal] = useState([])
   const [removedPlannerTerminals, setRemovedPlannerTerminals] = useState([])
   const [checkedArr, setcheckedArr] = useState([]);
   const [alertMessage, setAlertMessage] = useState("")
   const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
   const [userData, setuserData] = useContext(ContextData);

   useEffect(async () => {
      const accessProfileService = new AccessProfileService();
      const accessProfileData = await accessProfileService.getAccessProfile();
      userDefaultPlanners = user.defaultPlanners;
      const userService = new UserService();
      const accessProfileData1 = await userService.getAllUsers();
      allusersData = accessProfileData1;
      let allUserTerminals = []
      allusersData.map(data => {
         allUserTerminals.push(...data.terminals);
         mappedallterminals2.push(...data.defaultPlanners);
      })
      AllUniqueTerminals = [...new Set(allUserTerminals)];
      setnodes(accessProfileData)
      setisDataLoaded(true)

      const checkedData = [];
      if (user.AccessProfiles) {
         for (let chkloop = 0; chkloop < user.AccessProfiles.length; chkloop++) {
            let nodesArray = [...accessProfileData];

            const data = user.AccessProfiles[chkloop].toString();
            const splitData = data.split("_");
            const splitIdsTobeChecked = [];
            for (let iloop = 0; iloop < splitData.length; iloop++) {

               if (iloop == 0) {
                  splitIdsTobeChecked[iloop] = splitData[iloop];
                  nodesArray = nodesArray.filter(it => it.value.toString() === splitIdsTobeChecked[iloop]);
                  if (nodesArray.length)
                     nodesArray = nodesArray[0].children;
               }
               else {
                  splitIdsTobeChecked[iloop] = splitIdsTobeChecked[splitIdsTobeChecked.length - 1] + "_" + splitData[iloop];
                  nodesArray = nodesArray.filter(it => it.value.toString() === splitIdsTobeChecked[iloop]);
                  if (nodesArray.length) {
                     if (nodesArray[0].children !== undefined)
                        nodesArray = nodesArray[0].children;
                  }
               }
               if (iloop + 1 === splitData.length && nodesArray.length) {
                  // 
                  nodesArray.map(data => {
                     checkedData.push(data.value);
                  })
               }
            }
         }
      }
      if (user.defaultPlanners?.length > 0) {
         setplannerChecked(user.defaultPlanners)
      }

      setchecked([...checkedData])
   }, [Object.keys(user).length])

   const mapOrder = (a, order, key) => {
      const map = order.reduce((r, userDefaultPlanners, i) => ((r[userDefaultPlanners] = i), r), {})
      return a.sort((a, b) => map[a[key]] - map[b[key]])
   }

   useEffect(() => {
      if (nodes.length > 0) {
         let terminalcheck = checked.map((e) => e.split("_")[0])
         let a = [...new Set(terminalcheck)]
         let c = a.map((it) => Number(it))
         let allusersData = nodes.filter((item) => !c.includes(item.value)).map((access) => access.value)
         let b = [...c, ...allusersData]
         setcheckedArr(b)

      }
   }, [nodes.length, checked])

   const onCheckHandler = (checkeditem, targetNode) => {
      let terminalId = targetNode.value.toString()
      AllUniqueTerminals.find(element => {
         if (element == terminalId) {
            isOldTerminalAssignment = true;
         }
      })

      // Condion if terminal is checked and isOldTerminalAssignment false means it is never used before//
      if (targetNode.checked == true && isOldTerminalAssignment == false) {
         plannerChecked.push(terminalId);
         onPlannerCheckHandler(plannerChecked);
         setchecked([...checkeditem])
      }
      else {
         var result = arrayRemove(plannerChecked, terminalId);
         if (user.defaultPlanners.includes(terminalId)) {
            NotificationManager.error("Unassigning the terminal from default planner is not allowed", "Failure");
            // else
            // NotificationManager.error("unassigning defaultplanner is not save, It is save first to perform the unassigning terminal", "Error");
         }
         else {
            let defaultPlannerObject = allusersData.filter(obj => obj.defaultPlanners.includes(terminalId))
            if(defaultPlannerObject.length > 0 && !targetNode.checked) {
               setOpenConfirmationModal(true)
               let alertMessageTemp = `All the drivers assigned to `+ user.userName + `
               on the terminal `+ terminalId + ` will be auto assigned to the 
               default planner ` + defaultPlannerObject[0].userName
               setAlertMessage(alertMessageTemp);
               let previousPlannerTerminalArray = removedPlannerTerminals
               let previousPlanner = {
                  user_id: user.userId,
                  default_planner_user_id: defaultPlannerObject[0].userId,
                  terminalId: terminalId
               }
               previousPlannerTerminalArray.push(previousPlanner);
               setRemovedPlannerTerminals(previousPlannerTerminalArray);
            }
            onPlannerCheckHandler(result);
            setchecked([...checkeditem])
         }
      }
   }

   function arrayRemove(arr, value) {
      return arr.filter(function (ele) {
         return ele != value;
      });
   }
   const onExpandHandler = (expanded, targetNode) => {
      setexpanded(expanded);
   }

   const onPlannerCheckHandler = (plannerChecked) => {
      defaultplannercheck(plannerChecked);
   }

   function defaultplannercheck(plannerChecked) {
      if (plannerChecked.length > 0) {
         const filteredArray = user.defaultPlanners.filter(value => plannerChecked.includes(value));
         if (filteredArray.toString().includes(plannerChecked.toString())) {
            if (plannerChecked.toString().includes(userDefaultPlanners.toString())) {
               setplannerChecked(plannerChecked)
            }
            else
               NotificationManager.error("To change default planner, go to a different user and assign that user as default planner for this terminal", "Failure");
         }
         else {
            let newDefaultPlannerAssignment = plannerChecked.filter(item => user.defaultPlanners.indexOf(item) < 0);
            let previousDefaultPlannerObject = allusersData.filter(obj => obj.defaultPlanners.includes(newDefaultPlannerAssignment[0].toString()));
            if (previousDefaultPlannerObject.length > 0) {
               let previousDefaultPlanner = []; 
               let defaultplannerchecked = []; 
               previousDefaultPlannerObject.map(data => {
                  previousDefaultPlanner.push(data.userName);
                  defaultplannerchecked.push(...data.defaultPlanners);
               })

               if (previousDefaultPlanner == JSON.stringify(user.userName).replace(/["']/g, "")) {
                  NotificationManager.error("Unassigning the terminal from default planner is not allowed", "Faliure");
               }
               else {
                  let indexToRemove = previousDefaultPlannerObject[0].defaultPlanners.indexOf(newDefaultPlannerAssignment[0])
                  let test = previousDefaultPlannerObject[0].defaultPlanners[indexToRemove];
                  let previousPlannerTerminalArray = previousPlannerTerminal
                  let previousPlanner = {
                     user_id: previousDefaultPlannerObject[0].userId,
                     terminalId: previousDefaultPlannerObject[0].defaultPlanners[indexToRemove]
                  }
                  previousPlannerTerminalArray.push(previousPlanner)
                  setPreviousPlannerTerminal(previousPlannerTerminalArray)
                  previousDefaultPlannerObject[0].defaultPlanners.splice(indexToRemove,1)
                  allPreviousPlanners.push(previousDefaultPlannerObject[0]);
                  setplannerChecked(plannerChecked)
               }
            }
            else {
               let previousPlannerTerminalArray = previousPlannerTerminal
               let previousPlanner = {
                  user_id: null,
                  terminalId: newDefaultPlannerAssignment[0]
               }
               previousPlannerTerminalArray.push(previousPlanner)
               setPreviousPlannerTerminal(previousPlannerTerminalArray)
               setplannerChecked(plannerChecked)
            }
            user.defaultPlanners = plannerChecked;
         }
      }
      else {
         if (userDefaultPlanners.length > 0)
            NotificationManager.error("Unassigning the terminal from default planner is not allowed", "Failure");
         else
            setplannerChecked(plannerChecked)
      }
   }

   const updateAccessProfile = async (e) => {
      const userService = new UserService()
      user.AccessProfiles = [...checked];
      user.DefaultPlanners = [...plannerChecked];
      if (allPreviousPlanners.length > 0) {
         for(const previousPlanner of allPreviousPlanners) {
            try {
               const updateuserResponse = await userService.updateUser(previousPlanner);
            }
            catch(error) {
               console.log("error", error)
            }
         }
      }
      let requestBody = {
         user_id: user.userId,
         previousPlannerTerminal: previousPlannerTerminal
      }
      try{
         const updateDefaultPlannerDriversResponse = await userService.updateDefaultPlannerDrivers(requestBody);
      }

      catch(error) {
         console.log(error);
      }

      if(removedPlannerTerminals.length > 0) {
         let body = {
            unassigned_planner_terminals: removedPlannerTerminals
         }
         try {
            const response = await userService.unassignDrivers(body);
         }
         catch(error) {
            console.log("error", error)
         } 
      }

      const updateuserResponse = await userService.updateUser(user);
      if (updateuserResponse) {
         NotificationManager.success("Access profile updated successfully", "Success");
         user.defaultPlanners = plannerChecked;
         let userDataForUpdate = await userData;
         if (userDataForUpdate.terminals.length > 0) {
            setuserData(updateuserResponse);
         }
      }
   }

   return (
      <div className="col-xl-88">
         <div className="card card_shadow">
            <div className="card-body special_card_paddingother">
               <div className="access_header">
                  <h2 className="header-title">Access Profile</h2>
                  -- To be Decomissioned After Planning Profile is Approved
                  <button
                     type="button"
                     className="btn_blue_sm btn-blue ml_10 access_save"
                     disabled={accessDisabled ? true : false}
                     style={{ background: accessDisabled ? "#dddddd" : "" }}
                     onClick={(e) => updateAccessProfile(e)}
                  >
                     SAVE
                  </button>
               </div>
               <div className="tree_view_section tree_scroll">
                  {
                     isDataLoaded ?
                        <CheckboxTree
                           checked={accessDisabled == true ? [] : checked}
                           expanded={expanded}
                           plannerChecked={accessDisabled == true ? [] : plannerChecked}
                           iconsClass="fa5"
                           nodes={mapOrder(nodes, checkedArr, "value")}
                           onCheck={(checked, targetNode) => onCheckHandler(checked, targetNode)}
                           onExpand={(expanded, targetNode) => onExpandHandler(expanded, targetNode)}
                           onPlannerChecked={onPlannerCheckHandler}
                        />
                        :
                        (<div>
                           <ProgressBar animated now={100} />
                         </div>)
                  }
               </div>
               <NotificationContainer />
            </div>
         </div>
         <Modal
            show={openConfirmationModal}
            onHide={() => setOpenConfirmationModal(false)}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Body>
              <div class="form-group">
                <p>
                   <br/>
                  {alertMessage}
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={(e) => setOpenConfirmationModal(false)}>Okay</Button>
            </Modal.Footer>
          </Modal>
      </div>
      
   )
}

export default UserAccessProfile
