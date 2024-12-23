import axios from 'axios';

// Application Specific
import User from '../models/userModel';
import Driver from '../models/driverModel'
import Trailer from '../models/trailerModel'
import BaseService from './baseService';

class UserService extends BaseService {
    constructor() {
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }

    async getUser(userId) { 
        const user = new User();
        let userObject = {}
        // Call API using Await
        if (!this.isIntegrated) {
            const userData = user.sampleUsers.filter(function (usr) {
                return usr.AdId === userId;
            });

            
            userObject = user.parseApiUserObject(userData[0]);
        } else {
            // API object call.
            const url = this.ApiEndPoint + "/users/" + userId;
            const userApiData = await axios.get(url);
            userObject = user.parseApiUserObject(userApiData.data.data);
        }

        // Init planning profile
        let planningProfile = await this.getPlanningProfileById(userObject.userId)
        let planning_profile_ids = [...new Set(planningProfile.map(elem=>elem.planningprofile_id))]
        let planning_terminal_ids = [...new Set(planningProfile.map(elem=>elem.userPlanningprofile.terminal_id))]

        return Promise.resolve({...userObject, planning_profile_ids: planning_profile_ids, planning_terminal_ids: planning_terminal_ids});
    }

    async getAllUsers() {
        const user = new User();

        // Generate the model using map method.
        let userObject = []
        try {
            if (!this.isIntegrated) {
                userObject = user.sampleUsers.map(usr =>
                    user.parseApiUserObject(usr)
                );
            } else {
                // Call API using Await
                const url = this.ApiEndPoint + "/users";
                //console.log("Print URL: "+url);
                const userApiData = await axios.get(url);
                userObject = userApiData.data.data.map(data => user.parseApiUserObject(data));
            }
        } catch (err) {
            
            return Promise.reject("Failure: Unable to retrieve user list. Please try refreshing again!");
        }

        return Promise.resolve(userObject);
    }

    async getUsersByTerminal(terminalId) {
        const user = new User();

        // Generate the model using map method.
        let userObject = []
        try {
            if (!this.isIntegrated) {
                userObject = user.sampleUsers.map(usr =>
                    user.parseApiUserObject(usr)
                );
            } else {
                // Call API using Await
                const url = this.ApiEndPoint + "/getusersbyterminal";
                const data = {
                    terminalid: terminalId
                };

                const userApiData = await axios.post(url, data);
                userObject = userApiData.data.data.map(data => user.parseApiUserObject(data));
            }
        } catch (err) {
            
            return Promise.reject("Failure: Unable to retrieve user list. Please try refreshing again!");
        }

        return Promise.resolve(userObject);
    }

    async getPlannersByTerminal(terminalId, search) {
        const user = new User();

        // Generate the model using map method.
        let userObject = []
        try {
            if (!this.isIntegrated) {
                userObject = user.sampleUsers.map(usr =>
                    user.parseApiUserObject(usr)
                );
            } else {
                // Call API using Await
                const url = this.ApiEndPoint + "/getplannersbyterminal";
                const data = {
                    terminalid: terminalId,
                    search: search
                };

                const userApiData = await axios.post(url, data);
                userObject = userApiData.data.data.map(data => user.parseApiUserObject(data));
            }
        } catch (err) {
            
            return Promise.reject("Failure: Unable to retrieve user list. Please try refreshing again!");
        }

        return Promise.resolve(userObject);
    }

    async getUsersByTerminalSearch(terminalId, search) {
        const user = new User();

        // Generate the model using map method.
        let userObject = []
        try {
            if (!this.isIntegrated) {
                userObject = user.sampleUsers.map(usr =>
                    user.parseApiUserObject(usr)
                );
            } else {
                // Call API using Await
                const url = this.ApiEndPoint + "/getusersbyterminalsearch";
                const data = {
                    terminalid: terminalId,
                    search: search
                };

                const userApiData = await axios.post(url, data);
                userObject = userApiData.data.data.map(data => user.parseApiUserObject(data));
            }
        } catch (err) {
            
            return Promise.reject("Failure: Unable to retrieve user list. Please try refreshing again!");
        }

        return Promise.resolve(userObject);
    }

    async createUser(usr) {
        
        const user = new User();
        // Generate the model using map method.
        let userObject = []
        try {
            if (!this.isIntegrated) {
                const getSampleFromUI = user.sampleUsers[0];
                user.sampleUsers.push(getSampleFromUI);
                userObject = await user.getAllUsers();
            } else {
                // Pass User Model to API using Await
                const url = this.ApiEndPoint + "/users";
                const userApiData = await axios.post(url, usr);
                userObject = userApiData.data.data;
                return userObject
            }
        } catch (err) {
            return Promise.reject("There is an error on adding the user. Please validate the data and try again!")
        }

        return Promise.resolve(userObject);
    }
    async deleteUser(usr) {
        let isDeleted = false;
        const user = new User();
        // Generate the model using map method.
        let userObject = []

        try {
            if (!this.isIntegrated) {
                const getSampleFromUI = this.sampleUsers[0];
                this.sampleUsers.pop(getSampleFromUI);
                userObject = await this.getAllUsers();
            } else {
                // Pass User Model to API using Await
            }
            isDeleted = true;
        }
        catch {
            isDeleted = false;
            return Promise.reject(isDeleted);
        }

        return Promise.resolve(isDeleted);
    }

    async updateUser(usr) {
        // Pass User Model to API using Await
       
        const user = new User();
        

        let roles = [];
        if (typeof usr.roles[0] === 'object' && usr.roles[0] !== null) {
            console.log("check usr: "+JSON.stringify(usr));
            roles = usr.roles.map(role => role.roleId);
        } else {
            roles = usr.roles
        }

       
        // Generate the model using map method.
        let userObject = []
        try {
            if (!this.isIntegrated) {
                const getSampleFromUI = user.sampleUsers[0];
                user.sampleUsers.pop();
                user.sampleUsers.push(getSampleFromUI);
                userObject = await this.getAllUsers();
            } else {
                // Pass User Model to API using Await​
                const userObj = {
                    "id": usr.userId,
                    "ad_id": usr.AdId,
                    "name": usr.userName,
                    "address": usr.Address,
                    "email": usr.Email,
                    "phone": usr.Phone,
                    "profilepictureurl": "profilepictureurl",
                    "profilepicture": "profilepicture",
                    "plannerId": usr.Planner,
                    "tractorId": "",
                    "terminalId": usr.Terminal,
                    'isActive': usr.isActive,
                    "roles": roles, //.map(it => it),
                    "accessProfiles": usr.AccessProfiles,
                    "drivers": usr.drivers,
                    "trailers": usr.trailers,
                    "terminals": usr.terminals,
                    "defaultplanners": usr.DefaultPlanners,
                    "orderColumns": (usr.hasOwnProperty("orderColumns") ? usr.orderColumns : null),
                    "orderDataState": (usr.hasOwnProperty("orderDataState") ? usr.orderDataState : null),
                    "trailerColumns": (usr.hasOwnProperty("trailerColumns") ? usr.trailerColumns : null),
                    "trailerDataState": (usr.hasOwnProperty("trailerDataState") ? usr.trailerDataState : null),
                }

                
                const url = this.ApiEndPoint + "/users/" + usr.userId;
                const userApiData = await axios.put(url, userObj);
                userObject = user.parseApiUserObject(userApiData.data.data);
            }
        } catch (err) {
            
            return Promise.reject("There is an error on adding the user. Please validate the data and try again!")
        }

        return Promise.resolve(userObject);
    }

    async filterUsers(filterData) {
        const user = new User();
        let userObject = []
        // Call API using Await
        if (!this.isIntegrated) {
            const userData = user.sampleUsers.filter(function (usr) {
                return usr.userName === filterData;
            });

            
            if (userData.length > 0) {
                userObject = userData;
            }
            else {
                userObject = user.sampleUsers.map(usr =>
                    user.parseApiUserObject(usr)
                );
            }


        } else {
            // API object call.
            const url = this.ApiEndPoint + "/filterusers";
            const data = {
                search: filterData.search,
                name: filterData.search,
                email: filterData.search,
                terminals: filterData.terminals,
                roles: filterData.roles,
                region : filterData.region
            };

            
            const userApiData = await axios.post(url, data);
            userObject = userApiData.data.data.map(data => user.parseApiUserObject(data));

        }


        return Promise.resolve(userObject);
    } 

    async getAssignedDrivers(userId, terminalIds){
        let allDrivers = []
        const driver=new Driver()
        try {
            let data = {
                user_id: userId,
                "terminalIds": terminalIds,                   
            }
            const url = this.ApiEndPoint + "/getassigneddrivers";
            const assignedDrivers = await axios.post(url, data);
            
            allDrivers = assignedDrivers.data.data.map(data => driver.parseApiDriverObject(data));
        } catch (error) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again later!");
        }
        return Promise.resolve(allDrivers);
    }

    async unassignDrivers(requestBody){
        let allDrivers = []
        const driver=new Driver()
        try {
            const url = this.ApiEndPoint + "/unassigndriversfromuser";
            const assignedDrivers = await axios.post(url, requestBody);            
            allDrivers = assignedDrivers.data.data.map(data => driver.parseApiDriverObject(data));
        } catch (error) {
            return Promise.resolve("There is a problem on retrieving driver data. Please try again later!");
        }
        return Promise.resolve(allDrivers);
    }

    async filterByAssignTrailer(filterData) {
        
        const trailer = new Trailer();
        let trailerObject = []
         try {
             if (!this.isIntegrated) {
                 const trailerData = trailer.sampleTrailer;
                 trailerObject = trailer.sampleTrailer(data => trailer.parseApiTrailerObject(data));
             } else {
                 // API object call.
                 const url = this.ApiEndPoint + "/gettrailersbyterminalid";
                 let data = {
                    "terminalId": filterData.terminalId                   
                } 
                 const trailerApiData = await axios.post(url, data);
                 trailerObject = trailerApiData.data.data.map(data => trailer.parseApiTrailerObject(data));
                 
             }
         } catch (err){
             return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
         }       
         return Promise.resolve(trailerObject);
     }
     async filterTrailerByTerminalID(filterData) {
        
        const trailer = new Trailer();
        let trailerObject = []
         try {
             if (!this.isIntegrated) {
                 const trailerData = trailer.sampleTrailer;
                 trailerObject = trailer.sampleTrailer(data => trailer.parseApiTrailerObject(data));
             } else {
                 // API object call.
                 const url = this.ApiEndPoint + "/getusertrailers";
                 let data = {
                    "terminalIds":filterData,
                   
                }
                 
                 const trailerApiData = await axios.post(url, data);
                 
                 trailerObject = trailerApiData.data.data.map(data => trailer.parseApiTrailerObject(data));
             }
         } catch (err){
             return Promise.resolve("There is a problem on retrieving driver data. Please try again!");
         }       
         return Promise.resolve(trailerObject);
     }
     async getDriversbyTerminalId(terminalId){ 
        const driver = new Driver()
        let assignedDriversObj = [];
      try{
          const url = this.ApiEndPoint + "/getDriversbyTerminalId";
          const data = {
              "terminalId": terminalId,
          }
          const driverApiData = await axios.post(url, data);
          assignedDriversObj = driverApiData.data.data.map(data => driver.parseApiDriverObject(data));
          
      }catch (err) {
          return Promise.reject("There is a problem on retrieving Assigned data. Please try again!");
      }
      return Promise.resolve(assignedDriversObj);
  }
    async updateUserDrivers(userId, terminalIds) {
        let updateUserDriversResponse;
        try {
            const url = this.ApiEndPoint + "/updateuserdrivers";
            const data = {
                "terminalIds": terminalIds,
                "user_id": userId
            }
            updateUserDriversResponse = await axios.post(url, data);
            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving Assigned data. Please try again!");
        }
        return Promise.resolve(updateUserDriversResponse);
    }

    async updateDefaultPlannerDrivers(requestBody) {
        let updateUserDriversResponse;
        try {
            const url = this.ApiEndPoint + "/updatedefaultplannerdrivers";
            const data = requestBody
            updateUserDriversResponse = await axios.post(url, data);
        } catch (err) {
            return Promise.reject("There is a problem on retrieving Assigned data. Please try again!");
        }
        return Promise.resolve(updateUserDriversResponse);
    }

    async updateUserDriverPlanning(requestBody) {
        let updateUserDriversResponse;
        try {
            const url = this.ApiEndPoint + "/updateuserdriversplanning";
            const data = requestBody
            updateUserDriversResponse = await axios.post(url, data);
            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving Assigned data. Please try again!");
        }
        return Promise.resolve(updateUserDriversResponse);
    }

    async deleteUserDrivers(userId, driverIds) {
        let deleteUserDriversResponse;
        try {
            const url = this.ApiEndPoint + "/deleteuserdrivers";
            const data = {
                "user_id": userId,
                "driverIds": driverIds
            }
            deleteUserDriversResponse = await axios.post(url, data);
            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving Assigned data. Please try again!");
        }
        return Promise.resolve(deleteUserDriversResponse);
    }

    planningProfileByTerminalId = async (id) => {
        let planningProfileData;
        try{
            const url = this.ApiEndPoint + "/populateplanningprofilebyterminalid"
            const payload = {
                terminal_id : id
            }
            planningProfileData = await axios.post(url, payload)
            
        } catch (err) {
            return Promise.reject("There is a problem on retrieving Assigned data. Please try again!");
        }
        return Promise.resolve(planningProfileData);
    }

    getAllPlanningProfiles = async() => {
        let allPlanningProfile = [];
        try{
            const url = this.ApiEndPoint + "/getallplanningprofiles";
            const apiData = await axios.get(url);
            allPlanningProfile = apiData.data.data;
            console.log("allPlanningProfile",allPlanningProfile)
        } catch (err) {
            console.log(err)
        }
        return (Promise.resolve(allPlanningProfile));
    }

    getplanningprofilebyid = async(id) => {
        let getplanningprofile = []
        try{
            if(!this.isIntegrated) {
            } else {
                const payload = {
                    id : id
                }
                const url = this.ApiEndPoint + "/getplanningprofilebyid";
                const addApiData = await axios.post(url, payload)
                getplanningprofile = addApiData.data.data;
            }
        } catch (err) {
            console.log(err)
        }
        return Promise.resolve(getplanningprofile);

    }

    createPlanningProfile = async(payload) => {
        let response;
        try{
            const url = this.ApiEndPoint + "/createplanningprofile";
            response = await axios.post(url, payload);
        } catch (err) {
            console.log(err)
        }
        return (Promise.resolve(response));
    }

    updateplanningprofile = async(payload) => {
        
        let response;
        try{
            const url = this.ApiEndPoint + "/updateplanningprofile";
            response = await axios.post(url, payload);
        } catch (err) {
            console.log(err)
        }
        return (Promise.resolve(response));
    }

    updatePlanningProfileUsers = async(data) => {
        console.log("DATA",data)
        let response;
        try{
            let payload = {
                user_id : data.user_id,
                planningprofiles : data.planningprofiles
            }
            const url = this.ApiEndPoint + "/updateplanningprofileusers";
            response = await axios.post(url, payload);
        } catch (err) {
            console.log(err)
        }
        return (Promise.resolve(response));
    }

    getPlanningProfileById = async(id) => {
        // debugger
        let planningProfile = []
        try{
            let payload = {
                user_id : id
            }
            const url = this.ApiEndPoint + "/getplanningprofilebyuserid";
            const apiData = await axios.post(url, payload);
            planningProfile = apiData.data.data;
        } catch (err) {
            console.log("err");
        }

        return Promise.resolve(planningProfile);
    }
}

export default UserService;