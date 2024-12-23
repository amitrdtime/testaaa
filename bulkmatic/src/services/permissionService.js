import axios from 'axios';

// Application Specific
import Permission from '../models/permissionModel';
import BaseService from './baseService';

class PermissionService extends BaseService{
    constructor() {    
        super();
        // set the base URL & API Key if required.
        this.isIntegrated = true; // Make it true when the integration will be in place.
    }    

    async getPermission(permId) {   
        const permission = new Permission();
        let permissionObject = [];   
        try {
            if (!this.isIntegrated) {
                const permissionData = permission.samplePermission.filter(function(perm) {
                    return perm.roleId === permId;
                });
    
        
                permissionObject = permission.parseApiPermissionObject(permissionData[0]);
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/permissions/" + permId;
       
                const permApiData = await axios.get(url);
                permissionObject = permApiData.parseApiPermissionObject(permApiData.data.data);   
            }
        } catch (err){
            return Promise.resolve("There is a problem on retrieving role data. Please try again!");
        }       

        return Promise.resolve(permissionObject);
    }

    async getAllPermission() {
        const permission = new Permission();
        let permissionObject = [];   

        try{
            if (!this.isIntegrated) {
                const permissionData = permission.samplePermission;               
                permissionObject = permission.samplePermission.map(data => permission.parseApiPermissionObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/permissions";
     
                const permApiData = await axios.get(url);
    
                permissionObject = permApiData.data.data.map(data => permission.parseApiPermissionObject(data));
  
            }
        } catch (err){
       
            return Promise.reject("There is a problem on retrieving permission data. Please try again!");
        }       

        return Promise.resolve(permissionObject);
    }

    async createPermission(perm, desc) {    
        const permission = new Permission();
        let permissionObject = [];   

        try{
            if (!this.isIntegrated) {
                const permissionData = permission.samplePermission[0];
                permission.sampleRole.push(permissionData);                
    
        
              
                permissionObject = permission.sampleRole.map(data => permission.parseApiPermissionObject(data));
            } else {
                // API object call.
                const url = this.ApiEndPoint + "/permissions";
                const data = {
                    "id": "",
                    "code": perm,
                    "name": perm,
                    "desc": desc,
                    "isActive": true
                };

                const permApiData = await axios.post(url, data);                
                permissionObject = permission.parseApiPermissionObject(permApiData);
               
         
            }
            // Pass User Model to API using Await
        } catch(err){
            return Promise.reject("Failure: Unable to create the permission. Please validate the data and try again!");
        }
      
        return Promise.resolve(permissionObject);
    }

    async deletePermission(rl) {
        let isDeleted = false;
        const permission = new Permission();
        let permissionObject = [];   

        try{
            if (!this.isIntegrated) {
                const permissionData = permission.samplePermission[0];
                permission.sampleRole.pop();  
                
                permissionObject = permission.sampleRole.map(data => permission.parseApiPermissionObject(data));
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
    
    async updatePermission(rl) {
        const permission = new Permission();
        let permissionObject = [];   

        try{
            if (!this.isIntegrated) {
                const permissionData = permission.samplePermission[0];
                permission.sampleRole.pop();                
    
     
                permissionObject = permission.sampleRole.map(data => permission.parseApiPermissionObject(data));
            } else {
                // API object call.
            }
            // Pass User Model to API using Await
        } catch(err){
            return Promise.reject("Failure: Unable to update the permission. Please validate the data and try again!");
        }
      
        return Promise.resolve(permissionObject);
    }     
}
   
export default PermissionService;