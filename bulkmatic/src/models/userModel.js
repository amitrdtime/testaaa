import AppFilterService from "../services/appFilterService";
import UserAccess from "./useraccessModel";

// Use this object to bind with UI Controls
class User {
    // Have the parameter as per the need so that object creation shouldbe controlled from single place.
    // This will help us to avoid creating different structure across multiple pages.
    constructor() {

    }

    isAdministrator(userObj){
        return userObj.roles.filter(it => it.roleName.toUpperCase() === "ADMINISTRATOR").length > 0;
    }

    //This is to parse from API
    parseApiUserObject(user) {
        const userObj = {};

        if (user === null || user === undefined)
            return userObj;
        
        if (Object.keys(user).length === 0)
            return userObj;
        //Define your Data Model based on the UI Requirement here.
        //Implementation should continue bu creating demo model.
        userObj.userName = user.userName;
        userObj.userId = user.userId;
        userObj.Phone = user.Phone;
        userObj.Address = user.Address;
        userObj.Email = user.Email;
        userObj.Planner = user.Planner;
        userObj.Terminal = user.Terminal;
        userObj.ETractor = user.ETractor;
        userObj.AdId = user.AdId;
        userObj.LoadmasterID = user.LoadmasterID;
        userObj.isActive = user.isActive;
        userObj.DriverId = user.DriverId;
        userObj.roles = user.roles !== undefined? user.roles.map(item => { 
            return {
                roleId : item.roleId,
                roleName : item.roleName,
                permissionAccess: item.permissionAccess
            }
        }) : [{
            roleId : "NoRoleAssigned",
            roleName : "No Role Assigned",
            permissionAccess: []
        }];

        userObj.AccessProfiles = user.accessProfiles;
        userObj.planners = user.planners;
        
        userObj.drivers = user.drivers;
        userObj.trailers = user.trailers;       
        userObj.terminals = user.terminals;
        userObj.terminalnames = [];
        user.terminals.map(id => {
            const appfilter = new AppFilterService().getAppFilter();
            if(appfilter) {
                const terminals = new AppFilterService().getAppFilter().terminals;
                if (terminals.length > 0) {
                    const terminal = terminals.filter(it => it.id.toString() === id);
                    if(terminal.length > 0){
                        userObj.terminalnames.push(terminal[0].name);
                    }
                }
            }
        })
        userObj.terminal_id = [];
        user.terminals.map(id => {
            const appfilterID = new AppFilterService().getAppFilter();
            if(appfilterID) {
                const terminalIDs = new AppFilterService().getAppFilter().terminals;
                if (terminalIDs.length > 0) {
                    const terminalID = terminalIDs.filter(it => it.id.toString() === id);
                    if(terminalID.length > 0){
                        userObj.terminal_id.push(terminalID[0].code);
                    }
                }
            }
        })
        userObj.defaultPlanners = user.defaultplanners;

        // Derived Properties
        userObj.isAdministrator = this.isAdministrator(userObj);
        userObj.userAccess = new UserAccess(userObj);

        if (user.hasOwnProperty("orderColumns")){
            userObj.orderColumns = user.orderColumns;
        }

        if (user.hasOwnProperty("orderDataState")){
            userObj.orderDataState = user.orderDataState;
        }

        if (user.hasOwnProperty("trailerColumns")){
            userObj.trailerColumns = user.trailerColumns;
        }

        if (user.hasOwnProperty("trailerDataState")){
            userObj.trailerDataState = user.trailerDataState;
        }

        userObj.cgs = user.cgIds;
                
        return userObj;
    }
}

export default User;
