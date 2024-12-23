// External/NPM Library
import axios from 'axios';

// Application Specific
import Role from '../models/roleModel';
import BaseService from './baseService';

class RoleService extends BaseService {
    constructor() {    
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }    

    async getRole(roleId) {   
        const role = new Role();
        let roleObject = []
        try {
            if (!this.isIntegrated) {
                const roleData = role.sampleRole.filter(function(role) {
                    return role.roleId === roleId;
                });
    
       
                roleObject = role.parseApiRoleObject(roleData[0]);
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/roles/" + roleId;
                const roleApiData = await axios.get(url);
                roleObject = role.parseApiRoleObject(roleApiData.data.data);    
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving role data. Please try again!");
        }       

        return Promise.resolve(roleObject);
    }

    async getAllRole() {
        const role = new Role();
        let roleObject = [];
        
        try {
            if (!this.isIntegrated) {
                const roleData = role.sampleRole;
    
           
                roleObject = roleData.map(data => role.parseApiRoleObject(data));
          
            } else {
                // API object call.
             
                const url = this.ApiEndPoint + "/roles";
                const roleApiData = await axios.get(url);
                roleObject = roleApiData.data.data.map(data => role.parseApiRoleObject(data));
         
            }
        } catch (err){
            return Promise.reject("There is a problem on retrieving role data. Please try again!");
        }       

        return Promise.resolve(roleObject);
    }

    async createRole(rl, permissions) {    
        const role = new Role();
        let roleObject = [];
        try {
            if (!this.isIntegrated) {
                const roleData = role.sampleroles[0];
                role.sampleRole.push(roleData);                
    
        
                roleObject = role.sampleRole.map(data => role.parseApiRoleObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/roles";
                const data = {
                    "id": "",
                    "code": rl,
                    "name" : rl,
                    // "permissions" : [{ "permission": "a0711f82-33b2-42a5-94be-566f93848559", "isView": false, "isEdit": false}]
                    "permissions" : permissions
                };

                const roleApiData = await axios.post(url, data);                
                roleObject = role.parseApiRoleObject(roleApiData.data.data);
   
            }
        } catch(err){
       
            return Promise.reject("There is a problem on creating role, please validate the data and try again!");
        }
      
        return Promise.resolve(roleObject);
    }

    async updateRole(rlData, perms, isActive) {   
      
        const role = new Role();
        let roleObject = [];
      

        try {
            if (!this.isIntegrated) {
                const roleData = role.sampleroles[0];
                role.sampleRole.push(roleData);                
                roleObject = role.sampleRole.map(data => role.parseApiRoleObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/roles/" + rlData.roleId;
                const data = {
                    "id": rlData.roleId,
                    "code": rlData.roleId,
                    "name" : rlData.roleName,
                    "permissions" : perms,
                    "isActive": isActive
                };

              

                const roleApiData = await axios.put(url, data);       
            
                roleObject = role.parseApiRoleObject(roleApiData.data.data);
            }
        } catch(err){
        
            return Promise.reject("There is a problem on creating role, please validate the data and try again!");
        }
      
        return Promise.resolve(roleObject);
    }

    async deleteRole(rl) {
        let isDeleted = false;
        const role = new Role();
        let roleObject = [];   

        try{
            if (!this.isIntegrated) {
                const roleData = role.sampleroles[0];
                role.sampleRole.pop();                
    
           
                roleObject = role.sampleRole.map(data => role.parseApiRoleObject(data));
            } else {
                // API object call.
            }

            isDeleted = true;   
        }
        catch{
            isDeleted = false;
            return Promise.reject("Failure: Unable to delete the role!");
        }

        return Promise.resolve(isDeleted);
    }
    async filterRoles(filterData){
        const role = new Role();
   
        let roleObject = []
        // Call API using Await
        if (!this.isIntegrated) {
            const roleData = role.sampleRole.filter(function(role) {
                return role.roleName === filterData;
            });
    
      
            if(roleData.length > 0){
                if (roleData.length === 1)
                    roleObject =  role.parseApiRoleObject(roleData[0]);
                else {
                    roleObject = role.sampleRole.map(item => 
                        role.parseApiRoleObject(item)
                    );
                }
            }
            else{
                roleObject = role.sampleRole.map(item => 
                    role.parseApiRoleObject(item)
                );
            }
            // user
           
        } else {
            // API object call.
            const url = this.ApiEndPoint + "/filterroles";
            const data = {
                "id": "",
                "name": filterData,
                "permissions": []
            }
            const roleApiData = await axios.post(url, data);
            roleObject = roleApiData.data.data.map(data => role.parseApiRoleObject(data));
          
        }
    
    
        return Promise.resolve(roleObject);
    }

}
   
export default RoleService;